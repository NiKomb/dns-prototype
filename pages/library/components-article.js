import cpuGuide from '../article/choose-cpu-data.js';
import psu650Article from '../article/psu-600-650-comparison-data.js';
import psu850Article from '../article/psu-850-comparison-data.js';
import psu750Article from '../article/psu-700-750-comparison-data.js';
import boardGuide from '../article/choose-motherboard-data.js';
import caseGuide from '../article/choose-case-data.js';
import ryzen7700Article from '../article/ryzen-7700-data.js';
import article from '../article/ryzen-x3d-data.js';
import comparisonArticle from '../article/ryzen-9900x-comparison-data.js';
import budgetArticle from '../article/ryzen-5600x-vs-i5-12400-data.js';
import matxArticle from '../article/b850-matx-comparison-data.js';
import heatArticle from '../article/heat-output-data.js';
import {createBuildPanel} from '../../shared/article/build-panel.js';
import {breadcrumbs, recommendations, element, author, stats, shell, bodyBlock, productReference, comments, recommendation, promos, authorPart, headerPart, navigationItem, navigationPart, voteGroup, statPart, createArticleState, articleHeading, articleCover, articleContents, mentionedProducts, backToTop} from '../../shared/article/article-components.js?v=20260930-components-8a90008';

// Component previews use the same article CSS and inherit the project typography variables.
const host = document.querySelector('#ds-article-library');
const root = host.attachShadow({mode:'open'});
const base = new URL('../../shared/article/', import.meta.url);
const previewState = createArticleState();
const previewOptions = {id:'ds-article', interactive:true, store:previewState};
// External navigation is contained; component handlers use the isolated state below.
root.addEventListener('click', event => {
  const anchor=event.target.closest('a'),href=anchor?.getAttribute('href');
  if(anchor&&!(href?.startsWith('#')&&root.getElementById(href.slice(1)))){event.preventDefault();event.stopPropagation();}
}, true);
const sheet = document.createElement('link');
sheet.rel = 'stylesheet'; sheet.href = new URL('./article.css?v=20260930-control-states', base).href;
const ready = new Promise((resolve, reject) => {sheet.onload = resolve; sheet.onerror = reject;});
root.append(sheet);
const buildPanelSheet = document.createElement('link');
buildPanelSheet.rel = 'stylesheet'; buildPanelSheet.href = new URL('./build-panel.css', base).href;
const buildPanelReady = new Promise((resolve, reject) => {buildPanelSheet.onload = resolve; buildPanelSheet.onerror = reject;});
root.append(buildPanelSheet);
const layout = document.createElement('style');
layout.textContent = `
:host{display:block;color:var(--club-ink);font:var(--type-body);color-scheme:light}
.library{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:start;gap:24px}
.group{min-width:0;max-width:100%}
.group[data-component-group="body.table"]{grid-column:1 / -1}
.group[data-component-group="body.table"]>.states{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:start}
.group[data-component-group="body.gallery"]{grid-column:1}
.group[data-component-group="cover"]{grid-column:2}
.states{display:flex;flex-wrap:wrap;align-items:flex-start;gap:12px}
.example{flex:0 1 auto;max-width:100%;min-width:0}.example.wide{width:100%}
.label{font:var(--type-body-strong);margin:0 0 6px}.caption{font:var(--type-body-small);color:var(--club-muted);margin:0 0 6px}
.stage{min-width:0;max-width:100%;overflow-x:auto}.stage>.club-back-top{position:static}
.palette{display:flex;gap:12px;flex-wrap:wrap}.swatch{display:grid;gap:6px;font:var(--type-body-small)}.swatch i{width:96px;height:48px;border:1px solid #eee;border-radius:8px}
`;
root.append(layout);
const grid = element('div','library'); root.append(grid);

const groups=new Map();
const names={cover:'Обложка',stats:'Панель действий',votes:'Голосование','navigation.item':'Пункт навигации','body.paragraph':'Текст статьи','body.heading':'Заголовки','body.gallery':'Галерея','body.image':'Иллюстрация','body.table':'Таблица','body.disclosure':'Спойлер',mentioned:'Упомянутые товары',recommendation:'Карточка рекомендации'};
function sample(title, source, {context='', wide=false} = {}) {
  const node=libraryUI.namespace(source),id=node.dataset.dsComponent||node.querySelector('[data-ds-component]')?.dataset.dsComponent||node.className||title;
  const key=id.replace(/^article\./,'');
if(!groups.has(key)){const group=element('section',`group${wide?' wide':''}`),heading=element('h3','label',names[key]||title.split(' · ')[0]),states=element('div','states');group.dataset.componentGroup=key;group.append(heading,states);grid.append(group);groups.set(key,states);}
  const box=element('article',`example${wide?' wide':''}`),stage=element('div',`stage article-component-preview ${context}`);stage.append(node);
  const state=title.split(' · ').slice(1).join(' · ');if(state)box.append(element('p','caption',state));box.append(stage);groups.get(key).append(box);
}

