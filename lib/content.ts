import type { Locale } from "./resume";
import { guideKeys } from "./copy";

type Article = {title:string; intro:string; sections:[string,string][]};
type GuideKey = typeof guideKeys[number];
type ContentKey = "help"|"about"|"contact"|"privacy"|"terms";
export const articles:Record<Locale,Record<ContentKey|GuideKey,Article>> = {
  en:{
    help:{title:"Help Center",intro:"Answers for building, saving and sharing your resume.",sections:[
      ["How do I start?","Open the builder, create a new resume and fill in your personal information. Expand each section as needed. Blank sections are omitted from the document."],
      ["How do I reorder sections?","Drag a section by its grip or use its Move up and Move down buttons. These buttons work with a keyboard and on touchscreens."],
      ["What files can I import?","My Resumes imports ResumeForge V1 JSON backups. For the ATS checker, copy text from an existing PDF or Word resume and paste it in. Keep a JSON backup if you switch browsers or devices."],
      ["Which file should I download?","PDF preserves the A4 layout and selectable text. DOCX opens for editing in Word or a compatible editor and pagination can vary with the fonts available there. Use the format the employer requests."],
      ["Where is my resume saved?","Drafts are saved in this browser. In My Resumes, you can download backups, restore the previous save if available, or delete drafts and recovery data. Browser privacy settings or clearing site data can remove drafts."],
      ["How does the ATS score work?","The checker awards points for contact details, headings, experience, education and skills, readability, and optional job keywords. It normalizes the score across applicable checks. Individual recruiting systems can behave differently."],
    ]},
    about:{title:"About ResumeForge AI",intro:"A free resume workspace for job seekers in Malaysia and around the world.",sections:[
      ["Built for the application process","Choose a layout, write your resume and download it in the format the employer requests. Use the checker to identify missing details and relevant job terms."],
      ["You control your content","ResumeForge V1 uses rules to provide feedback. It does not generate qualifications or submit applications. Your work stays in your browser until you choose to download or share it."],
    ]},
    contact:{title:"Contact",intro:"Send feedback or report a problem to the project maintainer.",sections:[
      ["For technical feedback","Include your browser, device, interface language and the steps that reproduced the issue. Use sample text instead of personal resume information."],
    ]},
    privacy:{title:"Privacy Policy",intro:"ResumeForge stores resume data locally in V1.",sections:[
      ["Resume data","Drafts and one previous save are stored in your browser’s local storage. The editor, job-description checker and export tools process data on your device. The checker does not save pasted text or job descriptions."],
      ["Cookies and hosting","This release does not set analytics or advertising cookies and does not load ads. The hosting provider may process routine connection information when it serves the site. Drafts and job descriptions are never included in page URLs or network requests."],
      ["Your controls","Use My Resumes to download or delete your drafts. Deleting a draft also clears the previous saved copy. Delete all local data clears the workspace and recovery data. Your browser’s site-data controls can also clear local storage."],
      ["Downloaded files","Files saved to your device or shared with other services are controlled separately. Deleting a draft inside ResumeForge does not remove those files."],
    ]},
    terms:{title:"Terms of Use",intro:"ResumeForge is a free tool for preparing resumes and reviewing their content.",sections:[
      ["Your documents","You are responsible for the accuracy and content of your resume and for backing up files you want to keep. Follow each employer’s instructions for format and required information."],
      ["Feedback and availability","ATS feedback is heuristic and does not guarantee parsing, ranking or a hiring outcome. Features may change as the site is maintained."],
    ]},
    "write-a-resume":{title:"How to write a clear resume",intro:"Start with the role you want and select evidence that shows you can do the work.",sections:[
      ["Start with the essentials","Use your name, professional email, phone and city or region. Add a portfolio or LinkedIn link if it helps the recruiter evaluate the work."],
      ["Write specific experience bullets","Describe what you did, how you did it and the result. Include scope, frequency or measurable outcomes only when you can verify them."],
      ["Check the final file","Open the exported PDF, select a few lines and check page breaks. Use a recognizable filename and submit the format requested in the vacancy."],
    ]},
    "malaysia-resume-guide":{title:"Writing a resume for jobs in Malaysia",intro:"Match the application language and make it easy for recruiters to reach you.",sections:[
      ["Match the vacancy","Use English or Bahasa Melayu according to the listing. Retain the official names of your qualifications and use the same date format throughout."],
      ["Choose what to disclose","A city or region and a phone number with +60 are often enough for contact. Include sensitive identifiers or a photo only when the employer explicitly requests them and you are comfortable sharing them."],
      ["Include relevant training","List job-relevant certificates, courses and languages. For a first role, consider putting education and internships before other experience."],
    ]},
    "ats-keywords":{title:"Using ATS keywords honestly",intro:"Make the connection between a vacancy and the experience you already have.",sections:[
      ["Identify role-specific terms","Look for required skills, tools, methods and credentials in the job description. Terms repeated in the role requirements can help you choose what to emphasize."],
      ["Put the words in context","Use an accurate term in a skill list or describe how you used it in an experience bullet. Include the full term and abbreviation where helpful."],
      ["Keep it easy to read","Use standard headings, ordinary text and clear dates. Review the score breakdown and prioritize changes that also make sense to a person reading the resume."],
    ]},
  },
  ms:{
    help:{title:"Pusat Bantuan",intro:"Jawapan untuk membina, menyimpan dan berkongsi resume.",sections:[
      ["Bagaimana hendak bermula?","Buka pembina, cipta resume baharu dan isi maklumat peribadi. Buka bahagian yang anda perlukan. Bahagian kosong tidak dimasukkan ke dalam dokumen."],
      ["Bagaimana hendak menyusun bahagian?","Seret bahagian menggunakan pemegang atau gunakan butang Alih ke atas dan Alih ke bawah. Butang ini boleh digunakan dengan papan kekunci dan skrin sentuh."],
      ["Fail apakah yang boleh diimport?","Resume Saya menerima sandaran JSON ResumeForge V1. Untuk semakan ATS, salin teks daripada PDF atau Word dan tampalkannya. Simpan sandaran JSON jika anda bertukar pelayar atau peranti."],
      ["Fail manakah patut saya muat turun?","PDF mengekalkan susun atur A4 dan teks yang boleh dipilih. DOCX boleh diedit dalam Word atau aplikasi serasi. Pembahagian halaman bergantung pada fon yang tersedia. Ikut format yang diminta majikan."],
      ["Di manakah resume saya disimpan?","Draf disimpan dalam pelayar ini. Di Resume Saya, anda boleh memuat turun sandaran, memulihkan versi terdahulu jika tersedia, atau memadam data. Tetapan privasi pelayar atau pemadaman data laman boleh membuang draf."],
      ["Bagaimana skor ATS dikira?","Semakan memberi mata untuk maklumat hubungan, tajuk bahagian, pengalaman, pendidikan dan kemahiran, kebolehbacaan serta kata kunci pilihan. Skor dinormalkan mengikut kategori yang dinilai. Sistem pengambilan pekerja mungkin berfungsi secara berbeza."],
    ]},
    about:{title:"Tentang ResumeForge AI",intro:"Ruang kerja resume percuma untuk pencari kerja di Malaysia dan di seluruh dunia.",sections:[
      ["Dibina untuk permohonan kerja","Pilih susun atur, tulis resume dan muat turun dalam format yang diminta majikan. Semakan membantu mengenal pasti maklumat yang kurang dan istilah yang relevan."],
      ["Anda mengawal kandungan","ResumeForge V1 menggunakan peraturan untuk memberi maklum balas. Ia tidak menjana kelayakan atau menghantar permohonan. Kerja anda kekal dalam pelayar sehingga anda memuat turun atau berkongsinya."],
    ]},
    contact:{title:"Hubungi",intro:"Berikan maklum balas atau laporkan masalah kepada penyelenggara projek.",sections:[
      ["Untuk maklum balas teknikal","Sertakan pelayar, peranti, bahasa antara muka dan langkah untuk mengulangi masalah. Gunakan teks contoh sebagai ganti maklumat peribadi resume."],
    ]},
    privacy:{title:"Dasar Privasi",intro:"ResumeForge menyimpan data resume secara setempat dalam V1.",sections:[
      ["Data resume","Draf dan satu versi terdahulu disimpan dalam storan setempat pelayar. Editor, semakan huraian kerja dan eksport memproses data pada peranti anda. Teks yang ditampal dan huraian kerja tidak disimpan oleh alat semakan."],
      ["Kuki dan pengehosan","Keluaran ini tidak menetapkan kuki analitik atau pengiklanan dan tidak memuatkan iklan. Penyedia pengehosan mungkin memproses maklumat sambungan biasa semasa memaparkan laman. Draf dan huraian kerja tidak dihantar melalui URL atau permintaan rangkaian."],
      ["Kawalan anda","Gunakan Resume Saya untuk memuat turun atau memadam draf. Pemadaman draf turut memadam versi terdahulu. Pilihan Padam semua data setempat membersihkan ruang kerja dan data pemulihan. Anda juga boleh memadam storan melalui tetapan pelayar."],
      ["Fail dimuat turun","Fail pada peranti atau yang dikongsi dengan perkhidmatan lain dikawal secara berasingan. Memadam draf di ResumeForge tidak memadam fail tersebut."],
    ]},
    terms:{title:"Terma Penggunaan",intro:"ResumeForge ialah alat percuma untuk menyediakan resume dan menyemak kandungannya.",sections:[
      ["Dokumen anda","Anda bertanggungjawab terhadap ketepatan kandungan resume dan penyimpanan sandaran. Ikut arahan majikan berkenaan format dan maklumat yang diperlukan."],
      ["Maklum balas dan ketersediaan","Maklum balas ATS ialah penilaian heuristik dan tidak menjamin pembacaan, kedudukan atau keputusan pengambilan pekerja. Fungsi laman boleh berubah semasa penyelenggaraan."],
    ]},
    "write-a-resume":{title:"Cara menulis resume yang jelas",intro:"Mulakan dengan jawatan sasaran dan pilih bukti yang menunjukkan kebolehan anda.",sections:[
      ["Mulakan dengan maklumat asas","Gunakan nama, e-mel profesional, nombor telefon dan bandar atau negeri. Tambah pautan portfolio atau LinkedIn jika membantu penilaian kerja anda."],
      ["Tulis pengalaman yang khusus","Nyatakan perkara yang anda lakukan, cara melakukannya dan hasilnya. Masukkan skop, kekerapan atau ukuran hasil hanya jika maklumat itu boleh disahkan."],
      ["Semak fail akhir","Buka PDF yang dieksport, pilih beberapa baris teks dan semak pemisah halaman. Gunakan nama fail yang jelas dan ikut format yang diminta dalam iklan kerja."],
    ]},
    "malaysia-resume-guide":{title:"Menulis resume untuk pekerjaan di Malaysia",intro:"Padankan bahasa permohonan dan mudahkan pihak pengambilan pekerja menghubungi anda.",sections:[
      ["Ikut bahasa iklan kerja","Gunakan bahasa Inggeris atau Bahasa Melayu mengikut iklan. Kekalkan nama rasmi kelayakan dan format tarikh yang seragam."],
      ["Pilih maklumat yang perlu dikongsi","Bandar atau negeri dan nombor telefon dengan +60 selalunya memadai. Sertakan nombor pengenalan atau foto hanya jika majikan memintanya secara jelas dan anda selesa berkongsi."],
      ["Senaraikan latihan yang berkaitan","Senaraikan sijil, kursus dan bahasa yang berkaitan. Untuk jawatan pertama, pertimbangkan meletakkan pendidikan dan latihan industri sebelum pengalaman lain."],
    ]},
    "ats-keywords":{title:"Gunakan kata kunci ATS secara tepat",intro:"Terangkan kaitan antara kekosongan jawatan dengan pengalaman sebenar anda.",sections:[
      ["Kenal pasti istilah khusus jawatan","Cari kemahiran, alat, kaedah dan kelayakan yang diminta. Istilah yang berulang dalam syarat jawatan boleh membantu menentukan perkara yang wajar diketengahkan."],
      ["Gunakan dalam konteks sebenar","Masukkan istilah yang tepat dalam senarai kemahiran atau terangkan penggunaannya dalam pengalaman. Gunakan nama penuh dan singkatan jika membantu."],
      ["Pastikan mudah dibaca","Gunakan tajuk lazim, teks biasa dan tarikh yang jelas. Semak pecahan skor dan utamakan perubahan yang membantu orang yang membaca resume."],
    ]},
  },
};
