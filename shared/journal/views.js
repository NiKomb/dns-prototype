import './loading.js';
import {exportControl,saveReport,reportDocument,printReport} from './report-export.js';
import {approvedLayout,reviewRow,materialRow} from './approved-layout.js';
import {initializeJournalTheme} from './theme.js';
import {layoutSummary} from './layout-facts.js';
import {participationIdleMs,participationLabels,participationOptions} from '../telemetry/participation.js';
import {journalText,journalTextWithoutPeriods} from './text.js';
import {overviewStages,overviewObservations} from './overview-model.js';
import {hypothesisMetric,hypothesisMetricNote} from './hypothesis-metric-copy.js';
import {heartCardMetric,heartMetrics,heartLimits,heartDetail,heartVisitTable} from './heart-view.js';
import {attemptStatusOptions} from './attempt-state.js';
import {h1Labels,h1Ratio,h1Time,h1Rule,h1Limit,h2Interpretation,h2Rule,h2Separation,h2Labels,h2Observation} from './real-model.js';
import {categoryNames} from '../telemetry/registry.js';
import {comparisonActionNames} from './comparison-labels.js';
import {infoTooltip,systemStatus,abandonmentMetric,node,button,detailsButton,badge,panel,metric,metricWithInfo,progress,notice,empty,field,nestedField,table,tabs,disclosure,timeline,navigationItem,icon,iconButton,chevronButton,breadcrumbs,nestedList,limitedRows,metadataTags,buildTable,refreshButton,materialTable,scrollRows,scenarioMaterialTable,articleChoiceCell,attemptStatusCell,attemptStatusBadge,articleSelectionMetric,articleChoiceHeader,articleChoiceMetric} from './components.js';


export function loading(label,section){return window.journalLoading.create(label,section);}

export function mountJournal(root,source){
const $=s=>root.querySelector(s);
let model=source.initial;
let {scenario,sessions,statuses,hypotheses,articles,funnel,hypothesisStats,formatPrice}=model;
const buildPrice=value=>value===undefined?'Не записана':value===null?'Неизвестна':formatPrice(value);
const state={section:'overview',purpose:source.purpose||'research',status:'all',participation:'all',query:'',related:'',demoState:'ready',collection:model.collection??true};
const themeControl=$('#theme-toggle');if(themeControl)themeControl.dataset.journalControl='action';
if(!source.specimensOnly)root.classList.add('approved-journal');
const views={overview:['Обзор','Главное о тесте, прохождениях и взаимодействии со статьями.'],hypotheses:['Гипотезы','Наблюдения, основания расчёта и исследовательский вывод'],scenarios:['Сценарии','Задача, порядок действий и факты прохождений'],sessions:['Прохождения','Действия, результат и условия каждой попытки.']};
const prototypeLink=$('.sidebar .prototype-link');if(!source.specimensOnly)prototypeLink?.remove();
let toastTimer,specimenDetail;
function approved(){return approvedLayout({model,state,navigate,rerender:renderApproved,retryLayout(){refresh();},openGroup(ids,name){state.sessionGroup={ids,name};state.page=1;navigate('sessions');},sessionLink(s){const b=button(source.live?s.id.slice(0,8):s.id,()=>navigate('sessions',s.id),'text','link');b.title=s.id;b.dataset.sessionId=s.id;return b;},openTechnical});}
function renderApproved(){
 const active=document.activeElement,label=active?.getAttribute('aria-label'),text=active?.textContent,group=active?.closest('.segments')?.getAttribute('aria-label');render();
 const candidates=[...root.querySelectorAll('#screen>.approved-content button')];const target=candidates.find(e=>group?e.closest('.segments')?.getAttribute('aria-label')===group&&e.textContent===text:label&&e.getAttribute('aria-label')===label);target?.focus({preventScroll:true});
}
function ensureLayoutFacts(){
 if(!['overview','scenarios'].includes(state.section)&&!(state.section==='hypotheses'&&(state.materials||state.hypothesis==='H3')))return;
 if(!source.live){state.layoutError='У демонстрационного образца нет полной истории событий для новых общих расчётов.';return;}
 state.layoutFacts=null;state.layoutError=null;
 const facts=model.layoutFacts,totals=model.layoutTotals,research=model.sessions.filter(s=>!s.qa);
 if(totals?.version!==1||!Array.isArray(facts)||research.some(s=>!facts.some(f=>f.id===s.id))){state.layoutError='В сохранённом снимке ещё нет дополнительных показателей. Обновите журнал, чтобы продолжить подготовку.';return;}
 state.layoutFacts=layoutSummary(model.sessions,facts,totals);
}
// Legacy renderers are retained for the library archive only.
function legacyBlocks(renderOld,origin,predicate=()=>true){
 const contents=document.createDocumentFragment();renderOld(contents);const wrapper=node('div',null,'approved-legacy');
 for(const e of [...contents.children]){if(!predicate(e))continue;const entry=node('section',null,'approved-legacy-entry');const location=origin+(e.dataset.hypothesis?' · '+e.dataset.hypothesis:'');entry.dataset.journalOrigin=location;entry.append(node('p','Прежний блок · '+location,'library-label'),e);wrapper.append(entry);}return wrapper;
}
function approvedView(name){$('#screen').append(approved()[name]());}
function toast(text){$('#toast').textContent=journalText(text);$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,3500);}
function row(...children){const root=node('div',null,'toolbar');root.append(...children);return root;}
function shortcutButton(label,glyph,action){return infoTooltip(label,label,{trigger:iconButton(label,glyph,action)});}
function grid(className,...children){const root=node('div',null,className);root.append(...children);return root;}
function navigate(section,id){if(section!==state.section&&section!=='hypotheses')state.materials=false;if(section!==state.section){state.query='';state.status='all';state.participation='all';state.related='';if(section!=='sessions'){state.sessionGroup=null;state.sessionTab='all';state.page=1;state.purpose='research';}}if(source.specimensOnly&&section==='sessions'&&id&&specimenDetail){const session=sessions.find(s=>s.id===id);specimenDetail.replaceChildren(session?approved().detail(session):attemptNotFound());sizeEventLists();}if(source.navigate)return source.navigate(section,id,state);location.hash=id?`sessions/${id}`:section;}
function confirmDialog(title,description,actionLabel,onConfirm){
 const dialog=$('#demo-dialog'),body=$('#dialog-content');body.replaceChildren(node('h2',title));body.firstChild.id='dialog-title';body.append(node('p',description,'muted'));
 body.append(grid('dialog-actions',button('Отмена',()=>dialog.close()),button(actionLabel,()=>{dialog.close();onConfirm();},'primary')));dialog.showModal();
}
function technicalFields(s){
 const fields=node('dl',null,'technical-fields');
 for(const [label,value] of (s.technical||[['attempt_id',s.id],['task_id','task-2 · демонстрация'],['build_id','demo-v2'],['purpose',s.qa?'qa · исключена из сводки':'research · тестовые данные'],['Начало',s.date+' · UTC+5'],['Доставка',`${s.events.length} основных событий · без потерь`],['Окружение','Chromium · Linux · демонстрация']]))fields.append(grid('technical-field',node('dt',label),node('dd',value)));
 return fields;
}
function technicalControl(s){
 const contents=node('div');contents.append(node('strong','Технические сведения'),technicalFields(s));
 const control=infoTooltip('Технические сведения '+s.id,contents,{clickOnly:true});control.classList.add('journal-technical-tooltip');return control;
}
function openTechnical(s){
 const dialog=$('#technical-dialog');
 const heading=node('h2','Технические сведения');heading.id='technical-title';
 const fields=technicalFields(s);
 dialog.replaceChildren(grid('technical-heading',heading,iconButton('Закрыть технические сведения','x',()=>dialog.close())),node('p','Для диагностики доставки и измерений','muted'),fields);
 dialog.showModal();
}
function exportData(format='json'){
 if(typeof format!=='string')format='json';
 if(source.prepareExport){
  // Keep the print window tied to the click, before deferred network requests.
  const popup=format==='pdf'?window.open('','_blank'):undefined;
  if(format==='pdf'&&!popup){toast('Разрешите открытие окна отчёта для печати');return;}
  if(popup)popup.document.body.textContent='Загрузка отчёта…';
  return source.prepareExport(()=>exportPrepared(format,popup),error=>{
   if(error&&popup&&!popup.closed)popup.document.body.textContent='Не удалось загрузить отчёт. Повторите загрузку в журнале.';
   else popup?.close();
  });
 }
 return exportPrepared(format);
}
function exportPrepared(format,popup){
 if(format==='json'){if(source.exportData)return source.exportData();saveReport(JSON.stringify({demo:true,scenario,sessions},null,2),'journal-demo.json','application/json');toast('Тестовые данные экспортированы');return;}
 try{
  const local={...state,sessionGroup:null,sessionTab:'all',page:1,query:''},noop=()=>{};
  if(!local.layoutFacts&&Array.isArray(model.layoutFacts)&&model.layoutTotals?.version===1)local.layoutFacts=layoutSummary(sessions,model.layoutFacts,model.layoutTotals);
  const views=approvedLayout({model,state:local,navigate:noop,rerender:noop,retryLayout:noop,openGroup:noop,sessionLink:s=>node('span',s.id),openTechnical:noop}),sections=[];
  const id=(source.route||'').split('/')[1],detail=id&&sessions.find(s=>s.id===id);
  if(detail)sections.push(['Прохождение '+detail.id,views.detail(detail)]);
  else{
   sections.push(['Обзор',views.overview()]);
   for(const hypothesis of ['H1','H2','H3']){local.hypothesis=hypothesis;local.materials=true;sections.push(['Гипотеза '+hypothesis,views.hypotheses()]);}
   for(const scenario of ['comparison','selection']){local.scenario=scenario;sections.push([scenario==='comparison'?'Сценарий: сравнение товаров':'Сценарий: выбор детали',views.scenarios()]);}
   const list=views.sessions(),body=list.querySelector('tbody'),count=sessions.filter(s=>local.purpose==='all'||(local.purpose==='qa')===s.qa).length;
   if(body)for(let page=2;page<=Math.ceil(count/6);page++){local.page=page;body.append(...views.sessions().querySelector('tbody').children);}
   sections.push(['Прохождения',list]);
  }
  const report=reportDocument({title:'Журнал исследования · '+scenario.title,context:[scenario.caption,new Date().toLocaleString('ru-RU',{timeZone:'Asia/Yekaterinburg'})+' (Екатеринбург)',source.live?'Готовые загруженные результаты. Подробные события всех сессий дополнительно не запрашиваются.':'Демонстрационные данные. Не результаты исследования.'].filter(Boolean).join(' · '),sections});
  if(format==='md'){saveReport(report.markdown,detail?detail.id+'.md':'journal.md','text/markdown;charset=utf-8');toast('Отчёт Markdown сохранён');}
  else if(!printReport(report,popup))toast('Разрешите открытие окна отчёта для печати');
 }catch(error){console.error('Journal export failed',error);toast('Не удалось сформировать отчёт. Повторите экспорт.');}
}

