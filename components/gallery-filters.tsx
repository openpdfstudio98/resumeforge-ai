"use client";
import { useState, type ReactNode } from "react";
import { galleryCopy, collectionFilters, collectionFilterCopy, matchesCollection, type CollectionFilter } from "../lib/template-gallery";
import { sampleHasPhoto } from "../lib/premium";
import type { Locale, Template } from "../lib/resume";
import { useCopy } from "./ui-language";

export function GalleryFilters({locale,cards}:{locale:Locale;cards:{template:Template;node:ReactNode}[]}) {
  const [active,setActive]=useState<CollectionFilter>("all");
  const t=useCopy(galleryCopy[locale]);
  const filters=useCopy(collectionFilterCopy[locale]);
  return <>
    <div className="gallery-filters" role="group" aria-label={t.filter}>
      {collectionFilters.map(group=><button key={group} className="btn" type="button" aria-pressed={active===group} onClick={()=>setActive(group)}>{filters[group]}</button>)}
    </div>
    <div className="template-grid">{cards.filter(({template})=>active==="photo"?sampleHasPhoto(template):matchesCollection(template,active)).map(({template,node})=><div className="gallery-card-slot" key={template}>{node}</div>)}</div>
  </>;
}
