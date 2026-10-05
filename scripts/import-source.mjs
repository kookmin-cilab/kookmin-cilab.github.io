// One-time migration helper. The generated JSON is the editable source of truth.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const root = process.cwd();
const cache = path.join(root, '.source-cache');
const read = name => fs.readFile(path.join(cache, name), 'utf8');
const clean = value => value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim();
// The original data files contain plain lists of flat mappings, plus photo arrays.
function parseSourceYaml(text) {
  const result = []; let item, list;
  for (const line of text.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const top = line.match(/^- (\w+):\s*(.*)$/);
    const prop = line.match(/^  (\w+):\s*(.*)$/);
    const child = line.match(/^    - (.+)$/);
    if (top) { item = {}; result.push(item); }
    const match = top || prop;
    if (match) {
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) value = JSON.parse(value);
      if (match[1] === 'images') { value = []; list = value; }
      item[match[1]] = /^\d+$/.test(value) ? Number(value) : value;
    } else if (child) list.push(child[1]);
  }
  return result;
}
const files = ['professors', 'students', 'interns', 'alumni', 'news', 'publist', 'photos', 'projects'];
const source = Object.fromEntries(await Promise.all(files.map(async name => [name, parseSourceYaml(await read(name + '.yml'))])));
const personal = await read('personal.md');
const paperBlocks = personal.split('<div class="paper-box">').slice(1);
const normalize = s => clean(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const imagePath = original => 'assets/' + original.replace(/^\//, '').replace(/\.[^.]+$/, '.webp');
const publications = source.publist.map((p, i) => {
  const block = paperBlocks.find(b => normalize(b.match(/class="paper-box-title">([\s\S]*?)<\/p>/)?.[1] || '') === normalize(p.title));
  const links = block ? [...block.matchAll(/<a href="([^"]+)"[^>]*>\[([^<]+)\]<\/a>/g)].map(m => ({label: m[2] === 'arXiv' ? 'arXiv' : m[2] === 'project page' ? 'Project' : m[2] === 'page' ? 'Publication' : m[2] === 'supp' ? 'Supplement' : m[2][0].toUpperCase()+m[2].slice(1), url:m[1].replace(/^http:/,'https:')})) : [];
  for (const m of (block || '').matchAll(/<a href="(https:\/\/github\.com\/[^"#]+)"/g)) {
    if (!links.some(l => l.url === m[1])) links.push({label:'Code',url:m[1]});
  }
  if (p.link && !links.some(l => l.url === p.link)) links.unshift({label: p.link.includes('arxiv') ? 'arXiv' : 'Publication', url:p.link});
  const authorMatch = block?.match(/paper-box-title[\s\S]*?<\/p>\s*<p>([\s\S]*?)<\/p>/);
  let venue = (p.venue.match(/\(([^)]+)\)/)?.[1] || p.venue).replace(/ 20\d\d/g, '');
  p.venue = p.venue.replace('Transactions on Intelligent Vehicle (TIV)', 'Transactions on Intelligent Vehicles (TIV)');
  const type = /Workshop/i.test(p.venue) ? 'Workshop' : /Journal|Transactions|IEEE Access/i.test(p.venue) ? 'Journal' : 'Conference';
  return {id:'paper-'+(i+1), title:p.title, year:p.year, authors:clean(authorMatch?.[1] || p.authors).replaceAll('†','*'), venue, venueFull:p.venue, type, image:p.thumbnail ? imagePath(p.thumbnail) : '', oral:!!p.oral, links};
});
const team = ['professors','students','interns','alumni'].flatMap(group => source[group].filter(p => p.name !== 'Currently Hiring!').map(p => ({name:p.name, group, photo:imagePath('images/teampic/'+p.photo), email:p.email||p.external_email, homepage:p.homepage||'', interests:p.interests||'', affiliation:p.affiliation||'', role:p.position||({students:'Master’s student',interns:'Undergraduate researcher',alumni:'Alumnus'}[group])})));
const projects = source.projects.map(p => ({...p, image:'assets'+p.thumbnail}));
const projectPart = personal.split('# 💼 Projects')[1]?.split('# 📝')[0] || '';
for (const match of projectPart.matchAll(/^- \*\(([^)]+)\)\* (.+)\r?\n  - Funding from (.+)/gm)) {
  if (!projects.some(p => normalize(p.title) === normalize(match[2]))) projects.push({title:match[2],title_ko:'',period:match[1],funding:match[3],start_year:Number(match[1].match(/\d{4}/)[0]),image:''});
}
const talks = [];
for (const m of (personal.split('- Invited Talks')[1]?.split('- Reviewer')[0]||'').matchAll(/- \*\(([^)]+)\)\* (.+)\r?\n\s+- (.+)/g)) {
  const slide = m[2].match(/\[\[slide\]\]\(([^)]+)\)/);
  talks.push({date:m[1],title:m[2].replace(/\s*\[\[slide\]\].*$/, ''),place:m[3],url:slide?.[1]||''});
}
const gallery = source.photos.map((p,i)=>({id:'album-'+(i+1),date:p.date,title:p.title,images:p.images.map(name=>imagePath('images/photos/'+name))}));
const data = {updated:'2026-10-04', team, publications, news:source.news, projects, gallery, courses:[], talks};
await fs.mkdir('data', {recursive:true});
await fs.writeFile('data/site.json', JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(data).map(([k,v])=>[k,Array.isArray(v)?v.length:v]))));
if (!process.argv.includes('--assets')) process.exit(0);
const runtime = process.env.CILAB_RUNTIME_PACKAGES;
if (!runtime) throw new Error('Set CILAB_RUNTIME_PACKAGES to the bundled Node package directory for image optimization.');
const sharp = createRequire(path.join(runtime, 'package.json'))('sharp');
const tree = JSON.parse(await read('lab-tree.json'));
const assets = tree.filter(f=> /^images\/(photos|teampic|publications)\/.*\.(jpg|png|gif)$/i.test(f.path) && !/\/(backup|you)\./.test(f.path));
assets.push(...tree.filter(f=>/^images\/projects\/.*\.svg$/.test(f.path)));
let cursor=0;
await Promise.all(Array.from({length:5}, async()=> {
  while(cursor<assets.length) {
    const item=assets[cursor++];
    const dest=item.path.endsWith('.svg') ? 'assets/'+item.path : imagePath(item.path);
    await fs.mkdir(path.dirname(dest),{recursive:true});
    try { await fs.access(dest); continue; } catch {}
    const response=await fetch('https://raw.githubusercontent.com/kookmin-cilab/kookmin-cilab.github.io/main/'+item.path);
    if(!response.ok) throw new Error(item.path+': '+response.status);
    const buffer=Buffer.from(await response.arrayBuffer());
    if(item.path.endsWith('.svg')) await fs.writeFile(dest,buffer);
    else await sharp(buffer).rotate().resize({width:item.path.includes('teampic')?600:1600,withoutEnlargement:true}).webp({quality:83}).toFile(dest);
    console.log(dest);
  }
}));
