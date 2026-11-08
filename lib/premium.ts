import type { Block } from "./blocks";
import type { Template } from "./resume";

type PremiumStyle = {
  sidebar:string;
  sideInk:string;
  masthead:"none"|"filled"|"rule";
  timeline:boolean;
  rightSidebar?:boolean;
  framed?:boolean;
  mastheadFill?:string;
  trim?:string;
  ornaments?:"citrus"|"violet";
  photo:boolean;
};

const styles:Partial<Record<Template,PremiumStyle>>={
  "citrus-studio":{sidebar:"#126B95",sideInk:"#FFFFFF",masthead:"none",timeline:false,ornaments:"citrus",photo:true},
  "midnight-executive":{sidebar:"#253550",sideInk:"#FFFFFF",masthead:"none",timeline:true,photo:true},
  "silver-editorial":{sidebar:"#EEF1F5",sideInk:"#243247",masthead:"none",timeline:true,photo:true},
  "graphite-portfolio":{sidebar:"#363541",sideInk:"#FFFFFF",masthead:"none",timeline:false,photo:true},
  "mono-grid":{sidebar:"#FFFFFF",sideInk:"#252831",masthead:"rule",timeline:false,photo:false},
  "teal-timeline":{sidebar:"#263744",sideInk:"#FFFFFF",masthead:"filled",timeline:true,photo:true},
  "bloom-studio":{sidebar:"#FBE9ED",sideInk:"#5C2737",masthead:"filled",mastheadFill:"#F7DCE4",rightSidebar:true,trim:"#BD667D",timeline:false,photo:true},
  "violet-atelier":{sidebar:"#F0EAFB",sideInk:"#392758",masthead:"filled",framed:true,trim:"#8F68C7",ornaments:"violet",timeline:false,photo:true},
  "ivory-editorial":{sidebar:"#F7F2E8",sideInk:"#544431",masthead:"rule",mastheadFill:"#FBF7EF",rightSidebar:true,framed:true,trim:"#9C825E",timeline:true,photo:false},
  "onyx-gold":{sidebar:"#25252B",sideInk:"#F6EDDD",masthead:"none",trim:"#B38A4C",timeline:true,photo:true},
  "aurora-minimal":{sidebar:"#EAF4F8",sideInk:"#244055",masthead:"rule",timeline:false,photo:false},
  "executive-ledger":{sidebar:"#1F3864",sideInk:"#FFFFFF",masthead:"filled",mastheadFill:"#1F3864",timeline:true,photo:true},
  "editorial-mono":{sidebar:"#F2F2F2",sideInk:"#222222",masthead:"rule",timeline:false,photo:false},
  "canva-bloom":{sidebar:"#FBE9ED",sideInk:"#5C2737",masthead:"filled",mastheadFill:"#F7DCE4",rightSidebar:true,trim:"#D94F70",timeline:false,photo:true},
  "neon-grid":{sidebar:"#0F172A",sideInk:"#E2E8F0",masthead:"filled",mastheadFill:"#0E7490",timeline:true,photo:true},
  "paper-loom":{sidebar:"#F5EFE6",sideInk:"#5C4A33",masthead:"rule",trim:"#9C825E",timeline:true,photo:false},
  "obsidian-ink":{sidebar:"#111827",sideInk:"#F6EDDD",masthead:"none",trim:"#B38A4C",timeline:true,photo:true},
  "sage-column":{sidebar:"#E8F0E9",sideInk:"#2F4A32",masthead:"none",timeline:false,photo:true},
  "cobalt-slate":{sidebar:"#1E3A8A",sideInk:"#FFFFFF",masthead:"filled",mastheadFill:"#1E40AF",timeline:true,photo:true},
  "rose-atelier":{sidebar:"#FCE7F3",sideInk:"#831843",masthead:"filled",mastheadFill:"#FBCFE8",rightSidebar:true,trim:"#9F1239",timeline:false,photo:true},
};

export function premiumStyle(template:Template) {
  return styles[template];
}

export function isSidebarBlock(block:Block) {
  return block.role==="contact" || block.section==="education" || block.section==="skills" ||
    block.section==="certifications" || block.section==="languages";
}

export function isTitleBlock(block:Block) {
  return block.role==="name"||block.role==="headline";
}

export function premiumText(block:Block) {
  if(isTitleBlock(block))return block.text.replace(/\s+/g," ").trim();
  return block.role==="contact"?block.text.split("  |  ").join("\n"):block.text;
}

export function sampleHasPhoto(template:Template) {
  return template==="modern-portrait"||Boolean(premiumStyle(template)?.photo);
}
