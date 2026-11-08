export function Field({label,value,change,multi=false,type="text",limit=250,placeholder}:{
  label:string;value:string;change:(text:string)=>void;multi?:boolean;type?:string;limit?:number;placeholder?:string;
}) {
  return <label className="field"><span>{label}</span>{multi
    ? <textarea translate="no" rows={4} value={value} maxLength={limit} placeholder={placeholder} onChange={e=>change(e.target.value)}/>
    : <input translate="no" type={type} value={value} maxLength={limit} placeholder={placeholder} onChange={e=>change(e.target.value)}/>}</label>;
}
