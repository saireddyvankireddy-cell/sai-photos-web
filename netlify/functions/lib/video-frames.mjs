import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
const run=promisify(execFile);

// Extract a small set of representative frames from a video buffer using ffmpeg.
// Returns JPEG buffers (empty array when the codec cannot be decoded).
export async function extractFrames(bytes,{count=3,width=640,timeoutMs=60000}={}){
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'sai-video-'));
  const input=path.join(dir,'input');
  try{
    await fs.writeFile(input,Buffer.from(bytes));
    let duration=0;
    try{const {stdout}=await run('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',input],{timeout:15000});duration=Number.parseFloat(stdout)||0;}catch{}
    const stamps=[];
    if(duration>0.2){for(let i=0;i<count;i++)stamps.push(Math.max(0,Math.min(duration-0.05,duration*(i+0.5)/count)));}
    else stamps.push(0);
    const frames=[];
    for(let i=0;i<stamps.length;i++){
      const output=path.join(dir,'frame-'+i+'.jpg');
      try{await run('ffmpeg',['-v','error','-nostdin','-ss',stamps[i].toFixed(3),'-i',input,'-frames:v','1','-vf','scale='+width+':-2','-q:v','4','-y',output],{timeout:timeoutMs});frames.push(await fs.readFile(output));}catch{}
    }
    return frames;
  }finally{try{await fs.rm(dir,{recursive:true,force:true});}catch{}}
}

// Same as extractFrames but reads the video straight from disk, so large
// mounted originals never have to be loaded into memory.
export async function extractFramesFromFile(file,{count=3,width=640,timeoutMs=60000}={}){
  let duration=0;
  try{const {stdout}=await run('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',file],{timeout:15000});duration=Number.parseFloat(stdout)||0;}catch{}
  const stamps=[];
  if(duration>0.2){for(let i=0;i<count;i++)stamps.push(Math.max(0,Math.min(duration-0.05,duration*(i+0.5)/count)));}
  else stamps.push(0);
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'sai-video-frames-'));
  const frames=[];
  try{
    for(let i=0;i<stamps.length;i++){
      const output=path.join(dir,'frame-'+i+'.jpg');
      try{await run('ffmpeg',['-v','error','-nostdin','-ss',stamps[i].toFixed(3),'-i',file,'-frames:v','1','-vf','scale='+width+':-2','-q:v','4','-y',output],{timeout:timeoutMs});frames.push(await fs.readFile(output));}catch{}
    }
    return frames;
  }finally{try{await fs.rm(dir,{recursive:true,force:true});}catch{}}
}

// The CLIP embedding is stored as base64 of bytes in 1..255 (value/norm*127+128).
export function unpackEmbedding(base64){const buf=Buffer.from(base64,'base64');const values=new Array(buf.length);for(let i=0;i<buf.length;i++)values[i]=(buf[i]-128)/127;return values;}
export function packEmbedding(values){let sum=0;for(const value of values)sum+=value*value;const norm=Math.sqrt(sum)||1;const buf=Buffer.alloc(values.length);for(let i=0;i<values.length;i++)buf[i]=Math.max(1,Math.min(255,Math.round(values[i]/norm*127)+128));return buf.toString('base64');}
