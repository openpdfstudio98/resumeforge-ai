import { galleryOrder } from "../lib/template-gallery";
import { execFileSync } from "node:child_process";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { allPaths } from "../lib/seo";
import { backup, sampleResume, templateKeys, templates } from "../lib/resume";

test("all localized pages and rendered internal navigation respond",async({page,request})=>{
  const links=new Set<string>();
  for(const locale of ["en","ms"]) {
    for(const path of allPaths) {
      const response=await page.goto(`/${locale}${path?"/"+path:""}`,{waitUntil:"domcontentloaded"});
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang",locale);
      await expect(page.locator("main")).toBeVisible();
      for(const href of await page.locator('a[href^="/"]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute("href")!))) links.add(href);
    }
  }
  for(const link of links) expect((await request.get(link)).ok(),link).toBeTruthy();
  expect((await request.get("/robots.txt")).ok()).toBeTruthy();
  expect((await request.get("/sitemap.xml")).ok()).toBeTruthy();
  expect((await request.get("/en/no-such-page")).status()).toBe(404);
});

test("editor covers all fields, reorder, live preview, autosave and interface language",async({page})=>{
  await page.goto("/en/builder");
  await page.getByRole("button",{name:"New resume"}).click();
  await expect(page.getByRole("button",{name:"Download PDF"})).toBeDisabled();
  const personal={"Resume title":"QA draft","Full name":"Nur QA","Professional title":"Engineer","Email":"nur@example.com","Phone":"+60 12 345 6789","City / region":"Shah Alam","Website or LinkedIn URL":"https://example.com"};
  for(const [name,value] of Object.entries(personal))await page.getByLabel(name,{exact:true}).fill(value);
  for(const [section,label] of [["Professional Summary","Professional summary"],["Skills","Skills (separate with commas or new lines)"]]) {
    await page.getByRole("button",{name:section,exact:true}).click();
    await page.getByLabel(label,{exact:true}).fill("Excel, industrial planning");
  }
  const groups=[
    ["Work Experience","Role title","Employer"],["Education","Qualification","Institution"],["Certifications","Certification","Issuer"],["Projects","Project name","Organization"],["Languages","Language","Proficiency"],["Additional Information","Section heading","Organization"],
  ];
  for(const [section,title,organization] of groups) {
    await page.getByRole("button",{name:section,exact:true}).click();
    await page.getByRole("button",{name:section==="Additional Information"?"Add custom section":"Add entry",exact:true}).click();
    const entry=page.getByRole("group",{name:"Entry 1"});
    await entry.getByLabel(title,{exact:true}).fill(`QA ${title}`);
    await entry.getByLabel(organization,{exact:true}).fill(`QA ${organization}`);
    await entry.getByLabel("Dates",{exact:true}).fill("2023 – 2026");
    await entry.getByLabel("Description",{exact:true}).fill("Mengurus data inventori dan menyediakan laporan mingguan.");
  }
  await page.getByRole("button",{name:"Move up · Education",exact:true}).click();
  await expect(page.locator(".section-toggle").nth(1)).toHaveText("Education");
  const dragHandle=page.locator(".editor-section").filter({has:page.getByRole("button",{name:"Skills",exact:true})}).locator(".drag-handle");
  const dropTarget=page.locator(".editor-section").first();
  await dragHandle.hover({position:{x:8,y:8}});
  await page.mouse.down();
  await dragHandle.hover({position:{x:16,y:16}});
  await dropTarget.hover({position:{x:24,y:16}});
  await dropTarget.hover({position:{x:28,y:19}});
  await page.mouse.up();
  await expect(page.locator(".section-toggle").first()).toHaveText("Skills");
  await page.getByRole("button",{name:"Design",exact:true}).click();
  await page.getByRole("combobox",{name:"Template",exact:true}).selectOption("modern-executive");
  await page.getByRole("combobox",{name:"Font",exact:true}).selectOption("serif");
  await page.getByRole("combobox",{name:"Text size",exact:true}).selectOption("11");
  await page.getByRole("textbox",{name:"Accent color",exact:true}).fill("#29566c");
  await page.getByRole("combobox",{name:"Document headings",exact:true}).selectOption("ms");
  await expect(page.locator(".paper-stack")).toContainText("Pengalaman Kerja");
  await expect(page.locator(".paper-stack")).toContainText("QA Section heading");
  await page.getByRole("button",{name:/^Language /}).click();
  await page.getByRole("link",{name:"Bahasa Melayu",exact:true}).click();
  await expect(page).toHaveURL(/\/ms\/builder\?id=/);
  await expect(page.getByLabel("Nama penuh",{exact:true})).toHaveValue("Nur QA");
  await page.reload();
  await expect(page.getByLabel("Nama penuh",{exact:true})).toHaveValue("Nur QA");
  await expect(page.locator(".section-toggle").first()).toHaveText("Kemahiran");
  await page.getByRole("link",{name:"Semak resume ini"}).click();
  await expect(page.getByRole("combobox",{name:"Sumber resume"})).not.toHaveValue("");
  await page.getByLabel("Huraian kerja (pilihan)").fill("Excel forklift forklift");
  await page.getByRole("button",{name:"Semak resume",exact:true}).click();
  await expect(page.getByText("forklift",{exact:true})).toBeVisible();
  await expect(page.getByText("excel",{exact:true})).toBeVisible();
});

test("browser exports real multi-page files and keeps resume content local",async({page},info)=>{
  const outbound:string[]=[];
  const token="SYNTHETIC-PRIVATE-782";
  page.on("request",request=>{
    if(!request.url().startsWith(info.project.use.baseURL??"") || request.url().includes(token) || request.postData()?.includes(token)) outbound.push(request.url());
  });
  await page.goto("/ms/resumes");
  const r=sampleResume("ms","technical-engineer");
  r.personal.name="Chloé Nur";
  r.sections.experience[0].description=Array.from({length:100},(_,i)=>`Baris ${i+1} ${token} – kerja mingguan.`).join("\n");
  await page.locator('input[type=file]').setInputFiles({name:"resume.json",mimeType:"application/json",buffer:Buffer.from(backup([r]))});
  await page.getByRole("link",{name:"Edit resume",exact:true}).click();
  await expect(page.locator(".paper").nth(1)).toBeVisible();
  const results:Record<string,string>={};
  for(const format of ["PDF","DOCX"]) {
    const wait=page.waitForEvent("download");
    await page.getByRole("button",{name:`Muat turun ${format}`}).click();
    const result=await wait;
    expect(result.suggestedFilename().replace("_"," ")).toBe(`Chloé Nur.${format.toLowerCase()}`);
    const file=info.outputPath(`resume.${format.toLowerCase()}`);
    await result.saveAs(file);
    results[format]=file;
  }
  const pdf=execFileSync("pdftotext",[results.PDF,"-"],{encoding:"utf8"});
  expect(pdf).toContain("Chloé Nur");
  expect(pdf).toContain(`Baris 100 ${token} – kerja mingguan.`);
  expect(execFileSync("unzip",["-p",results.DOCX,"word/document.xml"],{encoding:"utf8"})).toContain(`Baris 100 ${token} – kerja mingguan.`);
  expect(await page.context().cookies()).toEqual([]);
  expect(outbound).toEqual([]);
});

test("draft duplicate, backup, invalid import, restore, deletion and clear",async({page})=>{
  await page.goto("/en/resumes");
  const input=page.locator('input[type=file]');
  await input.setInputFiles({name:"bad.json",mimeType:"application/json",buffer:Buffer.from("{}")});
  await expect(page.getByRole("status").filter({hasText:"valid Civora"})).toBeVisible();
  const resume=sampleResume("en","classic-ats");
  await input.setInputFiles({name:"good.json",mimeType:"application/json",buffer:Buffer.from(backup([resume]))});
  await expect(page.locator(".draft")).toHaveCount(1);
  await page.getByRole("button",{name:/^Duplicate ·/}).click();
  await expect(page.locator(".draft")).toHaveCount(2);
  await page.getByRole("button",{name:"Restore previous save"}).click();
  await page.getByRole("button",{name:"Confirm",exact:true}).click();
  await expect(page.locator(".draft")).toHaveCount(1);
  const waiting=page.waitForEvent("download");
  await page.getByRole("button",{name:"Back up all resumes"}).click();
  expect((await waiting).suggestedFilename()).toBe("Civora-backup.json");
  await page.getByRole("button",{name:/^Delete ·/}).click();
  await page.getByRole("button",{name:"Confirm",exact:true}).click();
  await expect(page.locator(".draft")).toHaveCount(0);
  await input.setInputFiles({name:"good.json",mimeType:"application/json",buffer:Buffer.from(backup([resume]))});
  await page.getByRole("button",{name:"Delete all local data"}).click();
  await page.getByRole("button",{name:"Confirm",exact:true}).click();
  expect(await page.evaluate(()=>Object.keys(localStorage).filter(key=>key.startsWith("resumeforge:")))).toEqual([]);
});

test("all templates start successfully and layouts fit phone portrait and landscape",async({page})=>{
  for(const template of templateKeys) {
    await page.goto(`/en/templates/${template}`);
    await page.getByRole("link",{name:"Use this template"}).click();
    await page.getByRole("button",{name:"New resume",exact:true}).click();
    await page.getByRole("button",{name:"Design",exact:true}).click();
    await expect(page.getByRole("combobox",{name:"Template",exact:true})).toHaveValue(template);
    await expect(page.getByRole("combobox",{name:"Font",exact:true})).toHaveValue(templates[template].font);
  }
  for(const viewport of [{width:390,height:844},{width:844,height:390}]) {
    await page.setViewportSize(viewport);
    for(const path of ["/en","/ms/templates","/ms/ats","/en/builder"]) {
      await page.goto(path);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth),page.url()).toBeLessThanOrEqual(viewport.width);
    }
    await page.getByRole("button",{name:"New resume",exact:true}).click();
    if(viewport.width<=800)await page.getByRole("button",{name:"Live preview",exact:true}).click();
    await expect(page.locator(".document-sheet")).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth),page.url()).toBeLessThanOrEqual(viewport.width);
  }
});

