import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {videos,video,youtubeId} from './videos.mjs';
export {videos,video};
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const out=path.join(root,'dist');
export const data=JSON.parse(await fs.readFile(path.join(root,'data/site.json'),'utf8'));
export const lab=JSON.parse(await fs.readFile(path.join(root,'data/lab.json'),'utf8'));
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const md=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
export const ext=(url,text,attributes='')=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" ${attributes}>${text}</a>`;
export const image=(src,alt,cls='',eager=false,zoomable=true)=>`<img src="${esc(src)}" alt="${esc(alt)}"${cls?` class="${cls}"`:''} loading="${eager?'eager':'lazy'}" ${eager?'fetchpriority="high" ':''}decoding="async"${zoomable?'':' data-lightbox="off"'}>`;
export const nav=[['index','Home'],['team','Team'],['news','News'],['research','Research'],['publications','Publications'],['projects','Projects'],['teaching','Teaching'],['gallery','Gallery'],['contact','Contact'],['joining','Joining CILAB']];
export const heading=(title,description='')=>`<div class="publications-heading"><div><h1>${title}</h1>${description?`<p>${description}</p>`:''}</div></div>`;
export const yearValues=items=>[...new Set(items.map(p=>p.year))].sort((a,b)=>b-a);
export const publicationUrl=(filters={},paperId='publication-results')=>'publications.html?'+new URLSearchParams({region:'all',type:'all',year:'all',venue:'all',...filters}).toString().replaceAll('+','%20')+'#'+paperId;
export const memberUrl=person=>'team.html#member-'+data.team.indexOf(person);
// One YouTube setting updates the homepage, research page, and publication links.
for(const p of data.publications){const v=videos.find(v=>v.paperId===p.id);if(!v)continue;const id=youtubeId(v.youtubeUrl);p.links=p.links.filter(l=>l.label!=='Video');if(id)p.links.push({label:'Video',url:'https://www.youtube.com/watch?v='+id});}
export function header(key){return `<header class="site-header">
  <div class="institution-bar"><div class="header-inner institution-inner"><a class="cilab-wordmark" href="index.html" data-default-href="index.html" data-default-label="${esc(lab.name)} (${esc(lab.shortName)})" data-compact-href="index.html" data-compact-label="${esc(lab.name)} (${esc(lab.shortName)})"><span>${esc(lab.name)} (${esc(lab.shortName)})</span></a><div class="institution-actions"><form class="site-search" role="search" action="publications.html"><label class="sr-only" for="site-search-input">Search CILAB site</label><input id="site-search-input" type="search" name="q" placeholder="Search" autocomplete="off"><div class="site-search-results" role="listbox" hidden></div></form><a class="header-youtube-link" href="${esc(lab.youtubeChannel)}" target="_blank" rel="noopener noreferrer"><span class="header-youtube-icon" aria-hidden="true"></span>YouTube</a><button class="theme-toggle" type="button" aria-label="Current theme: Light. Switch to dark theme" aria-pressed="false"><span class="theme-toggle-icon" aria-hidden="true">☀</span><span class="theme-toggle-text">Light</span></button></div></div></div>
  <div class="header-inner lab-header"><div class="lab-mark"><div class="lab-logo-static">${image(lab.logo,'CILAB logo','',true)}</div><div class="lab-title-block"><a class="lab-title-link" href="index.html"><strong>${lab.name} (CILAB)</strong></a><a class="lab-department-link" href="https://english.kookmin.ac.kr/" target="_blank" rel="noopener noreferrer"><small>Kookmin University</small></a></div></div></div>
  <button class="header-inner nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation"><span class="nav-toggle-icon" aria-hidden="true"></span><span>Menu</span></button><nav class="header-inner primary-nav" id="primary-navigation" aria-label="Primary navigation">${nav.map(([id,title])=>`<a href="${id}.html"${key===id?' aria-current="page"':''}${id==='joining'?' class="primary-nav-join"':''}>${title}</a>`).join('')}</nav></header>`;}