function collectionToggle(sample=false){
 const explanation=node('span',null,'metric-tooltip-explanation');
 const updateExplanation=()=>{
  const lines=b.getAttribute('aria-checked')==='true'?['Сбор данных включён','Скопируйте ссылку и отправьте участнику, чтобы он начал новое прохождение','Нажмите на переключатель, чтобы приостановить сбор']:['Сбор данных приостановлен: включите его,','затем скопируйте ссылку и отправьте','участнику для нового прохождения'];
  explanation.replaceChildren(...lines.map(line=>node('span',journalTextWithoutPeriods(line))));
 };
 const b=button('',()=>{
  if(sample){b.setAttribute('aria-checked',String(b.getAttribute('aria-checked')!=='true'));updateExplanation();toast('Состояние образца переключено');}
  else if(source.setCollection){source.setCollection(!state.collection,b);}
  else{state.collection=!state.collection;render();toast(state.collection?'Демонстрация: сбор включён':'Демонстрация: сбор приостановлен');}
 });
 b.className='switch';b.dataset.journalControl='toggle';b.setAttribute('role','switch');
 b.setAttribute('aria-label',sample?'Образец переключателя сбора':source.live?'Управление сбором событий':'Демонстрация переключателя сбора');
 b.setAttribute('aria-checked',String(sample||state.collection));updateExplanation();
 infoTooltip('Сбор данных',explanation,{trigger:b});return b;
}


function renderCollectionHeader(){
 if(source.specimensOnly)return;
 const header=node('section',null,'journal-control-header');header.setAttribute('aria-label','Сбор данных и новая попытка');
 const row=node('div',null,'journal-control-row'),address=scenario.link||'https://example.test/demo/game-pc';
 const field=node('div',null,'journal-attempt-link'),input=node('input');input.type='url';input.readOnly=true;input.value=address;input.disabled=!state.collection;input.setAttribute('aria-label','Ссылка на новую попытку');input.title=address;
 const copy=button('',async()=>{try{if(source.copyLink)toast(await source.copyLink(address));else if(navigator.clipboard){await navigator.clipboard.writeText(address);toast('Ссылка скопирована');}else toast(address);}catch{toast(address);}finally{if(copy.isConnected&&!copy.disabled)copy.focus({preventScroll:true});}},'text');copy.classList.add('journal-copy-link');copy.disabled=!state.collection;copy.setAttribute('aria-label','Копировать ссылку на попытку');copy.title='Копировать ссылку';copy.append(icon('copy'));field.append(input,copy);
 const start=node('a','Открыть прототип','button secondary accent');start.dataset.journalControl='action';start.href=address;start.target='_blank';start.rel='noopener';
 const controls=node('div',null,'journal-link-controls');controls.append(field,collectionToggle());row.append(node('h2','Сбор данных'),controls,start);header.append(row);
 const previous=$('.journal-control-header');if(previous)previous.replaceWith(header);else $('main').prepend(header);
}