test("keyboard and axe checks on landing, editor and ATS states",async({page})=>{
  await page.goto("/en");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link",{name:"Skip to content"})).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#content$/);
  const violations=async()=> (await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze()).violations.map(({id,nodes})=>({id,targets:nodes.map(n=>n.target)}));
  expect(await violations()).toEqual([]);
  await page.goto("/en/builder");
  await page.getByRole("button",{name:"New resume",exact:true}).click();
  await expect(page.locator(".document-sheet")).toBeVisible();
  expect(await violations()).toEqual([]);
  await page.goto("/ms/ats");
  await page.getByRole("button",{name:"Semak resume",exact:true}).click();
  await expect(page.getByRole("alert").filter({hasText:"Masukkan teks resume"})).toBeVisible();
  expect(await violations()).toEqual([]);
});

test("optional resume photo stays local and appears in both downloads",async({page},info)=>{
  await page.goto("/en/builder?template=modern-portrait");
  await page.getByRole("button",{name:"New resume"}).click();
  await page.getByLabel("Full name",{exact:true}).fill("Photo QA");
  const photo=page.locator('input[type=file][accept*="image/jpeg"]');
  await photo.setInputFiles({name:"invalid.png",mimeType:"image/png",buffer:Buffer.from("not an image")});
  await expect(page.getByText(/Couldn’t open that photo/)).toBeVisible();
  const png=await page.evaluate(()=>{
    const canvas=document.createElement("canvas");
    canvas.width=160;
    canvas.height=120;
    const context=canvas.getContext("2d")!;
    context.fillStyle="#7343ce";
    context.fillRect(0,0,160,120);
    return canvas.toDataURL().split(",")[1];
  });
  await photo.setInputFiles({name:"photo.png",mimeType:"image/png",buffer:Buffer.from(png,"base64")});
  await expect(page.locator(".document-sheet image")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".document-sheet image")).toHaveCount(1);
  for (const format of ["PDF","DOCX"]) {
    const wait=page.waitForEvent("download");
    await page.getByRole("button",{name:`Download ${format}`}).click();
    const file=info.outputPath(`photo.${format.toLowerCase()}`);
    await (await wait).saveAs(file);
    if(format==="PDF") {
      expect(execFileSync("pdfimages",["-list",file],{encoding:"utf8"})).toMatch(/image\s+120\s+120/);
      expect(execFileSync("pdftotext",[file,"-"],{encoding:"utf8"})).toContain("Photo QA");
    } else {
      expect(execFileSync("unzip",["-Z1",file],{encoding:"utf8"})).toMatch(/word\/media\/.*\.jpg/);
      expect(execFileSync("unzip",["-p",file,"word/document.xml"],{encoding:"utf8"})).toContain("<w:tbl>");
    }
  }
  await page.getByRole("button",{name:"Remove photo"}).click();
  await page.reload();
  await expect(page.getByRole("button",{name:"Add photo"})).toBeVisible();
  await expect(page.locator(".document-sheet image")).toHaveCount(0);
});

