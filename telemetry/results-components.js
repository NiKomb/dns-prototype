import {evidenceKindNames} from '../shared/telemetry/registry.js';
import {bodyBlock} from '../shared/article/article-components.js';
export function node(tag, text, className) {
  const result=document.createElement(tag);
  if(text!=null)result.textContent=text;
  if(className)result.className=className;
  return result;
}
export function reportNavigation(){
 const nav=node('nav',null,'club-nav');nav.setAttribute('aria-label','Разделы журнала');nav.dataset.dsComponent='study.reportNavigation';
 for(const [id,label,icon]of [['overview','Обзор','chart-column'],['hypotheses','Гипотезы','flask'],['scenarios','Сценарии','route'],['sessions','Сессии','person']]){
  const a=node('a');a.href='#'+id;a.dataset.section=id;const glyph=node('span',null,'club-icon');glyph.setAttribute('aria-hidden','true');glyph.style.setProperty('--icon',`url("/assets/shared/report-icons/${icon}.svg")`);a.append(glyph,node('span',label));nav.append(a);
 }const prototype=node('a','Открыть прототип ↗','club-shop');prototype.href='/?preview=1';prototype.target='_blank';prototype.rel='noopener';nav.append(prototype);return nav;
}
// The scenario selector uses the catalog filter group and option renderers.
export function scenarioFilter(items,value,onChange){
 const root=node('section',null,'report-field report-task-filter');root.dataset.dsComponent='study.scenarioFilter';root.append(node('h2','Сценарий'));
 const group=catalogUI.controlElement('filter-section',{class:'catalog-facet is-collapsed'}),heading=node('h3'),selected=items.find(item=>item.id===value);
 const trigger=catalogUI.controlElement('filter-heading',{type:'button','aria-expanded':'false'},{text:selected?.label||'Выбрать сценарий'});
 const options=catalogUI.controlElement('catalog-options');options.id='report-scenarios-'+(++chartSerial);options.setAttribute('role','radiogroup');options.setAttribute('aria-label','Сценарий');trigger.setAttribute('aria-controls',options.id);
 trigger.onclick=()=>{const expanded=trigger.getAttribute('aria-expanded')!=='true';trigger.setAttribute('aria-expanded',String(expanded));group.classList.toggle('is-collapsed',!expanded);};
 for(const item of items){const option=catalogUI.controlElement('filter-option',{}, {input:{type:'radio',name:options.id,value:item.id},text:item.label,wrapped:true}),input=option.querySelector('input');input.checked=item.id===value;input.onchange=()=>{if(input.checked)onChange(item.id);};options.append(option);}
 heading.append(trigger);group.append(heading,options);const filters=node('div',null,'filter-panel');filters.append(group);root.append(filters);return root;
}
export function routeTimeline(stages,{median=false}={}){
 const list=node('ol',null,'report-route');list.dataset.dsComponent='study.routeTimeline';
 const ms=n=>Number.isFinite(n)?n.toLocaleString('ru-RU',{maximumFractionDigits:1})+' мс':'—';
 for(const stage of stages){const item=node('li',stage.label);item.append(node('small',`${median?'Медиана от старта':'От старта'}: ${ms(stage.elapsed_ms)} · ${stage.duration_ms==null?'Следующий этап не записан':(median?'Медиана этапа':'До следующего')+': '+ms(stage.duration_ms)}`,'report-secondary'));list.append(item);}
 return list;
}
// Same renderer and row styling as the heat-output article. Only service links
// are inserted after rendering: editorial table data remains plain text.
export function reportTable(head, rows, label) {
  const values=[head,...rows];
  const wrap=bodyBlock({type:'table',variant:'processor-power',id:'',label,
    rows:values.map(row=>row.map(value=>value instanceof Node?'':value??'—'))});
  [...wrap.querySelectorAll('tr')].forEach((row,i)=>values[i].forEach((value,j)=>{
    if(value instanceof Node)row.cells[j].replaceChildren(value);
  }));
  return wrap;
}
export function passageRows(wrap) {
  for(const row of wrap.querySelectorAll('tr')){
    const link=row.querySelector('a.report-open');if(!link)continue;
    row.classList.add('report-session-row');
    row.addEventListener('click',event=>{if(event.target.closest('a,button,input,select')||String(getSelection()))return;if(event.ctrlKey||event.metaKey)window.open(link.href,'_blank','noopener');else link.click();});
  }
  return wrap;
}
export function collectionToggle(){
 const button=node('button',null,'report-toggle');button.type='button';button.setAttribute('role','switch');button.setAttribute('aria-checked','false');button.dataset.dsComponent='study.collectionToggle';
 const label=node('span','Начать сбор'),track=node('span',null,'summary-switch');track.setAttribute('aria-hidden','true');button.append(track,label);return button;
}
export function testAttemptURL(){return new URL('/?new_attempt=1',location.origin).href;}
export function testLinkControl(){
 const root=node('div');root.dataset.dsComponent='study.testLink';
 const input=node('input');input.id='test-link';input.readOnly=true;input.setAttribute('aria-label','Ссылка для теста');
 const feedback=node('p','','report-muted');feedback.setAttribute('role','status');
 const open=node('a','Открыть ↗','report-link');open.target='_blank';open.rel='noopener';
 const update=()=>{input.value=testAttemptURL();open.href=input.value;};
 const refresh=catalogUI.component('replace');refresh.setAttribute('aria-label','Обновить ссылку');refresh.title='Обновить ссылку';refresh.removeAttribute('aria-haspopup');refresh.removeAttribute('aria-controls');
 refresh.onclick=()=>{update();feedback.textContent='Ссылка обновлена';};
 const copy=node('button','Скопировать','report-primary');copy.type='button';
 copy.onclick=async()=>{
  input.focus();input.select();let ok=false;
  try{if(navigator.clipboard){await navigator.clipboard.writeText(input.value);ok=true;}}catch{}
  if(!ok){try{ok=document.execCommand('copy');}catch{}}
  feedback.textContent=ok?'Ссылка скопирована':'Ссылка выделена — скопируйте её вручную.';
 };
 const refreshHost=node('div',null,'report-heading-actions selected-controls');refreshHost.append(refresh);
 const actions=node('div',null,'product-buttons');actions.append(copy);
 const group=node('div',null,'report-test-link');group.append(input,refreshHost,actions,open);root.append(group,feedback);update();return root;
}
let chartSerial=0;
export function researchBars(title,items,total,unit='прохождений'){
 const panel=node('section',null,'ds-panel report-chart');panel.dataset.dsComponent='study.researchBars';panel.append(node('h3',title));
 if(!items.length){panel.append(node('p','Пока недостаточно данных.','report-muted'));return panel;}
 const list=node('ol',null,'report-bars');
 for(const item of items){const row=node('li'),label=node('div',null,'report-bar-label'),percent=total?Math.round(item.count/total*100):0;label.append(node('span',item.label),node('strong',`${item.count} · ${percent}%`));
 const bar=node('div',null,'progress');bar.setAttribute('role','progressbar');bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax',String(Math.max(1,total)));bar.setAttribute('aria-valuenow',String(item.count));const fill=node('span',null,'progress-fill');fill.style.width=Math.min(100,percent)+'%';bar.append(fill);bar.setAttribute('aria-label',`${item.label}: ${item.count} ${unit}, ${percent}%`);row.append(label,bar);if(item.sessions!=null)row.append(node('small',`Прохождений: ${item.sessions}`,'report-muted'));list.append(row);}
 panel.append(list);
 if(items.length>5){
  const extra=[...list.children].slice(5);for(const item of extra)item.hidden=true;
  const controls=node('div',null,'product-buttons'),button=node('button',null,'report-expand'),label=node('span'),arrow=node('span',null,'filter-arrow');button.type='button';arrow.setAttribute('aria-hidden','true');list.id='report-bars-'+(++chartSerial);button.setAttribute('aria-controls',list.id);
  const update=expanded=>{for(const item of extra)item.hidden=!expanded;button.setAttribute('aria-expanded',String(expanded));label.textContent=expanded?'Свернуть':`Развернуть все (${items.length})`;};button.onclick=()=>update(button.getAttribute('aria-expanded')!=='true');button.append(label,arrow);update(false);controls.append(button);panel.append(controls);
 }
 return panel;
}

// Factoid typography and surface are the configurator build summary, not a new card style.
export function factoid(value,label,note){
 const card=node('section',null,'build-summary'),main=node('div',null,'summary-main'),total=node('div',null,'summary-total'),text=node('div');
 text.append(node('strong',String(value)),node('small',label));total.append(text,node('span'));main.append(total);if(note)main.append(node('p',note,'ds-note report-kpi-note'));card.append(main);return card;
}

// Shared dashboard/DS popup. Native dialog provides inert background and focus trapping.
export function reportPopup(title, children, {specimen=false,theme}={}){
 const dialog=node('dialog',null,'report-popup');dialog.dataset.dsComponent='study.reportPopup';
 if(theme){dialog.classList.add('report-page');window.dnsReportTheme.apply(dialog,theme);}
 const heading=node('div',null,'report-heading'),h=node('h2',title);h.id='report-popup-'+(++chartSerial);
 dialog.setAttribute('aria-labelledby',h.id);
 const close=node('button',null,'processor-modal-close');close.type='button';close.setAttribute('aria-label','Закрыть');close.onclick=()=>dialog.close();heading.append(h,close);dialog.append(heading,...children);
 if(specimen){dialog.setAttribute('open','');dialog.style.position='relative';dialog.style.inset='auto';dialog.style.margin='0';return dialog;}
 const focused=document.activeElement;
 dialog.addEventListener('close',()=>{dialog.remove();if(focused?.isConnected)focused.focus();});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
 document.body.append(dialog);dialog.showModal();return dialog;
}

export function reportThemeToggle(scope=document.documentElement,{persist=true}={}) {
 const button=node('button',null,'report-theme-toggle');button.type='button';button.dataset.dsComponent='study.reportTheme';
 const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('aria-hidden','true');button.append(icon);
 function update(){
  const dark=scope.dataset.reportTheme==='dark',label=dark?'Включить светлую тему':'Включить тёмную тему';
  button.setAttribute('aria-label',label);button.title=label;button.setAttribute('aria-pressed',String(dark));
  // Simple service-only glyphs; the icon depicts the next available theme.
  icon.innerHTML=dark?'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>':'<path d="M19 15.5A8 8 0 0 1 8.5 5a8 8 0 1 0 10.5 10.5Z"/>';
 }
 button.onclick=()=>{window.dnsReportTheme.apply(scope,scope.dataset.reportTheme==='dark'?'light':'dark',persist);update();};
 window.addEventListener('report-theme-change',event=>{if(event.detail.scope===scope)update();});update();return button;
}

export function reportAttemptPage(title,children,onBack){
 const root=node('section',null,'report-attempt-detail');root.dataset.dsComponent='study.attemptPage';root.tabIndex=-1;
 const head=node('div',null,'report-heading'),back=node('button',null,'processor-modal-close report-attempt-close');back.type='button';back.setAttribute('aria-label','К списку сессий');back.title='К списку сессий';back.onclick=onBack;
 head.append(node('h2',title),back);root.append(head,...children);return root;
}

export const coverageLabels={from_start:'С начала',partial:'Частично',not_measured:'Не измерялось'};
export const h3Labels={not_measured:'Не измерялось',no_recommendations:'Рекомендаций не было',no_opening:'Открытие не зарегистрировано',opening_without_arrival:'Клик без подтверждённого перехода',arrival_without_return:'Возврат не зарегистрирован',return_without_choice:'Выбор после возврата не зарегистрирован',choice_after_return:'Выбор после возврата'};
const ratio=(n,d)=>d?`${n} из ${d}`:'—';
const reportNote=text=>node('p',text,'report-muted');
const reportSection=(title,tag)=>{const p=node('section',null,'ds-panel report-hypothesis');const head=node('div',null,'report-row report-hypothesis-heading');head.append(node('h3',title));if(tag)head.append(node('span',tag,'report-tag'));p.append(head);return p;};
const disclosure=(label,text)=>{const details=node('details',null,'report-accordion');details.append(node('summary',label),reportNote(text));return details;};
export {researchStats} from '../shared/journal/metrics.js';
export function coverageNote(r){
 const n=node('div',null,'report-measurement');n.dataset.dsComponent='study.researchCoverage';
 const counts=node('div',null,'report-coverage');
 for(const [label,value]of [['С начала',r?.from_start],['Частично',r?.partial],['Не измерялось',r?.not_measured],['С разрывом',r?.incomplete],['QA исключены',r?.excluded_qa]])counts.append(node('span',`${label}: ${value??'—'}`));
 n.append(counts,reportNote('Самостоятельные попытки. Наблюдаем действия, не понимание, личную релевантность или помощь материала.'));
 return n;
}
export function hypothesisCards(r,onOpen){
 const grid=node('div',null,'report-hypothesis-cards');grid.dataset.dsComponent='study.hypothesisCards';
 const h2=r?.H2,h3=r?.H3;
 for(const [title,value,note]of [['H1 · Сравнение','Недоступно','Функция ещё не реализована'],['H2 · Данные',ratio(h2?.action||0,h2?.available||0),h2?.available?'Действие с доступным блоком':'Нет измеренных данных'],['H3 · Клуб',ratio(h3?.choice_after_return||0,h3?.returned||0),h3?.returned?'Выбор после возврата из статьи':'Нет измеренных возвратов']]){
  const card=node('button',null,'ds-panel report-card-link');card.type='button';card.append(node('h3',title),node('strong',value,'report-hypothesis-value'),reportNote(note));card.onclick=onOpen;grid.append(card);
 }return grid;
}
export function hypothesisPanels(r,onSessions){
 const root=node('div',null,'report-hypothesis-panels');root.dataset.dsComponent='study.hypothesisPanels';
 const h1=reportSection('H1 · Найти сравнение','НЕДОСТУПНО');h1.append(reportNote('Вход в сравнение и сопоставление товаров ещё не реализованы.'),reportNote('Подключить измерение после появления функции. Отсутствие сравнения не считается неуспехом попытки.'));
 const h2=reportSection('H2 · Проверяемые данные','ВНУТРИ СТАТЕЙ'),a=r?.H2||{};
 h2.append(reportNote('Практические результаты и условия теста в структурированных обзорах.'));
 const metrics=node('div',null,'report-evidence-metrics');
 for(const [value,label,note]of [[a.available||'—','С доступным блоком',a.available?'Результаты или условия теста':'Нет измеренных данных'],[ratio(a.action||0,a.available||0),'С действием по блоку','Раскрытие, изображение, таблица, содержание'],[ratio(a.choice_after_action||0,a.action||0),'С последующим выбором',`Та же категория: ${a.action?(a.choice_same_category||0):'—'}`]]){const m=node('div');m.append(node('strong',String(value)),node('span',label),node('small',note,'report-secondary'));metrics.append(m);}h2.append(metrics,reportNote('Видимость блоков не измеряется. Последующий выбор связан по порядку событий, без утверждения о причине.'),disclosure('Ограничения и зависимости','Рядом с товаром нет отдельного блока практических данных. Внешние ссылки на источники отключены. В статических GPU-обзорах отдельные действия с результатами и условиями недоступны.'));
 const h3=reportSection('H3 · Материалы Клуба','СВЯЗАННЫЙ ПУТЬ'),b=r?.H3||{},total=b.evaluated||0;
 h3.append(reportNote(total?`Выдача измерялась в ${total} попытках. На каждом шаге считаются попытки хотя бы с одним наблюдением.`:'Нет измеренных данных о выдаче материалов. Старые записи не заменяются нулями.'));
 const list=node('ol',null,'report-research-funnel');let previous=total;
 for(const [key,label]of [['offered','Предложены материалы'],['opened','Клик по статье'],['arrived','Переход в статью подтверждён'],['returned','Возврат в сборку подтверждён'],['choice_after_return','Выбор после возврата']]){
  const count=b[key]||0,item=node('li'),line=node('div',null,'report-bar-label');line.append(node('span',label),node('strong',ratio(count,previous)));
  const track=node('div',null,'progress'),fill=node('span',null,'progress-fill');fill.style.width=(total?count/total*100:0)+'%';track.append(fill);
  track.setAttribute('role','progressbar');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax',String(Math.max(1,total)));track.setAttribute('aria-valuenow',String(count));track.setAttribute('aria-label',`${label}: ${total?count+' из '+total+' измеренных попыток':'нет измеренных данных'}`);item.append(line,track);list.append(item);previous=count;
 }h3.append(list,reportNote('Длина полос — число попыток с измеренной выдачей; подписи — относительно предыдущего шага.'));
 const visibility=node('div',null,'report-observation');visibility.append(node('h3','Видимость карточки · отдельно'),node('p',b.offered?`${b.visible||0} из ${b.offered} попыток с предложенными материалами`:'Нет измеренных предложений'),reportNote('Не менее 50% карточки непрерывно 500 мс при видимой вкладке. Не доказательство внимания и не обязательное условие клика.'));h3.append(visibility);
 h3.append(disclosure('Повторы предложений','Перерисовка, повторное открытие и обновление с тем же набором сохраняют предложение. Изменение контекста A → B → A записывается отдельно; число попыток не увеличивается.'));
 if(total){const states=node('details',null,'report-accordion');states.append(node('summary','Разные состояния пути'),reportTable(['Состояние','Попыток'],[['Рекомендаций не было',b.no_recommendations||0],['Открытие не зарегистрировано',b.no_opening||0],['Клик без перехода',b.opening_without_arrival||0],['Возврат не зарегистрирован',b.arrival_without_return||0],['После возврата нет выбора',b.return_without_choice||0]],'Состояния H3'));h3.append(states);}
 if(onSessions)for(const [p,id]of [[h2,'H2'],[h3,'H3']]){const controls=node('div',null,'product-buttons'),button=node('button','Разобрать → сессии');button.type='button';button.onclick=()=>onSessions(id);controls.append(button);p.append(controls);}
 root.append(h1,h2,h3);return root;
}

export function researchCells(f){
 if(!f||f.coverage==='not_measured')return {coverage:'Не измерялось',H2:'Не измерялось',H3:'Не измерялось'};
 const available=f.H2.availability.some(a=>a.evidence_ids?.length),unsegmented=f.H2.availability.some(a=>a.reason==='unsegmented_screenshots');
 return {coverage:coverageLabels[f.coverage]||'Не измерялось',H2:f.H2.action?`Действий с блоками: ${f.H2.actions.length}`:available?'Действие не зарегистрировано':unsegmented?'Отдельные блоки недоступны':f.H2.availability.length?'Практических блоков нет':'Не измерялось',H3:h3Labels[f.H3.status]||'Не измерялось'};
}
export function attemptResearch(f,{title=id=>id,product=id=>id,category=id=>id,time=at=>String(at),measure=ms=>String(ms)+' мс',summaryOnly=false,detailsOnly=false}={}){
 const root=node('section',null,detailsOnly?'report-attempt-evidence':'report-attempt-research');root.dataset.dsComponent='study.attemptResearch';if(!detailsOnly)root.append(node('h3','H1–H3 в этой попытке'));
 if(f?.qa&&!detailsOnly)root.append(reportNote('QA-проверка: техническая история сохранена, из исследовательских расчётов исключена.'));
 const status=researchCells(f),summary=node('div',null,'report-observation');let h2=status.H2,h3=status.H3;
 if(f?.H2?.action){
  const verbs={'article.disclosure':'раскрытие/сворачивание','article.image':'открытие изображения','article.image.close':'закрытие просмотрщика','table.scroll':'прокрутка таблицы','article.toc':'содержание','article.contents':'содержание'},actions=f.H2.actions;
  const kinds=[...new Set(actions.flatMap(a=>a.evidence_kinds||[]))].map(k=>evidenceKindNames[k]||'неизвестные данные').join(' и '),used=[...new Set(actions.map(a=>a.action==='article.disclosure'?(a.expanded?'раскрыт блок':'свёрнут блок'):verbs[a.action]||'действие с блоком'))].join(', ');
  const next=actions.map(a=>a.next_choice).filter(Boolean).sort((a,b)=>a.at-b.at)[0];h2=`Действий с блоками: ${actions.length} · ${kinds}: ${used}${next?`; далее ${next.action==='replace'?'заменена':'добавлена'} деталь (${category(next.category_id)})`:''}`;
 }
 if(f?.H3?.status==='choice_after_return')h3='Предложение → клик → подтверждённый переход → возврат → выбор';
 summary.append(node('p','H1 · Функция сравнения недоступна'),node('p','H2 · '+h2),node('p','H3 · '+h3));if(!detailsOnly)root.append(summary);
 if(!f||f.coverage==='not_measured'){if(!detailsOnly)root.append(reportNote('Новые измерения отсутствуют. Старые записи не переписываются и не считаются неуспехом.'));return root;}
 if(!detailsOnly)root.append(reportNote(`Измерение: ${status.coverage}${f.incomplete?' · есть известный разрыв':''}. Выбор связан по порядку событий; причина неизвестна.`));if(summaryOnly)return root;
 const rows=[];
 for(const a of f.H2.availability)rows.push([a.at,'Доступность блоков',`${title(a.article_id)} · ${a.evidence_ids?.length||0} размеченных блоков · ${a.reason==='unsegmented_screenshots'?'статические страницы без отдельных действий':a.reason==='no_practical_blocks'?'практических блоков нет':'наличие, не просмотр'}`]);
 const choices=new Set(),pushChoice=c=>{if(c&&!choices.has(c.event_id)){choices.add(c.event_id);rows.push([c.at,c.action==='replace'?'Заменена деталь':'Добавлена деталь',`${category(c.category_id)} · ${c.previous_product_id?product(c.previous_product_id)+' → ':''}${product(c.product_id)} · ${c.same_category?'та же категория':'другая категория'} · ручной выбор`]);}};
 for(const a of f.H2.actions){const label=a.action==='article.disclosure'?(a.expanded?'Раскрыт блок':'Свёрнут блок'):a.action==='table.scroll'?'Прокручена таблица вручную':a.action==='article.image'?'Открыто изображение':a.action==='article.image.close'?'Закрыт просмотрщик':['article.toc','article.contents'].includes(a.action)?'Переход по содержанию':'Действие с блоком';rows.push([a.at,label,`${title(a.article_id)} · ${(a.evidence_kinds||[]).map(k=>evidenceKindNames[k]||'неизвестные данные').join(', ')} · блок ${a.evidence_id} · источник ${a.source_id||'не указан'}`]);pushChoice(a.next_choice);}
 const contexts=node('details',null,'report-accordion');contexts.append(node('summary',`Предложенные материалы · ${f.H3.offers.length} контекстов`));
 for(const o of f.H3.offers){
  const context=node('details',null,'report-accordion report-offer');context.append(node('summary',`${time(o.at)} · ${category(o.category_id)} · ${o.article_ids.length} материалов`));
  context.append(reportNote(o.article_ids.length?o.article_ids.map(id=>`${title(id)} [${id}]`).join(' · '):'Рекомендаций не было.'),reportNote(`Место: ${o.placement_id} · совместимость: ${o.compatible===undefined?'не измерялась':o.compatible?'включена':'выключена'} · ID товаров: ${(o.product_ids||[]).join(', ')||'итоговая выдача пуста'}`),node('p','ID предложения: '+o.offer_id,'report-secondary'));contexts.append(context);
  rows.push([o.at,'Предложены материалы',`${category(o.category_id)} · ${o.article_ids.map(title).join(' · ')||'рекомендаций нет'} · автоматическое состояние`]);
  for(const v of o.visible)rows.push([v.at,'Карточка в видимой области',`${title(v.article_id)} · ≥50%, непрерывно 500 мс; не доказательство внимания`]);
  for(const open of o.opens)rows.push([open.at,'Клик по статье',title(open.article_id)]);
  for(const visit of o.visits){rows.push([visit.at,'Переход в статью подтверждён',title(visit.article_id)]);if(visit.return)rows.push([visit.return.at,'Возврат подтверждён',`${title(visit.article_id)} → конфигуратор`]);pushChoice(visit.next_choice);}
 }
 root.append(contexts);rows.sort((a,b)=>a[0]-b[0]);
 const path=node('details',null,'report-accordion report-research-events');path.open=true;path.append(node('summary','Путь H2–H3 · зарегистрированные события'),reportTable(['От старта','Событие','Где / что'],rows.map(([at,event,context])=>[time(at),event,context]),'Путь H2–H3'));root.append(path);
 if(!detailsOnly)root.append(attemptArticleTimes(f,{title,measure}));
 return root;
}

export function attemptArticleTimes(f,{title=id=>id,measure=ms=>String(ms)+' мс'}={}){
 const root=node('section',null,'report-attempt-time');root.append(node('h3','Время статьи'));
 const visits=f?.H3?.offers.flatMap(o=>o.visits)||[];
 if(!visits.length)root.append(reportNote(f?.coverage==='not_measured'?'Переходы по рекомендациям не измерялись.':'Подтверждённых посещений по рекомендациям нет.'));
 for(const v of visits)root.append(reportNote(`${title(v.article_id)} · ${v.time_measured?`на странице ${measure(v.elapsed_ms)}, при видимой вкладке ${measure(v.visible_ms)}`:'Время не измерялось'}`));
 root.append(reportNote('Подтверждённые посещения по рекомендациям. Повторные накопленные отчёты не складываются. Время не означает чтение или понимание.'));return root;
}
