import { ArrowRight, Check, FileText, FolderOpen, LayoutTemplate, ScanLine, Sparkles } from "lucide-react";
import Image from "next/image";
import { articles } from "../lib/content";
import { galleryCopy, templateGroups } from "../lib/template-gallery";
import { GalleryFilters } from "./gallery-filters";
import { TemplateSample } from "./template-sample";
import { Ui } from "./ui-language";
import { extraCopy } from "../lib/ui-language";
import { guideKeys, site, type NavKey } from "../lib/copy";
import { demoPortraitPath, labels, sampleResume, templateKeys, templates, type Locale, type Template } from "../lib/resume";

function TemplateCard({locale,template}:{locale:Locale;template:Template}) {
  const root=`/${locale}`;
  const t=galleryCopy[locale];
  return <article className="template-card panel">
    <a className="template-preview-link" href={`${root}/templates/${template}`} aria-label={`${t.preview}: ${templates[template].name}`}>
      <TemplateSample locale={locale} template={template}/>
    </a>
    <div className="template-card-copy">
      <div className="split"><span className="pill"><Ui>{t.groups[templateGroups[template]]}</Ui></span><span className="hero-sample-format">A4</span></div>
      <h3>{templates[template].name}</h3>
      <p><Ui>{templates[template].description[locale]}</Ui></p>
      <div className="template-card-actions">
        <a className="text-link" href={`${root}/templates/${template}`}><Ui>{t.preview}</Ui><span className="sr-only"> · {templates[template].name}</span><ArrowRight size={15} aria-hidden="true"/></a>
        <a className="btn" href={`${root}/builder?template=${template}&sample=1`}><Ui>{extraCopy[locale].trySample}</Ui><span className="sr-only"> · {templates[template].name}</span></a>
      </div>
    </div>
  </article>;
}
function ResumeExample({locale}:{locale:Locale}) {
  const {personal,sections}=sampleResume(locale,"modern-portrait");
  const experience=sections.experience[0];
  const education=sections.education[0];
  const headings=labels[locale];
  return <figure className="hero-visual" aria-labelledby="hero-sample-label">
    <div className="hero-gridlines" aria-hidden="true"/>
    <figcaption className="hero-sample-caption">
      <span id="hero-sample-label" className="pill"><Ui>{extraCopy[locale].sample}</Ui></span>
      <span className="hero-sample-format"><FileText size={15} aria-hidden="true"/> A4 · PDF / DOCX</span>
    </figcaption>
    <div className="hero-sample-paper">
      <div className="hero-sample-header">
        <div>
          <p className="hero-sample-name">{personal.name}</p>
          <p className="hero-sample-role">{personal.headline}</p>
          <p className="hero-sample-contact"><span>{personal.location}</span><bdi>{personal.email}</bdi></p>
        </div>
        <Image src={demoPortraitPath} alt="" width={72} height={72} unoptimized/>
      </div>
      <div className="hero-sample-section">
        <p className="hero-sample-heading"><Ui>{headings.summary}</Ui></p>
        <p>{sections.summary[0].description}</p>
      </div>
      <div className="hero-sample-section">
        <p className="hero-sample-heading"><Ui>{headings.experience}</Ui></p>
        <div className="hero-sample-job"><strong>{experience.title}</strong><span>{experience.dates}</span></div>
        <p>{experience.organization}</p>
        <ul>{experience.description.split("\n").map(line=><li key={line}>{line}</li>)}</ul>
      </div>
      <div className="hero-sample-section">
        <p className="hero-sample-heading"><Ui>{headings.education}</Ui></p>
        <p><strong>{education.title}</strong></p>
        <p>{education.organization} · {education.dates}</p>
      </div>
      <div className="hero-sample-section">
        <p className="hero-sample-heading"><Ui>{headings.skills}</Ui></p>
        <p>{sections.skills[0].description}</p>
      </div>
    </div>
    <a className="btn hero-sample-action" href={`/${locale}/builder?template=modern-portrait&sample=1`}><Ui>{extraCopy[locale].trySample}</Ui><ArrowRight size={17} aria-hidden="true"/></a>
  </figure>;
}

