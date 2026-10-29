// Shared wire contract. New fields must be explicitly allowed here.
export const schemaVersion = 5;
export const eventNames = {
  'session.start':'Начал задание', 'session.complete':'Завершил сохранением сборки', 'page.view':'Открыл страницу', 'page.leave':'Покинул страницу',
  'page.visibility':'Видимость страницы', 'article.time':'Время статьи',
  'navigation.intent':'Нажал ссылку перехода', 'navigation.arrive':'Переход состоялся',
  'article.disclosure':'Раскрытие статьи', 'ui.click':'Нажал элемент', 'ui.hover':'Наведение', 'filter.change':'Изменил фильтр',
  'filter.group':'Раскрыл/свернул фильтр', 'filter.reset':'Сбросил фильтры', 'sort.change':'Изменил сортировку',
  'modal.open':'Открыл модалку', 'modal.close':'Закрыл модалку', 'modal.time':'Время модалки',
  'scroll.summary':'Прокрутка', 'build.change':'Изменил сборку', 'build.snapshot':'Состояние сборки',
  'recommendation.open':'Показал ленту товаров','recommendation.close':'Закрыл ленту товаров',
  'articles.offer':'Состав предложенных материалов','articles.visible':'Карточка материала в видимой области',
  'evidence.available':'Доступные измерения блоков данных',
  'evidence.exposure':'Практические данные видны 5 секунд',
  'comparison.available':'Измерение сравнения подключено',
  'comparison.action':'Действие сравнения выполнено','comparison.scroll':'Ручная прокрутка сравнения',
  'delivery.gap':'Неполные данные'
};
export const categories = ['processor','board','power','case','gpu'];
export const categoryNames = {processor:'Процессоры',board:'Материнские платы',power:'Блоки питания',case:'Корпуса',gpu:'Видеокарты'};
export const evidenceKindNames={results:'результаты',conditions:'условия',characteristics:'характеристики',construction:'устройство',compatibility:'совместимость',comparison:'сравнительные данные'};
export function category(value) {
  return ({processor:'processor',cpu:'processor',motherboard:'board',board:'board',powerSupply:'power', 'power-supply':'power',psu:'power',power:'power',computerCase:'case',case:'case',gpu:'gpu'})[value] || null;
}
export const fields = {
  device:'device',placement_id:'id',list_id:'id',element_id:'id',target_id:'id',category_id:'category',product_id:'id',previous_product_id:'id',article_id:'id',
  filter_id:'id',option_id:'id',modal_instance_id:'id',navigation_id:'id',source_page:'page',destination_page:'page',
  destination_category:'category',source_category:'category',source_article:'id',
  container_id:'container',direction:'id',axis:'axis',origin:'origin',reason:'id',action:'id',method:'id',
  selected:'boolean',expanded:'boolean',visible:'boolean',complete:'boolean',
  elapsed_ms:'number',visible_ms:'number',duration_ms:'number',start_px:'number',end_px:'number',travel_px:'number',
  depth_pct:'percent',scrollable_px:'number',list_revision_id:'id',dropped:'number',build:'build',
  name:'label',target_name:'label',comparison_id:'id',products:'products',previous_products:'products'
};
Object.assign(fields,{exposure_version:'number',measurement_version:'number',offer_id:'id',article_ids:'ids',product_ids:'ids',
 evidence_id:'id',evidence_ids:'ids',evidence_kinds:'kinds',source_id:'id',compatible:'boolean'});
