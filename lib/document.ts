import { jsPDF } from "jspdf";
import { type Font, type Resume } from "./resume";
import { documentBlocks, type Role } from "./blocks";

export const a4 = { width: 595.28, height: 841.89 };
const ink = "#20283B";
const muted = "#4D586C";
export type TextLine = {text:string; x:number; y:number; width:number; size:number; color:string; bold:boolean};
type Decoration = {x:number;y:number;width:number;height:number;color:string};
export type Page = {lines:TextLine[]; marks:Decoration[]};

export const family = {sans:"Arial",serif:"Times New Roman",mono:"Courier New"};
export function appearance(r: Resume) {
  return {
    margin:r.template === "minimal-professional" ? 62 : r.template === "technical-engineer" ? 45 : 52,
    centered:r.template === "minimal-professional" || r.template === "modern-executive",
    rule:r.template === "classic-ats" || r.template === "technical-engineer",
    top:r.template === "modern-executive" || r.template === "creative-professional",
    bar:r.template === "fresh-graduate" || r.template === "creative-professional",
    nameSize:r.template === "creative-professional" ? 32 : r.template === "modern-executive" ? 30 : r.template === "technical-engineer" ? 24 : 27,
  };
}
function readable(color:string) {
  const value = color.slice(1).match(/../g)!.map(hex=>parseInt(hex,16)/255);
  const [r,g,b] = value.map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
  return 1.05/(0.2126*r+0.7152*g+0.0722*b+0.05)>=4.5 ? color : ink;
}
export function textStyle(r:Resume, role:Role) {
  const sizes:Record<Role,number> = {name:appearance(r).nameSize,headline:r.size+3,contact:r.size-0.5,heading:r.size+1,title:r.size,meta:r.size-0.5,body:r.size};
  return {
    size:sizes[role], bold:["name","heading","title"].includes(role),
    color:role === "heading" || role === "name" ? readable(r.color) : role === "contact" || role === "meta" ? muted : ink,
  };
}

export type FontBytes = [string,string];
const fontLoads = new Map<Font,Promise<FontBytes>>();
export function loadFonts(font: Font) {
  if (!fontLoads.has(font)) {
    const pending = Promise.all(["Regular","Bold"].map(async style=>{
      const response = await fetch(`/fonts/${font}-${style}.ttf`);
      if (!response.ok) throw new Error("Font unavailable");
      const bytes = new Uint8Array(await response.arrayBuffer());
      let binary = "";
      for (const byte of bytes) binary += String.fromCharCode(byte);
      return btoa(binary);
    })).then(result=>result as FontBytes).catch(error=>{fontLoads.delete(font);throw error;});
    fontLoads.set(font,pending);
  }
  return fontLoads.get(font)!;
}

export function layoutPdf(resume:Resume, bytes:FontBytes) {
  const pdf = new jsPDF({unit:"pt",format:"a4",putOnlyUsedFonts:true,compress:true});
  for (const [index,style] of ["normal","bold"].entries()) {
    pdf.addFileToVFS(`${style}.ttf`,bytes[index]);
    pdf.addFont(`${style}.ttf`,"ResumeFont",style);
  }
  const {margin,centered,rule,top,bar} = appearance(resume);
  const bottom = a4.height-margin;
  const maxWidth = a4.width-2*margin;
  const pages:Page[] = [];
  let page:Page;
  let y = margin;
  function newPage() {
    page = {lines:[],marks:[]};
    pages.push(page);
    y = margin;
    if (top) page.marks.push({x:0,y:0,width:a4.width,height:6,color:resume.color});
  }
  newPage();
  const blocks = documentBlocks(resume).map(block=>{
    const style = textStyle(resume,block.role);
    pdf.setFont("ResumeFont",style.bold ? "bold" : "normal").setFontSize(style.size);
    const lines = block.text.split(/\r?\n/).flatMap(line=>
      line.trim() ? pdf.splitTextToSize(line.trim(),maxWidth) as string[] : [""]
    ).map(text=>({text,width:pdf.getTextWidth(text)}));
    return {...block,...style,lines,lineHeight:style.size*1.38};
  });
  for (const [index,block] of blocks.entries()) {
    const heading = block.role === "heading";
    const header = ["name","headline","contact"].includes(block.role);
    const next = blocks[index+1];
    const keepHeight = block.keep && next ? next.gap+next.lineHeight : 0;
    const ownHeight = Math.min(block.lines.length,block.keep ? 4 : 2)*block.lineHeight;
    if (y+block.gap+ownHeight+keepHeight > bottom && y > margin) newPage();
    if (y > margin) y += block.gap;
    if (heading && bar) page!.marks.push({x:margin-10,y:y+1,width:3,height:block.size+2,color:resume.color});
    for (const line of block.lines) {
      if (y+block.lineHeight>bottom) newPage();
      if (line.text) page!.lines.push({...line,x:centered && header ? (a4.width-line.width)/2 : margin,y:y+block.size,size:block.size,color:block.color,bold:block.bold});
      y += block.lineHeight;
    }
    if (heading && rule) {
      page!.marks.push({x:margin,y:y-0.5,width:maxWidth,height:0.55,color:"#ADB7CA"});
      y += 2;
    }
  }
  return {pdf,pages};
}

export function generatePdf(resume:Resume, bytes:FontBytes) {
  const {pdf,pages} = layoutPdf(resume,bytes);
  pdf.setProperties({title:resume.personal.name.trim() || resume.title,creator:"ResumeForge AI"});
  for (const [index,page] of pages.entries()) {
    if (index) pdf.addPage("a4","portrait");
    for (const mark of page.marks) pdf.setFillColor(mark.color).rect(mark.x,mark.y,mark.width,mark.height,"F");
    for (const line of page.lines) {
      pdf.setTextColor(line.color).setFont("ResumeFont",line.bold ? "bold" : "normal").setFontSize(line.size);
      pdf.text(line.text,line.x,line.y);
    }
  }
  return pdf;
}
