import test from 'node:test';
import assert from 'node:assert/strict';
import config from '../vite.config.js';

test('mirror directory middleware rejects decoded traversal and malformed encoding',()=>{
 let middleware;
 config.plugins.find(p=>p.name==='skillry-mirror-dir-index').configureServer({middlewares:{use(fn){middleware=fn;}}});
 for(const url of ['/skillry-full/%2e%2e/%2e%2e/','/skillry-full/%2e%2e%5c%2e%2e%5c','/skillry-full/%ZZ/']){
  let next=false;
  middleware({url},{setHeader(){assert.fail('must not serve a file outside the mirror');},end(){assert.fail('must not send filesystem contents');}},()=>{next=true;});
  assert.equal(next,true,url);
 }
});
