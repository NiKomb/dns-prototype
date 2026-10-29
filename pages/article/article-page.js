import { breadcrumbs, element, link, shell, author, stats, bodyBlock, comments, promos, recommendations, articleHeading, articleCover, articleContents, articleScreenshots, mentionedProducts, backToTop } from '../../shared/article/article-components.js?v=20260929-cpu-comparisons';
import {evidenceBlocks,evidenceCategory,evidenceExposureTargets} from '../../shared/telemetry/evidence-registry.js';

// Mark direct and in-prototype article visits without a reload or extra history entry.
const articleUrl = new URL(location.href);
if (articleUrl.searchParams.getAll('test').length !== 1 || articleUrl.searchParams.get('test') !== '1') {
  articleUrl.searchParams.set('test', '1');
  history.replaceState(history.state, '', articleUrl);
}

export function renderArticle(data, root) {
  const evidence=evidenceBlocks(data);
  window.__studyArticle = {id:data.id,title:data.title,evidenceCategory:evidenceCategory(data.id),evidenceIds:[...evidence.keys()],evidenceKinds:[...new Set([...evidence.values()].flat())],evidenceTargets:evidenceExposureTargets(data),evidenceReason:data.screenshotPages?'unsegmented_screenshots':evidence.size?'available':'no_practical_blocks'};
  document.title = 'Копия статьи Клуба DNS — для тестирования прототипа | ' + data.title;
  const main = element('main', 'club-main');
  const crumbs = breadcrumbs(data);
  const publication = data.publication || { title: 'Обзоры', href: 'https://club.dns-shop.ru/review/', section: 'reviews' };
  const page = element('article', 'club-panel article'); page.dataset.articleId = data.id;
  if (data.screenshotPages) {
    const heading = articleHeading(data);
    heading.classList.add('article-accessible-title');
    page.append(heading, articleScreenshots(data));
  } else {
    const commentsHref = data.commentGroups ? '#comments' : data.sourceUrl + '#comments';
    const byline = author(data.author, data.date, false, data.readingTime);
    const body = element('div', 'article-body');
    let context = data.title;
    data.blocks.forEach(block => { if (block.type === 'heading') context = block.text; body.append(bodyBlock(block, data.products, context)); });
    page.append(byline, articleHeading(data), articleCover(data), stats(data.stats, { id: data.id, interactive: true, bookmark: true, commentsHref }), articleContents(data), body, mentionedProducts(data), stats(data.stats, { id: data.id, interactive: true, bottom: true, commentsHref }));
  }
  main.append(crumbs, page);
  if (data.commentGroups) main.append(comments(data));
  if (data.showPromos !== false) main.append(promos());
  if (data.popular?.length) main.append(recommendations('Популярные 🔥', data.popular, true));
  if (data.related?.length) main.append(recommendations('Читайте также', data.related, false));
  const top = backToTop();
  root.replaceChildren(...shell(data.sourceUrl, publication.section), main, top);
  for(const node of bodyNodes(page))if(evidence.has(node.id)){
    node.dataset.evidenceId=node.id;node.dataset.evidenceKinds=JSON.stringify(evidence.get(node.id));node.dataset.sourceId=data.id;
  }
  window.dispatchEvent(new CustomEvent('prototype:telemetry',{detail:{type:'article.ready',...window.__studyArticle}}));
  const updateTop = () => { top.hidden = scrollY < 600; };
  addEventListener('scroll', updateTop, { passive: true }); updateTop();
  // Module content is inserted after the browser's initial fragment lookup.
  if (location.hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView());
}
function bodyNodes(page){return page.querySelectorAll('[id]');}
const { default: article } = await import(new URL(document.body.dataset.article, import.meta.url));
renderArticle(article, document.getElementById('club-root'));
if (document.body.hasAttribute('data-build-panel')) {
  const {mountArticleBuildPanel} = await import('./article-build-panel.js');
  mountArticleBuildPanel(document.getElementById('club-root'));
}
