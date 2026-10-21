import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {randomUUID} from 'node:crypto';
import {assertSiteHandoff,decodeSiteHandoff,localWorkbenchURL} from '../packages/contracts/site-handoff.js';
test('the website and core use identical data-only handoff contracts',async()=>{
 const root=resolve(process.env.HARNESS_ROOT||'../creative-os');
 assert.equal(await readFile(new URL('../packages/contracts/site-handoff.js',import.meta.url),'utf8'),await readFile(resolve(root,'packages/workbench/site-handoff-contract.js'),'utf8'));
 const data={schemaVersion:'0.1',id:randomUUID(),repo:'/Users/test/项目',task:'检查快速开始',designSources:['DESIGN.md','src/components']};
 const url=new URL(localWorkbenchURL('http://127.0.0.1:4190/apps/designer/',data));
 assert.equal(url.search,'');assert.deepEqual(decodeSiteHandoff(url.hash.slice(9)),data);
 assert.throws(()=>assertSiteHandoff({...data,start:{command:'anything'}}));
 assert.throws(()=>localWorkbenchURL('https://example.com/apps/designer/',data));
});
