import { spawn } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const args = process.argv.slice(2)
  .filter(arg => arg !== "--strictPort")
  .map(arg => arg === "--host" ? "--hostname" : arg);
const next = spawn(process.execPath,[require.resolve("next/dist/bin/next"),"dev",...args],{stdio:"inherit"});
for (const signal of ["SIGINT","SIGTERM"]) process.on(signal,()=>next.kill(signal));
next.on("exit",code=>{process.exitCode=code??0;});
