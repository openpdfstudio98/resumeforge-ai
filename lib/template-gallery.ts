import { templateKeys, type Template } from "./resume";

export const galleryGroups=["all","premium","professional","technical","graduate","photo"] as const;
export type GalleryGroup=typeof galleryGroups[number];
export const templateGroups:Record<Template,Exclude<GalleryGroup,"all">>={
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
};
export const galleryOrder = [...templateKeys.filter(key=>templateGroups[key]==="premium"), ...templateKeys.filter(key=>templateGroups[key]!=="premium")];

export const galleryCopy={
  en:{heading:"Find your resume style",intro:"Compare completed resumes, then start with a sample or a blank template.",filter:"Filter by style",preview:"View full preview",page:"Sample page",groups:{all:"All styles",premium:"Premium collection",professional:"Professional",technical:"Technical",graduate:"Graduate",photo:"With photo"}},
  ms:{heading:"Cari gaya resume anda",intro:"Bandingkan resume yang lengkap, kemudian mula dengan contoh atau templat kosong.",filter:"Tapis ikut gaya",preview:"Lihat pratonton penuh",page:"Halaman contoh",groups:{all:"Semua gaya",premium:"Koleksi premium",professional:"Profesional",technical:"Teknikal",graduate:"Graduan",photo:"Bergambar"}},
};
