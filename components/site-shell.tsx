import { ArrowUpRight, CircleHelp, FileText, FolderOpen, LayoutDashboard, LayoutTemplate, ScanLine, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { site, type NavKey } from "../lib/copy";
import type { Locale } from "../lib/resume";
import { LocaleLink } from "./locale-link";

const navIcons = {dashboard:LayoutDashboard,builder:FileText,templates:LayoutTemplate,ats:ScanLine,resumes:FolderOpen,help:CircleHelp};
const workspace = ["dashboard","builder","templates","ats","resumes","help"] as const;

export function Brand({locale}:{locale:Locale}) {
  return <a className="brand" href={`/${locale}`}><span><Sparkles size={20}/></span><strong>ResumeForge <b>AI</b></strong></a>;
}
export function Shell({locale,path,sidebar,children}:{locale:Locale;path:string;sidebar:boolean;children:ReactNode}) {
  const t=site[locale];
  const root=`/${locale}`;
  function link(key:NavKey) {
    return <a key={key} href={`${root}/${key}`} aria-current={path===key?"page":undefined}>{t.nav[key]}</a>;
  }
  return <>
    <a className="skip" href="#content">{t.skip}</a>
    <header className="site-header">
      <div className="topbar"><Brand locale={locale}/>
        <nav aria-label={t.menu} className="top-nav">{(["templates","ats","career"] as const).map(link)}</nav>
        <div className="top-actions"><LocaleLink locale={locale} path={path}/>
        <a className="btn primary desktop-cta" href={`${root}/dashboard`}>{t.nav.dashboard}<ArrowUpRight size={16}/></a></div>
      </div>
      <nav className="mobile-nav" aria-label={t.workspace}>{workspace.map(link)}</nav>
    </header>
    {sidebar?<div className="app-shell"><aside className="sidebar"><div className="eyebrow">{t.workspace}</div><nav aria-label={t.workspace}>{workspace.map(key=>{
      const Icon=navIcons[key];
      return <a href={`${root}/${key}`} key={key} aria-current={path===key?"page":undefined}><Icon size={18}/>{t.nav[key]}</a>;
    })}</nav><p>{t.local}</p></aside><main id="content" className="workspace">{children}</main></div>
      :<main id="content">{children}</main>}
    <footer className="site-footer"><div className="footer-inner"><Brand locale={locale}/><nav aria-label={t.resources}>{(["help","career","about","contact","privacy","terms"] as const).map(link)}</nav></div></footer>
  </>;
}
