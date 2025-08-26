import fs from "fs"; import { globSync } from "glob";
const files = globSync("src/**/*.{tsx,jsx,ts,js}", { ignore:["**/node_modules/**"] });
const rx = /(?:<Route[^>]*\spath="([^"]+)"|path:\s*["'`]([^"'`]+)["'`])/g;
const S=new Set();
for (const f of files){const t=fs.readFileSync(f,"utf8"); for (const m of t.matchAll(rx)){const p=m[1]||m[2]; if(p&&(p.startsWith("/")||p==="*")) S.add(p.replace(/\/+$/,""));}}
console.log([...new Set([...S])].sort().join("\n"));