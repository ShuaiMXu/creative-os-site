import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as radix from '@radix-ui/colors';
test('semantic colors use the appropriate Radix steps in both themes',async()=>{
 const tokens=JSON.parse(await readFile('packages/design-tokens/happyhands.json','utf8'));
 for(const mode of ['light','dark']){
  const suffix=mode==='dark'?'Dark':'';
  for(const [token,scale,step] of [['bg','gray',1],['bg-sunken','gray',3],['bg-hover','gray',4],['ink','gray',12],['ink-muted','gray',11],['line','gray',6],['line-strong','gray',8],['brand','orange',9],['brand-text','orange',11],['danger','red',11]])assert.equal(tokens[mode][token],radix[scale+suffix][scale+step],`${mode}/${token}`);
 }
});