const h1Explanations={
 'Начали использовать сравнение':'Сессии с хотя бы одним успешным добавлением товара в сравнение или открытием таблицы, включая пустую, делим на полностью измеренные сессии с открытием рабочего каталога. Каждую сессию учитываем один раз. QA, старые записи, частичные данные и известные разрывы исключены из сводки.',
 'Дошли до таблицы с 2+ товарами':'Сессии, в которых открытая таблица содержала минимум два разных товара одной категории, делим на полностью измеренные сессии с открытием рабочего каталога. Учитываем состав при открытии и товары, добавленные позже внутри таблицы. Набор вне открытой таблицы и товары разных категорий не объединяем. Каждая сессия считается один раз; QA, старые, частичные и разорванные записи исключены из сводки.',
 'Время до первого действия сравнения':'Время от открытия каталога до первого успешного добавления в сравнение или открытия таблицы в той же вкладке и посещении каталога. В сводке показываем медиану этих времён и число сессий расчёта. QA и сессии без подтверждённого времени, в том числе старые, частичные и разорванные записи, исключены. Неизвестное время не заменяем нулём.'
};
function h1Metric(label,value,caption){return metricWithInfo(label,value,caption,'Как считается: '+label,h1Explanations[label]);}
function h1Metrics(a,main=true){
 const time=a?.time_to_first_action,contents=grid(main?'evidence-metrics':'h1-card-measurements');contents.classList.add('h1-metrics');
 if(main)contents.append(hypothesisMetric('H1','table_2plus',h1Ratio(a?.table_2plus)));
 contents.append(hypothesisMetric('H1','started',h1Ratio(a?.started)),hypothesisMetric('H1','time',h1Time(time?.median_ms),`Медиана · Сессий расчёта: ${time?.sessions??0}`));return contents;
}
function hypothesisCard(h) {return approved().hypothesisCard(h);}
function library(){
 const root=$('#system');const header=node('div',null,'system-heading');const copy=node('div');copy.append(node('p','СИСТЕМНЫЙ БЛОК / БИБЛИОТЕКА ЖУРНАЛА','eyebrow'),node('h2','Повторяющиеся элементы'));copy.lastChild.id='system-title';copy.append(node('p','Собственная библиотека журнала. Образцы здесь и элементы экранов ниже созданы одним кодом.','muted'));header.append(copy,badge('Journal UI · v0.2','accent'));if(!source.compactSpecimens)root.append(header);
 const compactGroups=new Map();
 function addSamples(container,label,contents){
  const origin=/Раздел гипотез|Гипотезы/.test(label)?'Гипотезы':/Маршрут|Этапы сценария|Прогресс|Материалы/.test(label)?'Сценарии':/Прохождение|Сессии|Попытки|Состав сборки|От статьи/.test(label)?'Прохождения':/Разбор сессий|Открытые материалы/.test(label)?'Обзор':'Общие компоненты журнала';
  for(const e of contents)e.dataset.journalOrigin=origin;
  label+=' · '+origin;
  if(!source.compactSpecimens){const item=node('div',null,'library-item');item.append(node('p',label,'library-label'),...contents);container.append(item);return;}
  const caption=label.replace(/^\d+ · /,'');
  for(const content of contents){
   const kind=content.matches('.hypothesis-panel,[data-component-group=hypothesis-section]')?'hypothesis-section':content.matches('.journal-component-preview')?'Прохождение':content.matches('.hypothesis,.approved-hypothesis')?'hypothesis':content.matches('.metric')?'metric':content.matches('.field')?'field':content.matches('.notice')?'notice':content.matches('.journal-nav-item')?'navigation':content.querySelector('.session-table')?'sessions':content.querySelector('.build-table')?'build':content.querySelector('table')?'table':content.matches('.empty-state,.loading')?'screenState':content.matches('.progress-row')||content.querySelector('.progress-row')?'progress':caption.split(' · ')[0];
   const titles={hypothesis:'Гипотеза',metric:'Показатель',field:'Поле выбора',notice:'Сообщение',navigation:'Навигация',sessions:'Таблица сессий',build:'Состав сборки',table:'Таблица материалов',screenState:'Состояние экрана',progress:'Прогресс'};
   if(!compactGroups.has(kind)){const group=node('div',null,'library-item');group.dataset.componentGroup=kind;group.append(node('p',titles[kind]||caption.split(' · ')[0],'library-label'),node('div',null,'library-samples'));container.append(group);compactGroups.set(kind,group);}
   const group=compactGroups.get(kind),sample=node('div',null,'library-sample');
   const specificOrigin=origin==='Гипотезы'?(content.dataset.overviewHypothesis||content.querySelector('[data-hypothesis-statement]')?.dataset.hypothesisStatement):null;sample.append(node('p','Раздел: '+origin+(specificOrigin?' · '+specificOrigin:''),'library-caption library-origin'));
   const wide=['sessions','build','table','Прохождение','H2','hypothesis-section'].includes(kind);group.classList.toggle('library-wide',wide);
   if(wide)sample.classList.add('library-sample-wide');
   if(kind==='hypothesis'||kind==='metric')sample.classList.add('library-sample-card');
   const state=kind==='notice'?content.firstChild.textContent:kind==='metric'?content.firstChild.textContent:caption.split(' · ').slice(1).join(' · ')||(['screenState','sessions','table','progress'].includes(kind)?caption:'');
   if(state)sample.append(node('p',state,'library-caption'));sample.append(content);group.lastChild.append(sample);
  }
 }
 const samples=node('div',null,'library-grid');function sample(label,...content){addSamples(samples,label,content);}
 const disabled=button('Недоступно',()=>{});disabled.disabled=true;
 sample('01 · Действия',row(button('Основная',()=>toast('Основное действие выполнено'),'primary'),button('Вторичная',()=>toast('Вторичное действие выполнено')),button('С акцентом',()=>toast('Действие с акцентом выполнено'),'secondary accent')),row(disabled,button('Текстовая →',()=>toast('Текстовое действие выполнено'),'text'),detailsButton(()=>navigate('hypotheses'))));
 sample('02 · Статусы попытки',row(...Object.keys(statuses).map(attemptStatusBadge)));
 const choiceKpi=model.choiceKpis||model.kpis;
 sample('03 · Показатель',articleSelectionMetric(model.articleSelection),...(model.emptyArticleSelection?[articleSelectionMetric(model.emptyArticleSelection)]:[]),articleChoiceMetric(choiceKpi?.median||'—',choiceKpi?.medianCaption||'Сессий расчёта: 0 · QA исключены'));
 sample('04 · Прогресс',scrollRows(funnel.map(([label,count])=>progress(label,count,model.stats?.attempts??24)),5,'Прогресс, прокручиваемый список'));
 const extra=node('div',null,'library-extra');
 const extended=node('div',null,'library-grid');function ext(label,...content){addSamples(extended,label,content);}
 ext('05 · Поля и выбор',nestedField('Статус попытки',model.statusOptions||attemptStatusOptions,()=>toast('Статус выбран')),field('Тип попыток',[['research','Исследование'],['qa','Технические проверки']],()=>toast('Демонстрация выбора типа')),field('Статус',model.statusOptions||attemptStatusOptions,()=>toast('Статус выбран')));
 ext('06 · Переключатель',grid('split',node('span','Демонстрация сбора','muted'),collectionToggle(true)));
 ext('07 · Сообщение',...[['neutral','История попыток'],['success','Данные сохранены'],['warning','Неполные данные'],['error','Не удалось загрузить']].map(([tone,title])=>notice(title,'История доступна после обновления.',tone)));
 ext('08 · Токены',grid('swatches',...['--journal-surface','--journal-text-primary','--journal-text-secondary','--journal-accent','--journal-success-text'].map(color=>{const s=node('span',null,'swatch');s.style.background=`var(${color})`;s.title=color;return s;})),node('p','PT Sans · радиус 24 / 12 px','muted'));
 ext('Сессии · Одна строка',sessionTable([sessions[0]]));ext('Материалы · До трёх строк',limitedRows(scenarioMaterialTable(articles),3,'Показать все статьи'));if(!source.compactSpecimens)extended.lastChild.classList.add('library-wide');
 ext('10 · Раскрытие',disclosure('Технические сведения',node('p','Версия: demo-v1 · идентификатор: DEMO-024','muted')));
 const reviewExample={id:'partial-build',label:'Прекратили с неполным составом',ids:sessions.slice(0,5).map(s=>s.id)},emptyReview={id:'no-choice',label:'Прекратили участие без ручного выбора',ids:[]};
 ext('28 · Разбор сессий',reviewRow(reviewExample,approved().reviewList(reviewExample)),reviewRow(emptyReview,approved().reviewList(emptyReview)));
 ext('30 · Открытые материалы',...articles.slice(0,2).map(([title,,visits])=>materialRow(title,visits,()=>navigate('hypotheses'))));
 const groupCell=button('2',()=>navigate('sessions'),'text','link'),emptyCell=button('0',()=>navigate('sessions'),'text','link'),unknownCell=button('н/д',()=>{},'text','link');
 groupCell.dataset.sessionIds=sessions.slice(0,2).map(s=>s.id).join(',');emptyCell.dataset.sessionIds='';unknownCell.disabled=true;
 ext('31 · Переход по ячейке',table(['Сессии группы','Пустая группа','Нет измерения'],[[groupCell,emptyCell,unknownCell]]));
 ext('11 · Маршрут',route(['Каталог','Статья','Выбор']));
 const scenarioExample=approved().scenarios(),scenarioVersion=scenarioExample.querySelector('.approved-scenario-version');
 scenarioVersion.replaceChildren(scenarioVersion.querySelector('[data-scenario-block=path]'));scenarioExample.replaceChildren(scenarioVersion);
 const previousScenario=state.scenario;state.scenario='selection';const pickerExample=approved().scenarios().querySelector('[data-quick-picker-branch]');state.scenario=previousScenario;scenarioVersion.append(pickerExample);
 ext('32 · Этапы сценария',scenarioExample);compactGroups.get('Этапы сценария')?.classList.add('library-wide');
 const currentNav=navigationItem('overview','Обзор');currentNav.setAttribute('aria-current','page');ext('12 · Навигация',currentNav,navigationItem('hypotheses','Гипотезы'),navigationItem('scenarios','Сценарии'),navigationItem('sessions','Прохождения'));
 ext('13 · Вложенный список',nestedList([{label:'Каталоги',items:['Процессоры','Материнские платы','Видеокарты'],open:true},{label:'Материалы',items:['Обзоры и тесты','Сравнительные обзоры']}]));
 ext('14 · Хлебные крошки',breadcrumbs([{label:'Исследование',href:'#overview'},{label:'Прохождения',href:'#sessions'},{label:'Прохождение'}]));
 ext('15 · Иконки действий',row(grid('journal-shortcuts',shortcutButton('Демонстрация изменений','square-line-vertical',()=>toast('Образец перехода в деморежим')),shortcutButton('Чистый прототип','layout-header-side-content',()=>toast('Образец перехода в прототип'))),refreshButton(()=>new Promise(resolve=>setTimeout(()=>{toast('Образец обновления');resolve();},800))),exportControl(exportData)));
 const sampleStatus=node('p','Подготовка сохранённых результатов…');sampleStatus.id='journal-status-specimen';ext('27 · Системный статус',row(node('strong','Обзор'),systemStatus(sampleStatus)));
 ext('Панель',panel('История попыток','Исследовательские и технические проверки',button('Экспорт данных',exportData)));
 const presentation=tabs([['sessions','Сессии'],['materials','Материалы']],'sessions',value=>{for(const [index,item]of [...presentation.children].entries()){const active=['sessions','materials'][index]===value;item.setAttribute('aria-pressed',String(active));item.classList.toggle('active',active);}toast('Представление переключено');});ext('Представление',presentation);
 ext('Прогресс без измерений',progress('Открыли статьи',null,null));
 ext('Показатель результата',metric('Результат','Сборка сохранена','Завершённая попытка','success'));
 ext('16 · Раскрытие строк · 10 последних сессий',limitedRows(sessionTable(sessions),10,'Показать все сессии'));
 ext('17 · Диалог',button('Открыть подтверждение',()=>confirmDialog('Приостановить демонстрацию?','Это образец диалога. Реальный сбор данных не меняется.','Приостановить',()=>toast('Действие в образце подтверждено'))));
 ext('18 · Метаданные',metadataTags(['H1 · недоступно','H2 · товар из статьи','H3 · материалы'],index=>toast('Выбрана гипотеза H'+(index+1)),1));
 ext('26 · Состояние попытки · отдельно от результата',attemptStatusCell({status:'incomplete',build_count:2,saving:'not_saved'},{participation:'abandoned',participationLabel:participationLabels.abandoned}));
 const buildSamples=[...sessions[0].build,['Блок питания','Пример неизвестной цены',null],['Корпус','Пример старой записи без цены',undefined],['Процессор','Пример нулевой цены',0]];
 ext('19 · Состав сборки',limitedRows(buildTable(buildSamples.map(([category,name,price])=>[category,name,buildPrice(price)])),3,'Показать все комплектующие'));
 if(!source.compactSpecimens)extended.lastChild.classList.add('library-wide');
 if(model.choiceSpecimens){ext('24 · От статьи до выбора · измерение и пять статусов',sessionTable(model.choiceSpecimens));if(!source.compactSpecimens)extended.lastChild.classList.add('library-wide');}
 if(model.buildSpecimens){ext('25 · Статус попытки · сохранение и полнота',sessionTable(model.buildSpecimens));if(!source.compactSpecimens)extended.lastChild.classList.add('library-wide');}
 ext('22 · Медиана статьи и подсказка',scenarioMaterialTable([['Статья с замерами','Процессоры',3,{median_ms:65000,samples:3},1],['Нет видимого времени','Процессоры',1,{median_ms:null,samples:0},0],['Нулевое время','Процессоры',1,{median_ms:0,samples:1},0]]));if(!source.compactSpecimens)extended.lastChild.classList.add('library-wide');
 ext('20 · Технические сведения',iconButton('Технические сведения DEMO-024','info',()=>openTechnical(sessions[0])));
 ext('21 · Гипотезы',...hypotheses.map(hypothesisCard));
 specimenDetail=node('div',null,'journal-component-preview');specimenDetail.append(approved().detail(sessions[0]));ext('Прохождение',specimenDetail);if(!source.compactSpecimens)extended.lastChild.classList.add('library-wide');
 extra.append(extended);const stateSamples=node('div',null,'library-grid');
 for(const [label,content]of [['Пустое состояние',empty('Пока нет попыток','Здесь появятся прохождения.')],['Ошибка',empty('Не удалось загрузить','Попробуйте ещё раз.',button('Повторить',()=>toast('Образец повторного запроса')),'error')],['Загрузка',loading()],['Список событий',timeline(sessions[0].events.slice(0,2))]])addSamples(stateSamples,label,[content]);extra.append(stateSamples);root.append(samples,extra);if(source.specimensOnly)root.append(libraryScreens(),libraryArchive());if(!source.compactSpecimens)root.append(node('p','Оформление: рабочий журнал /results · Собственная библиотека макета · Образцы и экраны используют один код','system-footnote'));
}

