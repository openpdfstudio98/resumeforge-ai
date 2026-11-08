import { AlignmentType, BorderStyle, Document, HeadingLevel, ImageRun, Packer, Paragraph, Table, TableCell, TableLayoutType, TableRow, TextRun, WidthType } from "docx";
import { a4, appearance, family, isSingleColumn, photoSize, readable, textStyle } from "./document";
import { isSidebarBlock, isTitleBlock, premiumStyle, premiumText } from "./premium";
import { documentBlocks, type Block } from "./blocks";
import type { Resume } from "./resume";

export function wordDocument(resume: Resume) {
  const design = appearance(resume);
  const accent = resume.color.slice(1);
  const blocks=documentBlocks(resume);
  const premium=isSingleColumn(resume.template)?undefined:premiumStyle(resume.template);
  const children:(Paragraph|Table)[] = premium ? premiumChildren(resume,blocks,premium) : blocks.map(block=>{
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
  if (resume.photo && !premium) {
    const photo=portrait(resume.photo,design.portrait ? AlignmentType.RIGHT : design.centered ? AlignmentType.CENTER : AlignmentType.LEFT,!design.portrait);
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
function portrait(dataUrl:string,alignment:typeof AlignmentType[keyof typeof AlignmentType],keepNext:boolean) {
  const pixels=Math.round(photoSize*96/72);
  return new Paragraph({
    alignment,keepNext,spacing:{after:200},
    children:[new ImageRun({
      type:"jpg",data:Uint8Array.from(atob(dataUrl.split(",")[1]),character=>character.charCodeAt(0)),
      transformation:{width:pixels,height:pixels},
    })],
  });
}

function premiumChildren(resume:Resume,blocks:Block[],design:NonNullable<ReturnType<typeof premiumStyle>>) {
  const accent=readable(resume.color).slice(1);
  const width=Math.round(a4.width*20)-2*appearance(resume).margin*20;
  const sidebarWidth=Math.round(width*0.3);
  const none={style:BorderStyle.NIL};
  const rule=(color:string)=>({style:BorderStyle.SINGLE,color,size:4,space:2});
  const filled=design.masthead==="filled";
  const trim=design.trim?.slice(1)??accent;
  const mastheadFill=design.mastheadFill?.slice(1)??accent;
  function paragraph(block:Block,inSidebar:boolean,inMasthead=false) {
    const style=textStyle(resume,block.role);
    const color=inSidebar?design.sideInk.slice(1):inMasthead&&filled&&!design.mastheadFill?"FFFFFF":style.color.slice(1);
    const size=inSidebar?Math.min(style.size,10):style.size;
    const timeline=design.timeline&&!inSidebar&&block.section==="experience"&&block.role!=="heading";
    return new Paragraph({
      alignment:inMasthead&&design.masthead==="rule"?AlignmentType.CENTER:AlignmentType.LEFT,
      heading:block.role==="heading"?HeadingLevel.HEADING_1:undefined,
      keepNext:block.keep,keepLines:block.role!=="body",widowControl:true,
      spacing:{before:block.gap*20,after:0,line:260},
      border:block.role==="heading"?{bottom:rule(design.trim?.slice(1)??(inSidebar?color:"BCC7D2"))}:timeline?{left:{...rule(trim),space:7}}:undefined,
      children:premiumText(block).split(/\r?\n/).map((text,index)=>new TextRun({
        text,break:index?1:undefined,bold:style.bold,color,size:size*2,font:family[resume.font],
      })),
    });
  }
  function row(columns:{width:number; fill:string; children:Paragraph[]}[],divider=false) {
    return new Table({
      width:{size:width,type:WidthType.DXA},
      columnWidths:columns.map(column=>column.width),
      layout:TableLayoutType.FIXED,
      margins:{top:160,bottom:160,left:220,right:220},
      borders:{top:none,bottom:none,left:none,right:none,insideHorizontal:none,insideVertical:divider?rule("B6BBC4"):none},
      rows:[new TableRow({children:columns.map(column=>new TableCell({
        width:{size:column.width,type:WidthType.DXA},
        shading:{fill:column.fill},
        children:column.children.length?column.children:[new Paragraph("")],
      }))})],
    });
  }
  const titles=blocks.filter(isTitleBlock).map(block=>paragraph(block,false,design.masthead!=="none"));
  const side=blocks.filter(isSidebarBlock).map(block=>paragraph(block,true));
  const body=blocks.filter(block=>!isSidebarBlock(block)&&!isTitleBlock(block)).map(block=>paragraph(block,false));
  const photo=resume.photo?portrait(resume.photo,AlignmentType.CENTER,false):undefined;
  if(photo&&!filled)side.unshift(photo);
  const lanes=[
    {width:sidebarWidth,fill:design.sidebar.slice(1),children:side},
    {width:width-sidebarWidth,fill:"FFFFFF",children:design.masthead==="none"?[...titles,...body]:body},
  ];
  const columns=row(design.rightSidebar?[...lanes].reverse():lanes,design.masthead==="rule");
  if(filled) {
    const masthead=photo?[
      {width:sidebarWidth,fill:mastheadFill,children:[photo]},
      {width:width-sidebarWidth,fill:mastheadFill,children:titles},
    ]:[{width,fill:mastheadFill,children:titles}];
    if(photo&&design.rightSidebar)masthead.reverse();
    return [row(masthead),new Paragraph({spacing:{line:40}}),columns];
  }
  if(design.masthead!=="rule")return [columns];
  return design.mastheadFill?[row([{width,fill:mastheadFill,children:titles}]),columns]:[...titles,columns];
}

export function generateWord(resume:Resume) {
  return Packer.toBlob(wordDocument(resume));
}