test("language picker translates UI with the device API and keeps the resume unchanged",async({page})=>{
  await page.addInitScript(()=>{
    Object.defineProperty(window,"Translator",{configurable:true,value:{
      async create({targetLanguage}:{targetLanguage:string}) {
        return {async translate(text:string){return `${targetLanguage} · ${text}`;},destroy(){}};
      },
    }});
  });
  await page.goto("/en/builder");
  await page.getByRole("button",{name:"New resume"}).click();
  await page.getByLabel("Full name",{exact:true}).fill("Private Name");
  await page.getByRole("button",{name:/^Language /}).click();
  await page.getByLabel("Search languages").fill("Français");
  await page.getByRole("combobox",{name:"Choose a language"}).selectOption("fr");
  await page.getByRole("button",{name:"Translate interface"}).click();
  await expect(page.locator("html")).toHaveAttribute("lang","fr");
  await expect(page.getByRole("button",{name:"fr · Download PDF"})).toBeVisible();
  await expect(page.getByLabel("fr · Full name",{exact:true})).toHaveValue("Private Name");
  await expect(page.locator(".document-sheet")).toContainText("Private Name");
  await page.reload();
  await expect(page.getByRole("button",{name:"fr · Download PDF"})).toBeVisible();
  await page.getByRole("button",{name:/^Language /}).click();
  await page.getByRole("link",{name:"English",exact:true}).click();
  await expect(page.locator("html")).toHaveAttribute("lang","en");
  await expect(page.getByLabel("Full name",{exact:true})).toHaveValue("Private Name");
});


