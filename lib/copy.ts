import type { Locale } from "./resume";

export const site = {
  en: {
    nav:{dashboard:"Dashboard",builder:"Resume Builder",templates:"Templates",ats:"ATS Checker",resumes:"My Resumes",help:"Help Center",about:"About",contact:"Contact",privacy:"Privacy Policy",terms:"Terms of Use",career:"Career Guides"},
    title:"Free Resume Builder & ATS Checker",
    description:"Build a professional A4 resume for free. Pick a template, check your resume against a job description, and download a searchable PDF or editable Word file.",
    eyebrow:"FREE RESUME WORKSPACE",
    hero:"Build a resume that",
    accent:"gets to the point.",
    start:"Build my resume", browse:"Explore templates", local:"Private by design", noAccount:"No account required", free:"Free PDF & Word export",
    toolkit:"Everything you need to apply", toolkitCopy:"Write, refine and export your resume in one workspace.", gallery:"Find your starting point",
    copy:{builder:"Write and format your resume with a live A4 preview.",ats:"Check essential sections and compare keywords with a job description.",resumes:"Manage drafts and save JSON backups on your device.",templates:"Choose a professional A4 layout."},
    workspace:"WORKSPACE", resources:"RESOURCES", menu:"Menu", skip:"Skip to content",
  },
  ms: {
    nav:{dashboard:"Papan Pemuka",builder:"Pembina Resume",templates:"Templat",ats:"Semakan ATS",resumes:"Resume Saya",help:"Pusat Bantuan",about:"Tentang Kami",contact:"Hubungi",privacy:"Dasar Privasi",terms:"Terma Penggunaan",career:"Panduan Kerjaya"},
    title:"Pembina Resume Percuma & Semakan ATS",
    description:"Bina resume A4 profesional secara percuma. Pilih templat, semak resume berdasarkan huraian kerja dan muat turun PDF atau fail Word yang boleh diedit.",
    eyebrow:"RUANG KERJA RESUME PERCUMA",
    hero:"Bina resume yang",
    accent:"terus kepada isi.",
    start:"Bina resume saya", browse:"Terokai templat", local:"Utamakan privasi", noAccount:"Tanpa akaun", free:"Eksport PDF & Word percuma",
    toolkit:"Sedia untuk memohon kerja", toolkitCopy:"Tulis, kemas kini dan eksport resume dalam satu ruang kerja.", gallery:"Pilih templat untuk bermula",
    copy:{builder:"Tulis dan format resume dengan pratonton A4 masa nyata.",ats:"Semak bahagian penting dan bandingkan kata kunci dengan huraian kerja.",resumes:"Urus draf dan simpan sandaran JSON pada peranti anda.",templates:"Pilih susun atur A4 profesional."},
    workspace:"RUANG KERJA", resources:"SUMBER", menu:"Menu", skip:"Langkau ke kandungan",
  },
} satisfies Record<Locale,unknown>;
export type NavKey = keyof typeof site.en.nav;
export const workRoutes = ["dashboard","builder","ats","resumes"] as const;
export type WorkRoute = typeof workRoutes[number];
export const publicRoutes = ["templates","help","about","contact","privacy","terms","career"] as const;
export const guideKeys = ["write-a-resume","malaysia-resume-guide","ats-keywords"] as const;
