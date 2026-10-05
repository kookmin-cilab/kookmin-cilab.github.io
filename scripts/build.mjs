import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {root,out,shell,esc,heading} from './components.mjs';
import {home,teamPage,pubPage} from './primary-pages.mjs';
import {newsPage,researchPage,projectsPage,teachingPage,galleryPage,contactPage,joiningPage} from './secondary-pages.mjs';
export {root,out};
export async function build(){
  await fs.mkdir(out,{recursive:true});
  await fs.cp(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
  const pages={index:home,team:teamPage,news:newsPage,research:researchPage,publications:pubPage,projects:projectsPage,teaching:teachingPage,gallery:galleryPage,contact:contactPage,joining:joiningPage};
  for(const [key,body] of Object.entries(pages))await fs.writeFile(path.join(out,key+'.html'),shell(key,body));
  await fs.writeFile(path.join(out,'.nojekyll'),'');
  await fs.copyFile(path.join(root,'CNAME'),path.join(out,'CNAME'));
  const redirect=target=>`<!doctype html><html lang="en"><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${target}"><title>Redirecting · CILAB</title><a href="${target}">Continue to CILAB</a></html>`;
  const aliases={members:'team',photos:'gallery',joining_us:'joining',...Object.fromEntries(Object.keys(pages).filter(k=>k!=='index').map(k=>[k,k]))};
  for(const [old,target] of Object.entries(aliases)){await fs.mkdir(path.join(out,old),{recursive:true});await fs.writeFile(path.join(out,old,'index.html'),redirect('../'+target+'.html'));}
  await fs.writeFile(path.join(out,'allnews.html'),redirect('news.html'));
  const base='/'+(process.env.BASE_PATH||'').replace(/^\/+|\/+$/g,'');
  const prefix=base==='/'?'/':base+'/';
  const notFound=shell('404',`<main id="main" class="page">${heading('Page not found','The page may have moved. Please use the navigation above.')}<p><a href="index.html">Back to home →</a></p></main>`).replace(/(href|src)="(?!https?:|mailto:|tel:|#)([^"]+)"/g,(_,attr,url)=>`${attr}="${esc(prefix+url)}"`);
  await fs.writeFile(path.join(out,'404.html'),notFound);
  console.log('Built 10 pages, legacy aliases, and 404.html in dist/');
}
if(process.argv[1]===fileURLToPath(import.meta.url))await build();
