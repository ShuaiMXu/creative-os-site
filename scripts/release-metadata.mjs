import {execFileSync} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
const revision=process.env.VERCEL_GIT_COMMIT_SHA||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(!/^[a-f0-9]{40}$/.test(revision))throw Error('Invalid release source revision');
let dirty=null;
try{dirty=Boolean(execFileSync('git',['status','--porcelain','--untracked-files=all'],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim());}catch{if(!process.env.VERCEL_GIT_COMMIT_SHA)throw Error('Cannot identify local release source state');}
await writeFile('public/release.json',JSON.stringify({schemaVersion:'0.1',channel:'local-web-alpha',repository:'https://github.com/ShuaiMXu/happyhands-site',revision,dirty,builtAt:new Date().toISOString(),scope:'Website and read-only examples; run the writable Harness locally.'},null,2)+'\n');
