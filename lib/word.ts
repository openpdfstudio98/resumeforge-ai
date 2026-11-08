import { AlignmentType, BorderStyle, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { a4, appearance, family, textStyle } from "./document";
import { documentBlocks } from "./blocks";
import type { Resume } from "./resume";

export function wordDocument(resume: Resume) {
  const design = appearance(resume);
  const accent = resume.color.slice(1);
  const children = documentBlocks(resume).map(block=>{
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
  return new Document({
    title:resume.personal.name.trim() || resume.title,
    creator:"ResumeForge AI",
    sections:[{properties:{page:{size:{width:Math.round(a4.width*20),height:Math.round(a4.height*20)},margin:{top:margin,bottom:margin,left:margin,right:margin}}},children:children.length ? children : [new Paragraph("")]}],
  });
}
export function generateWord(resume:Resume) {
  return Packer.toBlob(wordDocument(resume));
}
