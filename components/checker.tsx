"use client";
import { useState } from "react";
import { assess } from "../lib/ats";
import { documentBlocks } from "../lib/blocks";
import { type Locale, type Resume } from "../lib/resume";
import { work } from "../lib/work-copy";
import { Field } from "./field";

export function Checker({locale,resumes,id}:{locale:Locale;resumes:Resume[];id:string}) {
  const t=work[locale];
  const [selected,setSelected]=useState(resumes.some(r=>r.id===id)?id:"");
  const [text,setText]=useState("");
  const [job,setJob]=useState("");
  const [result,setResult]=useState<ReturnType<typeof assess>>();
  const [stale,setStale]=useState(false);
  const [error,setError]=useState(false);
  function run() {
    const draft=resumes.find(r=>r.id===selected);
    if(draft ? !documentBlocks(draft).length : !text.trim()) {setError(true);setResult(undefined);return;}
    setError(false);setStale(false);setResult(assess(draft??text,job,locale));
  }
  function changed() {setStale(Boolean(result));setError(false);}
  return <>
    <header className="workspace-heading"><div><div className="eyebrow">{t.overview}</div><h1>{t.atsTitle}</h1><p>{t.atsIntro}</p></div></header>
    <div className="checker-grid">
      <section className="panel stack">
        <label className="field"><span>{t.resumeSource}</span><select value={selected} onChange={e=>{setSelected(e.target.value);changed();}}><option value="">{t.paste}</option>{resumes.map(r=><option key={r.id} value={r.id}>{r.title}</option>)}</select></label>
        {!selected && <Field label={t.paste} value={text} multi limit={100000} change={value=>{setText(value);changed();}}/>}
        <Field label={t.job} placeholder={t.jobHint} value={job} multi limit={40000} change={value=>{setJob(value);changed();}}/>
        <button className="btn primary" onClick={run}>{t.check}</button>
        {error && <p className="alert" role="alert">{t.noText}</p>}
        <p className="muted small">{t.privacy}</p>
      </section>
      <section className="panel stack" aria-live="polite">
        <h2>{t.result}</h2><p className="muted">{t.heuristic}</p>
        {stale && <p className="alert">{t.resultStale}</p>}
        {result && !stale && <>
          <div className="ats-score">{result.total}<span> / 100</span></div>
          {result.parts.map(part=><div className="score-row" key={part.name}>
            <div><span>{part.name}</span><strong>{part.max?`${part.score} / ${part.max}`:t.excluded}</strong></div>
            {part.max>0 && <progress aria-label={part.name} value={part.score} max={part.max}/>}
          </div>)}
          <h3>{t.recommendations}</h3>
          {result.parts.some(p=>p.score<p.max)?<ul className="tips">{result.parts.filter(p=>p.score<p.max).map(p=><li key={p.name}>{p.tip}</li>)}</ul>:<p>{t.noIssues}</p>}
          <h3>{t.missingKeywords}</h3>
          {result.missing.length?<div className="actions">{result.missing.map(word=><span className="badge" key={word}>{word}</span>)}</div>:<p>{result.matched.length?t.noneMissing:t.noKeywords}</p>}
          {result.matched.length>0 && <><h3>{t.matched}</h3><div className="actions">{result.matched.map(word=><span className="badge" key={word}>{word}</span>)}</div></>}
        </>}
      </section>
    </div>
  </>;
}
