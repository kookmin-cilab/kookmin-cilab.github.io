/* CILAB language controls and translated content. */
(() => {
  const all=s=>Array.from(document.querySelectorAll(s));
  const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function newsLanguage(lang){
    all('[data-news-content]').forEach(el=>{el.innerHTML=el.dataset[lang==='ko'?'newsKoHtml':'newsEnHtml']||escape(el.dataset[lang==='ko'?'newsKo':'newsEn']).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');el.lang=lang;});
    all('[data-news-language]').forEach(b=>{b.classList.toggle('is-active',b.dataset.newsLanguage===lang);b.setAttribute('aria-pressed',String(b.dataset.newsLanguage===lang));});
    all('[data-news-text-en]').forEach(el=>{el.textContent=el.dataset[lang==='ko'?'newsTextKo':'newsTextEn'];});
    try{localStorage.setItem('cilabNewsLanguage',lang);}catch{}
  }
  all('[data-news-language]').forEach(b=>b.addEventListener('click',()=>newsLanguage(b.dataset.newsLanguage)));
  if(document.querySelector('[data-news-content]')){let lang='en';try{lang=localStorage.getItem('cilabNewsLanguage')||'en';}catch{}newsLanguage(lang);}
  all('[data-project-lang]').forEach(b=>b.addEventListener('click',()=>{const lang=b.dataset.projectLang;all('[data-project-en]').forEach(el=>{el.textContent=el.dataset[lang==='ko'?'projectKo':'projectEn'];el.lang=lang;});all('[data-project-lang]').forEach(btn=>{btn.classList.toggle('is-active',btn===b);btn.setAttribute('aria-pressed',String(btn===b));});}));
  all('[data-project-filter]').forEach(b=>b.addEventListener('click',()=>{const value=b.dataset.projectFilter;all('[data-project-section]').forEach(section=>{section.hidden=value!=='all'&&section.dataset.projectSection!==value;});all('[data-project-filter]').forEach(btn=>{btn.classList.toggle('is-active',btn===b);btn.setAttribute('aria-pressed',String(btn===b));});}));
  all('[data-joining-lang]').forEach(b=>b.addEventListener('click',()=>{all('.joining-language-panel').forEach(p=>{p.hidden=p.lang!==b.dataset.joiningLang;p.classList.toggle('is-active',!p.hidden);});all('[data-joining-lang]').forEach(btn=>{btn.classList.toggle('is-active',btn===b);btn.setAttribute('aria-selected',String(btn===b));});}));
})();
