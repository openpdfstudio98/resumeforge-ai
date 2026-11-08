"use client";
import { useEffect, useState } from "react";
import { a4, layoutPdf, loadFonts, type FontBytes } from "../lib/document";
import { type Locale, type Resume } from "../lib/resume";
import { work } from "../lib/work-copy";

export function Preview({resume,locale}:{resume:Resume;locale:Locale}) {
  const t=work[locale];
  const [loaded,setLoaded]=useState<{font:Resume["font"];bytes?:FontBytes}>();
  const [attempt,setAttempt]=useState(0);
  useEffect(()=>{
    let current=true;
    loadFonts(resume.font).then(bytes=>{if(current)setLoaded({font:resume.font,bytes});},()=>{if(current)setLoaded({font:resume.font});});
    return ()=>{current=false;};
  },[resume.font,attempt]);
  if(loaded?.font!==resume.font) return <p role="status">{t.loading}</p>;
  if(!loaded.bytes) return <p role="alert">{t.previewError} <button className="btn" onClick={()=>{setLoaded(undefined);setAttempt(attempt+1);}}>{t.retry}</button></p>;
  const {pages}=layoutPdf(resume,loaded.bytes);
  return <div className="paper-stack">{pages.map((page,index)=><figure key={index} className="paper">
    <svg className="document-sheet" viewBox={`0 0 ${a4.width} ${a4.height}`} role="img" aria-label={`${t.page} ${index+1}`}>
      <rect width={a4.width} height={a4.height} fill="white"/>
      {page.marks.map(({color,...mark},i)=><rect key={i} {...mark} fill={color}/>)}
      {page.lines.map(({text,color,bold,width,size,...point},i)=><text key={i} {...point} fill={color} fontFamily={`Resume-${resume.font}`} fontSize={size} fontWeight={bold?700:400} textLength={width||undefined} lengthAdjust="spacingAndGlyphs">{text}</text>)}
      {!page.lines.length && <text x={a4.width/2} y={a4.height/2} textAnchor="middle" fontSize={13} fill="#596579">{t.previewEmpty}</text>}
    </svg>
    <figcaption>{t.page} {index+1} / {pages.length}</figcaption>
  </figure>)}</div>;
}