try {
  await Promise.all([ready, buildPanelReady]);

  // Read the article's tokens directly; :root rules don't match a shadow root.
  const tokens = [...sheet.sheet.cssRules].find(rule => rule.selectorText === ':root').style;
  for (const name of tokens) host.style.setProperty(name, tokens.getPropertyValue(name));
  const palette = element('div','palette');
  for (const [name, label] of [['--club-ink','Текст'],['--club-muted','Вторичный текст'],['--club-bg','Фон'],['--club-surface','Панель'],['--club-action','Действие']]) {
    const chip = element('div','swatch'); const color = element('i'); color.style.background = `var(${name})`;
    chip.append(color, element('span','',label), element('small','',tokens.getPropertyValue(name).trim())); palette.append(chip);
  }
  sample('Цвета статьи', palette);
  const [header, sidebar] = shell(article.sourceUrl);
  sample('Шапка Клуба DNS', header, {wide:true});
  const buildCategories = Object.entries(catalogUI.configuratorCategories).map(([rowId, item]) => ({
    id: rowId.replace(/-row$/, ''), opensCatalog: Boolean(item.id), title: item.title, image: item.image,
    selected: item.id === 'processor-row' ? processorCatalog[0] : null
  }));
  sample('Сборка из статьи', createBuildPanel({categories: buildCategories, currentCategory: 'processor'}).element, {wide:true});
  for (const [name, title] of [
    ['logo','Логотип Клуба DNS'], ['search','Поиск в шапке'], ['live','Эфир · подпись и индикатор'],
    ['coin','Значок Клуба'], ['theme','Значок темы'], ['bell','Уведомления'], ['write','Кнопка «Написать»'], ['login','Кнопка «Войти»']
  ]) {
    const part = element('nav','club-header-actions'); part.append(headerPart(name,article.sourceUrl));
    sample(title,part,{context:'club-header component-header-element'});
  }
  sample('Боковая навигация', sidebar);
  sample('Пункт меню · иконка «Блоги»', navigationPart('blogs','icon'), {context:'component-nav-part'});
  sample('Пункт меню · подпись «Блоги»', navigationPart('blogs','label'), {context:'component-nav-part'});
  sample('Пункт навигации · обычное состояние', navigationItem('news',article.sourceUrl), {context:'club-nav component-nav-item'});
  sample('Пункт навигации · активное состояние', navigationItem('reviews',article.sourceUrl), {context:'club-nav component-nav-item'});
  sample('Автор, дата и время чтения', author(article.author,article.date,false,article.readingTime));
  for (const [part,title] of [['avatar','Аватар автора'], ['name','Имя автора'], ['date','Дата публикации'], ['readingTime','Время чтения']]) {
    sample(title,authorPart(part,article.author,article.date,article.readingTime),{context:'club-author'});
  }
  sample('Ryzen 7 7700 · спойлер с четырьмя результатами C23', bodyBlock(ryzen7700Article.blocks.find(block => block.type === 'disclosure'), ryzen7700Article.products, ryzen7700Article.title), {context:'article-body',wide:true});
  sample('Заголовок статьи', articleHeading(article), {context:'article',wide:true});
  sample('Сравнение БП · Товарные вставки', bodyBlock(psu650Article.blocks.find(b => b.type === 'product-group'), psu650Article.products, psu650Article.title), {context:'article-body',wide:true});
  sample('Сравнение БП · таблица восьми параметров', bodyBlock(psu750Article.blocks.find(b => b.type === 'table'), psu750Article.products, psu750Article.title), {context:'article-body',wide:true});
  sample('Галерея · большое фото, миниатюры и недоступный кадр', bodyBlock(psu750Article.blocks.find(b => b.moreLabel), psu750Article.products, psu750Article.title), {context:'article-body',wide:true});
  sample('Галерея · подпись источника', bodyBlock(psu850Article.blocks.find(b => b.type === 'gallery' && b.caption), psu850Article.products, psu850Article.title), {context:'article-body',wide:true});
  sample('Обложка · лёгкое превью, оригинал по клику', articleCover(article), {wide:true});
  sample('Панель действий · оценка, комментарии, закладка, просмотры', stats(article.stats,{...previewOptions,bookmark:true}), {wide:true});
  sample('Голосование', voteGroup(article.stats,previewOptions));
  for (const [name,label] of [['comments','Количество комментариев'],['bookmark','Закладка'],['views','Просмотры']]) sample(label,statPart(name,article.stats,previewOptions));
  for (const [selector,label] of [['button:first-child','кнопка «Нравится»'],['span','значение оценки'],['button:last-child','кнопка «Не нравится»']]) {
    sample(`Голосование · ${label}`,voteGroup(article.stats,previewOptions).querySelector(selector),{context:'club-votes'});
  }
  sample('Нижняя панель · реакции и действие «Поделиться»', stats(article.stats,{...previewOptions,bottom:true}),{wide:true});
  sample('Реакции · значок и количество',statPart('reaction',article.stats,previewOptions));
  sample('Кнопка «Поделиться»',statPart('share',article.stats,previewOptions));

  sample('Содержание · раскрыть / свернуть', articleContents(article), {wide:true});
  const kinds = [
    ['Вводный абзац', b=>b.type==='paragraph'&&b.variant==='lead'],
    ['Основной текст', b=>b.type==='paragraph'&&!b.variant],
    ['Заголовок раздела', b=>b.type==='heading'&&b.level===2],
    ['Подзаголовок', b=>b.type==='heading'&&b.level===3],
    ['Иллюстрация', b=>b.type==='image'],
    ['Галерея изображений', b=>b.type==='gallery'],
    ['Цитата', b=>b.type==='quote'],
    ['Список', b=>b.type==='list'],
    ['Таблица', b=>b.type==='table'],
    ['Подписи к колонкам', b=>b.type==='captions']
  ];
  for (const [label, match] of kinds) {
    const block = article.blocks.find(match);
    if (block) sample(label, bodyBlock(block,article.products,article.title), {context:'article-body',wide:true});
  }
  sample('Подпись иллюстрации', bodyBlock(matxArticle.blocks.find(block => block.variant === 'caption'), matxArticle.products, matxArticle.title), {context:'article-body',wide:true});
  sample('Обложка статьи · высокий исходник вписан в общий контейнер', articleCover(budgetArticle), {wide:true});
  sample('Обложка видео · статичное изображение без ссылки', bodyBlock(comparisonArticle.blocks.find(block => block.interactive === false), comparisonArticle.products, comparisonArticle.title), {context:'article-body',wide:true});
  sample('Спойлер статьи · Только заголовок', bodyBlock(budgetArticle.blocks.find(block => block.type === 'disclosure'), budgetArticle.products, budgetArticle.title), {context:'article-body',wide:true});
  sample('Обложка · подпись автора изображения', articleCover(cpuGuide), {wide:true});
  sample('Иллюстрация · подпись источника', bodyBlock(cpuGuide.blocks.find(b => b.type === 'image' && b.caption), cpuGuide.products, cpuGuide.title), {context:'article-body',wide:true});
  sample('Общее руководство · примечание', bodyBlock(cpuGuide.blocks.find(b => b.variant === 'notice'), cpuGuide.products, cpuGuide.title), {context:'article-body',wide:true});
  sample('Пустое медиа · заглушка из макета корпуса', bodyBlock(caseGuide.blocks.find(b => b.type === 'media-placeholder'), caseGuide.products, caseGuide.title), {context:'article-body',wide:true});
  sample('Разделитель статьи', bodyBlock(caseGuide.blocks.find(b => b.type === 'separator'), caseGuide.products, caseGuide.title), {context:'article-body',wide:true});
  sample('Кнопка категории в статье', bodyBlock(boardGuide.blocks.find(b => b.type === 'cta'),boardGuide.products,boardGuide.title), {context:'article-body',wide:true});
  const product = Object.values(article.products)[0];
  sample('Товарная вставка в статье', productReference(product), {wide:true});
  sample('Упомянутые товары · раскрыть / свернуть', mentionedProducts(article),{wide:true});
  sample('Упомянутые товары · сетка · центрированные названия и цены', mentionedProducts(heatArticle), {wide:true});
  sample('Комментарии · ответы двух уровней', comments({...heatArticle, commentGroups: heatArticle.commentGroups.slice(0,3)}, {store:previewState}), {wide:true});
  sample('Наверх · общий элемент всех статей', backToTop());
  sample('Пункт навигации · активный блог', navigationItem('blogs', heatArticle.sourceUrl, true), {context:'club-nav component-nav-item'});
  sample('Хлебные крошки',breadcrumbs(article));
  sample('Секция рекомендаций · заголовок и сетка',recommendations('Читайте также',article.related.slice(0,3),false),{wide:true});
  sample('Промоблоки', promos(),{wide:true});
  sample('Карточка «Популярные»', recommendation(article.popular[0],true));
  sample('Карточка «Читайте также»', recommendation(article.related[0]));
  host.dataset.ready = 'true';
} catch (error) {
  root.append(element('p','','Не удалось загрузить образцы статьи. Обновите страницу.'));
  console.error(error);
}
