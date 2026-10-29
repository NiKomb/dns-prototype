import {gravityMarkup} from './icons/gravity.js';
import {choiceCategoryNames,articleSelectionValue} from './article-choice.js';
import {attemptStatuses,attemptStateCaption} from './attempt-state.js';
import {participationLabels,participationIdleMs} from '../telemetry/participation.js';
import {journalText,journalTextWithoutPeriods} from './text.js';
// Independent journal library. No prototype UI imports or respondent state.
export function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text != null) {
    for(const part of journalText(text).split(/([←→])/)){
      if(part==='←'||part==='→'){const glyph=icon(part==='←'?'chevron-left':'chevron-right');glyph.classList.add('inline-chevron');element.append(glyph);}
      else element.append(document.createTextNode(part));
    }
  }
  if (className) element.className = className;
  return element;
}
const gravityNames={sun:'journal-sun-fill',moon:'journal-moon-fill','refresh-cw':'arrows-rotate-right',download:'journal-download-fill',search:'magnifier','circle-alert':'circle-exclamation-fill',info:'circle-info',x:'xmark','circuit-board':'cpus','plug-zap':'thunderbolt-fill','pc-case':'server'};
export function icon(name) {
  if(name.startsWith('chevron-')){
    const element=node('span','\ue259','journal-icon dns-icon '+name);element.setAttribute('aria-hidden','true');return element;
  }
  const sourceName=gravityNames[name]||name,markup=gravityMarkup[sourceName];if(!markup)throw new Error('Unknown journal icon: '+name);
  const svg=new DOMParser().parseFromString(markup,'image/svg+xml').documentElement;
  const element=document.importNode(svg,true);element.classList.add('journal-icon','gravity-icon');element.dataset.icon=sourceName;
  element.setAttribute('aria-hidden','true');element.setAttribute('focusable','false');return element;
}
export function button(label, action, variant = 'secondary', control = 'action') {
  const direction=label.includes('←')?'chevron-left':label.includes('→')?'chevron-right':null;
  const element=node('button',label.replace(/[←→]/g,'').trim(),`button ${variant}`);
  element.dataset.journalControl=control;
  if(direction){element.classList.add('has-icon');element.append(icon(direction));}
  element.type='button';element.addEventListener('click',action);return element;
}
export function detailsButton(action) {
  const element=button('Подробнее →',action);element.classList.add('journal-details-button');return element;
}
export function iconButton(label,name,action) {
  const element=button('',action);element.classList.add('icon-button');element.append(icon(name));
  element.setAttribute('aria-label',label);element.title=label;return element;
}
export function chevronButton(label,name,action,variant='secondary') {
  const element=button(label,action,variant);if(label)element.classList.add('has-icon');element.append(icon(name));return element;
}
export function breadcrumbs(items) {
  const root=node('nav',null,'breadcrumbs');root.setAttribute('aria-label','Хлебные крошки');
  const list=node('ol');for(const [index,item]of items.entries()){
    const li=node('li');const entry=node(item.href?'a':'span',item.label);
    if(item.href)entry.href=item.href;else if(index===items.length-1)entry.setAttribute('aria-current','page');
    li.append(entry);list.append(li);
  }root.append(list);return root;
}
export function badge(label,tone='neutral') {
 const status={'В процессе':'active','Прервано':'stopped','Ошибка':'error'}[label];
 return node('span',label,`badge tone-${tone}${status?' status-'+status:''}`);
}
export function panel(title,description,action) {
  const root = node('section',null,'panel');
  const head = node('div',null,'panel-heading');const copy=node('div');
  copy.append(node('h2',title));if(description)copy.append(node('p',description,'muted'));
  if(action?.matches('.button.secondary'))action.classList.add('compact');
  head.append(copy);if(action)head.append(action);root.append(head);return root;
}
export function metric(label,value,caption,tone) {
  const root=node('div',null,'metric');if(!/\d/.test(value))root.classList.add('metric-word');root.append(node('span',label,'muted'),node('strong',value,tone?`text-${tone}`:''),node('span',caption,'metric-caption'));return root;
}
export function progress(label,value,total,caption) {
  const root=node('div',null,'progress-row');const head=node('div',null,'split');head.append(node('span',label),node('strong',Number.isFinite(value)&&Number.isFinite(total)?`${value} / ${total}`:'—'));
  const track=node('div',null,'progress-track');track.setAttribute('role','progressbar');track.setAttribute('aria-label',label);track.setAttribute('aria-valuemin','0');if(Number.isFinite(total)&&total>0&&Number.isFinite(value)){track.setAttribute('aria-valuemax',String(total));track.setAttribute('aria-valuenow',String(value));}else track.setAttribute('aria-valuetext','Нет измеренных данных');const fill=node('span');fill.style.width=`${total?value/total*100:0}%`;track.append(fill);root.append(head,track);if(caption)root.append(node('p',caption,'muted'));return root;
}
export function notice(title,description,tone='neutral') {
  const root=node('div',null,`notice tone-${tone}`);root.append(node('strong',title),node('p',description));return root;
}
export function empty(title,description,action,kind='empty') {
  const root=node('div',null,'empty-state');const glyph=node('div',null,'empty-symbol');glyph.append(icon(kind==='error'?'circle-alert':'search'));root.append(glyph,node('h3',title),node('p',description,'muted'));if(action)root.append(action);return root;
}
let fieldSerial=0;
export function field(label,options,onChange) {
 const root=node('div',null,'field');const id='journal-field-'+(++fieldSerial);
 const caption=node('span',label);caption.id=id;root.append(caption);
 const dropdown=node('details',null,'dropdown');const trigger=node('summary',null,'dropdown-trigger');
 const valueLabel=node('span');trigger.append(valueLabel,icon('chevron-down'));trigger.setAttribute('aria-labelledby',id+' '+id+'-value');valueLabel.id=id+'-value';
 const list=node('div',null,'dropdown-options');list.setAttribute('role','listbox');list.setAttribute('aria-labelledby',id);
 function setValue(value){root.value=value;const selectedOption=options.find(o=>o[0]===value);valueLabel.textContent=journalText(selectedOption?.[1]||'Выбрать');if(selectedOption?.[2]){trigger.title=selectedOption[2];trigger.setAttribute('aria-description',selectedOption[2]);}else{trigger.removeAttribute('title');trigger.removeAttribute('aria-description');}
  for(const option of list.querySelectorAll('[role="option"]')){const selected=option.dataset.value===value;option.setAttribute('aria-selected',String(selected));option.querySelector('.option-check').toggleAttribute('hidden',!selected);}
 }
 for(const [value,text,description]of options){
  const option=button(text,()=>{setValue(value);dropdown.open=false;trigger.focus();onChange(value);},'dropdown-option','option');
  if(description)option.title=description;option.dataset.value=value;option.setAttribute('role','option');const check=icon('check');check.classList.add('option-check');option.append(check);list.append(option);
 }
 dropdown.append(trigger,list);root.append(dropdown);root.setValue=setValue;setValue(options[0][0]);
 dropdown.addEventListener('keydown',event=>{
  const choices=[...list.querySelectorAll('[role="option"]')].filter(option=>!option.closest('.disclosure')||option.closest('.disclosure').open),index=choices.indexOf(document.activeElement);
  if(event.key==='Escape'){event.preventDefault();dropdown.open=false;trigger.focus();}
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){
   event.preventDefault();dropdown.open=true;choices[(index+(event.key==='ArrowDown'?1:-1)+choices.length)%choices.length].focus();
  }
 });return root;
}
// Shared across screens and standalone specimens; detached menus are never retained.
document.addEventListener('click',event=>{
 for(const dropdown of document.querySelectorAll('.journal-ui .dropdown[open]'))if(!dropdown.contains(event.target))dropdown.open=false;
});
// Same single selection and values as a flat field, with expandable outcome groups.
export function nestedField(label,options,onChange){
 const root=field(label,options,onChange),list=root.querySelector('.dropdown-options');
 const nestedValues=new Set(['incomplete','partial','ready','active','stopped']);
 const choices=node('div',null,'nested-status-options');
 for(const option of [...list.children])if(nestedValues.has(option.dataset.value))choices.append(option);
 if(choices.children.length){const group=disclosure('Незавершённые попытки',choices,true);group.classList.add('nested-status-group');list.append(group);}
 root.classList.add('nested-status-field');return root;
}
export function refreshButton(action){
 const control=iconButton('Обновить','refresh-cw',async()=>{
  if(control.disabled)return;control.disabled=true;control.setAttribute('aria-busy','true');
  try{await action();}finally{control.disabled=false;control.removeAttribute('aria-busy');}
 });return control;
}
// Keep service messages outside the page flow, with an accessible announcement.
export function systemStatus(message){
 const root=node('div',null,'journal-system-status'),announce=node('span',null,'visually-hidden');
 const control=iconButton('Состояние журнала','refresh-cw',()=>show(true));
 control.setAttribute('aria-controls',message.id);control.setAttribute('aria-expanded','false');
 message.classList.add('journal-system-message');message.setAttribute('aria-live','off');
 root.append(control,message,announce);
 function show(open){message.hidden=!open;control.setAttribute('aria-expanded',String(open));}
 function sync(){
  const text=message.textContent.trim(),error=message.getAttribute('role')==='alert';
  root.hidden=!text;root.dataset.tone=error?'error':'neutral';
  announce.setAttribute('role',error?'alert':'status');announce.setAttribute('aria-live',error?'assertive':'polite');
  if(announce.textContent!==text)announce.textContent=text;
  control.setAttribute('aria-label',text?'Состояние журнала: '+text:'Состояние журнала');control.removeAttribute('title');
  control.setAttribute('aria-busy',String(!!text&&!error&&message.dataset.busy!=='false'));
  if(!text)show(false);
 }
 root.addEventListener('pointerenter',()=>show(true));
 root.addEventListener('focusin',()=>show(true));
 root.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();control.focus();show(false);}});
 document.addEventListener('pointerdown',e=>{if(!root.contains(e.target))show(false);});
 new MutationObserver(sync).observe(message,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['role','data-busy']});
 show(false);sync();return root;
}
export function materialTable(headers,rows){
 const wrapper=table(headers,rows);wrapper.classList.add('material-table');
 for(const cell of wrapper.querySelectorAll('tbody td:first-child>span')){cell.classList.add('material-title');cell.title=cell.textContent;}
 return wrapper;
}
export function scrollRows(items,limit,label){
 const list=node('div',null,'scroll-rows-list');list.append(...items);
 if(items.length<=limit)return list;
 const viewport=node('div',null,'scroll-rows');viewport.tabIndex=0;viewport.setAttribute('role','region');viewport.setAttribute('aria-label',label);viewport.dataset.limit=String(limit);viewport.append(list);return viewport;
}
export function nestedList(groups) {
 const root=node('div',null,'nested-list');
 for(const group of groups){const choices=node('div',null,'nested-options');
  for(const name of group.items){const label=node('label',null,'nested-option');const input=node('input');input.type='checkbox';const visual=node('span',null,'checkbox-visual');visual.append(icon('check'));label.append(input,visual,node('span',name));choices.append(label);}
  root.append(disclosure(group.label,choices,!!group.open));
 }return root;
}
export function table(headers,rows) {
  const wrapper=node('div',null,'table-scroll');const table=node('table');const head=node('thead'),tr=node('tr');
  for(const name of headers){const th=node('th',name instanceof Node?null:name);if(name instanceof Node)th.append(name);th.scope='col';tr.append(th);}head.append(tr);const body=node('tbody');
  for(const cells of rows){const row=node('tr');for(const content of cells){const td=node('td');td.append(content instanceof Node?content:node('span',String(content)));if(content instanceof Element&&content.matches('button[data-session-ids]:not(:disabled)')){td.classList.add('journal-group-cell');td.addEventListener('click',event=>{if(!content.contains(event.target))content.click();});}row.append(td);}body.append(row);}
  table.append(head,body);wrapper.append(table);return wrapper;
}
export function buildTable(rows){
 const names={'Процессор':'cpu','Материнская плата':'circuit-board','Видеокарта':'gpu','Блок питания':'plug-zap','Корпус':'pc-case'};
 const wrapper=table(['Категория','Модель','Цена'],rows.map(([category,name,price])=>{const label=node('span',null,'build-category');label.append(icon(names[category]||'pc-case'),node('strong',category));return [label,name,price];}));
 wrapper.querySelector('table').classList.add('build-table');wrapper.querySelector('thead').classList.add('visually-hidden');return wrapper;
}
let rowLimitSerial=0;
export function limitedRows(wrapper,limit,label){
 const rows=[...wrapper.querySelectorAll('tbody tr')];if(rows.length<=limit)return wrapper;
 const root=node('div',null,'row-limit');wrapper.id='journal-rows-'+(++rowLimitSerial);let expanded=false;
 const toggle=button(label,()=>{expanded=!expanded;update();});toggle.classList.add('expand-rows');toggle.setAttribute('aria-controls',wrapper.id);
 function update(){rows.forEach((row,index)=>row.hidden=!expanded&&index>=limit);toggle.textContent=journalText(expanded?'Свернуть':label);toggle.setAttribute('aria-expanded',String(expanded));}
 root.append(wrapper,toggle);update();return root;
}
export function metadataTags(labels,onSelect,current=0){
 const root=node('div',null,'toolbar');root.setAttribute('role','group');root.setAttribute('aria-label','Наблюдения по гипотезам');
 labels.forEach((label,index)=>{const tag=button(label,()=>{for(const [i,item]of [...root.children].entries())item.setAttribute('aria-pressed',String(i===index));onSelect(index);},'meta-tag','filter');tag.setAttribute('aria-pressed',String(index===current));root.append(tag);});return root;
}
export function tabs(items,current,onChange,label='Представление',{animated=false}={}) {
  const root=node('div',null,'segments');root.setAttribute('role','group');root.setAttribute('aria-label',label);
  const colors=element=>{const style=getComputedStyle(element);return {backgroundColor:style.backgroundColor,color:style.color,boxShadow:style.boxShadow};};
  function select(id){
    if(!animated){onChange(id);return;}
    const scope=root.closest('.journal-ui')||root.getRootNode();
    const groups=()=>[...scope.querySelectorAll('.segments')].filter(group=>group.getAttribute('aria-label')===label);
    const index=groups().indexOf(root),previous=[...root.children].map(colors),focused=root.contains(document.activeElement);
    onChange(id);
    // Views rebuild their content synchronously; continue the transition on the replacement tabs.
    const next=root.isConnected?root:groups()[index];
    if(!next)return;
    if(focused&&!next.contains(document.activeElement))next.children[items.findIndex(item=>item[0]===id)]?.focus({preventScroll:true});
    [...next.children].forEach((tab,i)=>{
      const from=previous[i],to=colors(tab);
      if(!from||Object.keys(to).every(key=>from[key]===to[key]))return;
      tab.getAnimations().forEach(animation=>animation.cancel());
      // Explicitly retained under prefers-reduced-motion at the owner's request.
      tab.animate([from,to],{duration:220,easing:'ease'});
    });
  }
  for(const [id,name]of items){const b=button(name,()=>select(id),'secondary','tab');b.classList.toggle('active',id===current);b.setAttribute('aria-pressed',String(id===current));root.append(b);}return root;
}
export function disclosure(title,contents,open=false) {
  const root=node('details',null,'disclosure');root.open=open;const trigger=node('summary',null,'disclosure-trigger');trigger.append(node('span',title),icon('chevron-down'));root.append(trigger);const body=node('div',null,'disclosure-body');body.append(contents);root.append(body);return root;
}
export function timeline(items) {
  const root=node('ol',null,'timeline');for(const [time,title,description]of items){const li=node('li');li.append(node('time',time),node('strong',title),node('p',description,'muted'));root.append(li);}return root;
}

