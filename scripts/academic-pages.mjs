import {data,esc,ext,image} from './components.mjs';

const localized=(en,ko=en)=>`data-project-en="${esc(en)}" data-project-ko="${esc(ko)}"`;
const text=(en,ko=en,tag='span')=>`<${tag} ${localized(en,ko)}>${esc(en)}</${tag}>`;
const labelKo={'Role':'역할','Period':'기간','Funding Source':'지원기관','Program':'사업명','Title':'과제명'};
function meta(label,en,ko=en){return `<span><b ${localized(label,labelKo[label]||label)}>${label}</b><span class="project-meta-value" ${localized(en,ko)}>${esc(en)}</span></span>`;}
function current(p){const end=p.period.split(' - ')[1];if(end==='Present')return true;const [month,year]=end.split(' ');const index=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(month);return Date.UTC(Number(year),index+1,1)>Date.now();}
const period=p=>p.period.replace(/([A-Za-z]{3}) (\d{4})/g,(_,m,y)=>`${y}.${String(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(m)+1).padStart(2,'0')}`);
const currentProjects=data.projects.filter(current);
const completedProjects=data.projects.filter(p=>!current(p));
function project(p){
  const isCurrent=current(p),state=isCurrent?'Current':'Completed';
  const title=p.program||p.title;
  return `<article id="project-${data.projects.indexOf(p)}" class="publication-card project-card" data-project-status="${state.toLowerCase()}"${p.role?` data-project-roles="${esc(p.role)}"`:''}>
    <div class="publication-body"><div class="publication-title-row"><span class="pub-badge project-${state.toLowerCase()}" ${localized(state,isCurrent?'진행 중':'완료')}>${state}</span>${p.start_year<2024?`<span class="pub-badge" ${localized('Prior research','이전 연구 참여')}>Prior research</span>`:''}<h3 ${localized(title,p.program_ko||p.title_ko||title)}>${esc(title)}</h3></div>
    <div class="publication-meta">${p.role?meta('Role',p.role,p.role_ko):''}${meta('Period',period(p))}${meta('Funding Source',p.funding,p.funding_ko)}${p.program?meta('Program',p.program,p.program_ko):''}${p.program?meta('Title',p.title,p.title_ko):''}</div></div>
    ${p.image?`<a class="publication-figure cilab-funding-figure" href="${p.image}">${image(p.image,p.funding)}</a>`:''}</article>`;
}
export const projectsPage=`<main id="main" class="page"><section id="funded-projects" class="publications-section projects-section">
  <div class="publications-heading"><div><h1>Funded Projects</h1><p>${data.projects.length} entries</p></div></div>
  <div class="project-controls"><div class="project-language-toggle" aria-label="Funded project language"><span>Language</span><div class="project-language-buttons language-control"><button class="is-active" type="button" data-project-lang="en" aria-pressed="true">EN</button><button type="button" data-project-lang="ko" aria-pressed="false">한국어</button></div></div><div class="project-status-row" aria-label="Project summary"><button class="project-summary-label is-active" type="button" data-project-filter="all" aria-pressed="true">${text('All projects','전체 과제')}</button><button type="button" data-project-filter="current" aria-pressed="false">${text('Current','진행 중')} <b>${currentProjects.length}</b></button><button type="button" data-project-filter="completed" aria-pressed="false">${text('Completed','완료')} <b>${completedProjects.length}</b></button></div></div>
  <div data-project-section="current"><h2 class="publication-year" ${localized('Current','진행 중')}>Current</h2><div class="publication-list project-current-list">${currentProjects.map(project).join('')}</div></div>
  <div data-project-section="completed"><h2 class="publication-year" ${localized('Completed','완료')}>Completed</h2><div class="publication-list project-completed-list">${completedProjects.map(project).join('')}</div></div>
  </section></main>`;

const courses=data.courses.map(c=>({...c,year:c.year||String(c.term||'').match(/\d{4}/)?.[0],semester:c.semester||String(c.term||'').replace(/\d{4}/,'').trim()}));
const semesterOrder={Winter:4,Fall:3,Summer:2,Spring:1};
courses.sort((a,b)=>Number(b.year)-Number(a.year)||(semesterOrder[b.semester]||0)-(semesterOrder[a.semester]||0));
const courseLevels=[['undergraduate','Undergraduate Courses'],['graduate','Graduate Courses']];
const yearsFor=level=>[...new Set(courses.filter(c=>c.level===level).map(c=>c.year))].sort((a,b)=>b-a);
const yearId=(level,year)=>level==='undergraduate'?`teaching-${year}`:`teaching-graduate-${year}`;
function course(c){return `<article class="teaching-card"><div class="teaching-title-row"><h4>${esc(c.title)}${c.title_ko?`<span lang="ko">(${esc(c.title_ko)})</span>`:''}</h4></div>${c.ta||c.description?`<div class="publication-meta">${c.ta?`<span><b>TA</b>${esc(c.ta)}</span>`:''}${c.description?`<span>${esc(c.description)}</span>`:''}</div>`:''}${c.url?`<div class="publication-actions">${ext(c.url,'Material')}</div>`:''}</article>`;}
function courseGroup(level,label){
  return `<section class="teaching-level" id="${level}-courses"><h2>${label}</h2>${yearsFor(level).map((year,i)=>{
    const offerings=courses.filter(c=>c.level===level&&c.year===year);
    return `<details id="${yearId(level,year)}" class="teaching-year-group" data-teaching-year="${level}-${year}"${i===0?' open':''}><summary class="publication-year"><h3>${year}</h3></summary>${[...new Set(offerings.map(c=>c.semester))].map(semester=>`<p class="teaching-semester">${esc(semester)}</p><div class="teaching-list">${offerings.filter(c=>c.semester===semester).map(course).join('')}</div>`).join('')}</details>`;
  }).join('')}</section>`;
}
export const teachingPage=`<main id="main" class="page"><section id="teaching" class="publications-section teaching-section">
  <div class="publications-heading"><div><h1>Teaching</h1><p>Undergraduate and graduate courses at Kookmin University.</p></div><div class="teaching-heading-actions"><button class="teaching-toggle-all" type="button" aria-expanded="false">Expand all years</button></div></div>
  <div class="teaching-layout"><aside class="teaching-toc"><nav aria-label="Teaching contents"><p>Courses</p>${courseLevels.map(([level,label])=>`<a class="teaching-level-link" href="#${level}-courses">${label}</a><ol>${yearsFor(level).map(year=>`<li><a href="#${yearId(level,year)}" data-index="${year}" data-teaching-target-year="${level}-${year}">Courses</a></li>`).join('')}</ol>`).join('')}<a class="teaching-talks-link" href="talks.html">Invited Talks →</a></nav></aside>
  <div id="courses" class="teaching-content-stack">${courseLevels.map(([level,label])=>courseGroup(level,label)).join('')}</div></div></section></main>`;
