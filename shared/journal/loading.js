// Tiny first-paint renderer, shared with the journal and its library sample.
// This classic entry has no analytics, catalog or UI-module dependencies.
(() => {
 if(window.journalLoading)return;
 const node=(tag,text,className)=>{const e=document.createElement(tag);if(text!=null)e.textContent=text;if(className)e.className=className;return e;};
 const readSavedTheme=(key='dns-report-theme')=>{try{const value=localStorage.getItem(key);return ['light','dark'].includes(value)?value:null;}catch{return null;}};
 const preferredTheme=()=>readSavedTheme()||'light';
function create(label='Загружаем тестовые данные…',section='overview'){
 if(section==='overview'){
  const root=node('div',null,'approved-content journal-overview-loading');root.setAttribute('role','status');root.setAttribute('aria-label',label);
  const visual=node('div',null,'approved-content');visual.setAttribute('aria-hidden','true');
  const bar=(extra='')=>node('span',null,'skeleton '+extra);
  const lines=(count,variant='')=>{const group=node('div',null,'journal-loading-lines '+variant);for(let i=0;i<count;i++)group.append(bar());return group;};
  const cards=node('div',null,'approved-grid3');
  for(let i=0;i<3;i++){const card=node('section',null,'panel journal-loading-card');card.append(lines(1,'journal-loading-heading'),lines(2));cards.append(card);}
  const outcomes=node('div',null,'approved-grid2');for(let i=0;i<2;i++){const panel=node('section',null,'panel journal-loading-card');panel.append(lines(1,'journal-loading-heading'),lines(1));outcomes.append(panel);}
  visual.append(cards,outcomes);root.append(visual);return root;
 }
 const root=node('div',null,'loading');root.setAttribute('role','status');root.setAttribute('aria-label',label);for(let i=0;i<3;i++){const bar=node('div',null,'skeleton');bar.setAttribute('aria-hidden','true');root.append(bar);}return root;
}

 function bootstrap(){
  const root=document.body;root.dataset.theme=document.documentElement.dataset.theme;
  const url=new URL(location.href),titles={overview:'Обзор',hypotheses:'Гипотезы',scenarios:'Сценарии',sessions:'Прохождения'},section=url.searchParams.has('run')?'sessions':Object.hasOwn(titles,url.hash.slice(1))?url.hash.slice(1):'overview';
  document.getElementById('page-title').textContent=titles[section];
  document.getElementById('screen').replaceChildren(create('Обновление данных…',section));
 }
 window.journalLoading={create,bootstrap,readSavedTheme};
 if(document.currentScript?.hasAttribute('data-journal-bootstrap'))document.documentElement.dataset.theme=preferredTheme();
})();
