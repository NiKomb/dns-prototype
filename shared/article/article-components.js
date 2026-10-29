import '../image-loading.js?v=20260929-images';
import club from './club-data.js';
import {configuratorHref} from '../build-navigation.js';

// Resolve shared assets against this module, independent of the consuming page.
const assetUrl = value => new URL(value, import.meta.url).href;

// Data is rendered as text. Only these editorial inline tags are supported.
export function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
// Keep source URLs in data for attribution, but only expose local navigation.
function localHref(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, location.href);
    return ['http:', 'https:'].includes(url.protocol) && url.origin === location.origin ? url.href : null;
  } catch { return null; }
}
export function link(text, href, className) {
  const node = element('a', className, text);
  const local = localHref(href);
  if (local) node.href = local;
  else node.setAttribute('aria-disabled', 'true');
  return node;
}
export function icon(name) {
  const node = element('span', 'club-icon');
  node.style.setProperty('--icon', `url("${assetUrl(club.icons[name])}")`);
  node.setAttribute('aria-hidden', 'true');
  return node;
}
export function image(data, alt = '', eager = false, ahead = 'viewport') {
  const node = element('img');
  node.alt = alt;
  node.width = data.width;
  node.height = data.height;
  node.style.aspectRatio = `${data.width} / ${data.height}`;
  node.loading = eager ? 'eager' : 'lazy';
  node.decoding = 'async';
  if (eager) node.fetchPriority = 'high';
  prototypeImages.defer(node, assetUrl(data.preview || data.src), {eager, ahead});
  return node;
}
function button(label, className, action, iconName) {
  const node = element('button', className);
  node.type = 'button';
  node.setAttribute('aria-label', label);
  if (iconName) node.append(icon(iconName));
  node.addEventListener('click', action);
  return node;
}
export function richText(parent, content) {
  for (const part of content) {
    if (part.text !== undefined) parent.append(document.createTextNode(part.text));
    else if (['a', 'strong', 'em', 'br'].includes(part.tag)) {
      const child = part.tag === 'a' ? link('', part.href) : element(part.tag);
      richText(child, part.children || []);
      parent.append(child);
    }
  }
  return parent;
}
export function authorPart(part, data, date, readingTime) {
  let result;
  if (part === 'avatar') result = image(data.avatar);
  if (part === 'name') result = data.href ? link(data.name, data.href) : element('span', '', data.name);
  if (part === 'date') result = element('span', 'club-muted', date);
  if (part === 'readingTime') result = element('small', 'club-muted', readingTime);
  if (!result) throw new Error(`Unknown author part: ${part}`);
  result.dataset.dsComponent = `article.author.${part}`; return result;
}
export function author(data, date, small = false, readingTime) {
  const row = element('div', `club-author${small ? ' club-author--small' : ''}`);
  if (data.avatar) row.append(authorPart('avatar', data));
  row.append(authorPart('name', data));
  if (date) row.append(authorPart('date', data, date));
  if (readingTime) row.append(authorPart('readingTime', data, date, readingTime));
  row.dataset.dsComponent = 'article.author'; return row;
}

