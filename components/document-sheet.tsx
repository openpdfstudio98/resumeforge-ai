import { useId } from "react";
import { a4, photoSize, type Page } from "../lib/document";
import type { Font } from "../lib/resume";

export function DocumentSheet({page,font,label,empty}:{
  page:Page;font:Font;label?:string;empty?:string;
}) {
  const photoClip=useId();
  return <svg className="document-sheet" viewBox={`0 0 ${a4.width} ${a4.height}`} role={label?"img":undefined} aria-label={label} aria-hidden={label?undefined:true}>
    <rect width={a4.width} height={a4.height} fill="white"/>
    {page.marks.map(({color,...mark},index)=><rect key={index} {...mark} fill={color}/>)}
    {page.dots?.map(({x,y,radius,color},index)=><circle key={index} cx={x} cy={y} r={radius} fill={color}/>)}
    {page.photo?.round&&<defs><clipPath id={photoClip}><circle cx={page.photo.x+photoSize/2} cy={page.photo.y+photoSize/2} r={photoSize/2}/></clipPath></defs>}
    {page.photo&&<image href={page.photo.data} x={page.photo.x} y={page.photo.y} width={photoSize} height={photoSize} clipPath={page.photo.round?`url(#${photoClip})`:undefined}/>}
    {page.photo?.round&&<circle cx={page.photo.x+photoSize/2} cy={page.photo.y+photoSize/2} r={photoSize/2} fill="none" stroke="white" strokeWidth={1.5}/>}
    {page.lines.map(({text,color,bold,width,size,...point},index)=><text key={index} {...point} fill={color} fontFamily={`Resume-${font}`} fontSize={size} fontWeight={bold?700:400} textLength={width||undefined} lengthAdjust="spacingAndGlyphs">{text}</text>)}
    {empty&&!page.lines.length&&!page.photo&&<text x={a4.width/2} y={a4.height/2} textAnchor="middle" fontSize={13} fill="#596579">{empty}</text>}
  </svg>;
}