function libraryScreens(){
 const section=node('section',null,'journal-screen-specimens');section.dataset.libraryJournalScreens='';section.append(node('h2','Актуальные блоки журнала'),node('p','Демонстрационные данные. Не результаты исследования.','muted'));
 for(const [origin,name,overrides]of [['Обзор','overview',{}],['Гипотезы · H1','hypotheses',{hypothesis:'H1'}],['Сценарии · Сравнение','scenarios',{scenario:'comparison'}],['Сценарии · Выбор детали','scenarios',{scenario:'selection'}],['Прохождения · Список','sessions',{}],['Прохождения · Карточка попытки','detail',{}]]){
  const entry=node('section',null,'journal-screen-example'),host=node('div'),local={section:name,purpose:'research',sessionTab:'all',participation:'all',query:'',page:1,layoutFacts:source.specimenFacts,...overrides};let selected=sessions[0];entry.dataset.journalOrigin=origin;entry.append(node('h3','Раздел: '+origin,'library-label'),host);
  function navigate(section,id){local.section=id?'detail':section;if(id)selected=sessions.find(s=>s.id===id)||sessions[0];draw();}
  function draw(){const actualOrigin=local.section==='hypotheses'?'Гипотезы · '+local.hypothesis:local.section==='scenarios'?'Сценарии · '+(local.scenario==='selection'?'Выбор детали':'Сравнение'):local.section==='overview'?'Обзор':local.section==='detail'?'Прохождения · Карточка попытки':'Прохождения · Список';entry.dataset.journalOrigin=actualOrigin;entry.firstChild.textContent='Раздел: '+actualOrigin;const view=approvedLayout({model,state:local,navigate,rerender:draw,retryLayout:()=>{},openGroup(ids,name){local.sessionGroup={ids,name};local.page=1;local.section='sessions';draw();},sessionLink(s){const b=button(s.id,()=>navigate('sessions',s.id),'text','link');b.dataset.sessionId=s.id;return b;},openTechnical:()=>toast('Демонстрационные технические сведения')});host.replaceChildren(local.section==='detail'?view.detail(selected):view[local.section]());}
  draw();section.append(entry);
 }
 return section;
}
function libraryArchive(){
 const archive=disclosure('Прежние блоки журнала',node('div',null,'journal-legacy-samples'));archive.dataset.libraryJournalLegacy='';const host=archive.querySelector('.journal-legacy-samples');let built=false;
 archive.addEventListener('toggle',()=>{if(!archive.open||built)return;built=true;
  host.append(legacyBlocks(overview,'Обзор',e=>{if(e.dataset.overviewBlock==='summary'){e.children[0]?.remove();e.children[0]?.remove();return true;}return ['scenario','recent'].includes(e.dataset.overviewBlock);}),legacyBlocks(scenarioView,'Сценарии',e=>{if(e.matches('.metrics'))e.firstElementChild?.remove();return true;}),legacyBlocks(sessionView,'Прохождения · Список'));
  host.append(legacyBlocks(hypothesisView,'Гипотезы'));
  host.append(legacyBlocks(target=>target.append(sessionDetailPanels(sessions[0])),'Прохождения · Карточка попытки',e=>{if(e.matches('.notice')&&!['abandoned','not_started'].includes(sessions[0].participation))return false;if(e.matches('.attempt-summary'))e.querySelector('.attempt-route .route')?.remove();if(e.matches('.metrics')){e.children[2]?.remove();e.children[0]?.remove();}return true;}));sizeEventLists();
 });return archive;
}

