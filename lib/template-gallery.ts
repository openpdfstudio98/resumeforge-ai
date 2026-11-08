import { templateKeys, type Template } from "./resume";

export const galleryGroups=["all","studio","premium","professional","technical","graduate","photo"] as const;
export type GalleryGroup=typeof galleryGroups[number];
export const collectionFilters=["all","modern","classic","minimal","ats","creative","oneColumn","twoColumn","photo"] as const;
export type CollectionFilter=typeof collectionFilters[number];
const oneColumnTemplates=new Set<Template>(["classic-ats","modern-executive","fresh-graduate","minimal-professional","technical-engineer","creative-professional","modern-portrait","engineering-blue","mono-grid","aurora-minimal","editorial-mono","paper-loom","ivory-editorial","heritage-classic","signature-minimal","academic-scholar"]);
const atsTemplates=new Set<Template>(["classic-ats","minimal-professional","heritage-classic","signature-minimal","academic-scholar","aurora-minimal","mono-grid"]);
const classicTemplates=new Set<Template>(["heritage-classic","academic-scholar","minimal-professional","ivory-editorial","paper-loom","executive-ledger","onyx-gold"]);
const minimalTemplates=new Set<Template>(["signature-minimal","minimal-professional","aurora-minimal","mono-grid","editorial-mono","classic-ats"]);
export function matchesCollection(template:Template,filter:CollectionFilter) {
  switch(filter) {
    case "all":return true;
    case "oneColumn":return oneColumnTemplates.has(template);
    case "twoColumn":return !oneColumnTemplates.has(template);
    case "ats":return atsTemplates.has(template);
    case "classic":return classicTemplates.has(template);
    case "minimal":return minimalTemplates.has(template);
    case "creative":return templateGroups[template]==="studio" || ["creative-professional","citrus-studio","graphite-portfolio"].includes(template);
    case "modern":return !classicTemplates.has(template);
    case "photo":return false;
  }
}
export const collectionFilterCopy={
  en:{all:"All templates",modern:"Modern",classic:"Classic",minimal:"Minimal",ats:"ATS",creative:"Creative",oneColumn:"One column",twoColumn:"Two columns",photo:"With photo"},
  ms:{all:"Semua templat",modern:"Moden",classic:"Klasik",minimal:"Minimal",ats:"ATS",creative:"Kreatif",oneColumn:"Satu lajur",twoColumn:"Dua lajur",photo:"Bergambar"},
};
export const templateGroups:Record<Template,Exclude<GalleryGroup,"all">>={
  "bloom-studio":"studio",
  "violet-atelier":"studio",
  "ivory-editorial":"studio",
  "onyx-gold":"studio",
  "citrus-studio":"premium",
  "midnight-executive":"premium",
  "silver-editorial":"premium",
  "graphite-portfolio":"premium",
  "mono-grid":"premium",
  "teal-timeline":"premium",
  "classic-ats":"professional",
  "modern-executive":"professional",
  "fresh-graduate":"graduate",
  "minimal-professional":"professional",
  "technical-engineer":"technical",
  "creative-professional":"professional",
  "modern-portrait":"photo",
  "engineering-blue":"technical",
  "aurora-minimal":"premium",
  "executive-ledger":"professional",
  "editorial-mono":"premium",
  "canva-bloom":"studio",
  "neon-grid":"technical",
  "paper-loom":"professional",
  "obsidian-ink":"studio",
  "sage-column":"premium",
  "cobalt-slate":"professional",
  "rose-atelier":"studio",
  "heritage-classic":"professional",
  "signature-minimal":"premium",
  "academic-scholar":"professional",
  "professional-stripe":"professional",
  "modern-coral":"premium",
  "studio-pastel":"studio",
  "executive-timeline":"professional",
  "creative-spectrum":"studio",
};
export const galleryOrder = [...templateKeys.filter(key=>templateGroups[key]==="studio"), ...templateKeys.filter(key=>templateGroups[key]==="premium"), ...templateKeys.filter(key=>!["studio","premium"].includes(templateGroups[key]))];

export const galleryCopy={
  en:{heading:"Find your resume style",intro:"Compare completed resumes, then start with a sample or a blank template.",filter:"Filter by style",preview:"View full preview",page:"Sample page",groups:{all:"All styles",studio:"Studio collection",premium:"Premium collection",professional:"Professional",technical:"Technical",graduate:"Graduate",photo:"With photo"}},
  ms:{heading:"Cari gaya resume anda",intro:"Bandingkan resume yang lengkap, kemudian mula dengan contoh atau templat kosong.",filter:"Tapis ikut gaya",preview:"Lihat pratonton penuh",page:"Halaman contoh",groups:{all:"Semua gaya",studio:"Koleksi Studio",premium:"Koleksi premium",professional:"Profesional",technical:"Teknikal",graduate:"Graduan",photo:"Bergambar"}},
};
