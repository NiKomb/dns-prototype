import {sessionTable} from './session-table.js';
import {node,button,detailsButton,panel,metric,metricWithInfo,table,tabs,disclosure as baseDisclosure,empty,timeline,field,badge,icon,infoTooltip,notice} from './components.js';
import {journalText,journalTextWithoutPeriods} from './text.js';
import {hypothesisMetric,hypothesisMetricCopy,metricExplanation,overviewMetricCopy,reviewMetricCopy,comparisonStageCopy} from './hypothesis-metric-copy.js';
import {h1Time,h1Rule,h1Limit} from './real-model.js';
import {heartLimits} from './heart-view.js';
import {categoryNames} from '../telemetry/registry.js';
import {attemptStateCaption} from './attempt-state.js';
import {participationLabels} from '../telemetry/participation.js';

const group=(className,...contents)=>{const e=node('div',null,className);e.append(...contents);return e;};
const disclosure=(title,...contents)=>baseDisclosure(title,group('',...contents));
let materialListSerial=0,actionListSerial=0;
const copy=text=>node('p',text,'muted');
const remark=text=>{const root=node('p',null,'muted journal-note'),glyph=node('span','\ue927','journal-icon dns-icon journal-note-icon');glyph.setAttribute('aria-hidden','true');root.append(glyph,node('span',text.replace(/\.\s*$/, '')));return root;};
const spacedRemark=text=>{const root=remark(text);root.classList.add('approved-spaced-note');return root;};
const countColumn=(root,values)=>{root.style.setProperty('--journal-row-count-width',Math.max(2,...values.map(value=>String(value).length))+'ch');return root;};
const metricHeadings={
 H1:['Дошли до таблицы с несколькими товарами','Начали использовать','До первого действия'],
 H2:['Выбрали деталь после просмотра данных','Просмотрели целевые данные','От показа данных до выбора'],
 H3:['Просмотрели рекомендацию и выбрали','Просмотрели рекомендацию','От открытия статьи до выбора']
};
export function reviewRow(entry,contents){
 const root=node('details',null,'approved-review'),trigger=node('summary'),label=node('span',null,'approved-review-label');
 trigger.dataset.journalControl='row';
 const info=infoTooltip('Как считается: '+entry.label,metricExplanation(reviewMetricCopy[entry.id]));
 info.addEventListener('click',event=>event.stopPropagation());
 const text=journalText(entry.label),split=text.lastIndexOf(' '),tail=node('span',null,'approved-review-tail');
 tail.append(node('span',text.slice(split+1)),info);
 label.append(node('span',text.slice(0,split+1)),tail);
 trigger.append(node('strong',String(entry.ids.length)),label,icon('chevron-down'));
 root.append(trigger,group('approved-review-content',contents));return root;
}
export function materialRow(title,visits,action,href=null){
 const row=action?button('',action,'text','row'):node(href?'a':'div',null,'approved-material-static');row.classList.add('approved-material');row.title=title;row.setAttribute('aria-label',title+' · '+visits+' посещений');
 row.append(node('strong',String(visits)),node('span',title,'approved-material-title'));if(action)row.append(icon('chevron-right'));
 if(href){row.href=href;row.target='_blank';row.rel='noopener noreferrer';infoTooltip(title,'Статья откроется в новой вкладке',{trigger:row,hoverDelay:400});}
 return row;
}
const count=ids=>ids?.length??null;
const display=n=>n===null||n===undefined?'н/д':String(n);
const savedCaption=s=>attemptStateCaption(s.attemptState||s.overview?.build);