// Navigation and its specimens share the original filled Gravity UI SVGs.
export function navigationItem(section,label) {
 const item=node('a',null,'journal-nav-item');item.href='#'+section;item.dataset.section=section;
 const glyph=icon({overview:'journal-square-list-ul-fill',hypotheses:'sparkles-fill',scenarios:'geo-fill',sessions:'person-fill'}[section]);glyph.classList.add('nav-icon');
 item.append(glyph,node('span',label));return item;
}


let tooltipSerial=0;
// One delegated lifecycle for current tooltip instances, including rerendered tables.
function dismissTooltips(except){for(const root of document.querySelectorAll('.journal-ui .journal-tooltip'))if(root!==except)root.closeTooltip();}
document.addEventListener('click',event=>{for(const root of document.querySelectorAll('.journal-ui .journal-tooltip'))if(!root.contains(event.target))root.closeTooltip();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')dismissTooltips();});
function positionTooltips(){for(const root of document.querySelectorAll('.journal-ui .journal-tooltip'))root.positionTooltip();}
window.addEventListener('resize',positionTooltips);
window.addEventListener('scroll',positionTooltips,true);
export function infoTooltip(label,text,{clickOnly=false,trigger=null,hoverDelay=0}={}){
 const root=trigger||node('span'),tip=node('span',null,'journal-tooltip-content');root.classList.add('journal-tooltip');
 if(typeof text==='string')tip.textContent=journalTextWithoutPeriods(text);else{
  tip.append(text);const contents=document.createTreeWalker(tip,NodeFilter.SHOW_TEXT);let part;
  while(part=contents.nextNode())part.data=journalTextWithoutPeriods(part.data);
 }
 tip.id='journal-tooltip-'+(++tooltipSerial);tip.setAttribute('role','tooltip');tip.hidden=true;
 let pinned=false,activated=false,hoverTimer=null;
 const control=trigger||iconButton(label,'info',()=>{pinned=!pinned;if(pinned)show();else close();});control.removeAttribute('title');control.setAttribute('aria-describedby',tip.id);if(!trigger)control.setAttribute('aria-expanded','false');
 function close(){clearTimeout(hoverTimer);hoverTimer=null;pinned=false;tip.hidden=true;if(!trigger)control.setAttribute('aria-expanded','false');}
 function show(){clearTimeout(hoverTimer);hoverTimer=null;dismissTooltips(root);tip.hidden=false;if(!trigger)control.setAttribute('aria-expanded','true');position();}
 function position(){if(tip.hidden)return;const box=control.getBoundingClientRect();tip.style.left='8px';const width=tip.getBoundingClientRect().width;tip.style.left=Math.max(8,Math.min(box.left,innerWidth-width-8))+'px';const height=tip.getBoundingClientRect().height;tip.style.top=(box.bottom+height+8<=innerHeight?box.bottom+8:Math.max(8,box.top-height-8))+'px';}
 root.closeTooltip=close;root.positionTooltip=position;
 root.addEventListener('pointerenter',event=>{
  if(!clickOnly&&event.pointerType!=='touch'){
   activated=false;
   if(hoverDelay>0){clearTimeout(hoverTimer);hoverTimer=setTimeout(()=>{hoverTimer=null;if(root.isConnected)show();},hoverDelay);}else show();
  }
 });
 root.addEventListener('pointerleave',()=>{if(!pinned)close();});
 if(!clickOnly)control.addEventListener('focus',()=>{if(!trigger||!activated)show();});
 root.addEventListener('focusout',event=>{if(!root.contains(event.relatedTarget)){if(event.relatedTarget)activated=false;if(!pinned)close();}});
 // Returning from a newly opened tab can restore focus to its link; keep the dismissed tooltip closed.
 if(trigger){control.addEventListener('click',()=>{activated=true;close();});root.append(tip);}else root.append(control,tip);return root;
}
export const articleMedianExplanation='Медиана суммарного видимого времени статьи за сессию. Повторные посещения складываются. QA и сессии без замера исключены';
export function articleMedianHeader(){const root=node('span',null,'table-heading-info');root.append(node('span','Медиана времени'),infoTooltip('Как считается медиана времени',articleMedianExplanation));return root;}
export function articleMedianCell(value){
 const root=node('span',null,'article-median-cell'),count=value?.samples||0,time=value?.median_ms;
 const measured=count>0&&Number.isFinite(time);
 const caption=measured?`${count} ${count%100>=11&&count%100<=14?'сессий':count%10===1?'сессия':count%10>=2&&count%10<=4?'сессии':'сессий'} с замером`:'Нет замеров';
 root.append(node('span',measured?`${Math.floor(time/60000)}:${String(Math.floor(time/1000)%60).padStart(2,'0')}`:'—'),node('span',caption,'muted article-median-caption'));return root;
}

export const articleChoiceExplanation='Время от открытия статьи до выбора детали той же категории после возврата. Повторные статьи не запускают отсчёт заново, паузы учитываются. Если выборов несколько, показываем медиану';
export const articleChoiceMedianExplanation='Медиана значений исследовательских сессий текущего сценария. Значение сессии — медиана завершённых цепочек от статьи до выбора. Незавершённые попытки учитываются. QA и сессии без измеренных цепочек исключены. Показано число сессий расчёта';
export function articleChoiceHeader(){const root=node('span',null,'table-heading-info');root.append(node('span','От статьи до выбора'),infoTooltip('Как считается время от статьи до выбора',articleChoiceExplanation));return root;}
export function metricWithInfo(title,value,caption,label,explanation){
 const root=metric('',value,caption);root.firstChild.classList.add('table-heading-info','metric-heading');
 root.firstChild.append(node('span',title),infoTooltip(label,explanation));return root;
}
export function articleChoiceMetric(value,caption){return metricWithInfo('Медиана времени от статьи до выбора',value,caption,'Как считается медиана от статьи до выбора',articleChoiceMedianExplanation);}

export const articleChoiceStates={
 no_choice:['Нет выбора','Открытие статьи и возврат в конфигуратор подтверждены, но последующее добавление или замена детали той же категории не зафиксированы'],
 no_return:['Нет возврата','Открытие статьи подтверждено, но возврат из неё в конфигуратор не зафиксирован'],
 insufficient:['Неполные данные','В записи отсутствуют необходимые события или есть пропуски. Достоверно восстановить цепочку от статьи до выбора нельзя'],
 no_articles:['Без статей','История событий полная, подтверждённых открытий статей нет'],
 qa:['QA исключена','Техническая проверка не входит в исследовательский расчёт']
};
const choiceDuration=n=>`${Math.floor(n/60000)}:${String(Math.floor(n/1000)%60).padStart(2,'0')}`;
export function articleChoiceCell(measurement){
 const root=node('div');
 if(!Number.isFinite(measurement?.median_ms)){
  const [label,explanation]=articleChoiceStates[measurement?.status]||articleChoiceStates.insufficient;
  const status=node('span',null,'table-heading-info');
  status.append(node('span',label),infoTooltip('О статусе измерения: '+label,explanation));root.append(status);return root;
 }
 const details=measurement.chains.map(c=>`${choiceCategoryNames[c.category_id]}: ${choiceDuration(c.duration_ms)}`);
 details.push(`Измеренных цепочек: ${measurement.chains.length}`);
 if(measurement.issues.length)details.push('Есть неполные данные');
 if(measurement.pending.some(c=>c.status==='no_choice'))details.push('Есть цепочки без выбора');
 root.append(node('span',choiceDuration(measurement.median_ms)),node('span',details.join(' · '),'cell-secondary'));return root;
}
export function attemptStatusBadge(status){const root=badge(...(attemptStatuses[status]||attemptStatuses.unknown));root.classList.add('attempt-status');return root;}
export function attemptStatusCell(state,participation){
 const key=state?.saving==='saved'?'completed':participation?.participation||'unknown';
 const label=participationLabels[key]||participationLabels.unknown;
 const tag=badge(label,key==='completed'?'success':key==='active'?'accent':'neutral');tag.classList.add('participation-tag');
 if(key==='abandoned')tag.title='Без явного завершения';
 const root=node('div');root.append(tag,node('span',attemptStateCaption(state),'cell-secondary'));
 if(key==='abandoned')root.append(node('span',`${participationIdleMs/60000} минут без действий`,'cell-secondary'));
 if(key==='not_started')root.append(node('span',`После старта действий нет · ${participationIdleMs/60000} минут без действий`,'cell-secondary'));
 return root;
}
export function articleSelectionMetric(summary){
 const explanation=node('span');
 explanation.append('Открытие статьи',icon('chevron-right'),node('span',' › ','visually-hidden'),'возврат в конфигуратор',icon('chevron-right'),node('span',' › ','visually-hidden'),'выбор детали той же категории. В расчёте — сессии с полной записью, включая сессии без выбора. Сессии без открытий статей и с неполными данными исключены');
 return metricWithInfo('Выбрали деталь после статьи',articleSelectionValue(summary),'Исследовательские сессии · QA исключены','Как считается выбор детали после статьи',explanation);
}
export function scenarioMaterialTable(rows){return materialTable(['Материал','Тема','Открытия',articleMedianHeader(),'Выбор после'],rows.map(row=>row.map((value,index)=>index===3?articleMedianCell(value):value)));}

// The journal classifies from persisted action facts; the renderer has no clock.
export function abandonmentMetric(value){return metric('Без явного завершения',value?.count??'—',value?.caption||'Недостаточно данных');}