export const navigation = [['news', 'Новости', 'digest'], ['reviews', 'Обзоры', 'review'], ['blogs', 'Блоги', 'blog'], ['feed', 'Поток', 'flow'], ['questions', 'Вопрос-ответ', 'discussions'], ['knowledge', 'База знаний', 'wiki'], ['community', 'Комьюнити', 'authors'], ['saved', 'Закладки', 'bookmarks']];
export function navigationPart(name, part) {
  const route = navigation.find(item => item[0] === name);
  const result = part === 'icon' ? icon(name) : element('span', '', route[1]);
  result.dataset.dsComponent = `article.navigation.${part}`; return result;
}
export function navigationItem(name, sourceUrl, active = name === 'reviews') {
  const route = navigation.find(item => item[0] === name);
  const result = link('', name === 'saved' ? sourceUrl : `https://club.dns-shop.ru/${route[2]}/`, active ? 'is-current' : '');
  result.append(navigationPart(name, 'icon'), navigationPart(name, 'label'));
  if (active) result.setAttribute('aria-current', 'page');
  result.dataset.dsComponent = 'article.navigation.item'; return result;
}
export function headerPart(name, sourceUrl) {
  let result;
  switch (name) {
    case 'logo': result = link('', 'https://club.dns-shop.ru/', 'club-logo'); result.append(image(club.logo, 'DNS Клуб', true)); break;
    case 'search': result = link('', 'https://club.dns-shop.ru/search/', 'club-header-search'); result.setAttribute('aria-label','Поиск'); result.append(icon('search')); break;
    case 'live': result = link('Эфир', 'https://club.dns-shop.ru/feed/', 'club-live'); result.append(element('span','club-live-dot')); break;
    case 'coin': result = link('', 'https://club.dns-shop.ru/', 'club-coin'); result.append(image(club.coin,'Клуб')); break;
    case 'theme': result = element('span','club-theme'); result.setAttribute('aria-disabled','true'); result.append(icon('sun')); break;
    case 'bell': result = link('',sourceUrl); result.setAttribute('aria-label','Уведомления'); result.append(icon('bell')); break;
    case 'write': result = link('Написать',sourceUrl,'club-write'); result.append(icon('write')); break;
    case 'login': result = link('Войти',sourceUrl,'club-login'); break;
    default: throw new Error(`Unknown header part: ${name}`);
  }
  result.dataset.dsComponent = `article.header.${name}`; return result;
}

// The prototype persists this store; DS instances use the same behavior in memory.
export function createArticleState(storage = null) {
  const stateKey = 'dns-club-article-state-v1';
  let state = {};
  try { state = JSON.parse(storage?.getItem(stateKey) || '{}') || {}; } catch { /* Keep usable. */ }
  const listeners = new Map();
  return {
    get: id => state[id] || {},
    change(id, patch) {
      state[id] = {...state[id], ...patch};
      try { storage?.setItem(stateKey, JSON.stringify(state)); } catch { /* Keep usable. */ }
      for (const update of listeners.get(id) || []) update();
    },
    subscribe(id, update) {
      if (!listeners.has(id)) listeners.set(id, []);
      listeners.get(id).push(update); update();
    }
  };
}
let articleStorage;
try { articleStorage = localStorage; } catch { /* Private or restricted browser. */ }
export const articleState = createArticleState(articleStorage);

export function voteGroup(data, {id, interactive = false, comment = false, store = articleState} = {}) {
  const votes = element('div','club-votes');
  const count = element('span','',data.votes); count.dataset.dsComponent = 'article.vote.count';
  if (interactive) {
    const up = button('Нравится', '', () => store.change(id, {vote: store.get(id).vote === 1 ? 0 : 1}), comment ? 'like' : 'up');
    const down = button('Не нравится', '', () => store.change(id, {vote: store.get(id).vote === -1 ? 0 : -1}), comment ? 'dislike' : 'down');
    up.dataset.dsComponent = 'article.vote.up'; down.dataset.dsComponent = 'article.vote.down';
    votes.append(up,count,down);
    store.subscribe(id, () => {
      count.textContent = String(Number(data.votes) + (store.get(id).vote || 0));
      up.setAttribute('aria-pressed',String(store.get(id).vote === 1)); down.setAttribute('aria-pressed',String(store.get(id).vote === -1));
    });
  } else votes.append(icon('up'),count,icon('down'));
  votes.dataset.dsComponent = 'article.votes'; return votes;
}
export function statPart(name, data, {id, commentsHref, store = articleState} = {}) {
  let result;
  if (name === 'comments') {
    result = link('',commentsHref || '#comments','club-stat-pill'); result.append(icon('comments'),element('span','',data.comments));
    result.setAttribute('aria-label',`Комментарии: ${data.comments}`);
  } else if (name === 'bookmark') {
    result = button('Добавить в закладки','club-stat-pill',()=>store.change(id,{saved:!store.get(id).saved}),'bookmark');
    store.subscribe(id,()=>{ result.setAttribute('aria-pressed',String(!!store.get(id).saved)); result.setAttribute('aria-label',store.get(id).saved ? 'Удалить из закладок' : 'Добавить в закладки'); });
  } else if (name === 'reaction') {
    result = element('span','club-stat-pill club-bottom-reaction'); result.append(image(club.reaction),element('span','',data.reactions));
  } else if (name === 'views') {
    result = element('span','club-views'); result.append(icon('views'),element('span','',data.views));
  } else if (name === 'share') {
    result = button('Поделиться','club-stat-pill',()=> {
      if (navigator.share) navigator.share({title:document.title,url:location.href}).catch(()=>{});
      else { const copy = element('textarea'); copy.value = location.href; copy.style.position = 'fixed'; copy.style.left = '-9999px'; document.body.append(copy); copy.select(); document.execCommand('copy'); copy.remove(); }
    },'share');
  } else throw new Error(`Unknown stat part: ${name}`);
  result.dataset.dsComponent = `article.${name}`; return result;
}
export function stats(data, options = {}) {
  const {comment = false, bookmark = false, bottom = false} = options;
  const row = element('div',`club-stats${comment ? ' club-stats--comment' : ''}`);
  row.append(voteGroup(data,options));
  if (data.comments !== undefined) row.append(statPart('comments',data,options));
  if (bookmark) row.append(statPart('bookmark',data,options));
  if (bottom) row.append(statPart('reaction',data,options),statPart('share',data,options));
  if (data.views) row.append(statPart('views',data,options));
  row.dataset.dsComponent = 'article.stats'; return row;
}