export function approvedLayout({model,state,navigate,rerender,retryLayout,openGroup,sessionLink,openTechnical}){
 const facts=state.layoutFacts;
 const link=(label,action)=>button(label,action,'text','link');
 const session=s=>sessionLink(s);
 const grouped=(label,ids,name,variant='text')=>{const b=button(label,()=>openGroup(ids,name),variant,variant==='text'?'link':'action');b.disabled=!Array.isArray(ids);if(ids)b.dataset.sessionIds=ids.join(',');b.dataset.groupName=name;return b;};
 const section=(title,description,action)=>panel(title,description,action);
 const heading=(title,action)=>group('approved-heading',node('h2',title),...(action?[action]:[]));
 const dataNote=()=>state.layoutError?group('',copy('Расчёт не завершён: '+state.layoutError),link('Повторить расчёт',retryLayout)):copy(!facts?'Загружаем показатели':`Без заданной категории · ${facts.eligible} пригодных из ${model.kpis.attempts} сессий; у времени — своя выборка замеров.`);
 function metrics(h){
  const a=h.measurements,main=h.id==='H1'?'table_2plus':'selection',secondary=h.id==='H1'?'started':'viewing',t=h.id==='H1'?a?.time_to_first_action:a?.time;
  const pct=r=>r?.denominator>0?Math.round(r.percent)+'%':'Нет данных';
  const caption=(r,suffix)=>r?.denominator>0?`${r.numerator} из ${r.denominator} ${suffix}`:'Нет данных для расчёта';
  const values=[hypothesisMetric(h.id,main,pct(a?.[main]),caption(a?.[main],h.id==='H1'?'пригодных сессий':'просмотревших')),hypothesisMetric(h.id,secondary,pct(a?.[secondary]),caption(a?.[secondary],h.id==='H1'?'с каталогом':h.id==='H2'?'открывших':'с предложением')),hypothesisMetric(h.id,'time',h1Time(t?.median_ms),`Медиана · ${t?.sessions??0} сессий`)];
  const labels=metricHeadings[h.id];
  values.forEach((e,i)=>e.querySelector('.metric-heading>span').textContent=journalText(labels[i]));return values;
 }

 function narrative(id){
  const a=model.hypothesisStats[id];
  if(id==='H1')return [a?.started?.denominator?`Из ${a.started.denominator} пригодных сессий с каталогом ${a.started.numerator} начали использовать сравнение, ${a.table_2plus.numerator} дошли до таблицы с двумя и более товарами.`:'Нет пригодных измеренных сессий с каталогом. Старые, частичные и разорванные записи не означают отказ от сравнения.',`До первого действия: ${Number.isFinite(a?.time_to_first_action?.median_ms)?'медиана '+h1Time(a.time_to_first_action.median_ms):'не измерено — нет пригодной цепочки каталога и действия'} · ${a?.time_to_first_action?.sessions??0} замеров.`];
  const before=a?.before??0,after=a?.after??0,both=a?.both??0;
  if(id==='H2')return [a?.viewing?.denominator?`Статью с измерением показа открыли ${a.viewing.denominator} сессий; в ${a.viewing.numerator} целевые данные были показаны пять секунд подряд.`:'Нет пригодной выборки с измерением показа целевых данных.',a?.selection?.denominator?`После показа данных и возврата выбрали или заменили деталь той же категории ${a.selection.numerator} из ${a.selection.denominator} сессий. Выбор только до просмотра не засчитывается.`:'Нет подтверждённых просмотров целевых данных для расчёта последующего выбора.',`От начала показа данных до последующего выбора: ${Number.isFinite(a?.time?.median_ms)?'медиана '+h1Time(a.time.median_ms):'не измерено — нет подходящей последовательности показа и выбора'} · ${a?.time?.sessions??0} замеров.`];
  return [a?.viewing?.denominator?`${id==='H2'?'Подходящую статью открыли':'Материалы предложены'} ${a.viewing.denominator} ${id==='H2'?'сессий':'сессиям'}; ${a.viewing.numerator} выполнили критерий просмотра.`:'Нет пригодной выборки для просмотра. Наличие открытия и достаточность записи проверяются отдельно.',`Связанный выбор после просмотра и возврата — ${before+both} сессий, просмотр после выбора — ${after+both}; «оба порядка» — ${both}. Эти итоги пересекаются и не складываются.`,`От ${id==='H2'?'подтверждённого показа практических данных':'подтверждённого открытия рекомендации'} до последующего выбора: ${Number.isFinite(a?.time?.median_ms)?'медиана '+h1Time(a.time.median_ms):'не измерено — нет пригодного начала времени и связанного выбора'} · ${a?.time?.sessions??0} замеров.`];
 }
 function hypothesisCard(h){
  const p=node('article',null,'panel approved-hypothesis');p.dataset.overviewHypothesis=h.id;
  p.setAttribute('aria-label','Подробнее: '+h.id+' · '+hypothesisMetricCopy[h.id][h.id==='H1'?'table_2plus':'selection'].title);
  p.addEventListener('click',event=>{if(event.target.closest('.approved-statement'))return;event.preventDefault();event.stopPropagation();state.hypothesis=h.id;navigate('hypotheses');});
  const a=h.measurements,mainKey=h.id==='H1'?'table_2plus':'selection',secondaryKey=h.id==='H1'?'started':'viewing';
  const pct=r=>r?.denominator>0?Math.round(r.percent)+'%':'Нет данных';
  const primary=a?.[mainKey],secondary=a?.[secondaryKey],time=h.id==='H1'?a?.time_to_first_action:a?.time;
  const auxRow=(label,value,caption)=>group('approved-aux-row',group('approved-fact-line',node('strong',value),group('approved-metric-copy',node('small',caption),copy(label))));
  const main=auxRow(metricHeadings[h.id][0],pct(primary),primary?.denominator>0?`${primary.numerator} из ${primary.denominator} ${h.id==='H1'?'пригодных сессий':'просмотревших'}`:'Нет данных для расчёта');main.classList.add('approved-primary');
  const aux=[auxRow(metricHeadings[h.id][1],pct(secondary),secondary?.denominator>0?`${secondary.numerator} из ${secondary.denominator} ${h.id==='H1'?'с каталогом':h.id==='H2'?'открывших':'с предложением'}`:'Нет данных для расчёта'),auxRow(metricHeadings[h.id][2],h1Time(time?.median_ms),`Медиана · ${time?.sessions??0} сессий`)];
  const head=node('header'),titleLink=node('a',h.id+' · '+hypothesisMetricCopy[h.id][mainKey].title,'approved-hypothesis-link');titleLink.href='#hypotheses';const title=node('h3');title.append(titleLink);head.append(title);
  const text=node('details',null,'approved-review approved-statement'),trigger=node('summary',null,'approved-statement-trigger');
  trigger.dataset.journalControl='row';
  const statementCopy=node('span',journalTextWithoutPeriods(h.description));
  if(h.id==='H2')statementCopy.replaceChildren(...h.description.split(/(?=в статье |о комплектующих |характеристики, |то после возврата |он выберет |той же категории\.)/).map(line=>node('span',journalTextWithoutPeriods(line),'approved-statement-line')));
  trigger.append(statementCopy,icon('chevron-down'));text.append(trigger);
  let statementMotion=null,statementExpanded=false;
  trigger.addEventListener('click',event=>{
   event.preventDefault();
   const from=text.getBoundingClientRect().height;
   statementMotion?.cancel();
   if(!text.open){p.querySelector('.approved-card-metrics').scrollTop=0;p.style.setProperty('--journal-hypothesis-height',p.getBoundingClientRect().height+'px');}
   statementExpanded=!statementExpanded;
   text.open=statementExpanded;
   const to=text.getBoundingClientRect().height;
   text.open=true;
   text.style.overflow='hidden';
   // Match the demo panel's 220 ms ease, including under reduced motion by request.
   statementMotion=text.animate([{height:from+'px'},{height:to+'px'}],{duration:220,easing:'ease'});
   statementMotion.onfinish=()=>{
    text.open=statementExpanded;
    statementMotion.cancel();statementMotion=null;text.style.removeProperty('overflow');
    if(!statementExpanded){p.style.removeProperty('--journal-hypothesis-height');p.querySelector('.approved-card-metrics').scrollTop=0;}
   };
  });
  head.append(text);p.append(head,group('approved-card-metrics',main,...aux));return p;
 }
 function reviewList(entry){
  const list=node('div',null,'approved-session-links'),names=node('div',null,'approved-session-names');
  const items=entry.ids.map(id=>model.sessions.find(s=>s.id===id)).filter(Boolean);
  items.forEach((item,index)=>{const name=node('span',null,'approved-session-name');name.append(session(item));if(index<items.length-1){const separator=node('span',null,'approved-session-separator');separator.setAttribute('aria-hidden','true');name.append(separator);}names.append(name);});
  if(!entry.ids.length)names.append(copy('Таких прохождений в текущей выборке нет.'));
  const more=grouped('',entry.ids,entry.label);more.classList.add('approved-review-group');more.setAttribute('aria-label','Открыть группу: '+entry.label);more.title='Открыть группу: '+entry.label;more.append(icon('chevron-right'));more.disabled=!entry.ids.length;
  list.append(names,more);return list;
 }
 function materialList(all=false){
  const list=node('div',null,'approved-materials'),materials=facts?.materials.map(a=>[model.title(a.id),model.articlePath?.(a.id),a.visits])||[],rows=all?materials:materials.slice(0,3);
  countColumn(list,rows.map(([, ,visits])=>visits));
  if(!facts){list.append(dataNote());return list;}
  if(!rows.length)list.append(copy('В этой выборке нет зарегистрированных посещений материалов.'));
  for(const [title,href,visits]of rows)list.append(materialRow(title,visits,all?null:()=>{state.hypothesis='H3';state.materials=true;navigate('hypotheses');},all?href:null));return list;
 }
 function overview(){
  const root=node('div',null,'approved-content');root.dataset.approvedSection='overview';root.dataset.calculation=state.layoutError?'error':facts?'ready':'loading';
  const a=model.overview,summary=group('approved-summary',metricWithInfo('Сохранили полную сборку',a?.attempts>0?Math.round(a.completed/a.attempts*100)+'%':'Нет данных',a?.attempts>0?`${a.completed} из ${a.attempts}`:'Нет исследовательских попыток','Как считаем сохранённые сборки',metricExplanation(overviewMetricCopy.saved)));
  summary.firstChild.classList.add('approved-kpi');
  const savedIds=a?.facts?.filter(attempt=>!attempt.qa&&attempt.stages.saved_full).map(attempt=>attempt.id);summary.firstChild.querySelector('strong').replaceWith(grouped(a?.attempts>0?Math.round(a.completed/a.attempts*100)+'%':'Нет данных',savedIds,'Сохранили полную сборку'));
  const assembled=a?.stages?.find(stage=>stage.id==='assembled'),assembledIds=a?.facts?.filter(attempt=>!attempt.qa&&attempt.stages.assembled).map(attempt=>attempt.id);
  const assembledValue=a?.attempts>0&&Number.isFinite(assembled?.count)?Math.round(assembled.count/a.attempts*100)+'%':'Нет данных';
  const choice=metricWithInfo('Собрали пять деталей',assembledValue,a?.attempts>0&&assembled?`${assembled.count} из ${a.attempts}`:'Нет исследовательских попыток','Как считаем сборки из пяти деталей',metricExplanation(overviewMetricCopy.assembled));
  choice.querySelector('strong').replaceWith(grouped(assembledValue,assembledIds,'Собрали пять деталей'));choice.classList.add('approved-kpi');
  const time=metricWithInfo('Медиана времени от открытия каталога до выбора',facts?Number.isFinite(facts.time.median_ms)?h1Time(facts.time.median_ms):'н/д':state.layoutError?'Расчёт не завершён':'Расчёт…',facts?`${facts.time.ids.length} замеров`:'По сохранённым фактам','Как считаем время до выбора',metricExplanation(overviewMetricCopy.time));
  time.querySelector('strong').replaceWith(grouped(facts?Number.isFinite(facts.time.median_ms)?h1Time(facts.time.median_ms):'н/д':state.layoutError?'Расчёт не завершён':'Расчёт…',facts?.time.ids,'Замеры от каталога до ручного выбора'));time.classList.add('approved-kpi','approved-time-kpi');summary.append(choice,time);
  for(const item of summary.children){
   // circle-info occupies 1..15 in its native 16px viewBox; remove that empty rim here.
   item.querySelector('.metric-heading .journal-icon').setAttribute('viewBox','1 1 14 14');
   const label=item.querySelector('.metric-heading>span'),action=item.querySelector(':scope>.button');item.setAttribute('aria-label',label.textContent);label.classList.add('approved-kpi-label');
   item.setAttribute('role','link');item.setAttribute('aria-disabled',String(action.disabled));if(!action.disabled)item.tabIndex=0;
   action.tabIndex=-1;item.addEventListener('click',event=>{if(event.target.closest('button,.journal-tooltip'))return;action.click();});
   item.addEventListener('keydown',event=>{if(event.target===item&&(event.key==='Enter'||event.key===' ')){event.preventDefault();action.click();}});
  }
  root.append(summary);if(!facts)root.append(group('approved-result-note',dataNote()));
  root.append(group('approved-grid3',...model.hypotheses.map(hypothesisCard)));
  const review=countColumn(section('Незавершённые попытки'),(facts?.review||[]).map(entry=>entry.ids.length));
  review.classList.add('approved-attempt-review');
  for(const entry of facts?.review||[])review.append(reviewRow(entry,reviewList(entry)));
  if(!facts)review.append(dataNote());review.append(remark('Только прекратившие участие'));
  const allMaterials=button('Все →',()=>{state.hypothesis='H3';state.materials=true;navigate('hypotheses');});allMaterials.disabled=!facts;const materials=section('Какие материалы открывали',null,allMaterials);materials.classList.add('approved-overview-materials');materials.append(materialList());root.append(group('approved-grid2',review,materials));
  const comparison=section('Добавление и выбор из сравнения',null,button('Все →',()=>{state.scenario='comparison';navigate('scenarios');}));
  function comparisonContent(){
   const rows=facts?.comparison.rows.map(r=>[categoryNames[r.id],grouped(String(r.table.length),r.table,'Таблица 2+ · '+categoryNames[r.id]),grouped(r.inside_known?String(r.inside.length):'н/д',r.inside_known?r.inside:undefined,'Выбор в таблице · '+categoryNames[r.id]),grouped(r.returned_known?String(r.returned.length):'н/д',r.returned_known?r.returned:undefined,'Выбор после возврата · '+categoryNames[r.id])])||[];
   if(rows.length){
    const tableIds=[...new Set(facts.comparison.rows.flatMap(r=>r.table))];
    rows.push(['Всего уникальных сессий',grouped(String(tableIds.length),tableIds,'Таблица 2+ · Все категории'),comparisonControl('inside','','Выбрали в сравнении'),comparisonControl('returned','','Выбрали после возврата в каталог')]);
   }
   const content=node('div',null,'approved-comparison');content.append(rows.length?table(['Категория','Таблица с 2+ товарами','Выбрали в сравнении','Выбрали после возврата в каталог'],rows):copy(facts?facts.comparison.eligible?'В пригодной выборке нет зарегистрированных таблиц с двумя товарами.':'Нет пригодных измеренных сессий с каталогом. Старые и неполные записи не дают результата сравнения.':'Расчёт сравнения…'),remark('Уникальные прохождения. Категории и способы выбора могут пересекаться'));
   if(facts&&(facts.comparison.inside_unknown.length||facts.comparison.returned_unknown.length))content.append(remark('Для части прохождений связь выбора неизвестна'));
   return content;
  }
  for(const panel of [review,materials,comparison])panel.classList.add('approved-outcome-panel');
  comparison.append(comparisonContent());root.append(comparison);
  return root;
 }
 function hypotheses(){
  const root=node('div',null,'approved-content');root.dataset.approvedSection='hypotheses';const id=state.hypothesis||'H1',h=model.hypotheses.find(h=>h.id===id);
  root.append(tabs([['H1','H1 · Сравнение'],['H2','H2 · Данные'],['H3','H3 · Материалы']],id,value=>{state.hypothesis=value;state.materials=false;rerender();},'Выбор гипотезы',{animated:true}));
  const statement=section(h.id+' · '+h.title),description=node('p',null,'approved-full-statement');description.textContent=journalTextWithoutPeriods(h.description);statement.dataset.hypothesisStatement=id;statement.append(description);root.append(statement);
  const measures=section('Наблюдаемые показатели');measures.classList.add('approved-measurements');
  const relatedScenario=button('Связанный сценарий →',()=>{state.scenario=id==='H1'?'comparison':'selection';navigate('scenarios');});relatedScenario.classList.add('approved-related-scenario');
  measures.append(group('approved-metric-grid',...metrics(h)),relatedScenario);
  const result=section(id==='H1'?'Что наблюдаем в сравнении':'Обращение к информации');result.classList.add('approved-observations');result.append(...narrative(id).map(t=>node('p',t)));
  const limits=id==='H1'?group('h3-explanations',notice('Правило расчёта',h1Rule),notice('Ограничение и интерпретация',h1Limit),notice('Вне расчёта',`Не измерялось: ${h.measurements?.not_measured??0} · Частичные данные: ${h.measurements?.partial??0} · Разрывы: ${h.measurements?.incomplete??0} · Без открытия каталога: ${h.measurements?.no_catalog??0} · QA: ${h.measurements?.excluded_qa??0}`)):heartLimits(id,h.measurements);
  const rules=disclosure('Правила расчёта и ограничения',limits,remark('Отсутствие измерения не означает отсутствие действия.'));rules.classList.add('approved-calculation-rules');
  const rulesTrigger=rules.querySelector('summary');rulesTrigger.classList.add('button','secondary','accent','has-icon');rulesTrigger.dataset.journalControl='action';
  result.append(rules);root.append(group('approved-report-grid',measures,result));
  const relevant=model.sessions.filter(s=>!s.qa&&(id==='H1'?s.h1?.eligible&&(s.h1.started||s.h1.table_2plus):s[id.toLowerCase()]?.opening_eligible&&s[id.toLowerCase()].opened>0));
  const evidence=section('Прохождения для проверки',null,grouped('Все →',relevant.map(s=>s.id),id+' · Прохождения для проверки','secondary'));
  const observation=s=>id==='H1'?s.activity?.comparison||'Недостаточно данных':id==='H2'?(s.h2?.selected?'Просмотрели целевые данные, вернулись и выбрали деталь':s.h2?.viewed?'Целевые данные показаны; последующий выбор не зарегистрирован':'Открытие зарегистрировано; показ целевых данных не подтверждён'):s[id.toLowerCase()]?.selected?({before:'Просмотрели статью, вернулись и выбрали деталь',after:'Выбрали деталь до просмотра статьи',both:'Зарегистрированы оба порядка просмотра и выбора'})[s[id.toLowerCase()].order]:s[id.toLowerCase()]?.viewed?'Выполнили критерий просмотра; связанный выбор не зарегистрирован':'Открытие зарегистрировано; подходящий просмотр не подтверждён';
  evidence.append(relevant.length?table(['Сессия','Наблюдение','Сборка'],relevant.slice(0,2).map(s=>[session(s),observation(s),savedCaption(s)])):copy('В текущей выборке нет пригодных прохождений для этого наблюдения.'));root.append(evidence);
  if(id==='H3'){
   const materialsPanel=section('Материалы в прохождениях'),list=materialList(true),rows=[...list.querySelectorAll('.approved-material')];materialsPanel.classList.add('approved-session-materials');materialsPanel.append(list);
   if(rows.length>5){
    list.id='journal-materials-'+(++materialListSerial);let expanded=false;
    const toggle=button('Раскрыть',()=>{expanded=!expanded;update();},'secondary accent');toggle.classList.add('approved-materials-more','has-icon');toggle.setAttribute('aria-controls',list.id);
    function update(){rows.forEach((row,index)=>row.hidden=!expanded&&index>=5);toggle.replaceChildren(node('span',expanded?'Свернуть':'Раскрыть'),icon(expanded?'chevron-up':'chevron-down'));toggle.setAttribute('aria-expanded',String(expanded));}
    materialsPanel.querySelector('.panel-heading').append(toggle);update();
   }
   root.append(materialsPanel);
  }
  return root;
 }
 function flow(labels,groups,compact=false,bases=[]){
  const list=node('ol',null,'approved-flow'+(compact?' compact':''));
  labels.forEach((label,i)=>{
   const ids=groups?.[i],previous=groups?.[i-1],reached=i?ids&&previous?ids.filter(id=>previous.includes(id)):undefined:ids;
   const n=count(reached),d=count(previous),li=node('li'),control=grouped('',reached,label);control.classList.add('approved-flow-control');
   const value=i?d>0&&n!==null?`${Math.round(n/d*100)}%`:'н/д':display(n);
   const sessionWord=n!==null?new Intl.PluralRules('ru').select(n):null;
   const fraction=i?n!==null&&d!==null?`· ${n} из ${d}`:'':n!==null?({one:'сессия',few:'сессии',many:'сессий',other:'сессии'}[sessionWord]):'Нет данных';
   control.append(node('span',label),group('approved-flow-fact',node('strong',value),node('small',fraction,'muted')));
   if(i)control.append(node('small',n!==null&&d!==null?bases[i]||'сессий предыдущего шага':'Нет данных для перехода','approved-flow-base muted'));
   li.dataset.stepNumerator=n??'';if(i)li.dataset.stepDenominator=d??'';li.append(control);list.append(li);
  });return list;
 }
 function comparisonText(kind){return facts?.comparison[kind+'_known']?String(facts.comparison[kind].length):'н/д';}
 function comparisonControl(kind,label,title,variant='text'){return grouped((label?label+': ':'')+comparisonText(kind),facts?.comparison[kind+'_known']?facts.comparison[kind]:undefined,title,variant);}
 function comparisonChoices(){return group('approved-choice-types',comparisonControl('inside','В таблице','Выбрали в сравнении','secondary'),comparisonControl('returned','После возврата','Выбрали после возврата в каталог','secondary'),...(facts&&(facts.comparison.inside_unknown.length||facts.comparison.returned_unknown.length)?[remark('Для части прохождений связь выбора неизвестна')]:[]));}
 function infoTable(){
  const rows=['H2','H3'].map(id=>{const f=facts?.[id],a=model.hypothesisStats[id],time=group('',grouped(h1Time(a?.time?.median_ms),f?.time,id+' · Время до выбора'),copy(Number.isFinite(a?.time?.median_ms)?`${a.time.sessions} замеров · ${id==='H2'?'от показа данных':'от открытия'}`:'Нет данных для расчёта времени'));return [id,...['opened','viewed','before','after','both'].map(key=>grouped(display(count(f?.[key])),f?.[key],id+' · '+key)),time];});
  const t=table(['Измерение','Открыли','Просмотрели','Только выбор после возврата','Только просмотр после выбора','Оба порядка','Время до выбора'],rows);t.classList.add('approved-info-table');return t;
 }
 function scenarioRoute(labels){
  const route=node('div',null,'approved-scenario-route');route.setAttribute('aria-label','Порядок действий');labels.forEach((label,i)=>{if(i)route.append(icon('chevron-right'));route.append(badge(label));});return route;
 }
 function groundsBlock(title,steps,text,important){
  const block=group('approved-ground',node('h3',title));
  if(steps.length)block.append(scenarioRoute(steps));
  if(text)block.append(copy(text));
  if(important)block.append(group('approved-ground-important',node('strong',important)));
  return block;
 }
 function scenarioGrounds(comparison){
  const common=groundsBlock('Что не учитываем',[],
   'Тестовые, старые записи без нужных измерений, неполные записи и записи с разрывами не входят в соответствующий расчёт.',
   'Неизвестное действие не считаем отказом, неизвестное время не заменяем нулём');
  const blocks=comparison?[
   groundsBlock('Как связываем действия',['Каталог','Сравнение','Таблица 2+','Выбор детали'],
    'Проверяем порядок действий в одном прохождении, вкладке и посещении каталога, для одного сравнения. В таблице должны быть два разных товара одной категории.',
    'Нажатие кнопки ещё не означает, что участник дошёл до таблицы или выбрал деталь'),
   groundsBlock('Как считаем выбор',[],
    'Разделяем выбор внутри таблицы и выбор после подтверждённого возврата в каталог. Если связь с таблицей неизвестна, результат не приписываем сравнению. Не измеряем, заметил ли участник вход в сравнение.',
    'Сравнение необязательно для выбора. Эти данные не доказывают, что оно стало причиной выбора'),
   common
  ]:[
   groundsBlock('Как считаем прохождения',[],
    'Пять деталей засчитываем, даже если сборка не сохранена. Одно прохождение учитываем один раз. Долю собранных и сохранённых сборок считаем от всех исследовательских попыток задания.',
    'Пять деталей в сборке и сохранение сборки — разные результаты'),
   groundsBlock('Основной путь',['Начало задания','Каталог','Выбор или замена','Сохранение пяти деталей'],
    'Для переходов проверяем порядок действий одного прохождения. Каждый процент считаем от предыдущего шага; независимые счётчики не делим друг на друга.'),
   groundsBlock('Быстрый подбор',['Начало задания','Вызов ленты','Добавление через плюс'],
    'Каталог открывать не требуется. Проверяем одну категорию, вкладку и посещение конфигуратора. Каждый шаг учитываем один раз до первого сохранения.'),
   groundsBlock('Статья',['Открытие','Просмотр','Возврат','Выбор той же категории'],
    'В выбор после просмотра входят группы «только после возврата» и «оба порядка», каждое прохождение один раз. Просмотр только после уже сделанного выбора сюда не входит.',
    'H2, H3, сравнение и быстрый подбор могут пересекаться — их итоги не складываем'),
   groundsBlock('Время в каталоге',[],
    'От открытия до ручного выбора той же категории в том же посещении и вкладке. Повторное открытие начинает новый отсчёт; закрытие завершает его. Берём первую подходящую последовательность.',
    'Выбор без связанного каталога засчитываем, но время для него не считаем'),
   groundsBlock('Время после просмотра',[],
    'Для H2 — от показа практических данных, для H3 — от открытия рекомендации. До выбора считаем отдельные медианы и число замеров.',
    'Просмотр и последующий выбор не доказывают, что материал помог или повлиял на решение'),
   common
  ];
  return disclosure('Основания и исключения',group('approved-grounds-grid',...blocks));
 }
 function scenarios(){
  const source=scenarioContent(),selected=state.scenario||'comparison';
  const root=node('div',null,'approved-content');root.dataset.approvedSection='scenarios';
  root.append(source.firstElementChild);
  const proposal=node('section',null,'approved-scenario-version');proposal.dataset.scenarioVersion='new';proposal.setAttribute('aria-label','Сценарий участника');
  const blocks=[...source.children],route=section('Путь участника'),observations=section('Дополнительные наблюдения');
  let steps,grounds;
  if(selected==='comparison'){
   const [intro,path,recorded,stages,rules]=blocks;
   route.append(path);
   steps=stages;observations.append(steps.querySelector('.approved-choice-types'));
   const stepTiles=steps.querySelectorAll('.approved-flow>li');
   Object.values(comparisonStageCopy).forEach((explanation,i)=>stepTiles[i+1]?.append(infoTooltip('Как считается этап: '+stepTiles[i+1].querySelector('.approved-flow-control>span').textContent,metricExplanation(explanation))));
   const rows=facts?.comparison.rows.map(r=>[categoryNames[r.id],grouped(String(r.table.length),r.table,'Таблица 2+ · '+categoryNames[r.id]),grouped(r.inside_known?String(r.inside.length):'н/д',r.inside_known?r.inside:undefined,'Выбор в таблице · '+categoryNames[r.id]),grouped(r.returned_known?String(r.returned.length):'н/д',r.returned_known?r.returned:undefined,'Выбор после возврата · '+categoryNames[r.id])])||[];
   observations.append(rows.length?table(['Категория','Сессии с таблицей 2+','Сессии с выбором в таблице','Выбрали после возврата в каталог'],rows):copy(facts?facts.comparison.eligible?'В пригодной выборке нет зарегистрированных таблиц с двумя товарами.':'Нет пригодных измеренных сессий с каталогом. Старые и неполные записи не дают результата сравнения.':'Показатели сравнения ещё недоступны.'),spacedRemark('Группы могут пересекаться, не суммируйте строки'));
   grounds=rules;
  }else{
   const [path,branches,branchCards,information,rules]=blocks;
   route.append(path.querySelector('.approved-scenario-route'));steps=path;
   observations.className='approved-scenario-observations';branches.querySelector('h2').textContent='Дополнительные наблюдения';observations.replaceChildren(branches,branchCards,information);
   grounds=rules;
  }
  const stepsHeading=steps.querySelector('.panel-heading');
  stepsHeading.firstElementChild?.classList.add('approved-step-caption');
  stepsHeading.querySelector('h2').remove();
  if(stepsHeading.childElementCount)route.append(...stepsHeading.children);
  stepsHeading.remove();route.append(...steps.children);
  grounds.querySelector('.disclosure-trigger>span').textContent='Основания и исключения';grounds.classList.add('panel','approved-grounds');grounds.open=false;
  for(const [name,block]of [['path',route],['observations',observations],['grounds',grounds]]){block.dataset.scenarioBlock=name;proposal.append(block);}
  if(!facts)proposal.append(dataNote());
  root.append(proposal);return root;
 }
 function scenarioContent(){
  const root=node('div',null,'approved-content');root.dataset.approvedSection='scenarios';const selected=state.scenario||'comparison';root.append(tabs([['comparison','Сравнение товаров'],['selection','Выбор детали']],selected,value=>{state.scenario=value;rerender();},'Выбор сценария',{animated:true}));
  if(selected==='comparison'){
   root.append(heading('Сопоставить подходящие варианты'),scenarioRoute(['Каталог','Действие сравнения','Таблица одной категории','Связанный выбор']));
   const recorded=section('Что зафиксировано');recorded.append(group('approved-path',...[["Начало использования","Успешное добавление или открытие таблицы"],["Таблица 2+","Два разных товара одной категории"],["Связанный выбор","В таблице или после подтверждённого возврата"]].map(([title,text])=>group('',node('strong',title),copy(text)))));root.append(recorded);
   const steps=section('Дошли до каждого шага','Связные измеренные сессии. Доля — от сессий предыдущего шага.');steps.append(flow(['Открыли каталог','Начали сравнение','Дошли до таблицы','Выбрали деталь'],facts?.comparison.eligible?facts.comparison.groups:null,false,[null,'открывших каталог','начавших сравнение','дошедших до таблицы']),comparisonChoices(),remark(narrative('H1')[1]));root.append(steps);
   root.append(scenarioGrounds(true));
  }else{
   const path=section('Основной путь выбора детали','Доля от предыдущего шага · число сессий');path.append(scenarioRoute(['Начало задания','Каталог','Ручной выбор или замена','Сохранение полной сборки']),flow(['Начали задание','Открыли каталог','Выбрали / заменили','Сохранили сборку'],facts?.eligible?facts.selection:null,false,[null,'начавших задание','открывших каталог','выбравших деталь']));path.querySelector('.approved-flow>li:last-child').append(infoTooltip('Как считается сохранение сборки',metricExplanation({calculation:'Сохранили полную сборку ÷ выбрали или заменили деталь × 100%',explanation:'Сохранение это общий итог задания. Если сборку не сохранили, выбор детали всё равно засчитываем'})));root.append(path,heading('Необязательные ветви'));
   const comp=section('Сравнение');comp.append(flow(['Начали сравнение','Дошли до таблицы','Выбрали деталь'],facts?.comparison.eligible?facts.comparison.groups.slice(1):null,true,[null,'начавших сравнение','дошедших до таблицы']),comparisonChoices());
   const article=section('Статья');for(const id of ['H2','H3']){const f=facts?.[id];article.append(copy(id+' · '+(id==='H2'?'Практические данные':'Рекомендованные материалы')),flow(['Открыли статью',id==='H2'?'Увидели целевые данные':'Просмотрели статью','Вернулись и выбрали деталь'],f?[f.opened,f.viewed,f.direct]:null,true,[null,'открывших статью',id==='H2'?'увидевших данные':'просмотревших статью']));}
   const picker=section('Быстрый подбор');picker.dataset.quickPickerBranch='';picker.append(flow(['Начали задание','Вызвали ленту','Добавили из ленты'],facts?.quickPicker?.groups,true,[null,'начавших задание','вызвавших ленту']));
   root.append(group('approved-grid2',comp,picker,article));
   const information=section('Обращение к информации');information.append(infoTable(),spacedRemark('Внутри каждой гипотезы группы не пересекаются'),disclosure('Наблюдения до и после выбора',...['H2','H3'].map(id=>copy(narrative(id)[1]))));root.append(information,scenarioGrounds(false));
  }
  if(!facts)root.append(dataNote());return root;
 }
 function sessions(){
  const root=node('div',null,'approved-content');root.dataset.approvedSection='sessions';
  const groupIds=state.sessionGroup?.ids,items=model.sessions.filter(s=>(state.purpose==='all'||(state.purpose==='qa')===s.qa)&&(!groupIds||groupIds.includes(s.id)));
  const p=section(state.sessionGroup?.name||'Сессии',null,state.sessionGroup?button('Сбросить группу',()=>{state.sessionGroup=null;state.page=1;rerender();}):null);
  p.append(sessionTable({sessions:items,facts:model.layoutFacts,state,rerender,sessionLink:session}));root.append(p);return root;
 }
 function detail(s){
  const root=node('div',null,'approved-content');root.dataset.approvedSection='detail';const back=button(s.qa?'К списку прохождений':'Все прохождения',()=>navigate('sessions'),s.qa?'text':'secondary',s.qa?'link':'action');back.prepend(icon('chevron-left'));back.classList.add('has-icon','approved-back');root.append(back);
  const outcomes=section(s.id,s.device);outcomes.classList.add('approved-detail-outcomes');for(const [title,text]of [['Состав',Number.isInteger(s.attemptState?.build_count)?s.attemptState.build_count+'/5 деталей':'Неизвестен'],['Сохранение',({saved:'Сохранено',not_saved:'Не сохранено'})[s.attemptState?.saving]||'Неизвестно'],['Участие',s.participationLabel||'Неизвестно']])outcomes.append(group('approved-outcome',copy(title),node('span',text)));
  const actionsHeading=group('approved-actions-heading',node('h3','Значимые действия'));
  const actions=group('approved-actions-list');actions.id='journal-actions-'+(++actionListSerial);actions.setAttribute('role','region');actions.setAttribute('aria-label','Все значимые действия');
  const actionRows=s.route.map(r=>[r.elapsed_ms==null?'—':Math.floor(r.elapsed_ms/60000)+':'+String(Math.floor(r.elapsed_ms/1000)%60).padStart(2,'0'),r.label,r.description||'']);
  const drawActions=all=>actions.replaceChildren(actionRows.length?timeline(all?actionRows:actionRows.slice(0,5)):copy('Значимые действия не доставлены.'));
  if(actionRows.length>5){
   let expanded=false;
   const toggle=button('Смотреть все',()=>{expanded=!expanded;toggle.firstChild.textContent=expanded?'Свернуть':'Смотреть все';toggle.setAttribute('aria-expanded',String(expanded));drawActions(expanded);},'secondary');
   toggle.classList.add('has-icon');toggle.append(icon('chevron-down'));toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls',actions.id);actionsHeading.append(toggle);
  }
  drawActions(false);outcomes.append(actionsHeading,actions);
  const build=section('Состав и условия');build.append(s.build.length?table(['Категория','Модель'],s.build.map(([category,name])=>[category,name])):copy('Детали не выбраны или состав не доставлен.'));
  if(s.qa){
  const annotation=group('approved-annotation');let saved={moderator:'unknown',note:''};try{saved=JSON.parse(sessionStorage.getItem('journal-annotation:'+s.id))||saved;}catch{}
  const choice=field('Участие модератора',[['unknown','Не отмечено'],['none','Без вмешательства'],['help','Было вмешательство']],value=>{saved.moderator=value;notes.hidden=value!=='help';persist();});choice.setValue(saved.moderator);
  const notes=node('label',null,'field');notes.append(node('span','Что и на каком шаге подсказали'));const input=node('textarea');input.value=saved.note;input.placeholder='Короткая отметка исследователя';input.addEventListener('input',()=>{saved.note=input.value;persist();});notes.append(input);notes.hidden=saved.moderator!=='help';function persist(){try{sessionStorage.setItem('journal-annotation:'+s.id,JSON.stringify(saved));input.removeAttribute('aria-invalid');}catch{input.setAttribute('aria-invalid','true');}}
  annotation.append(choice,notes);build.append(annotation);
  }
  if(s.qa)build.append(disclosure('Технические события',link('Технические сведения',()=>openTechnical(s))));root.append(group('approved-grid2 approved-detail-grid',outcomes,build));return root;
 }
 return {overview,hypotheses,scenarios,sessions,detail,hypothesisCard,reviewList};
}
