import { jsPDF } from "jspdf";
import { type Font, type Resume } from "./resume";
import { documentBlocks, type Block, type Role } from "./blocks";

import { isSidebarBlock, isTitleBlock, premiumStyle, premiumText } from "./premium";

export const a4 = { width: 595.28, height: 841.89 };
const ink = "#20283B";
const muted = "#4D586C";
export type TextLine = {text:string; x:number; y:number; width:number; size:number; color:string; bold:boolean};
type Decoration = {x:number;y:number;width:number;height:number;color:string};
export const photoSize = 65;
export type Page = {lines:TextLine[]; marks:Decoration[]; dots?:{x:number;y:number;radius:number;color:string}[]; photo?: {x:number;y:number;data:string;round?:boolean}};

export const family = {sans:"Arial",serif:"Times New Roman",mono:"Courier New"};
export function appearance(r: Resume) {
  const portrait=r.template==="modern-portrait";
  const technical=r.template==="engineering-blue";
  return {
    portrait,technical,
    margin:r.template === "minimal-professional" ? 62 : r.template === "technical-engineer" ? 45 : 52,
    centered:r.template === "minimal-professional" || r.template === "modern-executive",
    rule:r.template === "classic-ats" || r.template === "technical-engineer",
    top:portrait || technical || r.template === "modern-executive" || r.template === "creative-professional",
    bar:r.template === "fresh-graduate" || r.template === "creative-professional",
    nameSize:portrait ? 33 : technical ? 28 : r.template === "creative-professional" ? 32 : r.template === "modern-executive" ? 30 : r.template === "technical-engineer" ? 24 : 27,
  };
}
export function readable(color:string) {
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
  if(premiumStyle(resume.template))return {pdf,pages:layoutPremium(resume,pdf)};
  const {margin,centered,rule,top,bar,portrait,technical} = appearance(resume);
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
  if (resume.photo) {
    pages[0].photo = {x:portrait?a4.width-margin-photoSize:centered?(a4.width-photoSize)/2:margin,y:margin,data:resume.photo};
    if(!portrait)y += photoSize+10;
  }
  const photoBesideHeader=portrait&&Boolean(resume.photo);
  const photoBottom=margin+photoSize+10;
  const blocks = documentBlocks(resume).map(block=>{
    const style = textStyle(resume,block.role);
    pdf.setFont("ResumeFont",style.bold ? "bold" : "normal").setFontSize(style.size);
    const header = ["name","headline","contact"].includes(block.role);
    const width = photoBesideHeader&&header?maxWidth-photoSize-14:technical&&block.role==="heading"?maxWidth-16:maxWidth;
    const lines = block.text.split(/\r?\n/).flatMap(line=>
      line.trim() ? pdf.splitTextToSize(line.trim(),width) as string[] : [""]
    ).map(text=>({text,width:pdf.getTextWidth(text)}));
    return {...block,...style,header,lines,lineHeight:style.size*1.38};
  });
  for (const [index,block] of blocks.entries()) {
    const heading = block.role === "heading";
    const {header}=block;
    if(photoBesideHeader&&!header&&pages.length===1)y=Math.max(y,photoBottom);
    const next = blocks[index+1];
    const keepHeight = block.keep && next ? next.gap+next.lineHeight : 0;
    const ownHeight = Math.min(block.lines.length,block.keep ? 4 : 2)*block.lineHeight;
    if (y+block.gap+ownHeight+keepHeight+(heading&&technical?6:0) > bottom && y > margin) newPage();
    if (y > margin) y += block.gap;
    const band=heading&&technical;
    if (heading && bar) page!.marks.push({x:margin-10,y:y+1,width:3,height:block.size+2,color:resume.color});
    for (const line of block.lines) {
      if (y+block.lineHeight>bottom) newPage();
      if(band)page!.marks.push({x:margin,y,width:maxWidth,height:block.lineHeight,color:"#EAF1F7"});
      if (line.text) page!.lines.push({...line,x:centered && header ? (a4.width-line.width)/2 : margin+(band?8:0),y:y+block.size,size:block.size,color:block.color,bold:block.bold});
      y += block.lineHeight;
    }
    if(band)y+=3;
    if (heading && rule) {
      page!.marks.push({x:margin,y:y-0.5,width:maxWidth,height:0.55,color:"#ADB7CA"});
      y += 2;
    }
  }
  return {pdf,pages};
}

