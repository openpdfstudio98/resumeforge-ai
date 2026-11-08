"use client";
import { useState, type ReactNode } from "react";
import { galleryCopy, galleryGroups, templateGroups, type GalleryGroup } from "../lib/template-gallery";
import { sampleHasPhoto } from "../lib/premium";
import type { Locale, Template } from "../lib/resume";
import { useCopy } from "./ui-language";

export function GalleryFilters({locale,cards}:{locale:Locale;cards:{template:Template;node:ReactNode}[]}) {
  const [active,setActive]=useState<GalleryGroup>("all");
  const t=useCopy(galleryCopy[locale]);
  return <>
    <div className="gallery-filters" role="group" aria-label={t.filter}>
      {galleryGroups.map(group=><button key={group} className="btn" type="button" aria-pressed={active===group} onClick={()=>setActive(group)}>{t.groups[group]}</button>)}
    </div>
    <div className="template-grid">{cards.filter(({template})=>active==="all"||(active==="photo"?sampleHasPhoto(template):templateGroups[template]===active)).map(({template,node})=><div className="gallery-card-slot" key={template}>{node}</div>)}</div>
  </>;
}
