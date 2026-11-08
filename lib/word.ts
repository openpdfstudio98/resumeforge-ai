import { AlignmentType, BorderStyle, Document, HeadingLevel, ImageRun, Packer, Paragraph, Table, TableCell, TableLayoutType, TableRow, TextRun, WidthType } from "docx";
import { a4, appearance, family, photoSize, textStyle } from "./document";
import { documentBlocks } from "./blocks";
import type { Resume } from "./resume";

export function wordDocument(resume: Resume) {
  const design = appearance(resume);
  const accent = resume.color.slice(1);
  const blocks=documentBlocks(resume);
  const children:(Paragraph|Table)[] = blocks.map(block=>{
    const style = textStyle(resume,block.role);
    const isHeading = block.role === "heading";
    const header = ["name","headline","contact"].includes(block.role);
    return new Paragraph({
      heading: isHeading ? HeadingLevel.HEADING_1 : undefined,
      alignment:header && design.centered ? AlignmentType.CENTER : AlignmentType.LEFT,
      keepNext:block.keep,
      keepLines:block.role !== "body",
      widowControl:true,
      spacing:{before:block.gap*20,after:0,line:295},
      shading:isHeading&&design.technical?{fill:"EAF1F7"}:undefined,
      border:isHeading && design.rule ? {bottom:{style:BorderStyle.SINGLE,color:"ADB7CA",size:4,space:1}}
        : isHeading && design.bar ? {left:{style:BorderStyle.SINGLE,color:accent,size:12,space:6}}
        : block.role === "name" && design.top ? {top:{style:BorderStyle.SINGLE,color:accent,size:16,space:5}}
        : undefined,
      children:block.text.split(/\r?\n/).map((text,index)=>new TextRun({
        text,break:index ? 1 : undefined,bold:style.bold,color:style.color.slice(1),size:style.size*2,font:family[resume.font],
      })),
    });
  });
  const margin = design.margin*20;
  if (resume.photo) {
    const pixels = Math.round(photoSize * 96 / 72);
    const photo=new Paragraph({
      alignment:design.portrait ? AlignmentType.RIGHT : design.centered ? AlignmentType.CENTER : AlignmentType.LEFT,
      keepNext:!design.portrait,
      spacing:{after:200},
      children:[new ImageRun({
        type:"jpg",data:Uint8Array.from(atob(resume.photo.split(",")[1]),character=>character.charCodeAt(0)),
        transformation:{width:pixels,height:pixels},
      })],
    });
    if(design.portrait) {
      const firstBody=blocks.findIndex(block=>!["name","headline","contact"].includes(block.role));
      const headers=children.splice(0,firstBody===-1?children.length:firstBody) as Paragraph[];
      const width=Math.round(a4.width*20)-2*margin;
      const photoColumn=(photoSize+14)*20;
      const none={style:BorderStyle.NIL};
      children.unshift(new Table({
        width:{size:width,type:WidthType.DXA},
        columnWidths:[width-photoColumn,photoColumn],
        layout:TableLayoutType.FIXED,
        margins:{top:0,bottom:0,left:0,right:0},
        borders:{top:none,bottom:none,left:none,right:none,insideHorizontal:none,insideVertical:none},
        rows:[new TableRow({children:[
          new TableCell({width:{size:width-photoColumn,type:WidthType.DXA},children:headers.length?headers:[new Paragraph("")]}),
          new TableCell({width:{size:photoColumn,type:WidthType.DXA},children:[photo]}),
        ]})],
      }));
    } else children.unshift(photo);
  }
  return new Document({
    title:resume.personal.name.trim() || resume.title,
    creator:"ResumeForge AI",
    sections:[{properties:{page:{size:{width:Math.round(a4.width*20),height:Math.round(a4.height*20)},margin:{top:margin,bottom:margin,left:margin,right:margin}}},children:children.length ? children : [new Paragraph("")]}],
  });
}
export function generateWord(resume:Resume) {
  return Packer.toBlob(wordDocument(resume));
}