export function Home({locale}:{locale:Locale}) {
  const t=site[locale];
  const root=`/${locale}`;
  const extra=extraCopy[locale];
  const tools = [["builder",FileText],["templates",LayoutTemplate],["ats",ScanLine],["resumes",FolderOpen]] as const;
  return <>
    <section className="landing-hero"><div className="hero-inner">
      <div className="hero-copy"><span className="pill"><Sparkles size={15}/><Ui>{t.eyebrow}</Ui></span>
        <h1><Ui>{t.hero}</Ui><br/><span><Ui>{t.accent}</Ui></span></h1><p><Ui>{t.description}</Ui></p>
        <div className="actions"><a className="btn primary" href={`${root}/builder`}><Ui>{t.start}</Ui><ArrowRight size={19}/></a><a className="btn" href={`${root}/templates`}><Ui>{t.browse}</Ui></a></div>
        <div className="hero-proof">{[t.noAccount,t.free].map(point=><span key={point}><Check size={16}/><Ui>{point}</Ui></span>)}</div>
      </div>
      <ResumeExample locale={locale}/>
    </div></section>
    <section className="public-section"><div className="eyebrow"><Ui>{t.workspace}</Ui></div><h2><Ui>{t.toolkit}</Ui></h2><p><Ui>{t.toolkitCopy}</Ui></p>
      <div className="tool-grid">{tools.map(([key,Icon])=><a href={`${root}/${key}`} className="panel tool-card" key={key}><span className="tile-icon"><Icon size={21}/></span><h3><Ui>{t.nav[key]}</Ui> <ArrowRight size={16}/></h3><p><Ui>{t.copy[key]}</Ui></p></a>)}</div>
    </section>
    <section className="public-section how-section"><h2><Ui>{extra.how}</Ui></h2>
      <div className="step-grid">{extra.steps.map((label,index)=><div key={label} className="step-card"><span className="step-number">0{index+1}</span><div><h3><Ui>{label}</Ui></h3><p><Ui>{extra.stepDetails[index]}</Ui></p></div></div>)}</div>
    </section>
    <section className="public-section"><div className="split"><h2><Ui>{t.gallery}</Ui></h2><a className="text-link" href={`${root}/templates`}><Ui>{t.browse}</Ui><ArrowRight size={16}/></a></div>
      <div className="template-grid">{(["modern-portrait","engineering-blue","classic-ats"] as const).map(template=><TemplateCard key={template} template={template} locale={locale}/>)}</div>
    </section>
  </>;
}
export function Gallery({locale,template}:{locale:Locale;template?:Template}) {
  const t=site[locale];
  const gallery=galleryCopy[locale];
  if(template)return <section className="public-section detail">
    <div><a className="text-link" href={`/${locale}/templates`}>← <Ui>{t.nav.templates}</Ui></a><h1>{templates[template].name}</h1><p><Ui>{templates[template].description[locale]}</Ui></p><a className="btn primary" href={`/${locale}/builder?template=${template}`}><Ui>{extraCopy[locale].use}</Ui><ArrowRight size={18}/></a><a className="btn" href={`/${locale}/builder?template=${template}&sample=1`}><Ui>{extraCopy[locale].trySample}</Ui></a><p className="muted small"><Ui>{t.free}</Ui></p></div>
    <TemplateSample locale={locale} template={template} full/>
  </section>;
  return <section className="public-section"><div className="eyebrow"><Ui>{t.nav.templates}</Ui></div><h1><Ui>{gallery.heading}</Ui></h1><p><Ui>{gallery.intro}</Ui></p>
    <GalleryFilters locale={locale} cards={templateKeys.map(key=>({template:key,node:<TemplateCard template={key} locale={locale}/>}))}/>
  </section>;
}
export function Reading({locale,path,guide}:{locale:Locale;path:NavKey;guide?:typeof guideKeys[number]}) {
  const t=site[locale];
  if(path==="career"&&!guide)return <section className="public-section">
    <div className="eyebrow"><Ui>{t.resources}</Ui></div><h1><Ui>{t.nav.career}</Ui></h1>
    <div className="tool-grid guide-grid">{guideKeys.map(key=><a href={`/${locale}/career/${key}`} className="panel tool-card" key={key}><h2><Ui>{articles[locale][key].title}</Ui><ArrowRight size={16}/></h2><p><Ui>{articles[locale][key].intro}</Ui></p></a>)}</div>
  </section>;
  const key=guide??path as "help"|"about"|"contact"|"privacy"|"terms";
  const content=articles[locale][key];
  const email=process.env.RESUMEFORGE_CONTACT_EMAIL;
  return <article className="public-section article">
    {guide&&<a className="text-link" href={`/${locale}/career`}>← <Ui>{t.nav.career}</Ui></a>}
    <div className="eyebrow"><Ui>{t.resources}</Ui></div><h1><Ui>{content.title}</Ui></h1><p className="lead"><Ui>{content.intro}</Ui></p>
    {content.sections.map(([heading,body])=><section key={heading}><h2><Ui>{heading}</Ui></h2><p><Ui>{body}</Ui></p></section>)}
    {path==="contact" && <a className="btn primary" href={email&&/^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i.test(email)?`mailto:${email}`:"https://github.com/openpdfstudio98"}><Ui>{extraCopy[locale].contact}</Ui><ArrowRight size={16}/></a>}
    {path==="privacy" && <a className="btn" href={`/${locale}/resumes`}><Ui>{t.nav.resumes}</Ui></a>}
  </article>;
}