test("bundled Spanish works when browser translation is unavailable",async({page})=>{
  await page.addInitScript(()=>Object.defineProperty(window,"Translator",{configurable:true,value:undefined}));
  await page.goto("/en");
  await page.getByRole("button",{name:/^Language /}).click();
  await page.getByRole("combobox",{name:"Choose a language"}).selectOption("es");
  await page.getByRole("button",{name:"Translate interface"}).click();
  await expect(page.locator("html")).toHaveAttribute("lang","es");
  await page.getByRole("link",{name:"Crear mi currículum"}).click();
  await page.getByRole("button",{name:"Nuevo currículum"}).click();
  await expect(page.getByLabel("Nombre completo",{exact:true})).toBeVisible();
  await expect(page.getByRole("button",{name:"Descargar PDF",exact:true})).toBeDisabled();
});


test("one click opens an editable portrait sample and switching themes keeps the draft",async({page})=>{
  await page.goto("/en");
  await page.getByRole("link",{name:"Try this sample",exact:true}).click();
  await expect(page.getByLabel("Full name",{exact:true})).toHaveValue("Alyssa Tan");
  await expect(page.locator(".document-sheet image")).toHaveCount(1);
  await page.getByLabel("Full name",{exact:true}).fill("Edited portrait");
  await page.getByRole("button",{name:"Design",exact:true}).click();
  await expect(page.getByRole("combobox",{name:"Template",exact:true})).toHaveValue("modern-portrait");
  await page.getByRole("combobox",{name:"Template",exact:true}).selectOption("engineering-blue");
  await page.reload();
  await expect(page.getByLabel("Full name",{exact:true})).toHaveValue("Edited portrait");
  await expect(page.locator(".section-toggle").nth(1)).toHaveText("Work Experience");
  await expect(page.locator(".document-sheet image")).toHaveCount(1);
  await page.goto("/en/templates/engineering-blue");
  await page.getByRole("link",{name:"Try this sample",exact:true}).click();
  await expect(page.getByLabel("Full name",{exact:true})).toHaveValue("Daniel Lim");
  await expect(page.locator(".section-toggle").nth(2)).toHaveText("Certifications");
});


