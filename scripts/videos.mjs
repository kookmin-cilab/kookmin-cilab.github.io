import fs from 'node:fs/promises';
export const videos=JSON.parse(await fs.readFile(new URL('../data/videos.json',import.meta.url),'utf8'));
export function youtubeId(value){
  if(!value)return '';
  if(/^[\w-]{11}$/.test(value))return value;
  try{
    const url=new URL(value),host=url.hostname.replace(/^www\./,'');
    const id=host==='youtu.be'?url.pathname.split('/')[1]:['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(host)?(url.searchParams.get('v')||url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1]):'';
    return /^[\w-]{11}$/.test(id||'')?id:'';
  }catch{return '';}
}
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function video(v){
  const id=youtubeId(v.youtubeUrl),url=id?`https://www.youtube.com/watch?v=${id}`:'';
  const player=id?`<iframe src="https://www.youtube.com/embed/${id}?rel=0" title="${esc(v.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`:`<div class="cilab-video-pending">${v.poster?`<img src="${esc(v.poster)}" alt="" loading="lazy">`:''}<span>YouTube video coming soon</span></div>`;
  return `<div class="cilab-video-item">${player}<p>${url?`<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(v.title)} <span class="cilab-video-platform">YouTube ↗</span></a>`:esc(v.title)}</p></div>`;
}
