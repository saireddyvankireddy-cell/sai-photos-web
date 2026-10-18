import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {perceptualHash,VISUAL_MODEL} from '../../../photo-tools.mjs';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const REVISION='d15189d7028b43f1d3e65039190477f6af591c2a';
let runtime;let vision;let text;let processor;let tokenizer;
async function library(){if(!runtime){runtime=import('@huggingface/transformers').then(api=>{api.env.cacheDir=fileURLToPath(new URL('../../../.ai-cache/models/',import.meta.url));api.env.allowLocalModels=false;api.env.backends.onnx.wasm.numThreads=2;return api;});}return runtime;}
export async function warmVision(){const api=await library();processor ||= api.AutoProcessor.from_pretrained('Xenova/clip-vit-base-patch32',{revision:REVISION});vision ||= api.CLIPVisionModelWithProjection.from_pretrained('Xenova/clip-vit-base-patch32',{dtype:'q8',revision:REVISION}).catch(error=>{vision=null;throw error;});await Promise.all([processor,vision]);}
export async function textEmbedding(query,prefix='a photo of '){const api=await library();tokenizer ||= api.AutoTokenizer.from_pretrained('Xenova/clip-vit-base-patch32',{revision:REVISION});text ||= api.CLIPTextModelWithProjection.from_pretrained('Xenova/clip-vit-base-patch32',{dtype:'q8',revision:REVISION}).catch(error=>{text=null;throw error;});const prompt=prefix==='music title: '?query.toLowerCase():query.toLowerCase().replace(/\bsarees?\b/g,'sari clothing').replace(/\broses?\b/g,'rose flowers');const inputs=(await tokenizer)([prefix+prompt],{padding:true,truncation:true});const result=await(await text)(inputs);const values=Array.from(result.text_embeds.data);const norm=Math.hypot(...values);return values.map(value=>value/norm);}
let lastDecodeError;
async function normalizedImage(bytes){
 try{return await sharp(bytes,{failOn:'none',limitInputPixels:false}).rotate().resize(1600,1600,{fit:'inside',withoutEnlargement:true}).jpeg({quality:90}).toBuffer();}catch(error){lastDecodeError=error;}
 if(process.platform==='darwin'){
  try{
   const dir=mkdtempSync(join(process.env.TMPDIR||tmpdir(),'sai-visual-'));
   try{const source=join(dir,'input');writeFileSync(source,Buffer.from(bytes));const target=join(dir,'out.jpg');execFileSync('/usr/bin/sips',['-s','format','jpeg','-Z','1600',source,'--out',target],{stdio:'ignore'});return readFileSync(target);}finally{rmSync(dir,{recursive:true,force:true});}
  }catch(error){lastDecodeError=error;}
 }
 throw lastDecodeError instanceof Error?lastDecodeError:new Error('Image could not be decoded.');
}
export async function visualFeatures(bytes,photo={}){
 await warmVision();const api=await library();const decoded=await normalizedImage(bytes);const image=await api.RawImage.fromBlob(new Blob([decoded]));const inputs=await(await processor)(image);const result=await(await vision)(inputs);const values=Array.from(result.image_embeds.data);const norm=Math.hypot(...values);const packed=Buffer.from(values.map(value=>Math.max(1,Math.min(255,Math.round(value/norm*127)+128)))).toString('base64');
 const gray=await sharp(decoded).resize(32,32,{fit:'fill'}).greyscale().raw().toBuffer();const rgb=await sharp(decoded).resize(16,16,{fit:'fill'}).removeAlpha().raw().toBuffer();const color=[0,0,0];for(let i=0;i<rgb.length;i++)color[i%3]+=rgb[i]/255/(rgb.length/3);const mean=gray.reduce((sum,x)=>sum+x,0)/gray.length;const contrast=Math.sqrt(gray.reduce((sum,x)=>sum+(x-mean)**2,0)/gray.length)/255;
 return {model:VISUAL_MODEL,embedding:packed,phash:perceptualHash(gray),color,contrast,width:photo.width||image.width,height:photo.height||image.height};
}
