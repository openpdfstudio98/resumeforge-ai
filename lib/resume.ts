import { premiumStyle } from "./premium";
import { isResumePhoto } from "./photo";

export const locales = ["en", "ms"] as const;
export type Locale = typeof locales[number];
export const sectionKeys = ["summary", "experience", "education", "skills", "certifications", "projects", "languages", "custom"] as const;
export type SectionKey = typeof sectionKeys[number];
export const entryFields = ["title", "organization", "dates", "description"] as const;
export const personalFields = ["name", "headline", "email", "phone", "location", "website"] as const;
export type Entry = Record<typeof entryFields[number], string> & { id: string };
export const templateKeys = ["classic-ats", "modern-executive", "fresh-graduate", "minimal-professional", "technical-engineer", "creative-professional", "modern-portrait", "engineering-blue", "citrus-studio", "midnight-executive", "silver-editorial", "graphite-portfolio", "mono-grid", "teal-timeline", "bloom-studio", "violet-atelier", "ivory-editorial", "onyx-gold", "aurora-minimal", "executive-ledger", "editorial-mono", "canva-bloom", "neon-grid", "paper-loom", "obsidian-ink", "sage-column", "cobalt-slate", "rose-atelier", "heritage-classic", "signature-minimal", "academic-scholar", "professional-stripe", "modern-coral", "studio-pastel", "executive-timeline", "creative-spectrum", "modern-ink", "classic-frame", "pastel-dawn", "colour-confetti", "contemporary-split", "bold-portrait", "creative-burst", "executive-focus", "industrial-mono", "academic-essential"] as const;
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
  "modern-portrait": {name:"Modern Portrait",color:"#4338AA",font:"sans",description:{en:"A bold name and optional portrait at the top right, with a clean single-column body.",ms:"Nama yang menonjol dan foto pilihan di kanan atas, dengan isi resume satu lajur."}},
  "engineering-blue": {name:"Engineering Blue",color:"#23496C",font:"sans",description:{en:"Navy accents put technical skills, certifications and projects before work history.",ms:"Aksen biru navy menonjolkan kemahiran teknikal, pensijilan dan projek sebelum sejarah kerja."}},
  "citrus-studio":{name:"Citrus Studio",color:"#126B95",font:"sans",description:{en:"A bright blue sidebar with playful citrus shapes for creative roles.",ms:"Sidebar biru terang dengan bentuk berwarna untuk bidang kreatif."}},
  "midnight-executive":{name:"Midnight Executive",color:"#253550",font:"serif",description:{en:"A deep navy sidebar, serif headline and a refined experience timeline.",ms:"Sidebar biru gelap, tajuk serif dan garis masa pengalaman yang kemas."}},
  "silver-editorial":{name:"Silver Editorial",color:"#465469",font:"sans",description:{en:"A soft silver sidebar and a clean, detailed editorial layout.",ms:"Sidebar perak lembut dengan susun atur editorial yang kemas."}},
  "graphite-portfolio":{name:"Graphite Portfolio",color:"#363541",font:"sans",description:{en:"A charcoal sidebar gives creative projects and skills a strong contrast.",ms:"Sidebar arang gelap memberi kontras pada projek kreatif dan kemahiran."}},
  "mono-grid":{name:"Mono Grid",color:"#292C34",font:"sans",description:{en:"A streamlined single-column layout with crisp rules and a contemporary header.",ms:"Susun atur satu lajur monokrom dengan garis halus dan tajuk moden."}},
  "teal-timeline":{name:"Teal Timeline",color:"#006D70",font:"sans",description:{en:"A teal masthead and a clear visual timeline for experience and achievements.",ms:"Pengepala hijau kebiruan dan garis masa visual untuk pengalaman dan pencapaian."}},
  "bloom-studio":{name:"Bloom Studio",color:"#9B3D56",font:"sans",description:{en:"Blush masthead, a right-hand portrait and a soft rose sidebar for creative portfolios.",ms:"Pengepala merah jambu lembut, potret di kanan dan sidebar ros untuk portfolio kreatif."}},
  "violet-atelier":{name:"Violet Atelier",color:"#542F91",font:"sans",description:{en:"A violet colour-block header, geometric accents and a framed lavender sidebar.",ms:"Pengepala blok ungu, aksen geometri dan sidebar lavender berbingkai."}},
  "ivory-editorial":{name:"Ivory Editorial",color:"#554734",font:"serif",description:{en:"An elegant single-column editorial layout with a centered serif header.",ms:"Susun atur editorial satu lajur dengan pengepala serif di tengah."}},
  "onyx-gold":{name:"Onyx Gold",color:"#292C32",font:"serif",description:{en:"Charcoal sidebar, champagne-gold rules and a portrait for leadership profiles.",ms:"Sidebar arang, garisan emas lembut dan potret untuk profil kepimpinan."}},
  "aurora-minimal":{name:"Aurora Minimal",color:"#2E6B8A",font:"sans",description:{en:"Airy minimal layout with soft aurora accents.",ms:"Susun atur minimal dengan aksen aurora lembut."}},
  "executive-ledger":{name:"Executive Ledger",color:"#1F3864",font:"serif",description:{en:"Formal ledger-style executive resume.",ms:"Resume eksekutif gaya lejar formal."}},
  "editorial-mono":{name:"Editorial Mono",color:"#2B2B2B",font:"mono",description:{en:"A clean single-column editorial layout in monochrome.",ms:"Susun atur editorial satu lajur dalam monokrom."}},
  "canva-bloom":{name:"Canva Bloom",color:"#D94F70",font:"sans",description:{en:"Bright Canva-style creative template.",ms:"Templat kreatif gaya Canva yang cerah."}},
  "neon-grid":{name:"Neon Grid",color:"#0E7490",font:"sans",description:{en:"Tech-forward neon grid layout.",ms:"Susun atur grid neon moden."}},
  "paper-loom":{name:"Paper Loom",color:"#6B5B45",font:"serif",description:{en:"Warm paper tones with woven rules.",ms:"Tona kertas hangat dengan garis tenunan."}},
  "obsidian-ink":{name:"Obsidian Ink",color:"#111827",font:"serif",description:{en:"Dark ink editorial with gold trim.",ms:"Editorial dakwat gelap dengan trim emas."}},
  "sage-column":{name:"Sage Column",color:"#4F6F52",font:"sans",description:{en:"Calm sage sidebar column.",ms:"Lajur sidebar sage yang tenang."}},
  "cobalt-slate":{name:"Cobalt Slate",color:"#1E40AF",font:"sans",description:{en:"Cobalt and slate executive hybrid.",ms:"Hibrid eksekutif kobalt dan slate."}},
  "rose-atelier":{name:"Rose Atelier",color:"#9F1239",font:"sans",description:{en:"Rose-toned atelier creative template.",ms:"Templat kreatif tona ros atelier."}},
  "heritage-classic":{name:"Heritage Classic",color:"#334155",font:"serif",description:{en:"A balanced, traditional single-column resume.",ms:"Resume klasik satu lajur yang seimbang."}},
  "signature-minimal":{name:"Signature Minimal",color:"#334B56",font:"sans",description:{en:"A clean modern resume with a subtle accent rule.",ms:"Resume moden minimal dengan aksen halus."}},
  "academic-scholar":{name:"Academic Scholar",color:"#3A4760",font:"serif",description:{en:"A clear single-column layout with room for academic experience.",ms:"Susun atur satu lajur untuk pengalaman akademik."}},
  "professional-stripe":{name:"Professional Stripe",color:"#294C6B",font:"sans",description:{en:"A structured professional resume with a bold header.",ms:"Resume profesional dengan pengepala yang menonjol."}},
  "modern-coral":{name:"Modern Coral",color:"#A0443A",font:"sans",description:{en:"A contemporary two-column layout with warm coral accents.",ms:"Susun atur dua lajur moden dengan aksen koral."}},
  "studio-pastel":{name:"Studio Pastel",color:"#725F8F",font:"sans",description:{en:"A soft pastel creative resume with a light sidebar.",ms:"Resume kreatif berwarna pastel dengan lajur sisi cerah."}},
  "executive-timeline":{name:"Executive Timeline",color:"#263B52",font:"serif",description:{en:"A polished executive design with a structured timeline.",ms:"Reka bentuk eksekutif dengan garis masa yang tersusun."}},
  "creative-spectrum":{name:"Creative Spectrum",color:"#226D75",font:"sans",description:{en:"A creative layout with a confident colour header.",ms:"Susun atur kreatif dengan pengepala warna yang menyerlah."}},
  "modern-ink":{name:"Modern Ink",color:"#243B53",font:"sans",description:{en:"A confident header and clean single-column content.",ms:"Pengepala moden dengan kandungan satu lajur."}},
  "classic-frame":{name:"Classic Frame",color:"#554B40",font:"serif",description:{en:"A timeless serif design with a refined framed header.",ms:"Reka bentuk serif klasik dengan bingkai kemas."}},
  "pastel-dawn":{name:"Pastel Dawn",color:"#895E76",font:"sans",description:{en:"A warm pastel header with a readable single-column layout.",ms:"Pengepala pastel dengan susun atur satu lajur."}},
  "colour-confetti":{name:"Colour Confetti",color:"#34517D",font:"sans",description:{en:"A playful dotted accent paired with a clean single column.",ms:"Aksen titik berwarna dan susun atur satu lajur."}},
  "contemporary-split":{name:"Contemporary Split",color:"#236B75",font:"sans",description:{en:"A modern split layout with a light sidebar and clear sections.",ms:"Susun atur moden dua lajur dengan sidebar cerah."}},
  "bold-portrait":{name:"Bold Portrait",color:"#354366",font:"sans",description:{en:"A strong coloured header with an optional portrait.",ms:"Pengepala berwarna dengan potret pilihan."}},
  "creative-burst":{name:"Creative Burst",color:"#A45431",font:"sans",description:{en:"A creative layout with a warm header and geometric accents.",ms:"Susun atur kreatif dengan aksen geometri hangat."}},
  "executive-focus":{name:"Executive Focus",color:"#384C43",font:"serif",description:{en:"A sophisticated sidebar and timeline for leadership roles.",ms:"Sidebar dan garis masa kemas untuk jawatan kepimpinan."}},
  "industrial-mono":{name:"Industrial Mono",color:"#32363A",font:"mono",description:{en:"A monochrome editorial design with a compact sidebar.",ms:"Reka bentuk editorial monokrom dengan sidebar ringkas."}},
  "academic-essential":{name:"Academic Essential",color:"#37465D",font:"serif",description:{en:"A restrained academic layout with space for detailed experience.",ms:"Susun atur akademik ringkas untuk pengalaman terperinci."}},
};
export const demoPortraitPath="/images/resume-demo-portrait.webp";
export const STORAGE_KEY = "resumeforge:v1";
export const RECOVERY_KEY = "resumeforge:v1:previous";
export const BACKUP_LIMIT = 4_000_000;
export function blankEntry(): Entry {
  return {id:crypto.randomUUID(),title:"",organization:"",dates:"",description:""};
}
export function makeResume(locale: Locale, template: Template = "classic-ats"): Resume {
  const order: SectionKey[] = template === "fresh-graduate"
    ? ["summary","education","skills","experience","projects","certifications","languages","custom"]
    : template === "engineering-blue"
      ? ["summary","skills","certifications","projects","experience","education","languages","custom"]
    : template === "technical-engineer"
      ? ["summary","skills","projects","experience","education","certifications","languages","custom"]
      : [...sectionKeys];
  return {
    id:crypto.randomUUID(), title:locale === "en" ? "Untitled resume" : "Resume tanpa tajuk", locale,
    updated:Date.now(), personal:{name:"",headline:"",email:"",phone:"",location:"",website:""},
    order, sections:{summary:[],experience:[],education:[],skills:[],certifications:[],projects:[],languages:[],custom:[]},
    template, color:templates[template].color, font:templates[template].font, size:11,
  };
}
export function filled(entry: Entry) {
  return entryFields.some(field => entry[field].trim());
}
export function sampleResume(locale: Locale, template: Template): Resume {
  const r = makeResume(locale, template);
  const en = locale === "en";
  const creative=["creative-professional","citrus-studio","graphite-portfolio","bloom-studio","violet-atelier"].includes(template);
  r.personal = {name:"Alyssa Tan",headline:en?"Operations Coordinator":"Penyelaras Operasi",email:"alyssa@example.com",phone:"+1 202 555 0147",location:"New York, United States",website:""};
  r.sections.summary = [{...blankEntry(),description:en?"Operations coordinator focused on stock accuracy, process documentation and cross-team planning.":"Penyelaras operasi yang memberi tumpuan kepada ketepatan stok, dokumentasi proses dan perancangan pasukan."}];
  r.sections.experience = [{...blankEntry(),title:r.personal.headline,organization:"Meridian Works",dates:"2023 – 2026",description:en?"Coordinated weekly inventory reviews across three teams.\nMaintained order tracking and documented handover procedures.":"Menyelaras semakan inventori mingguan merentas tiga pasukan.\nMenyelenggara penjejakan pesanan dan mendokumenkan proses serahan."}];
  r.sections.education = [{...blankEntry(),title:en?"Diploma in Business Administration":"Diploma Pentadbiran Perniagaan",organization:"Meridian College",dates:"2020 – 2023"}];
  r.sections.skills = [{...blankEntry(),description:en?"Excel, Inventory tracking, Process documentation":"Excel, Penjejakan inventori, Dokumentasi proses"}];
  r.sections.projects = [{...blankEntry(),title:en?"Stock reconciliation dashboard":"Papan pemuka penyelarasan stok",description:en?"Built a shared workbook for weekly stock reviews.":"Membina buku kerja bersama untuk semakan stok mingguan."}];
  if(template==="engineering-blue") {
    r.personal={...r.personal,name:"Daniel Lim",headline:en?"Quality Engineer":"Jurutera Kualiti",email:"daniel@example.com"};
    r.sections.summary=[{...blankEntry(),description:en?"Quality engineer with experience in valve inspection, hydrostatic testing and corrective actions.":"Jurutera kualiti berpengalaman dalam pemeriksaan injap, ujian hidrostatik dan tindakan pembetulan."}];
    r.sections.skills=[{...blankEntry(),description:"AutoCAD, Microsoft Excel, 8D, GD&T"}];
    r.sections.certifications=[{...blankEntry(),title:en?"ISO 9001 Internal Auditor Training":"Latihan Juruaudit Dalaman ISO 9001",dates:"2025"}];
    r.sections.projects=[{...blankEntry(),title:en?"Valve inspection reporting":"Pelaporan pemeriksaan injap",description:en?"Built a checklist to standardize pressure test records and inspection handovers.":"Membina senarai semak untuk menyeragamkan rekod ujian tekanan dan serahan pemeriksaan."}];
    r.sections.experience=[{...r.sections.experience[0],title:r.personal.headline,description:en?"Reviewed dimensional and pressure test reports for industrial valves.":"Menyemak laporan ukuran dan ujian tekanan bagi injap industri."}];
    r.sections.education=[{...r.sections.education[0],title:en?"Diploma in Mechanical Engineering":"Diploma Kejuruteraan Mekanikal"}];
  }
  if(template==="modern-executive"||template==="midnight-executive"||template==="onyx-gold") {
    r.personal={...r.personal,name:"Nadia Rahman",headline:en?"Operations Manager":"Pengurus Operasi",email:"nadia@example.com"};
    r.sections.summary[0].description=en?"Operations manager who leads production planning, vendor coordination and process improvement across multiple teams.":"Pengurus operasi yang mengetuai perancangan pengeluaran, penyelarasan pembekal dan penambahbaikan proses merentas pasukan.";
    r.sections.experience[0].title=r.personal.headline;
    r.sections.experience[0].description=en?"Led weekly production planning across three teams.\nIntroduced a shared dashboard for monitoring delivery performance.\nCoached team leads on escalation and handover standards.":"Mengetuai perancangan pengeluaran mingguan merentas tiga pasukan.\nMemperkenalkan papan pemuka bersama untuk memantau prestasi penghantaran.\nMembimbing ketua pasukan tentang piawaian eskalasi dan serahan.";
  }
  if(template==="fresh-graduate") {
    r.personal={...r.personal,name:"Hana Ismail",headline:en?"Business Administration Graduate":"Graduan Pentadbiran Perniagaan",email:"hana@example.com"};
    r.sections.summary[0].description=en?"Recent business administration graduate with internship experience in stock reporting, order tracking and team coordination.":"Graduan pentadbiran perniagaan dengan pengalaman latihan industri dalam pelaporan inventori, penjejakan pesanan dan penyelarasan pasukan.";
    r.sections.experience[0].title=en?"Operations Intern":"Pelatih Operasi";
    r.sections.experience[0].dates="2025 – 2026";
    r.sections.education[0].dates="2023 – 2026";
  }
  if(creative) {
    r.personal={...r.personal,name:"Maya Lee",headline:en?"Brand Designer":"Pereka Jenama",email:"maya@example.com"};
    r.sections.summary[0].description=en?"Brand designer with experience in visual identities, digital campaigns and design systems for small businesses.":"Pereka jenama yang berpengalaman dalam identiti visual, kempen digital dan sistem reka bentuk untuk perniagaan kecil.";
    r.sections.experience[0].title=r.personal.headline;
    r.sections.experience[0].organization="Meridian Studio";
    r.sections.experience[0].description=en?"Designed campaign assets for social and print.\nCreated reusable templates and maintained brand guidelines.\nCollaborated with writers to deliver consistent launch materials.":"Mereka bahan kempen untuk media sosial dan cetak.\nMembina templat dan menyelenggara panduan jenama.\nBekerjasama dengan penulis untuk menghasilkan bahan pelancaran yang seragam.";
    r.sections.education[0].title=en?"Diploma in Graphic Design":"Diploma Reka Bentuk Grafik";
    r.sections.skills[0].description="Figma, Adobe Illustrator, Adobe InDesign";
    r.sections.projects=[{...blankEntry(),title:en?"Brand identity refresh":"Penyegaran identiti jenama",description:en?"Developed a visual system and campaign templates for a local retailer.":"Membangunkan sistem visual dan templat kempen untuk peruncit tempatan."}];
  }
  if(template!=="fresh-graduate") {
    const technical=template==="engineering-blue"||template==="technical-engineer";
    const previousRole=technical?(en?"Inspection Technician":"Juruteknik Pemeriksaan"):creative?(en?"Junior Designer":"Pereka Junior"):(en?"Operations Assistant":"Pembantu Operasi");
    const previousWork=technical
      ?(en?"Recorded dimensional checks and maintained inspection records.\nPrepared equipment and test documentation for routine inspections.":"Merekod pemeriksaan ukuran dan menyelenggara rekod pemeriksaan.\nMenyediakan peralatan dan dokumentasi ujian untuk pemeriksaan rutin.")
      :creative
      ?(en?"Prepared social graphics and production-ready artwork.\nOrganized project files and incorporated client feedback.":"Menyediakan grafik media sosial dan karya seni untuk pengeluaran.\nMenyusun fail projek dan memasukkan maklum balas pelanggan.")
      :(en?"Tracked incoming orders and reconciled stock movements.\nPrepared daily exception reports for supervisors.":"Menjejak pesanan masuk dan menyelaraskan pergerakan stok.\nMenyediakan laporan pengecualian harian untuk penyelia.");
    r.sections.experience.push({...blankEntry(),title:previousRole,organization:creative?"Cedar Design":"Cedar Services",dates:"2021 – 2023",description:previousWork});
  }
  r.sections.languages=[{...blankEntry(),title:en?"English and Spanish":"Bahasa Inggeris dan Bahasa Sepanyol",description:en?"Professional working proficiency":"Kecekapan profesional"}];
  if(premiumStyle(template)) {
    r.personal.website=creative?"maya.example.com":"portfolio.example.com";
    r.sections.summary[0].description+=creative
      ?(en?" Builds practical brand toolkits that help teams launch and publish confidently across channels.":" Membina kit panduan jenama yang memudahkan pasukan menerbitkan bahan secara konsisten di pelbagai saluran.")
      :(en?" Combines clear reporting with hands-on process improvement and works closely with frontline teams.":" Menggabungkan pelaporan yang jelas dengan penambahbaikan proses dan bekerjasama rapat dengan pasukan operasi.");
    r.sections.experience[1].description+=creative
      ?(en?"\nMaintained a library of templates and prepared print proofs for approval.":"\nMenyelenggara koleksi templat dan menyediakan pruf cetakan untuk kelulusan.")
      :(en?"\nUpdated shift records and flagged recurring delays for the planning team.":"\nMengemas kini rekod syif dan memaklumkan kelewatan berulang kepada pasukan perancangan.");
    r.sections.projects.push({...blankEntry(),
      title:creative?(en?"Studio campaign toolkit":"Kit kempen studio"):(en?"Team handover playbook":"Panduan serahan tugas"),
      description:creative
        ?(en?"Built a reusable set of launch assets, from campaign typography to social layouts. Documented export settings and shared a review checklist with the team.":"Membina set bahan pelancaran daripada tipografi kempen hingga susun atur media sosial. Mendokumenkan tetapan eksport dan berkongsi senarai semak dengan pasukan.")
        :(en?"Created a handover guide with task owners, open issues and escalation steps. Piloted the guide with two teams and revised it after feedback.":"Menyediakan panduan serahan dengan pemilik tugas, isu terbuka dan langkah eskalasi. Menguji panduan dengan dua pasukan dan menyemaknya selepas menerima maklum balas."),
    });
    r.sections.skills.push({...blankEntry(),description:creative
      ?(en?"Art direction, Typography, Campaign design, Print production":"Arahan seni, Tipografi, Reka bentuk kempen, Pengeluaran cetak")
      :(en?"Process improvement, Reporting, Team coordination, Documentation":"Penambahbaikan proses, Pelaporan, Penyelarasan pasukan, Dokumentasi")});
    r.sections.certifications=[{...blankEntry(),
      title:creative?(en?"Visual Design Foundations":"Asas Reka Bentuk Visual"):(en?"Process Improvement Foundations":"Asas Penambahbaikan Proses"),
      organization:"Meridian Learning",dates:"2025",
    }];
  }
  if(template==="violet-atelier") {
    r.personal={...r.personal,name:"Sofia Lim",email:"sofia@example.com",website:"sofia.example.com"};
  }
  if(template==="ivory-editorial") {
    r.personal={...r.personal,name:"Hannah Wong",email:"hannah@example.com"};
  }
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
  if (!order.includes(from) || !order.includes(to) || from === to) return [...order];
  const result = order.filter(key => key !== from);
  const index = result.indexOf(to);
  result.splice(index >= 0 ? index : result.length, 0, from);
  return result;
}

export function touchResume(resume: Resume): Resume {
  return {...resume,updated:Date.now()};
}
export function copyResume(resume: Resume, title = resume.title): Resume {
  const nextTitle = title.trim().slice(0, 120) || resume.title.trim().slice(0, 120) || "Copy";
  return touchResume({...resume,id:crypto.randomUUID(),title:nextTitle});
}