// randomUUID is restricted to secure contexts; local Tailscale previews use HTTP.
// getRandomValues remains available there and preserves cryptographic randomness.
export const uid = () => {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
};
const id = value => typeof value === 'string' && value.length > 0 && value.length <= 180 && !/[\u0000-\u001f<>]/.test(value);
export const validPage = value => typeof value==='string' && (value === 'configurator' || /^article:[a-zA-Z0-9._-]+$/.test(value));
export function validTime(value) {
  return value && typeof value==='object' && !Array.isArray(value) &&
    Object.keys(value).length===2 && typeof value.clock_id==='string' && /^[a-zA-Z0-9._-]{1,100}$/.test(value.clock_id) &&
    Number.isSafeInteger(value.elapsed_ms) && value.elapsed_ms>=0;
}
export function validBuild(value) {
  return value && typeof value==='object' && !Array.isArray(value) && Object.keys(value).every(k => categories.includes(k)) &&
    Object.values(value).every(v => v===null || (v && Object.keys(v).every(k=>['id','name','price'].includes(k)) && id(v.id) && typeof v.name==='string' && v.name.length<=300 &&
      (!Object.hasOwn(v,'price') || v.price===null || (Number.isSafeInteger(v.price) && v.price>=0))));
}
export function validateEvent(event) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) return false;
  const allowed=['event_id','session_id','tab_id','page_view_id','sequence','at','event','page_id','prototype_version','task_version','schema_version','viewport','data'];
  if (Object.keys(event).some(k=>!allowed.includes(k)&&k!=='time') || allowed.some(k=>!(k in event))) return false;
  if (event.schema_version===5 ? !validTime(event.time) : 'time' in event) return false;
  if (!['event_id','session_id','tab_id','page_view_id','prototype_version','task_version'].every(k=>id(event[k]))) return false;
  if (!(Object.hasOwn(eventNames,event.event)) || !validPage(event.page_id) || ![1,2,3,4,schemaVersion].includes(event.schema_version) || !Number.isSafeInteger(event.sequence) || event.sequence<1 || !Number.isFinite(event.at) || event.at<0) return false;
  if (!Array.isArray(event.viewport) || event.viewport.length!==2 || !event.viewport.every(n=>Number.isFinite(n)&&n>=0&&n<100000)) return false;
  if (!event.data || Array.isArray(event.data) || typeof event.data!=='object') return false;
  return Object.entries(event.data).every(([key,value]) => {
    if (!(Object.hasOwn(fields,key))) return false;
    if (value===null) return ['product_id','previous_product_id','depth_pct','category_id','source_category','destination_category'].includes(key);
    switch(fields[key]) {
      case 'id': return id(value);
      case 'ids': return Array.isArray(value)&&value.length<=500&&value.every(id)&&new Set(value).size===value.length;
      case 'products': return Array.isArray(value)&&value.length<=500&&new Set(value.map(p=>p?.id)).size===value.length&&value.every(p=>p&&Object.keys(p).length===2&&id(p.id)&&typeof p.name==='string'&&p.name.length<=300);
      case 'kinds': return Array.isArray(value)&&value.length<=Object.keys(evidenceKindNames).length&&value.every(v=>Object.hasOwn(evidenceKindNames,v))&&new Set(value).size===value.length;
      case 'label': return typeof value==='string' && value.length<=300;
      case 'category': return categories.includes(value);
      case 'page': return validPage(value);
      case 'boolean': return typeof value==='boolean';
      case 'number': return Number.isFinite(value)&&value>=0;
      case 'percent': return Number.isFinite(value)&&value>=0&&value<=100;
      case 'axis': return ['x','y'].includes(value);
      case 'origin': return ['user','programmatic','unknown'].includes(value);
      case 'device': return ['desktop','mobile'].includes(value);
      case 'container': return ['configurator.page','article.page','article.table','modal.filters','modal.results','modal.articles','configurator.suggestions','article.categories'].includes(value);
      case 'build': return validBuild(value);
      default:return false;
    }
  });
}

export const elementNames = {
 'comparison.toggle':'Включить / исключить товар из сравнения','comparison.add':'Добавить товар в сравнение','comparison.remove':'Убрать товар из сравнения',
 'comparison.open':'Открыть таблицу сравнения','comparison.close':'Закрыть сравнение и вернуться в каталог','comparison.clear':'Очистить сравнение',
 'comparison.category':'Переключить категорию сравнения','comparison.category.close':'Закрыть категорию сравнения','comparison.category.restore':'Восстановить категорию сравнения',
 'comparison.differences':'Только различия','comparison.group':'Раскрыть / свернуть раздел сравнения','comparison.select':'Выбрать товар в сборку из сравнения',
 'comparison.browse':'Открыть / закрыть подбор товаров для сравнения','comparison.previous':'Предыдущие товары сравнения','comparison.next':'Следующие товары сравнения',
 'panel.overview':'Панель: в конфигуратор','panel.category':'Панель: категория сборки','panel.previous':'Панель: предыдущие категории','panel.next':'Панель: следующие категории',
 'suggestion.toggle':'Открыть / закрыть быстрый подбор','suggestion.card':'Товар в ленте быстрого подбора','suggestion.select':'Добавить из быстрого подбора','suggestion.previous':'Предыдущие товары ленты','suggestion.next':'Следующие товары ленты',
 'build.save':'Сохранить сборку и завершить', 'build.add':'Открыть выбор детали','build.replace':'Открыть замену детали','build.remove':'Удалить деталь','build.clear':'Очистить сборку',
 'modal.close':'Закрыть модалку','product.select':'Выбрать товар','product.card':'Карточка товара','product.favorite':'Избранное',
 'article.open':'Карточка статьи','articles.previous':'Предыдущие статьи','articles.next':'Следующие статьи',
 'filter.group':'Группа фильтров','filter.option':'Вариант фильтра','filter.search':'Поиск в фильтрах','filter.price':'Ввод цены',
 'filter.price.reset':'Сброс цены','filter.reset':'Сброс всех фильтров','filter.remove':'Удалить активный фильтр','filter.quick':'Быстрый фильтр',
 'filter.compatible':'Совместимость','filter.more':'Показать варианты','filter.all':'Все фильтры','sort.option':'Вариант сортировки','sort.open':'Открыть сортировку',
 'article.image':'Изображение статьи','article.image.close':'Закрыть изображение','article.image.next':'Следующее изображение',
 'article.image.previous':'Предыдущее изображение','article.image.thumbnail':'Миниатюра изображения','article.top':'Наверх',
 'article.disclosure':'Раскрытие блока','article.contents':'Содержание статьи','page.link':'Ссылка страницы'
};