export function shell(sourceUrl, activeSection = 'reviews') {
  const header = element('header', 'club-header');
  const actions = element('nav', 'club-header-actions');
  actions.setAttribute('aria-label', 'Навигация Клуба DNS');
  actions.append(...['search','live','coin','theme','bell','write','login'].map(name => headerPart(name, sourceUrl)));
  header.append(headerPart('logo', sourceUrl), actions);
  const sidebar = element('aside', 'club-sidebar');
  const nav = element('nav', 'club-nav'); nav.setAttribute('aria-label', 'Разделы клуба');
  navigation.forEach(([name]) => nav.append(navigationItem(name, sourceUrl, name === activeSection)));
  const shop = link('За покупками в', configuratorHref(), 'club-shop'); shop.append(image(club.shopLogo, 'DNS'));
  nav.append(shop);
  const footer = element('footer', 'club-sidebar-footer');
  for (const [text, path] of [['О нашем клубе', 'about/tour-by-site'], ['Контакты', 'about/about-project'], ['Авторам', 'about/for-authors'], ['Правила сайта', 'about/rules'], ['Производителям', 'about/proizvoditelyam']]) footer.append(link(text, `https://club.dns-shop.ru/${path}/`));
  sidebar.append(nav, footer);
  return [header, sidebar];
}
export function disclosure(title, content, className = '') {
  const details = element('details', `club-disclosure ${className}`);
  const summary = element('summary', '', title); summary.append(icon('up'));
  details.append(summary, content);
  return details;
}
// Article sections are shared by the actual page and its component library.
export function articleHeading(data) {
  const result = element('h1','',data.title); result.dataset.dsComponent = 'article.title'; return result;
}
export function articleScreenshots(data) {
  const body = element('div', 'article-body article-screenshots');
  body.dataset.dsComponent = 'article.screenshots';
  data.screenshotPages.forEach((part, index) => {
    const node = image(part.image, part.alt, index === 0);
    node.id = part.id;
    node.dataset.screenshotPart = String(index + 1);
    body.append(node);
  });
  return body;
}
export function articleCover(data) {
  const result = media(data.hero,data.heroAlt,true); result.classList.add('article-hero'); result.dataset.dsComponent = 'article.cover';
  if (!data.heroCaption) return result;
  const figure = element('figure', 'article-cover-with-caption');
  figure.append(result, element('figcaption', 'article-caption', data.heroCaption));
  return figure;
}
export function articleContents(data) {
  const toc = element('ol','article-toc');
  data.blocks.filter(block => block.type === 'heading' && block.level === 2).forEach(block => {
    const item = element('li'); item.append(link(block.text, '#' + block.id)); toc.append(item);
  });
  const result = disclosure('Содержание',toc,'article-contents'); result.dataset.dsComponent = 'article.contents'; return result;
}
export function mentionedProducts(data) {
  if (data.showMentionedProducts === false || !Object.keys(data.products || {}).length) return document.createDocumentFragment();
  const grid = data.mentionedLayout === 'grid';
  const mentioned = element('div', grid ? 'article-mentioned article-mentioned--grid' : 'article-mentioned');
  Object.values(data.products).forEach(product => mentioned.append(grid ? mentionedProductCard(product) : productReference(product)));
  const result = disclosure('Упомянутые товары',mentioned,grid ? 'article-products article-products--grid' : 'article-products'); result.dataset.dsComponent = 'article.mentioned'; return result;
}
export function mentionedProductCard(product) {
  const card = link('', product.href, 'article-mentioned-card');
  card.dataset.productId = product.id;
  card.dataset.dsComponent = 'article.mentionedCard';
  card.append(image(product.image, product.name), element('strong', 'article-mentioned-price', product.priceText), element('span', 'article-mentioned-name', product.name));
  return card;
}
export function productReference(product) {
  const card = link('', product.href, 'article-product');
  card.dataset.productId = product.id;
  card.dataset.dsComponent = 'article.product';
  const photo = element('span', 'article-product-photo'); photo.append(image(product.image));
  card.append(photo, element('span', 'article-product-name', product.name), icon('product-info'));
  return card;
}
// One lazily created viewer per document/DS shadow root; no extra image assets.
const mediaItems = new WeakMap();
const viewers = new WeakMap();
export function imageViewer() {
  const dialog = element('dialog', 'article-lightbox');
  dialog.dataset.dsComponent = 'article.imageViewer';
  dialog.setAttribute('aria-label', 'Просмотр изображений статьи');
  const thumbnails = element('nav', 'article-lightbox-thumbnails');
  thumbnails.setAttribute('aria-label', 'Изображения статьи');
  const stage = element('div', 'article-lightbox-stage');
  const full = element('img', 'article-lightbox-image');
  const counter = element('span', 'article-lightbox-counter');
  counter.setAttribute('aria-live', 'polite');
  stage.append(full, counter);
  let items = [], selected = 0, opener, overflow;
  const choose = index => {
    selected = (index + items.length) % items.length;
    const item = items[selected];
    const block=item.trigger?.closest('[data-evidence-id]');
    for(const key of ['evidenceId','evidenceKinds','sourceId']){
      if(block?.dataset[key])dialog.dataset[key]=block.dataset[key];else delete dialog.dataset[key];
    }
    dialog.dataset.telemetryTarget=new URL(item.data.src,import.meta.url).pathname.split('/').pop();
    full.src = assetUrl(item.data.src); full.alt = item.alt;
    full.width = item.data.width; full.height = item.data.height;
    counter.textContent = `${selected + 1}/${items.length}`;
    [...thumbnails.children].forEach((thumb, i) => thumb.setAttribute('aria-current', String(i === selected)));
    const active = thumbnails.children[selected];
    if (active) thumbnails.scrollTop = Math.max(0, active.offsetTop - thumbnails.offsetTop - (thumbnails.clientHeight - active.offsetHeight) / 2);
  };
  const previous = button('Предыдущее изображение', 'article-lightbox-previous', () => choose(selected - 1));
  const next = button('Следующее изображение', 'article-lightbox-next', () => choose(selected + 1));
  const close = button('Закрыть изображение', 'article-lightbox-close', () => dialog.close());
  for (const [control, pathData] of [[previous, 'M18 2L3 17l15 15'], [next, 'M2 2l15 15L2 32']]) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 20 34'); svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', pathData); path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor'); path.setAttribute('stroke-width', '2');
    svg.append(path); control.append(svg);
  }
  close.textContent = '×';
  dialog.append(thumbnails, stage, previous, next, close);
  dialog.addEventListener('click', event => {
    if (event.target === dialog || event.target === stage) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); choose(selected + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = overflow;
    opener?.focus({preventScroll:true});
  });
  return {
    element: dialog,
    open(entries, index, trigger) {
      items = entries; opener = trigger;
      prototypeImages.release(thumbnails);
      thumbnails.replaceChildren(...items.map((item, i) => {
        const thumb = button(`Изображение ${i + 1}: ${item.alt}`, 'article-lightbox-thumbnail', () => choose(i));
        thumb.append(image(item.data, '', false, 'default')); return thumb;
      }));
      previous.hidden = next.hidden = items.length < 2;
      overflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      dialog.showModal(); choose(index); close.focus({preventScroll:true});
    }
  };
}
function media(data, alt, eager = false, sequenceTrigger = null) {
  const trigger = button('Увеличить: ' + alt, 'article-media', () => {
    const root = trigger.getRootNode();
    if (!viewers.has(root)) {
      const viewer = imageViewer(); viewers.set(root, viewer);
      (root === document ? document.body : root).append(viewer.element);
    }
    const triggers = [...root.querySelectorAll('.article-media')].filter(node => mediaItems.has(node));
    viewers.get(root).open(triggers.map(node => mediaItems.get(node)), triggers.indexOf(sequenceTrigger || trigger), trigger);
  });
  if (!sequenceTrigger) mediaItems.set(trigger, {data, alt,trigger});
  trigger.append(image(data, alt, eager));
  return trigger;
}
export function bodyBlock(block, products, context) {
  let node;
  switch (block.type) {
    case 'paragraph': node = richText(element('p', block.variant ? `article-${block.variant}` : ''), block.content); break;
    case 'heading': node = element(`h${block.level}`, '', block.text); break;
    case 'image':
      node = element('figure');
      if (block.interactive === false) {
        const poster = image(block.image, block.alt || context);
        poster.className = 'article-static-image';
        node.append(poster);
      } else node.append(media(block.image, block.alt || context));
      if (block.caption) node.append(element('figcaption', 'article-caption', block.caption));
      break;
    case 'disclosure': {
      const content = element('div', 'article-body');
      (block.blocks || []).forEach(child => content.append(bodyBlock(child, products, context)));
      node = disclosure(block.title, content);
      break;
    }
    case 'gallery': {
      const gallery = element('div', 'article-gallery');
      gallery.style.setProperty('--columns', block.thumbnailLimit || block.images.length);
      block.images.forEach((data, index) => {
        const item = media(data, data.placeholder ? 'Медиа' : `${context}, изображение ${index + 1}`);
        if (block.thumbnailLimit && index >= block.thumbnailLimit) item.hidden = true;
        if (block.moreLabel && index === block.thumbnailLimit - 1) item.append(element('span', 'article-gallery-more', block.moreLabel));
        gallery.append(item);
      });
      if (block.variant === 'thumbnails') {
        node = element('div', 'article-gallery-with-thumbnails');
        const first = gallery.firstElementChild;
        const thumbnail = media(block.images[0], `${context}, изображение 1`, false, first);
        first.replaceWith(thumbnail);
        node.append(first, gallery);
      } else node = gallery;
      if (block.caption) {
        const figure = element('figure');
        figure.append(node, element('figcaption', 'article-caption', block.caption));
        node = figure;
      }
      break;
    }
    case 'product': node = productReference(products[block.productId]); break;
    case 'product-group':
      node = element('div', 'article-product-group');
      block.productIds.forEach(id => node.append(productReference(products[id])));
      break;
    case 'quote': node = richText(element('blockquote', block.variant === 'notice' ? 'club-quote article-notice' : 'club-quote'), block.content); break;
    case 'media-placeholder':
      node = element('div', 'article-media-placeholder', block.label || 'Медиа');
      node.setAttribute('role', 'img'); node.setAttribute('aria-label', 'Заглушка: ' + (block.label || 'медиа'));
      node.style.aspectRatio = block.aspectRatio || '16 / 9';
      break;
    case 'separator': node = element('hr', 'article-separator'); break;
    case 'cta': node = link(block.text, block.href, 'article-cta'); break;
    case 'list':
      node = element('ul', 'article-list');
      block.items.forEach(item => {
        const li = element('li');
        item.forEach(part => li.append(richText(element('span'), [part])));
        node.append(li);
      });
      break;
    case 'captions':
      node = element('div', 'article-captions'); node.style.setProperty('--columns', block.rows[0].length);
      block.rows[0].forEach(text => node.append(element('div', '', text))); break;
    case 'table': {
      node = element('div', 'article-table-scroll'); node.tabIndex = 0;
      node.setAttribute('aria-label', block.label || 'Таблица');
      const table = element('table', block.variant === 'processor-power' ? 'article-table--processor-power' : '');
      block.rows.forEach((row, index) => {
        const tr = element('tr');
        row.forEach((text, cellIndex) => {
          const cell = element(index === 0 || cellIndex === 0 ? 'th' : 'td', '', text);
          if (cell.tagName === 'TH') cell.scope = index === 0 ? 'col' : 'row';
          tr.append(cell);
        });
        table.append(tr);
      });
      node.append(table); break;
    }
    default: throw new Error(`Unknown article block: ${block.type}`);
  }
  node.id = block.id;
  node.dataset.dsComponent = `article.body.${block.type}`;
  return node;
}
export function recommendation(data, compact = false) {
  const card = element('article', `club-recommendation${compact ? ' club-recommendation--compact' : ''}`);
  card.dataset.articleId = data.id;
  card.dataset.dsComponent = 'article.recommendation';
  const cover = link('', data.href, 'club-recommendation-cover'); cover.append(image(data.image, data.title));
  const content = element('div', 'club-recommendation-content');
  if (data.author) content.append(author(data.author, data.date, true));
  content.append(link(data.title, data.href, 'club-recommendation-title'));
  const meta = stats(data.stats, { commentsHref: data.href + '#comments' });
  if (data.reactions?.length) {
    const reactions = element('div', 'club-reactions');
    data.reactions.forEach(item => reactions.append(image(item)));
    meta.append(reactions);
  }
  content.append(meta); card.append(cover, content); return card;
}
export function recommendations(title, items, compact) {
  const section = element('section', 'club-recommendations');
  const heading = element('h2', '', title);
  const grid = element('div', compact ? 'club-popular-grid' : 'club-related-grid');
  items.forEach(item => grid.append(recommendation(item, compact)));
  section.append(heading, grid); return section;
}
export function promos() {
  const row = element('nav', 'club-promos');
  for (const data of club.promos) {
    const card = link('', data.href);
    const text = element('div'); text.append(element('span', '', data.title), element('small', '', data.description));
    card.style.backgroundImage = `url("${assetUrl(data.image.src)}")`;
    card.append(text, image(data.logo, 'DNS')); row.append(card);
  }
  return row;
}
export function comments(article, {store = articleState} = {}) {
  const section = element('section', 'club-panel club-comments'); section.id = 'comments';
  const head = element('div', 'club-comments-heading');
  const title = element('h2', '', 'Комментарии '); title.append(element('span', 'club-muted', article.stats.comments));
  const sort = element('span', 'club-comment-sort', 'По популярности'); sort.append(icon('down')); head.append(title, sort);
  section.append(head, element('p', 'club-comment-rules', 'Наслаждайтесь общением. Критикуйте сообщения, а не авторов. Меньше токсичности, больше любви ❤️'));
  const input = element('textarea', 'club-comment-input'); input.placeholder = '@ для упоминания'; input.rows = 1; input.setAttribute('aria-label', 'Комментарий');
  section.append(input);
  const list = element('div', 'club-comment-list');
  const commentNodes = new Map();
  article.commentGroups.forEach(group => {
    const wrapper = element('div', 'club-comment-group'); wrapper.dataset.groupId = group.id;
    group.comments.forEach(data => {
      const node = element('article', `club-comment${data.level ? ' club-comment--reply' : ''}`); node.id = data.id;
      commentNodes.set(data.id, node);
      if (data.level > 1) node.style.setProperty('--comment-depth', Math.min(data.level, 2));
      const header = element('header', 'club-comment-header');
      const identity = element('div', 'club-comment-identity');
      identity.append(image(data.avatar));
      const info = element('div');
      const nameRow = element('div', 'club-comment-names');
      nameRow.append(link(data.author, data.authorUrl, data.authorBadge ? 'club-author-badge' : ''));
      if (data.replyTo) nameRow.append(element('span', 'club-reply-to', '↳ ' + data.replyTo));
      info.append(nameRow, element('small', 'club-muted', data.date + (data.edited ? ' · Изменено автором' : '')));
      identity.append(info);
      const permalink = link('', '#' + data.id, 'club-comment-permalink'); permalink.append(icon('link')); permalink.setAttribute('aria-label', 'Ссылка на комментарий');
      header.append(identity, permalink); node.append(header);
      const body = element('div', 'club-comment-body');
      data.body.forEach(part => body.append(element(part.type === 'quote' ? 'blockquote' : 'p', part.type === 'quote' ? 'club-quote' : '', part.text)));
      node.append(body);
      const actions = stats({ votes: data.votes }, { id: data.id, interactive: true, comment: true, store });
      const reply = button('Ответить ' + data.author, 'club-reply-button', () => { input.value = '@' + data.author + ' '; input.focus(); input.scrollIntoView({ block: 'center' }); }); reply.textContent = 'Ответить'; actions.append(reply); node.append(actions);
      if (data.replies) {
        const following = article.commentGroups.flatMap(g => g.comments);
        const index = following.findIndex(item => item.id === data.id);
        const children = [];
        for (let next = index + 1; next < following.length && following[next].level > data.level; next++) children.push(following[next].id);
        if (children.length) {
          let open = true;
          const toggle = button(data.replies, 'club-comment-replies', () => {
            open = !open;
            children.forEach(id => { commentNodes.get(id).hidden = !open; });
            toggle.firstChild.textContent = `${open ? 'Свернуть' : 'Развернуть'} ответы ${children.length}`;
            toggle.setAttribute('aria-expanded', String(open));
          });
          toggle.append(element('span', '', data.replies), icon('up')); toggle.setAttribute('aria-expanded', 'true'); toggle.setAttribute('aria-controls', children.join(' ')); node.append(toggle);
        } else {
          // Omitted replies retain their reference appearance without external navigation.
          const more = link(data.replies.replace('Свернуть', 'Развернуть'), article.sourceUrl + '#' + data.id, 'club-comment-replies'); more.append(icon('down')); node.append(more);
        }
      }
      wrapper.append(node);
    });
    list.append(wrapper);
  });
  section.append(list); return section;
}

// Shared by every article and by the component library.
export function backToTop() {
  const control = button('Наверх', 'club-back-top', () => {
    window.scrollTo({top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
  control.dataset.dsComponent = 'article.backToTop';
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrow.setAttribute('viewBox', '0 0 24 24');
  arrow.setAttribute('width', '24'); arrow.setAttribute('height', '24');
  arrow.setAttribute('aria-hidden', 'true'); arrow.setAttribute('fill', 'none');
  const path = document.createElementNS(arrow.namespaceURI, 'path');
  path.setAttribute('d', 'M12 20V4M5 11l7-7 7 7');
  path.setAttribute('stroke', 'currentColor'); path.setAttribute('stroke-width', '1.8');
  path.setAttribute('stroke-linecap', 'round'); path.setAttribute('stroke-linejoin', 'round');
  arrow.append(path); control.append(arrow); return control;
}

export function breadcrumbs(data) {
  const result = element('nav', 'club-breadcrumbs'); result.setAttribute('aria-label','Хлебные крошки');
  const publication = data.publication || {title:'Обзоры',href:'https://club.dns-shop.ru/review/'};
  result.append(link(publication.title, publication.href), document.createTextNode(' / '), link(data.category.title,data.category.href));
  return result;
}