function route(items){const root=node('div',null,'route');items.forEach((item,i)=>{
 const text=node('span',typeof item==='string'?item:item.label),step=grid('route-step',text);
 if(typeof item==='object'){
  step.title=item.note||'';
  if(item.description)text.append(node('small',item.description,'route-description muted'));
  for(const [key,value]of Object.entries({eventId:item.event_id,comparisonId:item.comparison_id,categoryId:item.category_id,productId:item.product_id}))if(value)step.dataset[key]=value;
 }
 if(i<items.length-1)step.append(icon('chevron-right'));root.append(step);
});return root;}
function statePreview(){
 const root=panel('Состояния экрана','Переключите состояние, чтобы согласовать сообщения и поведение.');root.classList.add('state-preview');
 root.append(tabs([['ready','Данные'],['empty','Пусто'],['loading','Загрузка'],['error','Ошибка']],state.demoState,value=>{state.demoState=value;render();},'Состояние демонстрационного экрана'));
 return root;
}
function stateContent(){if(state.demoState==='loading')return loading(source.live?'Обновление данных…':undefined,state.section);if(state.demoState==='error')return empty('Не удалось загрузить данные','История не потеряна. Повторите запрос, чтобы восстановить показ.',button('Повторить загрузку',()=>{if(source.refresh)return source.refresh();state.demoState='ready';render();toast('Тестовые данные загружены');},'primary'),'error');return empty('Пока нет данных','В выбранном сценарии ещё нет зарегистрированных попыток.',button('Показать тестовые данные',()=>{if(source.refresh)return source.refresh();state.demoState='ready';render();},'primary'));}
function recentOverviewTable(items){
 const rows=items.map(s=>{
  const attempt=node('div'),link=button(s.id.slice(0,8),()=>navigate('sessions',s.id),'text','link');link.classList.add('session-link','overview-attempt-link');link.title=s.id;
  attempt.append(link,node('span',s.date,'cell-secondary'));
  const build=node('div'),observed=s.overview?.build||s.attemptState;
  const selected=s.overview?.selected_categories||[];
  build.append(node('span',Number.isInteger(observed?.build_count)?`${observed.build_count} из 5 деталей`:selected.length?'Полный состав неизвестен':'Состав неизвестен'));
  if(selected.length)build.append(node('span',selected.map(id=>categoryNames[id]).join(' · '),'cell-secondary'));
  build.append(node('span',({saved:'Сохранено',not_saved:'Не сохранено',unknown:'Сохранение неизвестно'})[observed?.saving]||'Сохранение неизвестно','cell-secondary'));
  const actions=node('div',null,'overview-observations');for(const [id,text]of overviewObservations(s)){const line=node('p');line.append(node('strong',id+': '),node('span',text));actions.append(line);}
  return [attempt,build,actions];
 });
 const root=table(['Попытка','Сборка','Статьи и сравнение'],rows);root.querySelector('table').classList.add('overview-recent-table');return root;
}
function overview(screen=$('#screen')){
 const a=model.overview;
 const totals=node('section',null,'overview-summary');totals.dataset.overviewBlock='summary';totals.setAttribute('aria-label','Сводка попыток');
 const completeCaption=a?.attempts>0?`${Math.round(a.completed_percent)}% · ${a.completed} из ${a.attempts} попыток`:a?.attempts===0?'Нет исследовательских попыток':'Недостаточно данных';
 totals.append(metric('Исследовательские попытки',a?.attempts??'—','Выбранное задание · без технических проверок'),metric('Завершили задание',a?.completed??'—',completeCaption),abandonmentMetric(model.abandonment));
 const diagnostics=node('p',`Технические проверки: ${a?.excluded_qa??'—'} · Разрывы измерения: ${a?.gaps??'—'} · Недостаточные данные: ${a?.insufficient??'—'}`,'muted overview-diagnostics');diagnostics.dataset.overviewBlock='diagnostics';screen.append(totals,diagnostics);
 const h=panel('Гипотезы','Наблюдения, а не автоматические выводы',button('Все гипотезы →',()=>navigate('hypotheses'),'text','link'));h.classList.add('overview-hypotheses');h.dataset.overviewBlock='hypotheses';h.append(grid('hypotheses-grid',...hypotheses.map(x=>hypothesisCard(x))),node('p',hypothesisMetricNote,'muted'));screen.append(h);
 const scenarioPanel=panel('Сценарий',null,detailsButton(()=>navigate('scenarios')));scenarioPanel.dataset.overviewBlock='scenario';scenarioPanel.append(node('p',scenario.task,'overview-task'));
 const diagrams=node('div',null,'overview-diagrams');
 const draw=(title,rows,total,kind)=>{
  const group=node('section',null,'overview-chart');group.dataset.chart=kind;group.append(node('h3',title));
  const list=node('ul',null,'overview-bars');
  for(const fact of rows){
   const item=node('li',null,'overview-bar');item.dataset.stage=fact.id;
   const valid=Number.isFinite(fact.count)&&Number.isFinite(total),percent=valid&&total>0?Math.round(fact.count/total*100):null;
   const value=valid?`${fact.count} · ${percent===null?'—':percent+'%'}`:'—';
   const heading=node('div',null,'overview-bar-heading');heading.append(node('span',fact.label),node('strong',value,'overview-bar-value'));
   const track=node('div',null,'progress-track overview-bar-track'),fill=node('span');
   track.setAttribute('aria-hidden','true');fill.style.width=valid&&total>0?`${Math.min(100,Math.max(0,fact.count/total*100))}%`:'0%';track.append(fill);
   if(fact.id==='saved_full')item.classList.add('is-complete');
   item.append(heading,track);
   if(!valid)item.append(node('span','Нет данных об этом действии','muted overview-stage-unknown'));
   if(fact.unknown)item.append(node('span',`Ещё ${fact.unknown}: недостаточно данных`,'muted overview-stage-unknown'));
   list.append(item);
  }
  group.append(list);return group;
 };
 diagrams.append(draw('Продвижение по заданию',overviewStages.map(([id,label])=>({id,label,...a?.stages.find(stage=>stage.id===id)})),a?.attempts,'stages'),draw('Статьи и сравнение',model.activitySummary||[{id:'articles',label:'Просмотрели статью'},{id:'comparison',label:'Открыли сравнение с 2+ товарами'}],a?.attempts,'activities'));
 scenarioPanel.append(diagrams,node('p','Доля от всех исследовательских попыток выбранного задания. Каждая попытка учитывается один раз на действие, до первого сохранения. Статьи и сравнение могут использоваться в любом порядке.','muted'),node('p','Отсутствие записи при недостаточных данных не означает отказ.','muted'));screen.append(scenarioPanel);
 const recent=panel('Последние попытки','Три последние исследовательские попытки',button('Все сессии →',()=>navigate('sessions'),'text','link'));recent.dataset.overviewBlock='recent';
 const items=sessions.filter(s=>!(s.qa??s.status==='qa')).toSorted((x,y)=>(y.started_at??0)-(x.started_at??0)).slice(0,3);
 recent.append(items.length?recentOverviewTable(items):empty('Пока нет исследовательских попыток','Здесь появятся прохождения выбранного задания.'));screen.append(recent);
}
function hypothesisPanel(h,specimen=false){
  const p=panel(`${h.id} · ${h.title}`);p.classList.add('hypothesis-panel');p.dataset.hypothesis=h.id;p.id=(specimen?'hypothesis-specimen-':'hypothesis-')+h.id;p.tabIndex=-1;
  if(h.id!=='H1')p.firstChild.append(button('Открыть связанные сессии',()=>openRelatedSessions(h.id)));
  p.append(node('p',journalTextWithoutPeriods(h.description),'source-statement'));
  if(h.id==='H1'){
   const a=h.measurements;const notes=grid('hypothesis-notes');notes.append(notice('Правило расчёта',h1Rule),notice('Вне расчёта',`Не измерялось: ${a?.not_measured??0} · Частичные данные: ${a?.partial??0} · Разрывы: ${a?.incomplete??0} · Без открытия каталога: ${a?.no_catalog??0} · QA: ${a?.excluded_qa??0}`),notice('Ограничение и интерпретация',h1Limit));p.append(h1Metrics(a),notes);
  }else{const notes=heartLimits(h.id,h.measurements);notes.classList.add('hypothesis-notes');p.append(heartMetrics(h.id,h.measurements),notes);}
  if(h.id==='H3'){
   const a=hypothesisStats.H3?.diagnostic||{},contents=node('div',null,'h3-progress');
   let previous=model.h3Denominator??a.offered;
   for(const [key,label]of [['offered','Предложены материалы'],['opened','Клик по статье'],['arrived','Переход в статью подтверждён'],['viewed','Просмотр по критерию'],['viewedReturned','Возврат после подходящего просмотра'],['choice','Выбор нужной категории после возврата']]){contents.append(progress(label,a[key],previous));previous=a[key];}
   const explanations=grid('h3-explanations',notice('Видимость карточки',`${a.visibleOffers??'—'} из ${a.offers??'—'} отдельных предложений. Не менее 50% карточки непрерывно 500 мс при видимой вкладке. Это диагностика предложения, не доказательство внимания.`),notice('Повторы предложений','Повторное открытие с тем же набором сохраняет предложение. Изменение контекста учитывается отдельно; число сессий не увеличивается.'));
   p.append(grid('h3-measurements',node('h3','Путь от рекомендации до выбора','hypothesis-diagnostic-title'),contents,explanations));
  }
 return p;
}
function hypothesisView(screen=$('#screen')){
 const intro=notice('Как читать эти результаты','Самостоятельные попытки. Наблюдаем действия, а не понимание, личную релевантность или помощь материала. '+hypothesisMetricNote,'neutral');intro.classList.add('hypotheses-intro');screen.append(intro,...hypotheses.map(h=>hypothesisPanel(h)));
}
function openRelatedSessions(id){state.related=id;state.query='';state.status='all';state.participation='all';state.purpose='research';navigate('sessions');}
function scenarioView(screen=$('#screen')){
 screen.append(grid('metrics',...(model.scenarioMetrics||[['Завершили','18 / 24','75% попыток','success'],['В процессе','3','12,5% попыток'],['Прервали','3','12,5% попыток'],['Медиана времени от статьи до выбора',model.kpis?.median||'—',model.kpis?.medianCaption||'Сессий расчёта: 0 · QA исключены']]).map(x=>x[0]==='Медиана времени от статьи до выбора'?articleChoiceMetric(x[1],x[2]):metric(...x))));
 const f=panel('Воронка прохождения',`Доля от ${model.stats?.attempts??24} исследовательских попыток`);for(const [label,count]of funnel)f.append(progress(label,count,model.stats?.attempts??24));
 const clicks=panel('Клики и прокрутка',source.live?'Технический разрез сохранённых событий':'Технический разрез демонстрационных событий');clicks.append(node('p','Распределение кликов','eyebrow'));clicks.append(scrollRows((model.clicks||[['Карточки товаров',148,320],['Фильтры',92,320],['Рекомендации',48,320],['Другие действия',32,320]]).map(([label,count,total])=>progress(label,count,total)),5,'Распределение кликов, прокручиваемый список'));clicks.append(notice('Глубина прокрутки',model.scrollNote||'Медиана максимальной ручной глубины: 76%. Автоматическая прокрутка исключена.'));
 screen.append(grid('columns',f,clicks));const routes=panel('Маршруты','Переходы между каталогом, статьёй и выбором');routes.append(route(model.scenarioRoute||['Начало','Процессоры','Статья','Плата','Видеокарта','БП','Корпус','Сохранение']),disclosure('Группы похожих маршрутов',table(['Маршрут','Попытки'],(model.routes||[['Выбор → статья → возврат → сохранение',10],['Выбор без статьи → сохранение',8],['Незавершённые маршруты',6]]))));screen.append(routes);
 const a=panel('Материалы в сценарии','Время на странице не доказывает чтение');a.append(limitedRows(scenarioMaterialTable(articles),5,'Показать все статьи'));screen.append(a);
}
function sessionTable(items) {
 const rows=items.map(s=>{
  const time=articleChoiceCell(s.articleChoice);
  const article=node('div');const titles=s.visits.map(a=>a.title).join(' · ');
  const label=node('span',titles||(s.visitsMeasured===false?'Открытия не измерялись':'Не открывал статьи'),'article-titles');label.title=titles||(s.visitsMeasured===false?'Открытия не измерялись':'Не открывал статьи');
  article.append(label,node('span',s.visitsMeasured===false?'Открытия не измерялись':s.visits.length?`${s.visits.length} ${s.visits.length===1?'открытие':'открытия'}`:'0 открытий','cell-secondary'));
  const entry=button(source.live?s.id.slice(0,8):s.id,()=>navigate('sessions',s.id),'text','link');entry.classList.add('session-link');entry.title=s.id;const attempt=node('div');attempt.append(entry,node('span',`${s.date} · ${s.duration} длительность · UTC+5`,'cell-secondary'));return [attempt,time,attemptStatusCell(s.attemptState,s),article];
 });
 const wrapper=table(['Попытка',articleChoiceHeader(),'Участие','Статьи'],rows);wrapper.querySelector('table').classList.add('session-table');return wrapper;
}
function sessionView(screen=$('#screen')){
 const p=panel('История попыток',model.historyCaption||'24 исследовательские попытки и 4 технические проверки',button('Экспорт данных',exportData));
 const filters=node('div',null,'filters');const search=node('label',null,'field');const searchCaption=node('span','Поиск попытки','visually-hidden');search.append(searchCaption);const input=node('input');input.type='search';input.placeholder='ID или участник';input.setAttribute('aria-label','Поиск попытки');input.value=state.query;search.append(input);
 const participation=field('Участие',participationOptions,value=>{state.participation=value;source.specimensOnly?update():render();});participation.setValue(state.participation);
 const purpose=field('Тип данных',[['research','Исследование'],['qa','QA'],['all','Все попытки']],value=>{state.purpose=value;source.specimensOnly?update():render();});purpose.setValue(state.purpose);
 purpose.firstChild.classList.add('visually-hidden');
 if(source.taskFilter){const selector=source.taskFilter(true);selector.firstChild.classList.add('visually-hidden');filters.append(selector);}filters.append(search,participation,purpose,iconButton('Сбросить фильтры','refresh-cw',()=>{state.query='';state.status='all';state.participation='all';state.purpose='research';state.related='';source.specimensOnly?update():render();}));p.append(filters);if(state.related)p.append(row(badge('Связанные сессии: '+state.related,'accent'),button('Снять отбор',()=>{state.related='';source.specimensOnly?update():render();},'text')));const results=node('div');p.append(results);
 function update(){const items=sessions.filter(s=>(!state.sessionGroup||state.sessionGroup.ids.includes(s.id))&&(!state.related||(state.related==='H2'?s.h2.opening_eligible:s.h3?.opening_eligible))&&(state.purpose==='all'||(state.purpose==='qa')===(s.qa??s.status==='qa'))&&(state.participation==='all'||s.participation===state.participation)&&`${s.id} ${s.participant}`.toLowerCase().includes(state.query.toLowerCase()));results.replaceChildren(items.length?limitedRows(sessionTable(items),10,'Показать все сессии'):empty('Попытки не найдены','Измените поиск или сбросьте фильтры.',button('Сбросить фильтры',()=>{state.query='';state.status='all';state.participation='all';state.purpose='research';state.related='';source.specimensOnly?update():render();})));}
 input.addEventListener('input',()=>{state.query=input.value;update();});update();p.append(node('p',source.live?'QA выделены и исключены из исследовательских показателей. До 500 последних попыток.':'Полная тестовая история. QA выделены и исключены из исследовательских показателей.','muted'));screen.append(p);
}
function visitTime(visit){
 if(Number.isFinite(visit.elapsed))return visit.elapsed;
 if(Number.isFinite(visit.elapsed_ms))return visit.elapsed_ms;
 const match=/^(\d+):(\d{2})$/.exec(visit.duration);return match?(Number(match[1])*60+Number(match[2]))*1000:-1;
}
function attemptNotFound(){return empty('Попытка не найдена',source.live?'Такого ID нет в загруженной истории.':'Такого ID нет в демонстрационном наборе.',button('Вернуться к сессиям',()=>navigate('sessions'),'secondary','link'));}
function detailView(id) {
 const s=sessions.find(x=>x.id===id);
 if(!s){$('#screen').append(attemptNotFound());return;}
 $('#page-title').textContent='Прохождения';$('#page-description').textContent=journalText(s.participant+' · '+scenario.title);$('#breadcrumb').replaceChildren();
 if(s.qa){
  $('#title-actions').append(iconButton('Технические сведения '+s.id,'info',()=>openTechnical(s)));
  $('#page-actions').replaceChildren(button('← К сессиям',()=>navigate('sessions'),'secondary','link'),...(source.detailActions?source.detailActions():[]),exportControl(exportData));
 }else{
  $('#page-actions').replaceChildren(...[technicalControl(s),themeControl,refreshButton(refresh),exportControl(exportData)].filter(Boolean));
 }
 $('#screen').append(approved().detail(s));

}
function sessionDetailPanels(s){
 const screen=document.createDocumentFragment(),qa=s.qa??s.status==='qa';
 if(s.participationLabel)screen.append(notice('Участие',s.participationLabel+(['abandoned','not_started'].includes(s.participation)?` · ${participationIdleMs/60000} минут без осмысленных действий.`:'')));
 screen.append(grid('metrics',metric('Результат',statuses[s.status][0],s.resultCaption||(qa?'Техническая попытка':s.status==='completed'?'Сборка сохранена':'Сборка не сохранена')),metric('Время',s.duration,'От старта попытки'),metric('Устройство',s.device,s.deviceCaption||'1395 × 1050 · образец'),metric('Материалы',s.visitsMeasured===false?'—':String(s.visits.length),'Открытия в этой попытке')));
 const h=panel('Наблюдения по гипотезам','Что произошло в этой попытке');
 let coverage;
 const observation=node('div',null,'hypothesis-observation');observation.setAttribute('aria-live','polite');
 const labels=s.coverageLabels||['H1 · не измерялось','H2 · '+h2Labels[s.h2.status],qa?'H3 · QA исключена':s.visits.length?`H3 · ${s.visits.length} открытия`:'H3 · без открытия'];
 const observations=s.observations||[['H1 · Найти сравнение','Не измерялось. '+h1Rule],['H2 · Проверяемые данные',h2Observation(s.h2)],['H3 · Подходящие материалы Клуба DNS',qa?'Техническая попытка не входит в исследовательские расчёты.':s.visits.length?`Открыто материалов: ${s.visits.length}. ${s.visits.map(v=>v.title).join(' · ')}. Открытие не доказывает чтение или влияние на выбор.`:'Материалы в этой попытке не открывались.']];
 coverage=metadataTags(labels,index=>observation.replaceChildren(notice(...observations[index])),1);coverage.classList.add('detail-coverage');
 h.append(coverage,observation);observation.replaceChildren(notice(...observations[1]));
 const r=panel('Маршрут попытки','Записанные переходы и результаты выбора');r.classList.add('attempt-route');r.append(route(s.route));if(s.comparisonMeasured===false)r.append(notice('Сравнение товаров','Не измерялось. Новые измерения сравнения в этой попытке отсутствуют.'));if(!s.route.length)r.append(node('p','Маршрут не доставлен.','muted'));if(s.returnObservation)r.append(notice('Быстрые возвраты',`Зафиксировано: ${s.returnObservation.quick_returns}. Наблюдение «Возврат»: ${s.returnObservation.wandering?'есть':'не зафиксировано'}. Порог — три возврата из товарных статей за ≤ 7 секунд без выбора между ними; общие руководства исключены.`));screen.append(grid('attempt-summary',h,r));
 const a1=s.h1,first=a1?.first_action,h1Panel=panel('H1 · Найти сравнение',h1Labels[a1?.status]||'Не измерялось');h1Panel.classList.add('h1-detail');
 const observed=value=>value===true?'Да':value===false?'Не зарегистрировано':a1?.status==='not_measured'||!a1?'Не измерялось':'Неизвестно';
 const timeCaption=a1?.time_status==='unconfirmed'?'Время не подтверждено':a1?.time_status==='no_action'?'Действий сравнения не зарегистрировано':a1?.time_status==='measured'?'От открытия каталога в этом посещении':'Не измерялось';
 h1Panel.append(grid('evidence-metrics',hypothesisMetric('H1','started',observed(a1?.started),'Одно наблюдение на сессию'),hypothesisMetric('H1','table_2plus',observed(a1?.table_2plus),'Товары одной категории'),hypothesisMetric('H1','time',h1Time(a1?.time_to_first_action_ms),timeCaption)),notice('Первое действие',first?`${comparisonActionNames[first.action]||first.action} · ${categoryNames[first.category_id]||'Категория не записана'}`:a1?.eligible?'Не зарегистрировано':'Не измерялось или не доставлено'),notice('Состояние измерения',`${h1Labels[a1?.status]||'Не измерялось'}${a1?.coverage==='partial'?' · Частичные данные':''}${a1?.incomplete?' · Есть разрыв':''} · ${qa?'QA исключена из сводки':a1?.eligible?'Входит в сводку':'Не входит в знаменатель'}`));
 if(a1?.table_reached)h1Panel.append(notice('Таблица с 2+ товарами',categoryNames[a1.table_reached.category_id]||'Категория не записана'));
 screen.append(h1Panel);
 screen.append(heartDetail('H2',s.h2,model.title),heartDetail('H3',s.h3,model.title));
 const a=panel('Время в статьях','Прямые входы и обновления сохраняются отдельными посещениями');
 a.append(s.visits.length?limitedRows(materialTable(['Материал','Время','Ручная глубина','Связь с выбором'],s.visits.map((visit,index)=>({visit,index})).sort((a,b)=>visitTime(b.visit)-visitTime(a.visit)).map(({visit,index})=>[visit.title,visit.duration,visit.depth==null?'—':Math.round(visit.depth)+'%',visit.after||'Продолжил работу'])),3,'Показать все статьи'):empty('Статьи не открывались',s.visitsMeasured===false?'Открытия не измерялись.':'В этой попытке нет зарегистрированных посещений материалов.'));screen.append(a);
 const b=panel('Итоговая сборка',`${s.build.length} деталей · ${s.saved?'сохранена':s.status==='completed'?'сохранена':'последний известный состав'}`,badge(formatPrice(s.total),s.status==='completed'?'success':'neutral'));
 b.classList.add('build-panel');b.append(s.build.length?limitedRows(buildTable(s.build.map(([category,name,price])=>[category,name,buildPrice(price)])),3,'Показать все комплектующие'):empty('Детали не выбраны',source.live?'Последний известный состав пуст или не доставлен.':'Попытка прервана до первого выбора.'));
 const e=panel('Журнал событий','От начала попытки · основные действия');e.classList.add('events-panel');const eventList=timeline(s.events);if(s.events.length>5){const viewport=node('div',null,'event-scroll');viewport.tabIndex=0;viewport.setAttribute('role','region');viewport.setAttribute('aria-label','Журнал событий, прокручиваемый список');viewport.append(eventList);e.append(viewport);}else e.append(eventList);screen.append(grid('columns',b,e));
 return screen;
}

