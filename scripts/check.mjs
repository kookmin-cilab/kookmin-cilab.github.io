import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {build,root,out} from './build.mjs';
import {videos,youtubeId} from './videos.mjs';
await build();
const data=JSON.parse(await fs.readFile(path.join(root,'data/site.json'),'utf8'));
const pages=['index','team','news','research','publications','projects','teaching','gallery','contact','joining'];
const deploymentPrefix='/'+(process.env.BASE_PATH||'').replace(/^\/+|\/+$/g,'')+'/';
const prefix=deploymentPrefix==='//'?'/':deploymentPrefix;
const documents=new Map();
for(const name of await fs.readdir(out,{recursive:true})){
  if(name.endsWith('.html'))documents.set(path.resolve(out,name),await fs.readFile(path.join(out,name),'utf8'));
}
let links=0,assets=0;
for(const [file,html] of documents){
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`Duplicate IDs in ${file}`);
  for(const match of html.matchAll(/\b(href|src)="([^"]+)"/g)){
    const [_,attribute,raw]=match;
    if(/^(https?:|mailto:|tel:|data:)/.test(raw))continue;
    if(!raw)continue;
    const url=new URL(raw.replaceAll('&amp;','&'),'https://check.local'+prefix+path.relative(out,file).replaceAll('\\','/'));
    assert.ok(url.pathname.startsWith(prefix),`Link escaped deployment base: ${raw}`);
    const dest=path.resolve(out,decodeURIComponent(url.pathname.slice(prefix.length)));
    assert.ok(dest.startsWith(out+path.sep),`Unsafe local path: ${raw}`);
    await fs.access(dest).catch(()=>{throw new Error(`Missing ${attribute}: ${raw} in ${path.basename(file)}`);});
    if(url.hash&&documents.has(dest))assert.ok(documents.get(dest).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`Missing anchor ${raw}`);
    attribute==='src'?assets++:links++;
  }
}
for(const page of pages){
  const html=documents.get(path.join(out,page+'.html'));
  assert.ok(html,`Missing page: ${page}`);
  assert.equal([...html.matchAll(/<h1\b/g)].length,1,`Expected one h1: ${page}`);
  assert.equal([...html.matchAll(/aria-current="page"/g)].length,1,`Missing active nav: ${page}`);
  assert.ok(!/mail@kookmin|your-email/.test(html),`Unmigrated content on ${page}`);
}
assert.equal((documents.get(path.join(out,'publications.html')).match(/id="paper-\d+"/g)||[]).length,data.publications.length);
assert.equal((documents.get(path.join(out,'gallery.html')).match(/class="gallery-carousel"/g)||[]).length,data.gallery.length);
for(const album of data.gallery)for(const image of album.images)await fs.access(path.join(out,image));
for(const paper of data.publications){for(const link of paper.links)assert.ok(/^https:\/\//.test(link.url),'Publication URL must use HTTPS');}
for(const video of videos){
  if(video.youtubeUrl)assert.ok(youtubeId(video.youtubeUrl),`Invalid YouTube URL: ${video.title}`);
  if(video.poster)await fs.access(path.join(out,video.poster));
  if(video.paperId)assert.ok(data.publications.some(p=>p.id===video.paperId),`Unknown video paper: ${video.paperId}`);
}
const teamHtml=documents.get(path.join(out,'team.html'));
for(const person of data.team)assert.ok(teamHtml.includes(`q=${encodeURIComponent(person.publicationQuery||person.name)}`),`Missing member publication link: ${person.name}`);
for(const page of ['index','research'])assert.ok(!documents.get(path.join(out,page+'.html')).includes('<video '),'Research videos must use YouTube embeds');
const contactHtml=documents.get(path.join(out,'contact.html'));
assert.ok(contactHtml.includes('+82-2-910-5069')&&contactHtml.includes('미래관 703호')&&contactHtml.includes('id="contact-map"'),'Contact details or map missing');
assert.ok(![...documents.values()].some(html=>/910-4688|Future Hall 408|미래관 408/.test(html)),'Outdated contact details');
console.log(`PASS: ${pages.length} pages; ${links} internal links; ${assets} image/script references; ${data.publications.length} publications; ${data.gallery.reduce((n,a)=>n+a.images.length,0)} gallery photos.`);
