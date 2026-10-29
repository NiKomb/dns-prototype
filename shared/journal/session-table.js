import {node,button,icon,iconButton,table} from './components.js';
import {attemptStateCaption} from './attempt-state.js';
import {categoryNames} from '../telemetry/registry.js';

const participation=[['active','В процессе'],['completed','Завершили'],['abandoned','Прекратили участие'],['not_started','Нет действий'],['unknown','Неизвестно']];
const columns=[
 {id:'session',label:'Сессия',groups:[{id:'order',label:'Порядок сессий',single:true,options:[['new','Сначала новые'],['old','Сначала старые']]}]},
 {id:'participation',label:'Участие',groups:[{id:'values',options:participation}]},
 {id:'comparison',label:'Сравнение',groups:[
  {id:'stage',label:'Дошли до этапа',single:true,options:[['any','Любой'],['catalog','Открыли каталог'],['started','Начали сравнение'],['table','Открыли таблицу с 2+ товарами'],['choice','Сделали связанный выбор']]},
  {id:'category',label:'Категория',options:Object.entries(categoryNames)},
  {id:'where',label:'Где выбрали',options:[['inside','В таблице сравнения'],['returned','После возврата в каталог']]},
  {id:'measurement',label:'Измерение',options:[['measured','Пригодное'],['partial','Частичные данные'],['incomplete','Разрыв'],['not_measured','Не измерялось'],['no_catalog','Каталог не открывался']]}
 ]},
 {id:'build',label:'Сборка',groups:[
  {id:'count',label:'Количество деталей',options:[...Array.from({length:6},(_,i)=>[String(i),String(i)]),['unknown','Неизвестно']]},
  {id:'saving',label:'Сохранение',options:[['saved','Сохранено'],['not_saved','Не сохранено'],['unknown','Неизвестно']]},
  {id:'assembled',label:'Хотя бы раз было пять деталей',options:[['yes','Подтверждено'],['no','Не подтверждено'],['unknown','Недостаточно данных']]}
 ]}
];
const defaults=column=>Object.fromEntries(column.groups.map(g=>[g.id,g.single?g.options[0][0]:[]]));
const matches=(values,value)=>!values?.length||values.includes(value);
function comparisonData(s,fact){
 const h=s.h1,c=fact?.comparison;
 return {h,c,categories:[...new Set([h?.first_action?.category_id,h?.table_reached?.category_id,...(c?.tables||[]),...(c?.inside||[]),...(c?.returned||[])].filter(Boolean))]};
}
export function filterSessions(sessions,filters={},facts=[]){
 const byId=new Map(facts.map(f=>[f.id,f]));
 return sessions.filter(s=>{
  if(!matches(filters.participation?.values,s.participation||'unknown'))return false;
  const b=s.attemptState||s.overview?.build,build=filters.build;
  const assembled=s.overview?.stages?.assembled?'yes':s.overview?.sufficient?'no':'unknown';
  if(build&&(!matches(build.count,Number.isInteger(b?.build_count)?String(b.build_count):'unknown')||!matches(build.saving,b?.saving||'unknown')||!matches(build.assembled,assembled)))return false;
  const cmp=filters.comparison,{h,c,categories}=comparisonData(s,byId.get(s.id));
  if(cmp){
   const reached={catalog:h?.eligible===true,started:h?.eligible===true&&h.started===true,table:h?.eligible===true&&h.table_2plus===true,choice:h?.eligible===true&&c?.choice_eligible===true&&c.linked===true};
   if(cmp.stage&&cmp.stage!=='any'&&!reached[cmp.stage])return false;
   if(cmp.category?.length&&!cmp.category.some(id=>categories.includes(id)))return false;
   if(cmp.where?.length&&!cmp.where.some(id=>c?.[id]?.length>0))return false;
   if(!matches(cmp.measurement,h?.status||'not_measured'))return false;
  }
  return true;
 }).sort((a,b)=>{
  const delta=(a.started_at??a.overview?.started_at??0)-(b.started_at??b.overview?.started_at??0);
  return (filters.session?.order==='old'?delta:-delta)||a.id.localeCompare(b.id);
 });
}
function comparisonCaption(s,fact){
 const {h,c}=comparisonData(s,fact);
 const stages=[];
 if(h?.started)stages.push('Начали сравнение');
 if(h?.table_2plus)stages.push('Таблица с 2+ товарами');
 if(c?.inside?.length)stages.push('Выбрали в таблице');
 if(c?.returned?.length)stages.push('Выбрали после возврата');
 if(stages.length)return stages.join(' · ');
 return ({measured:'Не начали сравнение',partial:'Частичные данные',incomplete:'Разрыв измерения',no_catalog:'Каталог не открывался',not_measured:'Не измерялось'})[h?.status]||'Не измерялось';
}
let serial=0;
function columnControl(column,state,rerender){
 const root=node('div',null,'dropdown session-column-filter'),trigger=button(column.label,()=>{},'text','filter');
 trigger.append(icon('chevron-down'));trigger.setAttribute('aria-label','Фильтр: '+column.label);trigger.setAttribute('aria-expanded','false');
 const panel=node('div',null,'dropdown-options session-filter-panel');panel.popover='auto';panel.id='session-filter-'+(++serial);panel.setAttribute('aria-label',column.label);panel.setAttribute('role','dialog');trigger.setAttribute('aria-controls',panel.id);
 const current=()=>state.sessionFilters?.[column.id]||defaults(column);
 const active=JSON.stringify(current())!==JSON.stringify(defaults(column));trigger.classList.toggle('is-filtered',active);
 let draft;
 const close=()=>{panel.hidePopover();trigger.setAttribute('aria-expanded','false');};
 function fill(){
  panel.replaceChildren();
  for(const g of column.groups){
   const fieldset=node('fieldset',null,'session-filter-group');if(g.label)fieldset.append(node('legend',g.label));
   for(const [value,text]of g.options){
    const label=node('label',null,'nested-option'),input=node('input'),visual=node('span',null,'checkbox-visual');
    input.type=g.single?'radio':'checkbox';input.name=panel.id+'-'+g.id;input.value=value;input.checked=g.single?draft[g.id]===value:draft[g.id].includes(value);
    input.addEventListener('change',()=>{draft[g.id]=g.single?value:[...fieldset.querySelectorAll('input:checked')].map(e=>e.value);});
    visual.append(icon('check'));label.append(input,visual,node('span',text));fieldset.append(label);
   }panel.append(fieldset);
  }
  const actions=node('div',null,'session-filter-actions');
  actions.append(iconButton('Применить: '+column.label,'check',()=>{
   state.sessionFilters={...state.sessionFilters,[column.id]:structuredClone(draft)};state.page=1;close();trigger.focus();rerender();
  }),iconButton('Сбросить: '+column.label,'refresh-cw',()=>{draft=defaults(column);fill();panel.querySelector('button:last-child')?.focus();}));panel.append(actions);
 }
 trigger.addEventListener('click',()=>{
  if(panel.matches(':popover-open')){close();return;}
  draft=structuredClone(current());fill();panel.showPopover();
  trigger.setAttribute('aria-expanded','true');
  const rect=trigger.getBoundingClientRect(),width=panel.getBoundingClientRect().width;
  panel.style.left=Math.max(12,Math.min(rect.left,innerWidth-width-12))+'px';
  const below=innerHeight-rect.bottom-16,above=rect.top-16,up=below<200&&above>below;
  panel.style.top=up?'auto':rect.bottom+6+'px';panel.style.bottom=up?innerHeight-rect.top+6+'px':'auto';panel.style.maxHeight=Math.max(100,up?above:below)+'px';
  panel.querySelector('input')?.focus();
 });
 panel.addEventListener('toggle',()=>trigger.setAttribute('aria-expanded',String(panel.matches(':popover-open'))));
 panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close();trigger.focus();}});
 root.append(trigger,panel);return root;
}
export function sessionTable({sessions,facts=[],state,rerender,sessionLink}){
 const root=node('div',null,'session-table'),items=filterSessions(sessions,state.sessionFilters,facts),byId=new Map(facts.map(f=>[f.id,f]));
 const pages=Math.max(1,Math.ceil(items.length/6));state.page=Math.min(state.page||1,pages);
 const rows=items.slice((state.page-1)*6,state.page*6).map(s=>{
  const name=node('div');name.append(sessionLink(s),node('p',s.date,'muted'));
  return [name,participation.find(([id])=>id===s.participation)?.[1]||'Неизвестно',comparisonCaption(s,byId.get(s.id)),attemptStateCaption(s.attemptState||s.overview?.build)];
 });
 const t=table(columns.map(c=>columnControl(c,state,rerender)),rows);t.classList.add('session-table-scroll');root.append(t);
 if(!rows.length){const empty=node('p','Попытки не найдены. Измените фильтры таблицы.','session-table-empty muted');empty.setAttribute('role','status');root.append(empty);}
 const pager=node('nav',null,'approved-pages');pager.setAttribute('aria-label','Страницы прохождений');
 for(let i=1;i<=pages;i++){const b=button(String(i),()=>{state.page=i;rerender();},'secondary','pagination');b.setAttribute('aria-pressed',String(i===state.page));b.setAttribute('aria-label','Страница '+i);pager.append(b);}
 const footer=node('div',null,'approved-pager');footer.append(node('p',`${items.length} сессий · страница ${state.page} из ${pages}`,'muted'),pager);root.append(footer);return root;
}