function layoutPremium(resume:Resume,pdf:jsPDF):Page[] {
  const design=premiumStyle(resume.template)!;
  const sideWidth=174;
  const padding=24;
  const sideX=design.rightSidebar?a4.width-sideWidth:0;
  const mainX=design.rightSidebar?29:sideWidth+30;
  const mainWidth=a4.width-sideWidth-59;
  const panelInset=design.framed?12:0;
  const panelWidth=sideWidth-2*panelInset;
  const trim=design.trim??resume.color;
  const filled=design.masthead==="filled";
  const top=34;
  const titleTop=design.ornaments?54:top;
  const bottom=a4.height-31;
  const pages:Page[]=[];
  const blocks=documentBlocks(resume);
  const title=blocks.filter(isTitleBlock);
  const side=blocks.filter(isSidebarBlock);
  const body=blocks.filter(block=>!isTitleBlock(block)&&!isSidebarBlock(block));
  function ensurePage(index:number) {
    while(pages.length<=index) {
      pages.push({lines:[],marks:[
        {x:sideX+panelInset,y:panelInset,width:panelWidth,height:a4.height-2*panelInset,color:design.sidebar},
        {x:design.rightSidebar?sideX+panelInset:sideX+sideWidth-panelInset,y:panelInset,width:0.7,height:a4.height-2*panelInset,color:design.trim??(design.sidebar==="#FFFFFF"?"#B6BBC4":design.sidebar)},
      ]});
    }
    return pages[index];
  }
  function measure(block:Block,width:number,inSidebar:boolean) {
    const style=textStyle(resume,block.role);
    const size=inSidebar?Math.min(style.size,11):block.role==="name"?34:style.size+0.5;
    const color=inSidebar?design.sideInk:style.color;
    pdf.setFont("ResumeFont",style.bold?"bold":"normal").setFontSize(size);
    const lines=premiumText(block).split(/\r?\n/).flatMap(line=>line.trim()?pdf.splitTextToSize(line.trim(),width) as string[]:[""])
      .map(text=>({text,width:pdf.getTextWidth(text)}));
    return {...block,...style,size,color,lines,height:size*1.54};
  }

  const first=ensurePage(0);
  const fullHeader=design.masthead!=="none";
  const photoInHeader=filled&&Boolean(resume.photo);
  const titleInset=photoInHeader&&!design.rightSidebar?mainX:padding;
  const headerRight=photoInHeader&&design.rightSidebar?sideX-12:a4.width-padding;
  const titleWidth=fullHeader?headerRight-titleInset:mainWidth;
  const titleBlocks=title.map(block=>measure(block,titleWidth,false));
  const titleBottom=titleTop+titleBlocks.reduce((height,block)=>height+block.height*block.lines.length+3,0)+14;
  const headerBottom=fullHeader?Math.max(titleBottom,photoInHeader?112:0):0;
  if(filled) {
    first.marks.push({x:0,y:0,width:a4.width,height:headerBottom,color:design.mastheadFill??readable(resume.color)});
  } else if(design.masthead==="rule") {
    first.marks.push({x:0,y:0,width:a4.width,height:headerBottom,color:design.mastheadFill??"#FFFFFF"},{x:padding,y:headerBottom,width:a4.width-2*padding,height:1,color:design.trim??"#9A9FA8"});
  } else {
    first.marks.push({x:design.rightSidebar?0:sideWidth,y:0,width:a4.width-sideWidth,height:5,color:trim});
  }
  if(design.ornaments==="citrus")first.dots=[
    {x:a4.width-22,y:15,radius:22,color:"#FFD467"},
    {x:a4.width-57,y:18,radius:12,color:"#DAF1FB"},
    {x:a4.width-20,y:48,radius:5,color:"#E3A13B"},
  ];
  if(design.ornaments==="violet") {
    first.marks.push(
      {x:a4.width-112,y:0,width:112,height:9,color:"#A481D8"},
      {x:a4.width-72,y:9,width:72,height:8,color:"#DCCBF5"},
    );
    first.dots=[{x:a4.width-31,y:29,radius:11,color:"#BFA5E8"},{x:a4.width-57,y:34,radius:4,color:"#E8DBF8"}];
  }
  let titleY=titleTop;
  for(const block of titleBlocks) {
    for(const line of block.lines) {
      const x=design.masthead==="rule"?(a4.width-line.width)/2:fullHeader?titleInset:mainX;
      first.lines.push({...line,x,y:titleY+block.size,size:block.size,bold:block.bold,color:filled&&!design.mastheadFill?"#FFFFFF":block.color});
      titleY+=block.height;
    }
    titleY+=3;
  }
  let sideStart=headerBottom?headerBottom+22:top;
  if(resume.photo) {
    const photoX=photoInHeader&&!design.rightSidebar&&!design.trim?padding:sideX+(sideWidth-photoSize)/2;
    first.photo={x:photoX,y:photoInHeader?23:sideStart,data:resume.photo,round:true};
    if(!photoInHeader)sideStart+=photoSize+15;
  }
  function place(lane:Block[],x:number,width:number,start:number,inSidebar:boolean) {
    const measured=lane.map(block=>{
      const indent=!inSidebar&&design.timeline&&block.section==="experience"&&block.role!=="heading"?13:0;
      return {...measure(block,width-indent,inSidebar),indent};
    });
    let index=0;
    let y=start;
    for(const [offset,block] of measured.entries()) {
      const gap=block.gap+(block.role==="heading"?6:0);
      const next=measured[offset+1];
      if(y+gap+block.height+(block.keep&&next?next.gap+next.height:0)>bottom) {index++;y=top;}
      if(y>top)y+=gap;
      for(const [lineIndex,line] of block.lines.entries()) {
        if(y+block.height+(block.role==="heading"&&lineIndex===0?2:0)>bottom){index++;y=top;}
        const page=ensurePage(index);
        if(block.role==="heading"&&lineIndex===0) {
          page.marks.push({x,y:y-3,width,height:0.55,color:inSidebar?design.trim??design.sideInk:design.trim??"#B9C5CF"});
          y+=2;
        }
        if(block.indent&&block.role==="title"&&lineIndex===0) {
          (page.dots??=[]).push({x:x+3,y:y+block.size-3,radius:2.4,color:trim});
        }
        if(block.indent)page.marks.push({x:x+2.6,y,width:0.65,height:block.height,color:"#C6D2DC"});
        if(line.text)page.lines.push({...line,x:x+block.indent,y:y+block.size,size:block.size,color:block.color,bold:block.bold});
        y+=block.height;
      }
    }
  }
  place(body,mainX,mainWidth,headerBottom?headerBottom+17:Math.max(top,titleY+7),false);
  place(side,sideX+padding,sideWidth-padding*2,sideStart,true);
  return pages;
}

