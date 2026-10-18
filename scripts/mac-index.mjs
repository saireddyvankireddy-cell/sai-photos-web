import process from 'node:process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {VISUAL_MODEL} from '../photo-tools.mjs';

const site=(process.env.SAI_SITE_URL||'http://localhost:4173').replace(/\/+$/,'');
const sleepMs=Math.max(60000,Number(process.env.SAI_INDEX_SLEEP_MS||300000));
const once=process.env.SAI_INDEX_ONCE==='1';
const cacheFile=process.env.SAI_INDEX_CACHE_FILE||path.join(os.homedir(),'.cache','sai-photos','mac-index-progress.json');
const log=(...parts)=>console.log('['+new Date().toISOString().replace('T',' ').slice(0,19)+']',...parts);
function sessionCookie(){const file=(process.env.SAI_SESSION_COOKIE_FILE||'').trim();let value=(process.env.SAI_SESSION_COOKIE||'').trim();if(file)try{value=fs.readFileSync(file,'utf8').trim();}catch{}return value?(value.includes('=')?value:'sai_photos_session='+value):'';}
async function call(name,body){
 const cookie=sessionCookie();if(!cookie)throw new Error('Waiting for the Mac web app pCloud sign-in. Indexing resumes automatically after connection.');
 const response=await fetch(site+'/.netlify/functions/'+name,{method:body?'POST':'GET',headers:{cookie,origin:new URL(site).origin,'content-type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(120000)});
 const data=await response.json().catch(()=>({}));
 if(response.status===401)throw new Error('Mac pCloud session expired. Sign in again in the web app; no Index button is needed.');
 if(!response.ok)throw new Error(data.error||'Request failed: '+response.status);
 return data;
}
function readCache(account){try{const saved=JSON.parse(fs.readFileSync(cacheFile,'utf8'));if(saved.account===account&&Array.isArray(saved.ids)&&saved.visuals&&saved.checksums)return saved;}catch{}return {account,ids:[],visuals:{},checksums:{}};}
function saveCache(saved){fs.mkdirSync(path.dirname(cacheFile),{recursive:true,mode:0o700});const temp=cacheFile+'.partial';fs.writeFileSync(temp,JSON.stringify(saved),{mode:0o600});fs.renameSync(temp,cacheFile);}
async function restoreOperations(){
 const auth=await call('pcloud-auth?action=status');if(!auth.connected||!auth.accountId)throw new Error('Connect pCloud in the Mac web app to begin automatic indexing.');
 const saved=readCache(String(auth.accountId)),seen=new Set(saved.ids);
 for(let page=0;page<5000;page++){
  const result=await call('photo-metadata?action=sync',{known:[...seen]});const before=seen.size;
  if(result.skipped?.length||result.error)throw new Error('Saved pCloud index restore is incomplete; retrying before any new indexing.');
  for(const op of result.operations||[]){if(!op.id||seen.has(op.id))continue;seen.add(op.id);
   const map=op.type==='visual-index'?saved.visuals:op.type==='content-index'?saved.checksums:null;
   if(map&&op.photoId&&(!map[op.photoId]||Number(op.at||0)>=Number(map[op.photoId].at||0)))map[op.photoId]={photoId:op.photoId,version:op.version,model:op.model||'',at:op.at||0};
  }
  saved.ids=[...seen];saveCache(saved);
  if(!result.more)return saved;
  if(before===seen.size)throw new Error('Saved index restore made no progress; waiting before retrying.');
 }
 throw new Error('Saved index restore did not finish. No new indexing was started.');
}
async function indexPass(){
 log('Restoring saved pCloud indexes…');
 const saved=await restoreOperations();
 const known=Object.values(saved.visuals).filter(op=>op.model===VISUAL_MODEL).map(op=>({id:op.photoId,version:op.version}));
 const checksums=Object.values(saved.checksums).map(op=>({id:op.photoId,version:op.version}));
 log('Restored '+known.length+' visual indexes and '+checksums.length+' checksum records.');
 await call('photo-analysis',{action:'start',folderId:'0',known,checksums});
 for(;;){
  await new Promise(resolve=>setTimeout(resolve,5000));const job=await call('photo-analysis');
  const total=Number(job.libraryTotal??job.total??0),done=Number(job.alreadyIndexed||0)+Number(job.completed||0);
  if(job.running){log(done+' / '+total+' saved · '+Math.max(0,total-done)+' pending · '+(job.phase||'Working'));continue;}
  if(job.phase==='Paused'||job.phase==='Stopped'||job.message)throw new Error(job.message||'Indexing paused; saved progress will be restored before retrying.');
  log('Pass ended: '+done+' / '+total+' saved; '+Number(job.failed||0)+' failed, '+Number(job.changed||0)+' changed. Completed photo versions are skipped on the next pass.');return;
 }
}
log('Automatic Mac visual indexing for '+site+'. Samsung and Mac share pCloud results.');
for(;;){try{await indexPass();}catch(error){log(error.message);}if(once)break;await new Promise(resolve=>setTimeout(resolve,sleepMs));}
