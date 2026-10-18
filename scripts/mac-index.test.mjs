import test from 'node:test';import assert from 'node:assert/strict';import{createServer}from'node:http';import{mkdtemp,readFile,rm}from'node:fs/promises';import{tmpdir}from'node:os';import{join}from'node:path';import{spawn}from'node:child_process';
async function runAgent(site,cache){return new Promise((resolve,reject)=>{const p=spawn(process.execPath,['scripts/mac-index.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,SAI_SITE_URL:site,SAI_SESSION_COOKIE:'mock-session-only',SAI_SESSION_COOKIE_FILE:'',SAI_INDEX_ONCE:'1',SAI_INDEX_CACHE_FILE:cache}});let text='';p.stdout.on('data',b=>text+=b);p.stderr.on('data',b=>text+=b);p.on('error',reject);p.on('close',code=>resolve({code,text}));});}
test('Mac auto-index restores beyond 120 pages, starts the root and caches completed versions',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'sai-mac-index-test-'));let starts=0,pages=0;
 const records=Array.from({length:3001},(_,n)=>({id:'record-'+n,type:'visual-index',photoId:'pc-'+n,version:'v1',model:'clip-base32-q8-v1',at:n+1}));
 const server=createServer(async(req,res)=>{if(req.method==='POST')assert.equal(req.headers.origin,'http://127.0.0.1:'+server.address().port);let raw='';for await(const part of req)raw+=part;const body=raw?JSON.parse(raw):{};let answer={};
  if(req.url.includes('pcloud-auth'))answer={connected:true,accountId:'777'};
  else if(req.url.includes('photo-metadata')){pages++;const seen=new Set(body.known),missing=records.filter(x=>!seen.has(x.id));answer={operations:missing.slice(0,24),more:missing.length>24};}
  else if(req.method==='POST'){starts++;assert.equal(body.folderId,'0');assert.equal(body.known.length,3001);answer={running:true};}
  else answer={running:false,libraryTotal:3001,total:0,alreadyIndexed:3001,completed:0};
  res.setHeader('content-type','application/json');res.end(JSON.stringify(answer));
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try{const result=await runAgent('http://127.0.0.1:'+server.address().port,join(dir,'progress.json'));assert.equal(result.code,0);assert.ok(pages>120);assert.equal(starts,1);assert.match(result.text,/Restored 3001 visual indexes/);const saved=JSON.parse(await readFile(join(dir,'progress.json'),'utf8'));assert.equal(saved.ids.length,3001);assert.equal(Object.keys(saved.visuals).length,3001);}
 finally{await new Promise(r=>server.close(r));await rm(dir,{recursive:true,force:true});}
});
test('an incomplete shared restore never starts a Mac indexing job',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'sai-mac-incomplete-'));let starts=0;
 const server=createServer(async(req,res)=>{for await(const _ of req){};res.setHeader('content-type','application/json');if(req.url.includes('pcloud-auth'))res.end(JSON.stringify({connected:true,accountId:'778'}));else if(req.url.includes('photo-metadata'))res.end(JSON.stringify({operations:[],skipped:['unreadable-record'],more:false}));else{starts++;res.end('{}');}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try{const result=await runAgent('http://127.0.0.1:'+server.address().port,join(dir,'progress.json'));assert.equal(starts,0);assert.match(result.text,/restore is incomplete/);}
 finally{await new Promise(r=>server.close(r));await rm(dir,{recursive:true,force:true});}
});