export function generatePdf(resume:Resume, bytes:FontBytes) {
  const {pdf,pages} = layoutPdf(resume,bytes);
  pdf.setProperties({title:resume.personal.name.trim() || resume.title,creator:"ResumeForge AI"});
  for (const [index,page] of pages.entries()) {
    if (index) pdf.addPage("a4","portrait");
    for (const mark of page.marks) pdf.setFillColor(mark.color).rect(mark.x,mark.y,mark.width,mark.height,"F");
    for (const dot of page.dots??[]) pdf.setFillColor(dot.color).circle(dot.x,dot.y,dot.radius,"F");
    if (page.photo) {
      const {x,y,data,round}=page.photo;
      const radius=photoSize/2;
      if(round)pdf.saveGraphicsState().circle(x+radius,y+radius,radius,null).clip().discardPath();
      pdf.addImage(data,"JPEG",x,y,photoSize,photoSize);
      if(round)pdf.restoreGraphicsState().setDrawColor("#FFFFFF").setLineWidth(1.5).circle(x+radius,y+radius,radius,"S");
    }
    for (const line of page.lines) {
      pdf.setTextColor(line.color).setFont("ResumeFont",line.bold ? "bold" : "normal").setFontSize(line.size);
      pdf.text(line.text,line.x,line.y);
    }
  }
  return pdf;
}
