import {data,esc,ext,heading} from './components.mjs';

const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function dateParts(date){
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date.split('-').map(Number);
  const [month,year]=date.split(' ');
  return [Number(year),months.indexOf(month)+1,0];
}
const talks=data.talks.map((t,index)=>({...t,index,parts:dateParts(t.date)}))
  .sort((a,b)=>b.parts[0]-a.parts[0]||b.parts[1]-a.parts[1]||b.parts[2]-a.parts[2]);
const years=[...new Set(talks.map(t=>t.parts[0]))];
function talk(t){
  const [year,month,day]=t.parts;
  const dateLabel=day?`${months[month-1]} ${day}, ${year}`:`${months[month-1]} ${year}`;
  const datetime=day?t.date:`${year}-${String(month).padStart(2,'0')}`;
  return `<article class="talk-entry" id="talk-${t.index}"><time datetime="${datetime}">${dateLabel}</time><div class="talk-content"><h3${/[가-힣]/.test(t.title)?' lang="ko"':''}>${esc(t.title)}</h3><p class="talk-host">${esc(t.place)}</p>${t.url?`<div class="publication-actions">${ext(t.url,'Slides')}</div>`:''}</div></article>`;
}
export const talksPage=`<main id="main" class="page"><section id="talks" class="publications-section">${heading('Invited Talks','Lectures and seminars by Seongwon Lee.')}${years.map(year=>`<section class="talk-year" aria-labelledby="talks-${year}"><h2 class="publication-year" id="talks-${year}">${year}</h2><div class="talk-list">${talks.filter(t=>t.parts[0]===year).map(talk).join('')}</div></section>`).join('')}</section></main>`;
