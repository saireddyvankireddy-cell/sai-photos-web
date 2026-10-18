import { validOperation } from './photo-state.mjs';
export function sameOperation(a,b){
  const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().filter(key=>key!=='at').map(key=>[key,canonical(value[key])])):value;
  return validOperation(a)&&validOperation(b)&&JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
}
const TRANSIENT=/network|fetch failed|failed to fetch|timed? ?out|timeout|ECONN|EAI_|ENOTFOUND|socket|abort|50[234]|429|too many|temporar|unavailable|reset by peer|connection (lost|closed|reset)/i;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export async function syncRecords({data,read,write,persist,current=()=>true,onPhase=()=>{},onPage=()=>{},attempts=3,retryDelayMs=400,maxKnown=400000}){
  let writeError=null;let readError=null;const skipped=new Set();
  const guard=()=>{if(!current())throw new Error('Account changed during sync.');};
  const attempt=async(fn)=>{let last;const max=Math.max(1,attempts);for(let tries=1;tries<=max;tries++){try{return await fn();}catch(error){last=error;if(tries>=max||!TRANSIENT.test(String(error&&error.message||error)))break;await sleep(retryDelayMs*tries);}}throw last;};
  const flush=async()=>{
    for(const op of [...data.pending]){
      guard();onPhase('saving');
      try{const result=await attempt(()=>write(op));guard();if(!sameOperation(result.operation,op))throw new Error('pCloud did not confirm the saved record.');data.operations=data.operations.filter(old=>old.id!==op.id);data.operations.push(result.operation);data.pending=data.pending.filter(old=>old.id!==op.id);await persist();}
      catch(error){writeError=error;break;}
    }
  };
  await flush();guard();
  try{
    let more;
    do{onPhase('restoring');const knownAll=[...new Set([...data.operations.map(op=>op.id),...skipped])];const known=knownAll.length>maxKnown?knownAll.slice(knownAll.length-maxKnown):knownAll;const result=await attempt(()=>read(known));guard();if(result.error)readError=new Error(result.error);if(!Array.isArray(result.operations))throw new Error('pCloud returned unreadable app records.');const valid=result.operations.filter(validOperation);if(valid.length!==result.operations.length){readError=new Error('Some pCloud records were unreadable. Valid records were restored; incomplete records will retry.');for(const op of result.operations)if(!validOperation(op)&&typeof op?.id==='string')skipped.add(op.id);}data.operations=[...new Map([...data.operations,...valid].map(op=>[op.id,op])).values()];for(const id of result.skipped||[])skipped.add(id);more=result.more;await persist();guard();await onPage();if(more&&knownAll.length===[...new Set([...data.operations.map(op=>op.id),...skipped])].length)throw new Error('pCloud restore made no progress. Completed records are kept; sync will retry.');}while(more);
  }catch(error){readError=error;}
  guard();if(!writeError&&data.pending.length)await flush();
  return {writeError,readError,skipped:[...skipped],saved:data.pending.length===0};
}
