import { readFileSync } from "node:fs";
import { join } from "node:path";
import { layoutPdf, type FontBytes } from "../lib/document";
import { sampleResume, templates, type Font, type Locale, type Template } from "../lib/resume";
import { galleryCopy } from "../lib/template-gallery";
import { DocumentSheet } from "./document-sheet";

const fonts=new Map<Font,FontBytes>();

function getFonts(font:Font) {
  const cached=fonts.get(font);
  if(cached)return cached;
  const bytes=["Regular","Bold"].map(style=>readFileSync(join(process.cwd(),"public","fonts",`${font}-${style}.ttf`)).toString("base64")) as FontBytes;
  fonts.set(font,bytes);
  return bytes;
}

export function TemplateSample({locale,template,full=false}:{locale:Locale;template:Template;full?:boolean}) {
  const resume=sampleResume(locale,template);
  const {pages}=layoutPdf(resume,getFonts(resume.font));
  const visible=full?pages:pages.slice(0,1);
  return <div className={`template-figure ${template}${full?" template-figure-full":""}`} translate="no">
    {visible.map((page,index)=><DocumentSheet key={index} page={page} font={resume.font} label={full?`${templates[template].name} · ${galleryCopy[locale].page} ${index+1}`:undefined}/>)}
  </div>;
}
