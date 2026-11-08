import { ArrowRight, Check, FileText, FolderOpen, LayoutTemplate, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import { articles } from "../lib/content";
import { guideKeys, site, type NavKey } from "../lib/copy";
import { templateKeys, templates, type Locale, type Template } from "../lib/resume";

export function MiniResume({template}:{template:Template}) {
  const accent=templates[template].color;
  const center=template==="modern-executive"||template==="minimal-professional";
  return <svg className="mini-resume" viewBox="0 0 172 225" aria-hidden="true">
    <rect width="172" height="225" fill="#fff"/>
    {(template==="modern-executive"||template==="creative-professional")&&<rect width="172" height="5" fill={accent}/>}
    <rect x={center?47:20} y="25" width="78" height="8" rx="2" fill={accent}/>
    <rect x={center?57:20} y="39" width="58" height="3" rx="1" fill="#63718A"/>
    <rect x={center?29:20} y="48" width="114" height="2.5" rx="1" fill="#A2AFC4"/>
    {[67,107,152,187].map((y,index)=><g key={y}>
      {(template==="fresh-graduate"||template==="creative-professional")&&<rect x="14" y={y-2} width="2" height="8" fill={accent}/>}
      <rect x="20" y={y} width={index%2?57:43} height="4" rx="1" fill={accent}/>
      <rect x="20" y={y+9} width="132" height="2" rx="1" fill="#D5DCE7"/>
      <rect x="20" y={y+16} width={index%2?96:126} height="3" rx="1" fill="#9FAEC5"/>
      <rect x="20" y={y+23} width={index%2?115:80} height="3" rx="1" fill="#B6C1D2"/>
    </g>)}
  </svg>;
}

function TemplateCard({locale,template}:{locale:Locale;template:Template}) {
  return <a className="template-card panel" href={`/${locale}/templates/${template}`}>
    <div className={`template-figure ${template}`}><MiniResume template={template}/></div>
    <div className="split"><h3>{templates[template].name}</h3><ArrowRight size={17}/></div>
    <p>{templates[template].description[locale]}</p>
  </a>;
}
export function Home({locale}:{locale:Locale}) {
  const t=site[locale];
  const root=`/${locale}`;
  const tools = [["builder",FileText],["templates",LayoutTemplate],["ats",ScanLine],["resumes",FolderOpen]] as const;
  return <>
    <section className="landing-hero"><div className="hero-inner">
      <div className="hero-copy"><span className="pill"><Sparkles size={15}/>{t.eyebrow}</span>
        <h1>{t.hero}<br/><span>{t.accent}</span></h1><p>{t.description}</p>
        <div className="actions"><a className="btn primary" href={`${root}/builder`}>{t.start}<ArrowRight size={19}/></a><a className="btn" href={`${root}/templates`}>{t.browse}</a></div>
        <div className="hero-proof">{[t.noAccount,t.free].map(point=><span key={point}><Check size={16}/>{point}</span>)}</div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="orbit orbit-a"/><div className="orbit orbit-b"/>
        <div className="hero-document back"><MiniResume template="creative-professional"/></div>
        <div className="hero-document front"><MiniResume template="modern-executive"/></div>
        <div className="floating-label float-top"><FileText size={19}/> A4 <span>PDF / DOCX</span></div>
        <div className="floating-label float-bottom"><ShieldCheck size={20}/> {t.local}</div>
      </div>
    </div></section>
    <section className="public-section"><div className="eyebrow">{t.workspace}</div><h2>{t.toolkit}</h2><p>{t.toolkitCopy}</p>
      <div className="tool-grid">{tools.map(([key,Icon])=><a href={`${root}/${key}`} className="panel tool-card" key={key}><span className="tile-icon"><Icon size={21}/></span><h3>{t.nav[key]} <ArrowRight size={16}/></h3><p>{t.copy[key]}</p></a>)}</div>
    </section>
    <section className="public-section"><div className="split"><h2>{t.gallery}</h2><a className="text-link" href={`${root}/templates`}>{t.browse}<ArrowRight size={16}/></a></div>
      <div className="template-grid">{templateKeys.slice(0,3).map(template=><TemplateCard key={template} template={template} locale={locale}/>)}</div>
    </section>
  </>;
}
export function Gallery({locale,template}:{locale:Locale;template?:Template}) {
  const t=site[locale];
  if(template)return <section className="public-section detail">
    <div><a className="text-link" href={`/${locale}/templates`}>← {t.nav.templates}</a><h1>{templates[template].name}</h1><p>{templates[template].description[locale]}</p><a className="btn primary" href={`/${locale}/builder?template=${template}`}>{locale==="en"?"Use this template":"Guna templat ini"}<ArrowRight size={18}/></a><p className="muted small">{t.free}</p></div>
    <div className={`template-figure ${template}`}><MiniResume template={template}/></div>
  </section>;
  return <section className="public-section"><div className="eyebrow">{t.eyebrow}</div><h1>{t.nav.templates}</h1><p>{t.copy.templates}</p>
    <div className="template-grid">{templateKeys.map(key=><TemplateCard key={key} template={key} locale={locale}/>)}</div>
  </section>;
}
export function Reading({locale,path,guide}:{locale:Locale;path:NavKey;guide?:typeof guideKeys[number]}) {
  const t=site[locale];
  if(path==="career"&&!guide)return <section className="public-section">
    <div className="eyebrow">{t.resources}</div><h1>{t.nav.career}</h1>
    <div className="tool-grid guide-grid">{guideKeys.map(key=><a href={`/${locale}/career/${key}`} className="panel tool-card" key={key}><h2>{articles[locale][key].title}<ArrowRight size={16}/></h2><p>{articles[locale][key].intro}</p></a>)}</div>
  </section>;
  const key=guide??path as "help"|"about"|"contact"|"privacy"|"terms";
  const content=articles[locale][key];
  const email=process.env.RESUMEFORGE_CONTACT_EMAIL;
  return <article className="public-section article">
    {guide&&<a className="text-link" href={`/${locale}/career`}>← {t.nav.career}</a>}
    <div className="eyebrow">{t.resources}</div><h1>{content.title}</h1><p className="lead">{content.intro}</p>
    {content.sections.map(([heading,body])=><section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}
    {path==="contact" && <a className="btn primary" href={email&&/^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i.test(email)?`mailto:${email}`:"https://github.com/openpdfstudio98"}>{locale==="en"?"Contact the maintainer":"Hubungi penyelenggara"}<ArrowRight size={16}/></a>}
    {path==="privacy" && <a className="btn" href={`/${locale}/resumes`}>{t.nav.resumes}</a>}
  </article>;
}