let eventResize,refreshing=false;
async function refresh(){if(refreshing)return;refreshing=true;state.layoutFacts=null;state.layoutError=null;try{if(source.refresh)await source.refresh();else{state.demoState='ready';render();toast('Тестовые данные обновлены');}}finally{refreshing=false;const control=$('#page-actions [aria-label="Обновить"]');if(control){control.disabled=false;control.removeAttribute('aria-busy');}}}

function sizeEventLists(){
 eventResize?.disconnect();eventResize=new ResizeObserver(entries=>{for(const {target}of entries){const items=target.children;const limit=Number(target.parentElement.dataset.limit)||5;if(items.length>limit)target.parentElement.style.height=(items[limit].offsetTop-items[0].offsetTop)+'px';}});
 for(const list of root.querySelectorAll('.event-scroll>.timeline,.scroll-rows>.scroll-rows-list'))eventResize.observe(list);
}
function render(){
 renderCollectionHeader();
 const parts=(source.route||location.hash.slice(1)).split('/');state.section=views[parts[0]]?parts[0]:'overview';const [title,description]=views[state.section];
 $('#page-title').textContent=title;$('#page-description').textContent=journalText(state.section==='overview'?`Выбор комплектующих · ${model.overview?.attempts??scenario.attempts??0} исследовательских попыток`:description);$('#breadcrumb').replaceChildren();document.title=`${title} · ${source.live?'Журнал тестирования':'Макет журнала'} DNS`;
 for(const a of $('#navigation').children){if(a.dataset.section===state.section)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}
 $('#page-actions').replaceChildren(...[themeControl,refreshButton(refresh),exportControl(exportData)].filter(Boolean));
 if(refreshing){const control=$('#page-actions [aria-label="Обновить"]');control.disabled=true;control.setAttribute('aria-busy','true');}
 $('#title-actions').replaceChildren();if($('#technical-dialog').open)$('#technical-dialog').close();
 ensureLayoutFacts();
 $('#screen').replaceChildren();$('#screen').classList.toggle('hypotheses-screen',state.section==='hypotheses');
 if(state.demoState==='ready'){if(parts[1]&&state.section==='sessions')detailView(parts[1]);else approvedView(state.section);}else{const p=panel(title);p.append(stateContent());$('#screen').append(p);}
 if(!source.live)$('#screen').append(statePreview());sizeEventLists();
 if(state.section==='hypotheses'&&state.focusHypothesis){state.hypothesis=state.focusHypothesis;state.focusHypothesis=null;const target=$('[data-hypothesis-statement]');requestAnimationFrame(()=>{if(target?.isConnected){target.focus({preventScroll:true});target.scrollIntoView({block:'start'});}});}
}
if(source.specimensOnly){state.layoutFacts=source.specimenFacts||null;library();sizeEventLists();root.addEventListener('click',event=>{const href=event.target.closest('a')?.getAttribute('href');if(!href?.startsWith('#'))return;event.preventDefault();const [section,id]=href.slice(1).split('/');navigate(section,id);});return;}
// Service links open previews without creating respondent attempts.
const shortcuts=node('div',null,'journal-shortcuts');
for(const [label,glyph,href]of [
 ['Демонстрация изменений','square-line-vertical','/?preview=1&demo=changes'],
 ['Чистый прототип','layout-header-side-content',prototypeLink?.getAttribute('href')||'/?preview=1']
]){
 const entry=node('a',null,'button secondary icon-button');entry.href=href;entry.target='_blank';entry.rel='noopener';entry.setAttribute('aria-label',label);entry.dataset.journalControl='action';entry.append(icon(glyph));shortcuts.append(infoTooltip(label,label,{trigger:entry}));
}
$('.sidebar')?.prepend(shortcuts);
const heading=$('.page-heading'),topbar=$('.topbar');if(heading&&topbar)topbar.prepend(heading);
$('#breadcrumb').hidden=true;$('#page-description').hidden=true;
for(const [id,[title]]of Object.entries(views)){const item=navigationItem(id,title);if(source.navigate)item.addEventListener('click',event=>{event.preventDefault();navigate(id);});$('#navigation').append(item);}
if(source.navigate)$('#breadcrumb').addEventListener('click',event=>{const entry=event.target.closest('a');if(entry?.getAttribute('href')?.startsWith('#')){event.preventDefault();navigate(entry.getAttribute('href').slice(1));}});
initializeJournalTheme(root,$('#theme-toggle'),source.themeKey||'journal-demo-theme');
if($('#system'))library();render();if(!source.navigate)window.addEventListener('hashchange',()=>{state.demoState='ready';render();$('#page-title').setAttribute('tabindex','-1');$('#page-title').focus({preventScroll:true});});


return {update(next,section,id,filters){if(filters)Object.assign(state,filters);model=next;({scenario,sessions,statuses,hypotheses,articles,funnel,hypothesisStats,formatPrice}=model);state.collection=model.collection;state.section=section||state.section;source.route=id?'sessions/'+id:state.section;state.demoState='ready';render();},showState(value){state.demoState=value;render();},notify:toast,confirm:confirmDialog};
}
