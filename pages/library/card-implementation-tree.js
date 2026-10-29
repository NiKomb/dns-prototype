/* Local inspection and isolated variants of the existing library card. */
(async () => {
  const specimen = [...document.querySelectorAll('#ds-cards > .ds-specimen')]
    .find(item => item.querySelector('.ds-caption')?.textContent === 'Обычная · «Добавить»');
  if (!specimen) return;
  const card = specimen.querySelector('[data-ds-component="catalog.card"]');
  const data = processorCatalog.find(item => item.id === card.dataset.productId);
  const previewData = {...data, comparisonContext:card.comparisonContext};
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const paths = {
    catalog: 'shared/catalog/catalog-shared.js', action: 'shared/catalog/action-button.js',
    header: 'shared/catalog/configurator-components.js', library: 'pages/library/components.js',
    styles: 'shared/catalog/styles.css', images: 'shared/image-loading.js'
  };
  const sources = new Map();
  try {
    await Promise.all(Object.values(paths).map(async path => {
      const response = await fetch(path, {cache: 'no-store'});
      if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
      sources.set(path, await response.text());
    }));
    // A line number is resolved from the served source, never pinned to an old revision.
    const at = (needle, file = 'catalog', after = '') => {
      const path = paths[file], text = sources.get(path);
      const start = after ? text.indexOf(after) : 0;
      const offset = start < 0 ? -1 : text.indexOf(needle, start);
      if (offset < 0) throw new Error(`Не найдено место реализации: ${needle}`);
      return {path, line: text.slice(0, offset).split('\n').length};
    };
    const factory = id => at(`define('${id}',`);
    const insideCard = needle => at(needle, 'catalog', 'function productCard(data)');
    for (const id of ['card', 'photo', 'imageBadge', 'pagination', 'productName', 'badge', 'meta', 'rating', 'questions', 'reliability', 'spec', 'price', 'compareIcon', 'favorite', 'select', 'stock', 'delivery']) {
      if (!sources.get(paths.catalog).includes(catalogUI.components[id].create.toString())) {
        throw new Error(`Загруженная фабрика catalog.${id} отличается от исходника`);
      }
    }
    const productInputs = ['id', 'index', 'name', 'image', 'imageBadge', 'badge', 'badgeKind', 'rating', 'reviews', 'questions', 'reliability', 'specs', 'price', 'monthly', 'stores', 'category'];
    const info = (label, kind, method, ref, inputs, condition = 'Создаётся всегда.', atomic = 'Обычный DOM-узел; отдельный уровень Atomic Design ему не назначен.', extra = '') =>
      ({label, kind, method, ref, inputs, condition, atomic, extra});
    const registered = (id, label, inputs, condition, atomic, extra = '') =>
      info(label, 'Компонент', `catalogUI.component('${id}'${inputs.length ? ', data' : ''})`, factory(id), inputs, condition, atomic, extra);
    const atom = 'В принятой модели — атом / элемент.';
    const molecule = 'В принятой модели — молекула / составная группа.';
    const rules = new Map();
    const bind = (element, rule) => { if (element) rules.set(element, rule); };
    bind(card, info('Карточка товара', 'Компонент', "catalog.card → productCard(data) → node('article', …)", at('function productCard(data)'), productInputs,
      'Создаётся по вызову фабрики. id записывается при truthy id; index — при index != null.', 'В принятой модели — организм.',
      'Шаг 1. Финальный card.append: фото → информация → боковой блок → характеристики → наличие. Порядок создания внутри функции отличается от порядка DOM.',));
    const picture = card.querySelector(':scope > .product-image');
    const detail = card.querySelector(':scope > .product-detail');
    const side = card.querySelector(':scope > .product-side');
    const specs = card.querySelector(':scope > .product-specs');
    const buttons = side.querySelector('.product-buttons');
    bind(picture, info('Контейнер изображения', 'DOM-контейнер', "node('div', 'product-image')", insideCard("const picture = node('div'"), ['image', 'imageBadge', 'name'], undefined, undefined, 'Шаг 2. Затем создаются фото, условный бейдж и пагинация.'));
    bind(detail, info('Информация о товаре', 'DOM-контейнер', "node('div', 'product-detail')", insideCard("const detail = node('div'"), ['name', 'badge', 'badgeKind', 'rating', 'reviews', 'questions', 'reliability'], undefined, undefined, 'Шаг 6. Содержимое добавляется на шаге 9, после создания строк характеристик.'));
    bind(side, info('Боковой блок цены и действий', 'Группа внутри productCard', "node('div', 'product-side'); side.append(price, buttons)", insideCard("const side = node('div'"), ['price', 'monthly', 'id', 'category'], undefined, undefined, 'Шаг 10. Собственной зарегистрированной фабрики группы нет. Цена создаётся после кнопок, но в DOM располагается перед ними.'));
    bind(buttons, info('Действия с товаром', 'Группа внутри productCard', "node('div', 'product-buttons'); buttons.append(compareIcon, favorite, select)", insideCard("const buttons = node('div'"), ['id', 'category'], undefined, molecule, 'Шаг 11 — контейнер; шаг 12 — кнопки в порядке сравнение → избранное → выбор. Отдельной фабрики группы нет.'));
    bind(specs, info('Список характеристик', 'Группа внутри productCard', "node('dl', 'product-specs'); specs.forEach(spec => dl.append(component('spec', {specs:[spec]}).firstElementChild))", insideCard('specs.forEach'), ['specs'],
      'Контейнер создаётся всегда; при specs = [] строк нет.', molecule,
      'Шаг 7 — dl; шаг 8 — строки. catalog.spec возвращает временный dl: в карточку переносится только его первый div. Временный dl не является частью DOM карточки.'));
    const componentRules = {
      photo: registered('photo', 'Фото товара', ['image', 'name'], 'Создаётся всегда; URL назначает prototypeImages.defer.', atom, 'Шаг 3. alt получает name; загрузка изображения отложенная.'),
      imageBadge: registered('imageBadge', 'Бейдж на изображении', ['imageBadge'], 'В productCard создаётся только при truthy imageBadge.', atom, 'Шаг 4; alt пустой.'),
      pagination: registered('pagination', 'Пагинация изображений', [], 'Создаётся всегда, независимо от числа фото.', 'Элемент управления изображением.', 'Шаг 5. Статический span.image-dots с двумя i.'),
      productName: registered('productName', 'Название товара', ['name'], 'Создаётся всегда. Несовместимость не передаётся в эту фабрику.', atom,
        'Шаг 9.1. syncCards меняет is-alternative-socket у карточки по otherSocket и socket(card); знак × рисует CSS, отдельного DOM-узла для него нет.'),
      badge: registered('badge', 'Бейдж товара', ['badge', 'badgeKind'], 'span создаётся всегда, но hidden = !label. badgeKind выбирает hit / exclusive / dns; иначе используется badge.', atom, 'Шаг 9.2. Отсутствие бейджа не означает отсутствие DOM-узла.'),
      meta: registered('meta', 'Показатели товара', ['rating', 'reviews', 'questions', 'reliability'], 'Создаётся всегда. productCard передаёт showCompare:false.', molecule,
        'Шаг 9.3. productMeta: сравнение (условно) → рейтинг → вопросы (условно) → надёжность. В этой карточке чекбокса сравнения нет.'),
      rating: registered('rating', 'Рейтинг и отзывы', ['rating', 'reviews'], 'Создаётся всегда. reviews == null → «—»; reviews >= 1000 → сокращение k.', molecule),
      questions: registered('questions', 'Вопросы о товаре', ['questions'], 'productMeta добавляет только при questions != null; ноль показывается.', molecule),
      reliability: registered('reliability', 'Надёжность', ['reliability'], 'Создаётся всегда. undefined → «Отличная»; null → неизвестна; «Хорошая» добавляет is-good к SVG.', molecule),
      price: registered('price', 'Цена и ежемесячный платёж', ['price', 'monthly'], 'Создаётся всегда. price == null → «—» и скрытый small; иначе monthly ?? round(price × 0.0975).', molecule, 'Шаг 13. В DOM перед группой кнопок.'),
      compareIcon: registered('compareIcon', 'Кнопка сравнения', ['product', 'category', 'id'], 'Создаётся всегда. Без product/category — disabled; aria-pressed берётся из comparisonState(category, comparisonContext). В рабочем прототипе контекст общий; здесь ограничен карточкой.', atom,
        'Шаг 12.1. Используется тот же button, что создаёт catalog.favorite. Затем меняются подпись, классы и маркер компонента. Это вызов фабрики, а не вложенная кнопка. SVG: comparisonIcon → catalog.siteHeader → первый .header-actions svg → cloneNode(true). Клик вызывает setCompared с изолированным контекстом образца.'),
      favorite: registered('favorite', 'Кнопка избранного', [], 'Создаётся всегда; пиктограмма задаётся CSS, вложенного DOM для неё нет.', atom, 'Шаг 12.2.'),
      select: registered('select', 'Кнопка выбора товара', [], 'productCard не передаёт selection: начальное состояние «Добавить».', atom,
        'Шаг 12.3. catalogActionButton() создаёт button. setSelectionButton задаёт текст, aria-disabled и is-added. После создания syncCards выбирает Добавить / Заменить / Добавлен по selected.id; в этом образце selected = null.'),
      stock: registered('stock', 'Наличие и доставка', ['stores'], 'DOM создаётся всегда; весь блок скрыт только при stores === null.', molecule,
        'Шаг 15, внутри финального card.append. Две строки создаются через markup; третья — catalog.delivery. Значения наличия в markup фиксированы, stores управляет скрытием.'),
      delivery: registered('delivery', 'Строка доставки', [], 'Всегда создаётся внутри stock; скрывается вместе с родителем при stores === null.', molecule)
    };
    componentRules.meta.ref = at('function productMeta(data)');
    componentRules.meta.method = "catalogUI.component('meta', {...data, showCompare:false}) → productMeta(data)";
    for (const element of card.querySelectorAll('[data-ds-component]')) {
      const id = element.dataset.dsComponent.replace('catalog.', '');
      if (componentRules[id]) bind(element, componentRules[id]);
    }
    [...specs.children].forEach((row, index) => {
      bind(row, {
        ...registered('spec', `${data.specs[index][0]}: ${data.specs[index][1]}`, ['specs'], 'По одной строке на каждую пару в data.specs, в исходном порядке.', molecule),
        method: "catalogUI.component('spec', {specs:[spec]}).firstElementChild",
        values: {specs: [data.specs[index]]}, extra: `Шаг 8.${index + 1}. Строка ${index + 1}: div с dt и dd, извлечённый из временного dl.`
      });
      bind(row.querySelector('dt'), {...info('Подпись характеристики', 'DOM-узел', "node('dt', '', `${label}:`)", at("row.append(node('dt'"), ['specs']), values: {label: data.specs[index][0]}});
      bind(row.querySelector('dd'), {...info('Значение характеристики', 'DOM-узел', "node('dd', '', value)", at("row.append(node('dt'"), ['specs']), values: {value: data.specs[index][1]}});
    });
    bind(card.querySelector('.catalog-compare-icon > svg'), info('SVG сравнения', 'DOM-узел', "comparisonIcon() → component('siteHeader').querySelector('.header-actions svg').cloneNode(true)", at('function comparisonIcon()'), [], 'Клонируется из шапки при создании compareIcon.', undefined, 'Шапка создаётся вне DOM карточки. В дерево вложенности входит только извлечённый SVG, а не вся шапка.'));
    bind(card.querySelector('.product-price > strong'), info('Стоимость', 'DOM-узел', "node('strong', …)", at("const amount = node('strong'"), ['price'], 'Всегда; при null/undefined — «—».'));
    bind(card.querySelector('.product-price > small'), info('Ежемесячный платёж', 'DOM-узел', "node('small'); payment.hidden = price == null", at("const payment = node('small')"), ['price', 'monthly'], 'Узел всегда существует; скрыт при неизвестной цене.'));
    const stockLines = card.querySelectorAll('.product-stock > .stock-line');
    bind(stockLines[0], info('Наличие в магазинах', 'DOM-строка', 'markup: div.stock-line с span и a', factory('stock'), ['stores'], 'Входит в статический markup stock; скрывается с родителем.'));
    bind(stockLines[1], info('Пункты выдачи', 'DOM-строка', 'markup: div.stock-line с span и a', factory('stock'), ['stores'], 'Входит в статический markup stock; скрывается с родителем.'));
    const meta = card.querySelector('.product-meta');
    const rootModel = build(card, rules.get(card));
    function build(element, inherited) {
      const rule = rules.get(element) || info(
        `${element.localName}${element.classList.length ? '.' + [...element.classList].join('.') : ''}`,
        'DOM-узел', `DOM внутри ${inherited.method}`, inherited.ref, inherited.inputs,
        'Создаётся вместе с родительским узлом; его видимость наследуется.', undefined,
        element.textContent && !element.children.length ? `Текущее содержимое: ${element.textContent}` : 'Часть разметки родителя; отдельной зарегистрированной фабрики нет.');
      const model = {...rule, inputData: data, element, children: [...element.children].map(child => build(child, rules.get(element) || inherited))};
      // Document branches that the current data prevents from entering the DOM.
      if (element === picture && !element.querySelector('.image-badge')) model.children.splice(1, 0, {...componentRules.imageBadge, children: [], element: null, fallback: picture});
      if (element === meta) {
        model.children.unshift({...registered('compare', 'Чекбокс сравнения · отсутствует', ['showCompare'], 'productMeta создаёт при showCompare !== false; productCard всегда передаёт false.', atom), values: {showCompare: false}, element: null, fallback: meta, children: []});
        if (data.questions == null) model.children.splice(2, 0, {...componentRules.questions, element: null, fallback: meta, children: []});
      }
      return model;
    }
    const explorer = make('div', 'ds-card-code'); explorer.id = 'card-implementation';
    const navigation = make('section', 'ds-card-code-navigation');
    const heading = make('h3', '', 'Как собрана карточка'); heading.id = 'ds-card-code-title';
    navigation.setAttribute('aria-labelledby', heading.id);
    const introduction = make('p', 'ds-note', 'DOM-вложенность текущего образца. Шаги в описании показывают порядок создания в коде.');
    const legend = make('p', 'ds-card-code-legend', 'К — компонент · DOM — обычный узел · Г — группа внутри productCard');
    const help = make('p', 'ds-note', '↑ ↓ — выбор; → ← — ветви; Home / End — начало и конец; Enter / пробел — выбрать.');
    const tree = make('div', 'ds-card-code-tree'); tree.setAttribute('role', 'tree'); tree.setAttribute('aria-labelledby', heading.id);
    navigation.append(heading, introduction, legend, help, tree);
    const description = make('section', 'ds-card-code-description'); description.setAttribute('aria-label', 'Описание выбранной части карточки');
    const announcement = make('p', 'ds-card-code-status'); announcement.setAttribute('role', 'status'); announcement.setAttribute('aria-live', 'polite');
    const highlight = make('div', 'ds-card-code-highlight'); highlight.hidden = true; highlight.setAttribute('aria-hidden', 'true');
    const models = [], items = new Map(); let selected;
    function render(model, parent, level = 1) {
      model.parent = parent; models.push(model);
      const item = make('div', 'ds-card-code-item'); item.setAttribute('role', 'treeitem'); item.tabIndex = -1;
      item.setAttribute('aria-level', String(level)); item.setAttribute('aria-selected', 'false');
      const row = make('div', 'ds-card-code-row');
      const toggle = make('button', 'ds-card-code-toggle', model.children.length ? '▸' : '·'); toggle.type = 'button'; toggle.tabIndex = -1;
      toggle.setAttribute('aria-label', `Раскрыть: ${model.label}`); toggle.disabled = !model.children.length;
      const mark = make('span', 'ds-card-code-kind', model.kind === 'Компонент' ? 'К' : model.kind.startsWith('Группа') ? 'Г' : 'DOM');
      const label = make('span', 'ds-card-code-label', model.label); label.id = `ds-card-code-node-${models.length}`;
      item.setAttribute('aria-labelledby', label.id);
      row.append(toggle, mark, label); item.append(row); items.set(item, model); model.item = item; model.toggle = toggle;
      if (!model.element) row.append(make('span', 'ds-card-code-absent', 'нет в DOM'));
      if (model.children.length) {
        item.setAttribute('aria-expanded', 'false');
        const group = make('div', 'ds-card-code-group'); group.setAttribute('role', 'group'); group.hidden = true;
        model.group = group; model.children.forEach(child => group.append(render(child, model, level + 1))); item.append(group);
      }
      toggle.addEventListener('mousedown', event => event.preventDefault());
      toggle.onclick = event => { event.stopPropagation(); expand(model, model.group.hidden); activate(model); };
      return item;
    }
    tree.append(render(rootModel, null));
    specimen.replaceWith(explorer); specimen.classList.add('ds-card-code-preview');specimen.querySelector('.ds-caption').textContent='Базовые характеристики';
    const inspection = make('details', 'ds-card-inspection');
    inspection.open = true;
    inspection.append(make('summary', '', 'Состав и состояния'));
    const contents = make('div', 'ds-card-inspection-content');contents.append(navigation,description);inspection.append(contents);
    explorer.append(specimen,inspection,announcement,highlight);
    inspection.addEventListener('toggle', drawHighlight);
    function expand(model, open) {
      if (!model.group) return;
      if (!open && selected && model !== selected && model.item.contains(selected.item)) activate(model);
      model.group.hidden = !open; model.item.setAttribute('aria-expanded', String(open)); model.toggle.textContent = open ? '▾' : '▸';
      model.toggle.setAttribute('aria-label', `${open ? 'Свернуть' : 'Раскрыть'}: ${model.label}`);
    }
    function isVisible(element) { return element && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden'; }
    function targetFor(model) {
      let element = model.element || model.fallback;
      while (element && !isVisible(element)) element = element.parentElement;
      return element && card.contains(element) ? element : card;
    }
    function drawHighlight() {
      if (!selected || !inspection.open) {highlight.hidden=true;return;}
      const target = targetFor(selected), box = target.getBoundingClientRect(), origin = explorer.getBoundingClientRect();
      highlight.hidden = !box.width || !box.height;
      Object.assign(highlight.style, {left: `${box.left - origin.left}px`, top: `${box.top - origin.top}px`, width: `${box.width}px`, height: `${box.height}px`});
    }
    function field(label, value) {
      const wrapper = make('div', 'ds-card-code-field'); wrapper.append(make('dt', '', label), make('dd', '', value)); return wrapper;
    }
    function showDescription(model) {
      const title = make('h3', '', model.label);
      const facts = make('dl', 'ds-card-code-facts');
      const ref = model.ref;
      const source = field('Реализация', '');
      const link = make('a', '', `${ref.path}:${ref.line}`); link.href = `${ref.path}#L${ref.line}`; link.target = '_blank'; link.rel = 'noopener'; source.querySelector('dd').append(link);
      const values = model.values || Object.fromEntries(model.inputs.map(key => [key, (model.inputData || data)[key] === undefined ? 'undefined (не передано)' : (model.inputData || data)[key]]));
      facts.append(field('Тип узла', model.kind), field('Создание', model.method), source, field('Входные данные', Object.keys(values).length ? JSON.stringify(values, null, 2) : 'Нет входных данных.'), field('Условие', model.condition), field('Atomic Design', model.atomic));
      const actual = !model.element ? 'Узел не создан в этом образце. Рамка показывает родительскую область.' : !isVisible(model.element) ? 'Узел есть в DOM, но скрыт. Рамка показывает ближайшую видимую область.' : 'Рамка показывает выбранную часть существующей карточки.';
      const extra = model.extra?.startsWith('Текущее содержимое:') ? `Текущее содержимое: ${model.element?.textContent ?? 'узел отсутствует'}` : model.extra;
      const notes = make('p', 'ds-note', [extra, actual].filter(Boolean).join(' '));
      const code = make('pre', 'ds-card-code-source', sources.get(ref.path).split('\n').slice(ref.line - 1, ref.line + 3).map((line, index) => `${ref.line + index}  ${line.trim()}`).join('\n'));
      description.replaceChildren(title, facts, notes);
      if (model.element?.matches('.catalog-compare-icon')) {
        const dependencies = make('p', 'ds-note', `Текущее aria-pressed: ${model.element.getAttribute('aria-pressed')}. Источник состояния: ${at('function comparisonState(').path}:${at('function comparisonState(').line}. Источник SVG: ${at('function comparisonIcon()').path}:${at('function comparisonIcon()').line}; шаблон siteHeader: ${at('"siteHeader":', 'header').path}:${at('"siteHeader":', 'header').line}.`);
        description.append(dependencies);
      }
      if (model.element?.matches('.product-name,.catalog-action-button')) description.append(make('p', 'ds-note', `Обновление состояний: ${at('function syncCards(').path}:${at('function syncCards(').line}. Данные этого образца и вызов syncCards: ${at("['Обычная · «Добавить»'", 'library').path}:${at("['Обычная · «Добавить»'", 'library').line}.`));
      if (model.element?.matches('.catalog-action-button')) description.append(make('p', 'ds-note', `Нативная кнопка создаётся в ${at('document.createElement(\'button\')', 'action').path}:${at('document.createElement(\'button\')', 'action').line}.`));
      if (model === rootModel) description.append(make('p', 'ds-note', `Здесь указаны исходные параметры карточки. Временные варианты передаются только фабрикам изменяемых частей; описание этих частей показывает последние применённые входы. Регистрация catalog.card: ${factory('card').path}:${factory('card').line}.`));
      if (model.element?.matches('.product-meta')) description.append(make('p', 'ds-note', `Регистрация catalog.meta: ${factory('meta').path}:${factory('meta').line}.`));
      if (model.element?.matches('.product-name')) description.append(make('p', 'ds-note', `Отображение несовместимости через ::before: ${at('.is-alternative-socket .product-detail h3::before', 'styles').path}:${at('.is-alternative-socket .product-detail h3::before', 'styles').line}.`));
      if (model.element?.matches('.catalog-photo')) description.append(make('p', 'ds-note', `Отложенная загрузка: ${at('function defer(image', 'images').path}:${at('function defer(image', 'images').line}. URL уже передан фабрикой; дерево не назначает его повторно.`));
      description.append(code);
      showVariants(model);
    }
    function activate(model, focus = true) {
      for (const entry of models) { entry.item.tabIndex = entry === model ? 0 : -1; entry.item.setAttribute('aria-selected', String(entry === model)); }
      selected = model; showDescription(model); drawHighlight(); announcement.textContent = `Выбрано: ${model.label}.`;
      if (focus) model.item.focus({preventScroll: true});
    }
    const visibleModels = () => models.filter(model => !model.item.closest('[role="group"][hidden]'));
    const selectTreeNode = event => { const model = items.get(event.target.closest('[role="treeitem"]')); if (model) activate(model); };
    tree.addEventListener('click', selectTreeNode);
    tree.addEventListener('keydown', event => {
      const model = items.get(event.target.closest('[role="treeitem"]')); if (!model) return;
      const visible = visibleModels(), index = visible.indexOf(model); let next;
      switch (event.key) {
        case 'ArrowDown': next = visible[Math.min(index + 1, visible.length - 1)]; break;
        case 'ArrowUp': next = visible[Math.max(index - 1, 0)]; break;
        case 'Home': next = visible[0]; break;
        case 'End': next = visible.at(-1); break;
        case 'ArrowRight': if (model.group?.hidden) expand(model, true); else next = model.children[0]; break;
        case 'ArrowLeft': if (model.group && !model.group.hidden) expand(model, false); else next = model.parent; break;
        case 'Enter': case ' ': next = model; break;
        default: return;
      }
      event.preventDefault(); if (next) { activate(next); next.item.scrollIntoView({block: 'nearest'}); }
    });
    // No product state is written: only this card and a shallow copy of its inputs change.
    let selection = 'add', incompatible = false;
    const otherProduct = processorCatalog.find(item => item.id !== data.id);
    const otherSocket = processorCatalog.find(item => item.socket && item.socket !== data.socket)?.socket;
    const longName = processorCatalog.reduce((longest, item) => item.name.length > longest.name.length ? item : longest).name;
    const componentModel = id => models.find(model => model.method.startsWith(`catalogUI.component('${id}'`));
    const encode = value => value === undefined ? 'undefined' : JSON.stringify(value);
    const reference = ref => `${ref.path}:${ref.line}`;
    const option = (value, label, mechanism, ref, apply) => ({value, label, mechanism, ref, apply});
    const choices = new Map();
    const originals = new Map();
    function replacePart(id, present = true) {
      const model = componentModel(id), old = model.element;
      if (!originals.has(id)) originals.set(id, {parent: old?.parentElement || model.fallback, next: old?.nextSibling || null});
      const {parent, next} = originals.get(id);
      const fresh = present ? catalogUI.component(id, previewData) : null;
      if (old) fresh ? old.replaceWith(fresh) : old.remove();
      else if (fresh) {
        const siblings = model.parent.children;
        const following = siblings.slice(siblings.indexOf(model) + 1).find(entry => entry.element?.parentElement === parent)?.element;
        parent.insertBefore(fresh, following || (next?.parentNode === parent ? next : null));
      }
      // Factories retain their DOM shape. Keep tree identity and map every nested node to it.
      function rebind(entry, element) {
        entry.element = element; entry.fallback = parent; entry.inputData = {...previewData};
        entry.item.querySelector(':scope > .ds-card-code-row > .ds-card-code-absent')?.remove();
        if (!element) entry.item.firstElementChild.append(make('span', 'ds-card-code-absent', 'нет в DOM'));
        entry.children.forEach((child, index) => rebind(child, element?.children[index] || null));
      }
      rebind(model, fresh);
    }
    function syncPreview() {
      catalogUI.syncCards([card], {selected: selection === 'added' ? data : selection === 'replace' ? otherProduct : null,
        otherSocket: incompatible ? otherSocket : null, socket: () => data.socket});
    }
    const inputOption = (id, value, label, inputs, ref = factory(id)) => option(value, label,
      `Входные параметры: ${Object.entries(inputs).map(([key, val]) => `${key} = ${encode(val)}`).join('; ')} → catalogUI.component('${id}', временные данные).`, ref,
      () => { Object.assign(previewData, inputs); replacePart(id); });
    const addChoices = (id, key, label, initial, options, limitation = '') => {
      if (!choices.has(id)) choices.set(id, []);
      choices.get(id).push({key, label, initial, current: initial, options, limitation});
    };
    addChoices('select', 'selection', 'Состояние выбора', 'add', ['add', 'replace', 'added'].map((value, index) => option(value,
      ['Добавить', 'Заменить', 'Добавлен'][index],
      `Функция syncCards([эта карточка], …): selected = ${value === 'add' ? 'null' : `{id: ${encode(value === 'added' ? data.id : otherProduct.id)}}`}. setSelectionButton: selection = ${encode(value)}; is-added / aria-disabled = ${value === 'added'}.`,
      at('function setSelectionButton('), () => {selection = value; syncPreview();})));
    addChoices('productName', 'name', 'Вариант данных: длина названия', 'normal', [
      inputOption('productName', 'normal', 'Обычное', {name: data.name}),
      inputOption('productName', 'long', 'Длинное · из текущего каталога', {name: longName})
    ]);
    addChoices('productName', 'compatibility', 'Состояние несовместимости', 'normal', [false, true].map(value => option(value ? 'incompatible' : 'normal',
      value ? 'Несовместимый сокет' : 'Без признака несовместимости',
      `Функция syncCards: otherSocket = ${encode(value ? otherSocket : null)}; socket(card) = ${encode(data.socket)} → класс is-alternative-socket = ${value}. CSS ::before добавляет ×.`,
      at('function syncCards('), () => {incompatible = value; syncPreview();})), otherSocket ? '' : 'В каталоге нет другого сокета: изолированный пример недоступен.');
    addChoices('badge', 'badge', 'Вариант бейджа', 'original', [
      inputOption('badge', 'original', 'Исходный', {badge: data.badge, badgeKind: data.badgeKind}),
      ...['hit', 'exclusive', 'dns'].map((kind, index) => inputOption('badge', kind, ['Хит продаж', 'Эксклюзивно в DNS', 'Создано DNS'][index], {badgeKind: kind})),
      inputOption('badge', 'absent', 'Отсутствует', {badge: '', badgeKind: undefined})
    ]);
    addChoices('price', 'price', 'Вариант данных: цена', 'known', [
      inputOption('price', 'known', 'Известна', {price: data.price}), inputOption('price', 'unknown', 'Неизвестна · платёж скрыт', {price: null})
    ]);
    addChoices('price', 'monthly', 'Источник ежемесячного платежа', 'original', [
      inputOption('price', 'original', 'Исходный monthly', {monthly: data.monthly}),
      inputOption('price', 'computed', 'Расчёт из цены', {monthly: undefined})
    ]);
    addChoices('stock', 'stock', 'Вариант данных: наличие', 'known', [
      inputOption('stock', 'known', 'Известно', {stores: data.stores}), inputOption('stock', 'unknown', 'Неизвестно · блок скрыт', {stores: null})
    ]);
    addChoices('reliability', 'reliability', 'Вариант данных: надёжность', 'original', [
      inputOption('reliability', 'original', 'Исходная', {reliability: data.reliability}),
      ...['Отличная', 'Хорошая', null, undefined].map((value, index) => inputOption('reliability', `value-${index}`,
        ['Отличная', 'Хорошая · SVG.is-good', 'Неизвестна', 'Не передана · значение по умолчанию'][index], {reliability: value}))
    ]);
    addChoices('rating', 'reviews', 'Вариант данных: число отзывов', 'original', [
      inputOption('rating', 'original', 'Исходное', {reviews: data.reviews}),
      inputOption('rating', 'unknown', 'Неизвестно', {reviews: null}),
      inputOption('rating', 'below-threshold', '999 · без сокращения', {reviews: 999}),
      inputOption('rating', 'threshold', '1000 · сокращение k', {reviews: 1000})
    ]);
    addChoices('questions', 'questions', 'Вариант данных: вопросы', 'original', [data.questions, 0, null].map((value, index) => option(['original', 'zero', 'absent'][index],
      ['Исходное число', 'Ноль · элемент присутствует', 'Неизвестно · элемент отсутствует'][index],
      `Входной параметр questions = ${encode(value)}; productMeta: if (data.questions != null) → component('questions', data).`,
      at('function productMeta(data)'), () => {previewData.questions = value; replacePart('questions', value != null);} )));
    addChoices('imageBadge', 'imageBadge', 'Условный бейдж изображения', 'original', [data.imageBadge, undefined].map((value, index) => option(index ? 'absent' : 'original',
      index ? 'Отсутствует' : 'Исходный', `Входной параметр imageBadge = ${encode(value)}; productCard: if (imageBadge) → component('imageBadge', data).`,
      insideCard('if (imageBadge)'), () => {previewData.imageBadge = value; replacePart('imageBadge', Boolean(value));})));
    addChoices('compareIcon', 'comparison', 'Сравнение', 'false', [false, true].map(value => option(String(value), value ? 'Выбран' : 'Не выбран',
      `setCompared(product, ${value}, comparisonContext) → syncComparison → aria-pressed. Контекст принадлежит этому образцу.`,
      at('function setCompared('), () => card.comparisonContext.setCompared(data,value))));
    function ownerOf(model) {
      for (let entry = model; entry; entry = entry.parent) {
        for (const id of choices.keys()) if (entry === componentModel(id)) return id;
      }
      return null;
    }
    function showVariants(model) {
      const panel = make('section', 'ds-card-code-variants'); panel.setAttribute('aria-label', 'Варианты выбранного элемента');
      panel.append(make('h4', '', 'Состояния и варианты'));
      const id = ownerOf(model), sets = choices.get(id);
      if (!sets) panel.append(make('p', 'ds-note', model === componentModel('compare') ?
        'Чекбокс не создаётся: productCard передаёт showCompare:false. Отдельный образец чекбокса есть в группе элементов карточки. Текущая фабрика карточки этот узел не включает.' : model === componentModel('meta') ?
        'Самостоятельных переключаемых вариантов группы нет. Выберите её дочерние элементы. showCompare:false зафиксирован в productCard; включение чекбокса изменило бы состав текущей карточки.' :
        'У этого узла нет самостоятельных именованных состояний или вариантов в текущем коде. Данные и видимость могут наследоваться от родителя; выбирайте соответствующий компонент.'));
      else {
        if (model !== componentModel(id)) panel.append(make('p', 'ds-note', `Собственных переключаемых вариантов у этого узла нет. Эти варианты задаются родительским компонентом catalog.${id} и обновляют его целиком.`));
        for (const set of sets) {
          const label = make('label', 'ds-card-code-variant-label', set.label);
          const select = make('select'); select.dataset.variant = set.key;
          set.options.forEach(choice => {const item = make('option', '', choice.label); item.value = choice.value; select.append(item);});
          if (id === 'select') {selection=card.querySelector('.catalog-action-button').classList.contains('is-added')?'added':card.querySelector('.catalog-action-button').textContent==='Заменить'?'replace':'add';set.current=selection;}
          if (id === 'compareIcon') set.current = card.querySelector('.catalog-compare-icon').getAttribute('aria-pressed');
          select.value = set.current; select.disabled = Boolean(set.limitation); label.append(select); panel.append(label);
          const details = make('div', 'ds-card-code-variant-detail');
          function explain() {
            const choice = set.options.find(item => item.value === set.current);
            details.replaceChildren(make('p', '', choice.mechanism));
            const link = make('a', '', reference(choice.ref)); link.href = `${choice.ref.path}#L${choice.ref.line}`; link.target = '_blank'; link.rel = 'noopener'; details.append(link);
            if (set.limitation) {
              details.append(make('p', '', set.limitation));
              details.append(make('p', '', set.options.map(item => `${item.label}: ${item.mechanism}`).join('\n')));
            }
          }
          explain(); panel.append(details);
          select.addEventListener('change', () => {
            set.current = select.value; set.options.find(item => item.value === set.current).apply();
            observer.takeRecords();
            showDescription(selected); drawHighlight();
            description.querySelector(`[data-variant="${set.key}"]`).focus({preventScroll: true});
            announcement.textContent = `${set.label}: ${set.options.find(item => item.value === set.current).label}. Выбранный узел сохранён.`;
          });
        }
      }
      panel.append(make('p', 'ds-note', 'Наведение и фокус — поведение самого элемента, а не вариант данных. Проверяйте мышью и Tab на карточке; псевдосостояния не назначаются.'));
      const reset = make('button', 'ds-card-code-reset', 'Вернуть исходный образец'); reset.type = 'button';
      reset.onclick = () => {
        for (const key of Object.keys(previewData)) delete previewData[key];
        Object.assign(previewData, data, {comparisonContext:card.comparisonContext}); card.comparisonContext.setCompared(data,false); selection = 'add'; incompatible = false;
        for (const id of originals.keys()) replacePart(id, id === 'questions' ? data.questions != null : id === 'imageBadge' ? Boolean(data.imageBadge) : true);
        for (const sets of choices.values()) for (const set of sets) set.current = set.initial;
        syncPreview(); observer.takeRecords(); showDescription(selected); drawHighlight();
        description.querySelector('.ds-card-code-reset').focus({preventScroll: true});
        announcement.textContent = 'Исходный образец восстановлен. Выбранный узел сохранён.';
      };
      panel.append(reset); description.append(panel);
    }
    expand(rootModel, true); activate(rootModel, false);
    const resize = new ResizeObserver(drawHighlight); resize.observe(card); resize.observe(explorer);
    window.addEventListener('resize', drawHighlight); window.addEventListener('scroll', drawHighlight, {passive: true, capture: true});
    const observer = new MutationObserver(() => {
      // Image loading and external comparison sync must not destroy a focused control.
      if (!description.contains(document.activeElement)) showDescription(selected);
      drawHighlight();
    });
    observer.observe(card, {subtree: true, attributes: true, childList: true, characterData: true});
    explorer.dataset.ready = 'true';
  } catch (error) {
    specimen.append(make('p', 'ds-note', `Дерево реализации недоступно: ${error.message}. Образец карточки сохранён.`));
    console.error(error);
  }
})();
