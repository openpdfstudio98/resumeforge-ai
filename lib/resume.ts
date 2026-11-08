import { isResumePhoto } from "./photo";

export const locales = ["en", "ms"] as const;
export type Locale = typeof locales[number];
export const sectionKeys = ["summary", "experience", "education", "skills", "certifications", "projects", "languages", "custom"] as const;
export type SectionKey = typeof sectionKeys[number];
export const entryFields = ["title", "organization", "dates", "description"] as const;
export const personalFields = ["name", "headline", "email", "phone", "location", "website"] as const;
export type Entry = Record<typeof entryFields[number], string> & { id: string };
export const templateKeys = ["classic-ats", "modern-executive", "fresh-graduate", "minimal-professional", "technical-engineer", "creative-professional"] as const;
export type Template = typeof templateKeys[number];
export const fonts = ["sans", "serif", "mono"] as const;
export type Font = typeof fonts[number];
export type Resume = {
  id: string;
  title: string;
  locale: Locale;
  updated: number;
  photo?: string;
  personal: Record<typeof personalFields[number], string>;
  order: SectionKey[];
  sections: Record<SectionKey, Entry[]>;
  template: Template;
  font: Font;
  color: string;
  size: number;
};
export const labels = {
  en: {summary:"Professional Summary", experience:"Work Experience", education:"Education", skills:"Skills", certifications:"Certifications", projects:"Projects", languages:"Languages", custom:"Additional Information"},
  ms: {summary:"Ringkasan Profesional", experience:"Pengalaman Kerja", education:"Pendidikan", skills:"Kemahiran", certifications:"Pensijilan", projects:"Projek", languages:"Bahasa", custom:"Maklumat Tambahan"},
};
export const templates: Record<Template, {name: string; color: string; font: Font; description: Record<Locale,string>}> = {
  "classic-ats": {name:"Classic ATS",color:"#26334C",font:"sans",description:{en:"A straightforward, single-column layout with familiar headings.",ms:"Susun atur satu lajur dengan tajuk bahagian yang lazim."}},
  "modern-executive": {name:"Modern Executive",color:"#234BA8",font:"sans",description:{en:"A confident header and clear hierarchy for leadership experience.",ms:"Pengepala yang menonjol dan hierarki yang jelas untuk pengalaman kepimpinan."}},
  "fresh-graduate": {name:"Fresh Graduate",color:"#167263",font:"sans",description:{en:"A balanced layout that puts education before experience.",ms:"Susun atur seimbang yang mendahulukan pendidikan."}},
  "minimal-professional": {name:"Minimal Professional",color:"#3D4150",font:"serif",description:{en:"A restrained serif design with generous spacing.",ms:"Reka bentuk serif ringkas dengan ruang yang selesa."}},
  "technical-engineer": {name:"Technical Engineer",color:"#195C85",font:"mono",description:{en:"A precise layout that surfaces technical skills and projects early.",ms:"Susun atur kemas yang mengetengahkan kemahiran teknikal dan projek."}},
  "creative-professional": {name:"Creative Professional",color:"#7738A3",font:"sans",description:{en:"An expressive accent treatment with a clear reading order.",ms:"Aksen warna yang menyerlah dengan turutan bacaan yang jelas."}},
};
export const STORAGE_KEY = "resumeforge:v1";
export const RECOVERY_KEY = "resumeforge:v1:previous";
export const BACKUP_LIMIT = 4_000_000;
export function blankEntry(): Entry {
  return {id:crypto.randomUUID(),title:"",organization:"",dates:"",description:""};
}
export function makeResume(locale: Locale, template: Template = "classic-ats"): Resume {
  const order: SectionKey[] = template === "fresh-graduate"
    ? ["summary","education","skills","experience","projects","certifications","languages","custom"]
    : template === "technical-engineer"
      ? ["summary","skills","projects","experience","education","certifications","languages","custom"]
      : [...sectionKeys];
  return {
    id:crypto.randomUUID(), title:locale === "en" ? "Untitled resume" : "Resume tanpa tajuk", locale,
    updated:Date.now(), personal:{name:"",headline:"",email:"",phone:"",location:"",website:""},
    order, sections:{summary:[],experience:[],education:[],skills:[],certifications:[],projects:[],languages:[],custom:[]},
    template, color:templates[template].color, font:templates[template].font, size:10,
  };
}
export function filled(entry: Entry) {
  return entryFields.some(field => entry[field].trim());
}
export function sampleResume(locale: Locale, template: Template): Resume {
  const r = makeResume(locale, template);
  const en = locale === "en";
  r.personal = {name:"Alyssa Tan",headline:en?"Operations Coordinator":"Penyelaras Operasi",email:"alyssa@example.com",phone:"+60 12 345 6789",location:"Selangor, Malaysia",website:""};
  r.sections.summary = [{...blankEntry(),description:en?"Operations coordinator focused on stock accuracy, process documentation and cross-team planning.":"Penyelaras operasi yang memberi tumpuan kepada ketepatan stok, dokumentasi proses dan perancangan pasukan."}];
  r.sections.experience = [{...blankEntry(),title:r.personal.headline,organization:"Meridian Works",dates:"2023 – 2026",description:en?"Coordinated weekly inventory reviews across three teams.\nMaintained order tracking and documented handover procedures.":"Menyelaras semakan inventori mingguan merentas tiga pasukan.\nMenyelenggara penjejakan pesanan dan mendokumenkan proses serahan."}];
  r.sections.education = [{...blankEntry(),title:en?"Diploma in Business Administration":"Diploma Pentadbiran Perniagaan",organization:"Meridian College",dates:"2020 – 2023"}];
  r.sections.skills = [{...blankEntry(),description:en?"Excel, Inventory tracking, Process documentation":"Excel, Penjejakan inventori, Dokumentasi proses"}];
  r.sections.projects = [{...blankEntry(),title:en?"Stock reconciliation dashboard":"Papan pemuka penyelarasan stok",description:en?"Built a shared workbook for weekly stock reviews.":"Membina buku kerja bersama untuk semakan stok mingguan."}];
  return r;
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid object");
  return value as Record<string, unknown>;
}
function strings<T extends string>(input: unknown, fields: readonly T[], limit: number): Record<T,string> {
  const item = object(input);
  return Object.fromEntries(fields.map(key => {
    if (typeof item[key] !== "string" || item[key].length > limit) throw new Error("Invalid text");
    return [key,item[key]];
  })) as Record<T,string>;
}
function member<T extends string>(value: unknown, options: readonly T[]): value is T {
  return options.some(option => option === value);
}
export function readBackup(input: string): Resume[] {
  if (input.length > BACKUP_LIMIT) throw new Error("Backup too large");
  const payload = object(JSON.parse(input));
  if (payload.version !== 1 || !Array.isArray(payload.resumes) || payload.resumes.length > 100) throw new Error("Unsupported backup");
  const ids = new Set<string>();
  return payload.resumes.map(value => {
    const item = object(value);
    const {id,title,locale,updated,order,template,font,color,size,photo} = item;
    if (typeof id !== "string" || !/^[\w-]{1,80}$/.test(id) || ids.has(id) || typeof title !== "string" || title.length > 120 ||
        !member(locale,locales) || typeof updated !== "number" || !Number.isSafeInteger(updated) || updated < 0 || updated > 8.64e15 ||
        !member(template,templateKeys) || !member(font,fonts) || typeof color !== "string" || !/^#[0-9a-f]{6}$/i.test(color) ||
        typeof size !== "number" || !Number.isInteger(size) || size < 9 || size > 12 || !Array.isArray(order) ||
        order.length !== sectionKeys.length || new Set(order).size !== order.length || !order.every(key => member(key,sectionKeys))) {
      throw new Error("Invalid resume");
    }
    if (photo !== undefined && !isResumePhoto(photo)) throw new Error("Invalid photo");
    ids.add(id);
    const data = object(item.sections);
    const sections = Object.fromEntries(sectionKeys.map(key => {
      const entries = data[key];
      if (!Array.isArray(entries) || entries.length > 100) throw new Error("Invalid section");
      const entryIds = new Set<string>();
      return [key,entries.map(value => {
        const row = object(value);
        if (typeof row.id !== "string" || !/^[\w-]{1,80}$/.test(row.id) || entryIds.has(row.id)) throw new Error("Invalid entry");
        entryIds.add(row.id);
        return {id:row.id,...strings(row,entryFields,10_000)};
      })];
    })) as Resume["sections"];
    return {id,title,locale,updated,order,template,font,color,size,sections,...(photo ? {photo} : {}),personal:strings(item.personal,personalFields,250)};
  });
}
export function backup(resumes: Resume[]) {
  return JSON.stringify({version:1,resumes});
}
export function reorder(order: SectionKey[], from: SectionKey, to: SectionKey) {
  const result = order.filter(key => key !== from);
  result.splice(order.indexOf(to),0,from);
  return result;
}

export function touchResume(resume: Resume): Resume {
  return {...resume,updated:Date.now()};
}
export function copyResume(resume: Resume, title = resume.title): Resume {
  return touchResume({...resume,id:crypto.randomUUID(),title:title.slice(0,120)});
}
