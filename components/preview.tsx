"use client";
import { useEffect, useState } from "react";
import { layoutPdf, loadFonts, type FontBytes } from "../lib/document";
import { type Locale, type Resume } from "../lib/resume";
import { work } from "../lib/work-copy";
import { DocumentSheet } from "./document-sheet";
import { useCopy } from "./ui-language";

export function Preview({resume,locale}:{resume:Resume;locale:Locale}) {
  const t=useCopy(work[locale]);
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
    <div translate="no"><DocumentSheet page={page} font={resume.font} label={`${t.page} ${index+1}`} empty={t.previewEmpty}/></div>
    <figcaption>{t.page} {index+1} / {pages.length}</figcaption>
  </figure>)}</div>;
}