export function footer(){return `<footer class="site-footer"><div class="footer-inner"><div class="footer-main"><section class="footer-brand" aria-label="CILAB"><div class="footer-brand-mark">${image(lab.logo,'CILAB logo')}</div><p>${esc(lab.name)} (${esc(lab.shortName)})</p><a class="footer-join-link" href="joining.html">Join our lab <span aria-hidden="true">→</span></a></section><section class="footer-column" aria-labelledby="footer-affiliation-title"><h2 id="footer-affiliation-title">Affiliation</h2><p>${ext("https://ee.kookmin.ac.kr/",lab.department)}</p><p>College of Engineering</p><p>${ext('https://english.kookmin.ac.kr/','Kookmin University')}</p></section><section class="footer-column" aria-labelledby="footer-contact-title"><h2 id="footer-contact-title">Contact</h2><address><span>Seongwon Lee</span><a href="mailto:${lab.email}">${lab.email}</a></address></section><section class="footer-column footer-address" aria-labelledby="footer-address-title"><h2 id="footer-address-title">Address</h2><address>${lab.office}<br>77 Jeongneung-ro, Seongbuk-gu<br>Seoul 02707, Republic of Korea</address></section></div><div class="footer-bottom"><p>© ${new Date().getFullYear()} CILAB, Kookmin University. All rights reserved.</p><nav aria-label="Footer navigation"><a href="research.html">Research</a><a href="publications.html">Publications</a><a href="contact.html">Contact</a></nav></div></div></footer>`;}
export function shell(key,body){
  const title=nav.find(p=>p[0]===key)?.[1]||'Page not found';
  const design=key==='index'?'home':key;
  const css=['styles','header-design',...(key!=='404'?[design+'-design']:[]),'site-refresh'];
  const scripts=[...(key==='publications'?['publications']:[]),...(key==='index'?['home-video-scroll']:[]),...(key==='gallery'?['gallery-carousel']:[]),...(key==='teaching'?['teaching']:[]),'lightbox','theme-toggle','header-stickiness','nav-toggle','site-search'];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | CILAB · Kookmin University</title><meta name="description" content="${lab.name}, Kookmin University. Physical AI through multimodal perception, spatial intelligence, and embodied action."><meta name="theme-color" content="#0076b3"><link rel="icon" type="image/png" href="assets/brand/favicon-32x32.png">${css.map(c=>`<link rel="stylesheet" href="assets/theme/${c}.css">`).join('')}${key==='contact'?'<link rel="stylesheet" href="assets/vendor/leaflet/leaflet.css">':''}<link rel="stylesheet" href="assets/site.css"></head><body class="${key==='index'?'home-brand':''}" data-page="${key}"><script>try{if(localStorage.getItem('cilab-theme')==='dark')document.body.classList.add('theme-dark')}catch{}</script><a class="cilab-skip-link" href="#main">Skip to content</a>${header(key)}${body}${footer()}${scripts.map(s=>`<script src="assets/theme/${s}.js"></script>`).join('')}<script src="assets/site.js"></script>${key==='contact'?'<script src="assets/vendor/leaflet/leaflet.js"></script><script src="assets/contact-map.js"></script>':''}</body></html>`;
}
export const newsKo=[
 '**ACCV 2026**에 논문 **1편**이 채택되었습니다.',
 '**ICCAS 2026**에 논문 **1편**이 채택되었습니다.',
 '**Scientific Reports**에 논문 **1편**이 게재되었습니다.',
 '**International Journal of Control, Automation and Systems (IJCAS)**에 논문 **1편**이 게재 승인되었습니다.',
 '우리 연구실이 로봇 파운데이션 모델 연구를 위한 NRF **기초연구실(BRL) 사업**에 선정되었습니다.',
 '**IROS 2026**에 논문 **1편**이 채택되었습니다.',
 '**한국전자통신연구원(ETRI)**의 **비전-언어 네비게이션(VLN) 에이전트** 연구과제에 선정되었습니다.',
 '**BStar Robotics**의 **물류창고 로봇을 위한 3차원 재구성** 연구과제에 선정되었습니다.',
 '**비전-언어 네비게이션(VLN) 에이전트** 연구를 위한 NRF **신진연구 사업**에 선정되었습니다.',
 '**CVPR 2026**에 논문 **2편**이 채택되었습니다.', '**ICRA 2026**에 논문 **1편**이 채택되었습니다.',
 '**IEEE Transactions on Intelligent Vehicles (TIV)**에 논문 **1편**이 게재되었습니다. (IF: 14.0, JCR 상위 2%)',
 '**한국전자통신연구원(ETRI)**의 **뇌파 신호 기반 이미지 생성** 연구과제에 선정되었습니다.',
 '**한국전자기술연구원(KETI)**의 **차량 3차원 재구성** 연구과제에 선정되었습니다.',
 '**IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)**에 논문 **1편**이 게재되었습니다. (IF: 20.6, JCR 상위 1%)',
 '**ICRA 2025**에 논문 **1편**이 채택되었습니다.', '**IEEE Access**에 논문 **1편**이 채택되었습니다. (IF: 3.4, JCR 상위 40%)',
 '**국민대학교 CILAB**이 문을 열었습니다!', '**BMVC 2023**에 논문 **1편**이 채택되었습니다.', '**CVPR 2023**에 논문 **1편**이 채택되었습니다.',
 '이성원 교수가 **Qualcomm Innovation Fellowship 2022**에 선정되었습니다.',
 '**Correlation Verification for Image Retrieval** 논문이 **CVPR 2022 Oral presentation**에 선정되었습니다.',
 '**CVPR 2022**에 논문 **2편**이 채택되었습니다.', '**ICCV 2021**에 논문 **1편**이 채택되었습니다.'
];
function newsContent(description,n){
  const destination=n.publicationFilters||n.paperId?publicationUrl(n.publicationFilters,n.paperId):'';
  let html=md(description);
  if(destination)html=html.replace(/<strong>(.*?)<\/strong>/g,`<a href="${esc(destination)}"><strong>$1</strong></a>`);
  for(const name of ['Seongwon Lee','이성원 교수'])html=html.replaceAll(name,`<a href="team.html#member-0">${name}</a>`);
  return html;
}
export function newsItem(n,i){
  const category={Project:'Funding',Career:'People'}[n.category]||n.category;
  const en=newsContent(n.description,n),ko=newsContent(newsKo[i]||n.description,n);
  return `<li data-news-category="${category.toLowerCase()}" data-news-id="cilab-news-${i}" data-home-reveal="true"><time datetime="${n.year}-${String(n.month).padStart(2,'0')}">${new Date(n.year,n.month-1).toLocaleString('en',{month:'short'})} ${n.year}</time><p><span class="news-tag tag-${category.toLowerCase()}">${category}</span><span data-news-content data-news-en="${esc(n.description)}" data-news-ko="${esc(newsKo[i]||n.description)}" data-news-en-html="${esc(en)}" data-news-ko-html="${esc(ko)}">${en}</span></p></li>`;
}
export const languageControl=`<div class="news-language-toggle language-control" role="group" aria-label="News language"><button class="is-active" type="button" data-news-language="en" aria-pressed="true">EN</button><button type="button" data-news-language="ko" aria-pressed="false">한국어</button></div>`;
