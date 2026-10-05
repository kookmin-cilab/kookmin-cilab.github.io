import {data,esc,ext,image,yearValues,publicationUrl,memberUrl} from './components.mjs';

const {team,publications}=data;
const venueKey=p=>p.venue.toLowerCase().replace(/[^a-z0-9]+/g,'-')+(p.type==='Workshop'?'-ws':'');
const conferenceVenues=[['cvpr','CVPR'],['iccv','ICCV'],['icra','ICRA'],['iros','IROS'],['accv','ACCV'],['bmvc','BMVC']];
const journalVenues=[['tpami','TPAMI'],['tiv','TIV'],['scientific-reports','Scientific Reports'],['ijcas','IJCAS'],['ieee-access','IEEE ACCESS']];
const selectedVenues=new Set([...conferenceVenues,...journalVenues].map(([key])=>key));
const button=(group,value,label,count)=>`<button type="button" data-filter-group="${group}" data-filter-value="${esc(value)}">${label}${count!==undefined?` <b>${count}</b>`:''}</button>`;
const filterBadge=(label,filters,cls='')=>`<a class="pub-badge ${cls}" href="${esc(publicationUrl(filters))}" title="Show publications: ${esc(label)}">${esc(label)}</a>`;
const resourceLabel=label=>({Publication:'Page',Supplement:'Supp'}[label]||label);

function authors(p){
  return p.authors.replace(/\*/g,'†').replace(/,?\s+and\s+/g,', ').split(',').map(a=>a.trim()).filter(Boolean).map((name,i)=>{
    const plain=name.replace(/†/g,'');
    const member=team.find(m=>m.name===plain);
    const label=member?`<a class="publication-member-link" href="${memberUrl(member)}" aria-label="View ${esc(plain)} in Team"><strong>${esc(plain)}</strong></a>`:esc(plain);
    return label+(i===0?'*':'')+(name.includes('†')?'†':'');
  }).join(', ');
}

function paper(p){
  const venue=venueKey(p);
  return `<article id="${p.id}" class="publication-card${p.image?'':' publication-card-text-only'}" data-region="international" data-type="${p.type.toLowerCase()}" data-year="${p.year}" data-venue="${venue}" data-venue-group="${selectedVenues.has(venue)?'selected':'others'}">
    <div class="publication-body">
      <div class="publication-title-row">
        ${filterBadge(p.year,{year:p.year},'pub-year')}
        ${filterBadge('International',{region:'international'})}
        ${filterBadge(p.type,{type:p.type.toLowerCase()})}
        ${p.oral?filterBadge('Oral',{q:'Oral Presentation'},'award'):''}
        ${p.award?filterBadge('AWARD',{q:p.award},'award'):''}
        ${filterBadge(p.venue+(p.type==='Workshop'?' WS':''),{venue},'badge-venue')}
        <h3>${esc(p.title)}</h3>
      </div>
      <div class="publication-meta">
        <span><b>Venue</b><a href="${esc(publicationUrl({venue}))}" title="Show ${esc(p.venue)} publications">${esc(p.venueFull)}</a></span>
        <span><b>Authors</b>${authors(p)}</span>
        ${p.doi?`<span><b>DOI</b>${ext('https://doi.org/'+p.doi,esc(p.doi))}</span>`:''}
        ${p.oral?`<span><b>Note</b>${esc(p.oralNote||'Selected as an Oral Presentation')}</span>`:''}
        ${p.award?`<span class="publication-award-note"><b>Award</b>${esc(p.award)}</span>`:''}
      </div>
      <div class="publication-actions">${p.links.map(l=>ext(l.url,esc(resourceLabel(l.label)))).join('')}</div>
    </div>
    ${p.image?`<a class="publication-figure" href="${p.image}">${image(p.image,p.title)}</a>`:''}
  </article>`;
}

function venueGroup(title,venues){
  return `<div class="facet-subgroup"><em>${title}</em><div class="facet-buttons">${venues.map(([key,label])=>button('venue',key,label,publications.filter(p=>venueKey(p)===key).length)).join('')}</div></div>`;
}

export const pubPage=`<main id="main" class="page section-page"><section id="publications" class="publications-section">
  <div class="publications-heading"><h1>Publications</h1><div class="publication-author-note"><span>Author notes</span><em><b>*</b> First author</em><em><b>†</b> Corresponding author</em><em><strong>bold</strong> CILAB member</em></div></div>
  <div class="publication-filter-panel" aria-label="Publication filters">
    <div><span>Region</span>${['all','international','domestic'].map(v=>button('region',v,v[0].toUpperCase()+v.slice(1))).join('')}</div>
    <div><span>Type</span>${['all','conference','journal','preprint','workshop'].map(v=>button('type',v,v[0].toUpperCase()+v.slice(1))).join('')}</div>
    <div class="facet-year-range" aria-label="Publication year range"><span>Range</span>${['from','to'].map(which=>`<label>${which==='from'?'From':'To'} <select data-year-range="${which}"><option value="all">Any</option>${yearValues(publications).map(y=>`<option value="${y}">${y}</option>`).join('')}</select></label>`).join('')}</div>
    <div class="publication-filter-actions"><span>View</span><button type="button" data-filter-preset="default" aria-describedby="publication-default-filter-help">Default Filter</button><button type="button" data-filter-preset="all">Show all</button><p id="publication-default-filter-help" class="publication-filter-help">Default: International conference, journal, and preprint papers · All years and venues.</p></div>
    <div class="cilab-publication-search"><label for="publication-search">Search</label><input id="publication-search" type="search" placeholder="Title, author, or keyword" autocomplete="off"></div>
  </div>
  <div class="publication-facets" aria-label="Publication facets">
    <div class="publication-filter-total" aria-live="polite"></div>
    <div class="facet-row"><span>Publication Year</span><div class="facet-year-tools"><div class="facet-buttons">${yearValues(publications).map(y=>button('year',y,y,publications.filter(p=>p.year===y).length)).join('')}</div></div></div>
    <div class="facet-row"><span>Venue</span><div class="facet-venue-groups">
      ${venueGroup('Selected Conference',conferenceVenues)}
      ${venueGroup('Selected Journal',journalVenues)}
      <div class="facet-subgroup"><em>Others</em><div class="facet-buttons">${button('venue','others','Others',publications.filter(p=>!selectedVenues.has(venueKey(p))).length)}</div></div>
    </div></div>
  </div>
  <div id="publication-results" tabindex="-1">${yearValues(publications).map(y=>`<div class="publication-year" data-publication-year="${y}">${y}</div><div class="publication-list">${publications.filter(p=>p.year===y).map(paper).join('')}</div>`).join('')}
  <p id="publication-empty" class="cilab-empty" hidden>No publications match the selected filters. Use “Show all” to reset.</p>
  </div>
</section></main>`;
