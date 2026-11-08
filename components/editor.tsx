"use client";
import { ArrowDown, ArrowUp, Download, GripVertical, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useDeferredValue, useRef, useState } from "react";
import { generatePdf, loadFonts } from "../lib/document";
import { blankEntry, fonts, labels, personalFields, reorder, sectionKeys, templateKeys, templates, type Entry, type Locale, type Resume, type SectionKey } from "../lib/resume";
import { work } from "../lib/work-copy";
import { extraCopy } from "../lib/ui-language";
import { useCopy, useUi } from "./ui-language";
import { documentBlocks } from "../lib/blocks";
import { Field } from "./field";
import { ResumePhoto } from "./resume-photo";
import { Preview } from "./preview";
import { download, jsonDownload } from "./storage";

export function Editor({resume,locale,update,warning}:{resume:Resume;locale:Locale;update:(resume:Resume)=>boolean;warning?:string}) {
  const t=useCopy(work[locale]);
  const ui=useUi();
  const extra=useCopy(extraCopy[locale]);
  const [active,setActive]=useState<SectionKey|"personal"|"design">("personal");
  const [mobile,setMobile]=useState<"edit"|"preview">("edit");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const latest=useRef(resume);
  const deferred=useDeferredValue(resume);
  const filled=Boolean(resume.photo)||documentBlocks(resume).length>0;
  const name=(resume.personal.name || resume.title || "Civora Resume").replace(/[^\p{L}\p{N} ._-]/gu,"").trim().slice(0,90) || "Civora Resume";
  function patch(value:Partial<Resume>) {
    const draft={...latest.current,...value};
    if(update(draft))latest.current=draft;
  }
  function rows(key:SectionKey,entries:Entry[]) {patch({sections:{...resume.sections,[key]:entries}});}
  function move(from:SectionKey,to:SectionKey) {patch({order:reorder(resume.order,from,to)});}
  async function exportFile(kind:"pdf"|"docx") {
    setBusy(true);setError("");
    try {
      const blob=kind==="pdf" ? generatePdf(resume,await loadFonts(resume.font)).output("blob") : await (await import("../lib/word")).generateWord(resume);
      download(blob,`${name}.${kind}`);
    } catch {setError(t.downloadError);}
    finally {setBusy(false);}
  }
  return <>
    <a className="text-link editor-back" href={`/${locale}/resumes`}>← {extra.back}</a>
    <header className="workspace-heading">
      <div><div className="eyebrow">{t.edit}</div><h1 translate="no">{resume.title || extra.resumeTitle}</h1>
      {!warning && <p><ShieldCheck size={16}/>{t.saved}</p>}</div>
      <div className="actions">
        <button className="btn" disabled={busy || !filled} onClick={()=>exportFile("docx")}>{t.word}</button>
        <button className="btn primary" disabled={busy || !filled} onClick={()=>exportFile("pdf")}><Download size={17}/>{t.pdf}</button>
      </div>
    </header>
    {busy && <p role="status">{t.preparing}</p>}{error && <p className="alert" role="alert">{error}</p>}
    <div className="mobile-tabs actions">
      <button className="btn" aria-pressed={mobile==="edit"} onClick={()=>setMobile("edit")}>{t.editTab}</button>
      <button className="btn" aria-pressed={mobile==="preview"} onClick={()=>setMobile("preview")}>{t.preview}</button>
    </div>
    <div className={`editor-grid mobile-${mobile}`}>
      <section className="panel editor-form" aria-label={t.edit}>
        <p className="small editor-hint">{extra.editHint}</p>
        <Field label={t.title} value={resume.title} limit={120} change={title=>patch({title})}/>
        <div className="actions editor-tabs">
          <button className="btn" aria-pressed={active==="personal"} onClick={()=>setActive("personal")}>{t.personal}</button>
          <button className="btn" aria-pressed={active==="design"} onClick={()=>setActive("design")}>{t.design}</button>
        </div>
        {active==="personal" && <div className="fields"><ResumePhoto locale={locale} photo={resume.photo} onChange={photo=>patch({photo})}/>{personalFields.map(field=><Field key={field} label={t.fields[field]} value={resume.personal[field]} type={field==="phone"?"tel":field==="email"?"email":field==="website"?"url":"text"} change={value=>patch({personal:{...resume.personal,[field]:value}})}/>)}</div>}
        {active==="design" && <div className="fields">
          <label className="field"><span>{t.template}</span><select value={resume.template} onChange={e=>{const template=e.target.value as Resume["template"];patch({template,color:templates[template].color,font:templates[template].font});}}>{templateKeys.map(key=><option key={key} value={key}>{templates[key].name}</option>)}</select></label>
          <label className="field"><span>{t.font}</span><select value={resume.font} onChange={e=>patch({font:e.target.value as Resume["font"]})}>{fonts.map(font=><option key={font} value={font}>{t.fontNames[font]}</option>)}</select></label>
          <label className="field"><span>{t.fontSize}</span><select value={resume.size} onChange={e=>patch({size:Number(e.target.value)})}>{[9,10,11,12].map(size=><option key={size} value={size}>{size} pt</option>)}</select></label>
          <label className="field"><span>{t.color}</span><input type="color" value={resume.color} onChange={e=>patch({color:e.target.value})}/></label>
          <label className="field"><span>{t.language}</span><select value={resume.locale} onChange={e=>patch({locale:e.target.value as Locale})}><option value="en">English</option><option value="ms">Bahasa Melayu</option></select></label>
        </div>}
        <h2 className="section-title">{t.content}</h2><p className="muted small">{t.orderHint}</p>
        <div className="section-list">
          {resume.order.map((key,index)=>{
            const expanded=active===key;
            const entries=resume.sections[key];
            return <div key={key} className="editor-section" data-section={key}>
              <div className="section-row">
                <span className="drag-handle" title={t.drag} aria-hidden="true" onPointerDown={event=>{
                  if (event.button===0) event.currentTarget.setPointerCapture(event.pointerId);
                }} onPointerUp={event=>{
                  if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
                  const target=document.elementFromPoint(event.clientX,event.clientY)?.closest(".editor-section");
                  const to=sectionKeys.find(section=>section===target?.getAttribute("data-section"));
                  if (to && to!==key) move(key,to);
                }}><GripVertical size={18}/></span>
                <button className="section-toggle" aria-expanded={expanded} aria-controls={`section-${key}`} onClick={()=>setActive(expanded?"personal":key)}>{ui(labels[locale][key])}</button>
                <button className="icon-btn" aria-label={`${t.up} · ${ui(labels[locale][key])}`} disabled={index===0} onClick={()=>move(key,resume.order[index-1])}><ArrowUp size={15}/></button>
                <button className="icon-btn" aria-label={`${t.down} · ${ui(labels[locale][key])}`} disabled={index===sectionKeys.length-1} onClick={()=>move(key,resume.order[index+1])}><ArrowDown size={15}/></button>
              </div>
              <div id={`section-${key}`} hidden={!expanded} className="entry-fields">
                {expanded && (key==="summary" || key==="skills"
                  ? <Field label={t.simple[key]} value={entries[0]?.description ?? ""} limit={10000} multi change={description=>rows(key,[{...(entries[0] ?? blankEntry()),description},...entries.slice(1)])}/>
                  : <>
                    {entries.map((entry,i)=><fieldset className="entry" key={entry.id}><legend>{t.entry} {i+1}</legend>
                      <div className="fields">{(["title","organization","dates","description"] as const).map(field=><Field key={field} label={field==="title"?t.rowTitle[key]:field==="organization"?t.rowOrg[key]:t.row[field]} value={entry[field]} limit={field==="description"?10000:250} multi={field==="description"} change={value=>rows(key,entries.map(row=>row.id===entry.id?{...row,[field]:value}:row))}/>)}</div>
                      <button className="btn danger" onClick={()=>rows(key,entries.filter(row=>row.id!==entry.id))}><Trash2 size={15}/>{t.remove}</button>
                    </fieldset>)}
                    <button className="btn" disabled={entries.length>=100} onClick={()=>rows(key,[...entries,blankEntry()])}><Plus size={15}/>{key==="custom"?t.addCustom:t.add}</button>
                  </>)}
              </div>
            </div>;
          })}
        </div>
        <div className="actions editor-footer"><button className="btn" onClick={()=>jsonDownload([resume],name)}>{t.backup}</button><a className="btn" href={`/${locale}/ats?id=${resume.id}`}>{t.draftCheck}</a></div>
      </section>
      <section className="panel preview-pane" tabIndex={0} aria-label={t.preview}>
        <div className="preview-heading"><h2>{t.preview}</h2><span className="badge">{t.a4}</span></div>
        <Preview resume={deferred} locale={locale}/>
      </section>
    </div>
  </>;
}