test("gallery shows completed samples and filters to matching themes",async({page},info)=>{
  await page.goto("/en/templates");
  const cards=page.locator(".template-card");
  await expect(cards).toHaveCount(templateKeys.length);
  for (const [index,template] of galleryOrder.entries()) {
    await expect(cards.nth(index).locator(".document-sheet text").first()).toHaveText(sampleResume("en",template).personal.name);
  }
  await page.getByRole("button",{name:"Studio collection",exact:true}).click();
  await expect(cards).toHaveCount(4);
  await expect(cards.locator("svg image")).toHaveCount(3);
  await page.getByRole("button",{name:"Premium collection",exact:true}).click();
  await expect(cards).toHaveCount(6);
  await expect(cards.locator("svg image")).toHaveCount(5);
  await page.getByRole("button",{name:"Technical",exact:true}).click();
  await expect(cards).toHaveCount(2);
  await page.getByRole("button",{name:"With photo",exact:true}).click();
  await expect(cards).toHaveCount(9);
  await expect(cards.locator("svg image")).toHaveCount(9);
  await page.getByRole("button",{name:"All styles",exact:true}).click();
  await page.getByRole("link",{name:"Try this sample · Classic ATS",exact:true}).click();
  await expect(page.getByLabel("Full name",{exact:true})).toHaveValue("Alyssa Tan");
  await page.goto("/en/templates/bloom-studio");
  await page.getByRole("link",{name:"Try this sample",exact:true}).click();
  const portrait=page.locator(".document-sheet image[clip-path]");
  await expect(portrait).toHaveCount(1);
  expect(Number(await portrait.getAttribute("x"))).toBeGreaterThan(400);
  for (const format of ["PDF","DOCX"]) {
    const wait=page.waitForEvent("download");
    await page.getByRole("button",{name:`Download ${format}`}).click();
    const file=info.outputPath(`bloom-studio.${format.toLowerCase()}`);
    await (await wait).saveAs(file);
    if(format==="PDF") {
      expect(execFileSync("pdfimages",["-list",file],{encoding:"utf8"})).toMatch(/image\s+\d+\s+\d+/);
      expect(execFileSync("pdftotext",[file,"-"],{encoding:"utf8"})).toContain("Maya Lee");
    } else {
      const xml=execFileSync("unzip",["-p",file,"word/document.xml"],{encoding:"utf8"});
      expect(xml).toContain('w:fill="F7DCE4"');
      expect(xml).toContain("<w:drawing>");
    }
  }
});
