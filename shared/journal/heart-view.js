import {hypothesisMetricCopy,hypothesisMetric} from './hypothesis-metric-copy.js';
import {node,notice,panel,table} from './components.js';
import {categoryNames} from '../telemetry/registry.js';
import {h1Ratio,h1Time,h2Labels,h2Rule,h2DataRule,h2Interpretation,h2Separation} from './real-model.js';

export const heartNames=Object.fromEntries(['H2','H3'].map(id=>[id,Object.fromEntries(Object.entries(hypothesisMetricCopy[id]).map(([key,copy])=>[key,copy.title]))]));
const orders={before:'Просмотр до выбора',after:'Просмотр после выбора',both:'Оба пути'};
const branches={time:'Видимое время ≥ 3 с',depth:'Ручная глубина > 50%',both:'Обе ветви OR',exposure:'Целевые данные показаны пять секунд подряд'};
export function heartCardMetric(id,a){return hypothesisMetric(id,'selection',h1Ratio(a?.selection));}
export function heartMetrics(id,a,main=true){
 const root=node('div',null,main?'evidence-metrics':'h1-card-measurements');
 if(main)root.append(heartCardMetric(id,a));
 root.append(hypothesisMetric(id,'viewing',h1Ratio(a?.viewing)),hypothesisMetric(id,'time',h1Time(a?.time?.median_ms),`Медиана · Сессий расчёта: ${a?.time?.sessions??0}`));return root;
}
export function heartLimits(id,a){
 const root=node('div',null,'h3-explanations'),x=a?.excluded||{};
 if(id==='H2'&&a?.legacy_time?.sessions)root.append(notice('Прежнее измерение · от действия с данными',`${h1Time(a.legacy_time.median_ms)} · Медиана · Сессий расчёта: ${a.legacy_time.sessions}. С новым временем от показа не объединяется.`));
 root.append(notice('Правило расчёта',id==='H2'?h2DataRule:h2Rule),notice('Вне расчёта',`QA: ${x.qa??0} · Не измерялось: ${x.not_measured??0} · Частичные данные: ${x.partial??0} · Разрывы: ${x.incomplete??0} · Неизвестный просмотр: ${x.unknown??0} · Без подходящей возможности: ${x.no_opportunity??0}`),notice('Данные о последующем выборе',id==='H2'?`Недостаточно данных о выборе: ${a?.linkage_unknown??0}. Прохождения с подтверждённым просмотром остаются в общем числе просмотров. Неизвестное действие не засчитываем как выбор`:`Недостаточно данных о выборе: ${a?.linkage_unknown??0}`),notice('Порядок и время',id==='H2'?`Выбор после показа данных: ${a?.before??0} · Показ не зарегистрирован при работающем измерении: ${a?.no_action??0}. Выбор только до просмотра не засчитывается.`:`Просмотр до выбора: ${a?.before??0} · После выбора: ${a?.after??0} · Оба пути: ${a?.both??0} · Только обратный путь, без времени до выбора: ${a?.after_only??0}`),notice('Разделение показателей',h2Separation),notice('Ограничение и интерпретация',h2Interpretation));return root;
}
const timeState=h=>h?.time_status==='measured'?h1Time(h.time_ms):h?.time_status==='no_exposure'?'Не измерено: пятисекундный показ данных не зарегистрирован':h?.time_status==='after_only'?'Не применяется: просмотр после выбора':h?.time_status==='no_choice'?'Не измерено: прямой выбор не зарегистрирован':'Не измерялось или недостаточно данных для нового показателя';
export function heartVisitTable(id,h,title=x=>x){
 return table(['Материал и категория','Просмотр','Связь с выбором'],(h?.visits||[]).map(v=>{
  const material=node('div');material.append(node('strong',title(v.article_id)),node('p',categoryNames[v.category_id]||'Категория не подтверждена','muted'),node('p',id==='H2'?`${v.practical?'Практические данные доступны':'Данные не подтверждены'} · Уровень: область данных`:`Предложение: ${v.recommendation?.offer_id||'не подтверждено'}`,'muted'));
  const viewing=node('div');viewing.append(node('p','Открытие подтверждено'),node('p',`Видимое время статьи: ${v.visible_ms===null?'не измерено':h1Time(v.visible_ms)} · Ручная глубина: ${v.depth_pct===null?'не измерена':v.depth_pct+'%'}`),node('p',branches[v.branch]|| (v.status==='below'?(id==='H2'?'Показ данных не зарегистрирован':'Ниже обоих порогов'):'Недостаточные измерения')));
  const linked=node('div');linked.append(node('p',orders[v.order]||'Связанный выбор не зарегистрирован'));
  if(v.direct_choice)linked.append(node('p',`После возврата: ${v.direct_choice.product_id} · Возврат подтверждён`));
  if(v.reverse_choice)linked.append(node('p',`До просмотра: ${v.reverse_choice.product_id} · Деталь остаётся в составе`));
  if(id==='H2'&&v.previous_choice)linked.append(node('p',`До просмотра: ${v.previous_choice.product_id} · Не засчитывается в последующий выбор`));
  if(!v.order)linked.append(node('p',v.other_category?'Выбор другой категории':v.return?'Возврат подтверждён':'Возврат не зарегистрирован'));
  if(id==='H2')linked.append(node('p',`Действий с размеченными данными: ${v.actions.length}`),node('p',`Подтверждённый показ данных: ${v.exposures?.length?'да':'не зарегистрирован'}`));
  return [material,viewing,linked];
 }));
}
export function heartDetail(id,h,title){
 const root=panel(`${id} · ${id==='H2'?'Практические данные и выбор':'Рекомендация и выбор'}`,h2Labels[h?.status]||'Не измерялось');root.classList.add(id.toLowerCase()+'-detail');
 root.append(notice('Доступность и результат',`${id==='H2'?'Подтверждённых открытий практического материала: '+(h?.opened??0):'Непустое предложение: '+(h?.offered?'да':'не подтверждено')} · ${h?.viewed?'Просмотр по критерию подтверждён':'Подходящий просмотр не подтверждён'} · ${orders[h?.order]||'Связанный выбор не подтверждён'}`));
 if(h?.visits?.length)root.append(heartVisitTable(id,h,title));
 if(id==='H2'&&h?.legacy_time_ms!=null)root.append(notice('Прежнее измерение · от действия с данными',`${h1Time(h.legacy_time_ms)} · Отдельно от нового времени показа`));
 const c=h?.representative,start=h?.time_start;
 root.append(notice(heartNames[id].time,timeState(h)+(start?` · Начало: ${new Date(start.at).toLocaleTimeString('ru-RU',{timeZone:'Asia/Yekaterinburg'})} · Конец: ${new Date(c.choice.at).toLocaleTimeString('ru-RU',{timeZone:'Asia/Yekaterinburg'})}`:'')),notice('Состояние измерения',`${h2Labels[h?.status]||'Не измерялось'} · ${h?.choice_eligible?'Входит в расчёт связи с выбором':h?.opening_eligible?'Входит только в расчёт просмотра':'Не входит в основные знаменатели'}`),notice('Ограничение',h2Interpretation));return root;
}
