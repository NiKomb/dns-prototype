// Shared production and components specimens; catalog objects remain authoritative.
(() => {
  const node = (tag, className, text) => { const n = document.createElement(tag); n.className = className; if (text !== undefined) n.textContent = text; return n; };
  const motionDuration = 300;
  const smoothstep = progress => progress * progress * (3 - 2 * progress);
  catalogUI.railArrow = direction => {
    const button=node('button',`build-board-arrow is-${direction}`);button.type='button';button.hidden=true;
    button.setAttribute('aria-label',direction==='previous' ? 'Предыдущие товары' : 'Следующие товары');return button;
  };
  catalogUI.scrollRail = (element,target,onFinish) => {
    let frame=0;const from=element.scrollLeft,began=performance.now();
    function tick(now) {
      if(!element.isConnected || !element.clientWidth){onFinish?.();return;}
      const progress=Math.min(1,(now-began)/motionDuration);
      element.scrollLeft=from+(target-from)*smoothstep(progress);
      if(progress<1)frame=requestAnimationFrame(tick);else onFinish?.();
    }
    frame=requestAnimationFrame(tick);return ()=>cancelAnimationFrame(frame);
  };
  catalogUI.railPageTarget = (element,items,direction,left,width=element.clientWidth) => {
    const maximum=Math.max(0,element.scrollWidth-element.clientWidth);
    const wanted=Math.max(0,Math.min(maximum,left+direction*width));
    if(wanted===0 || wanted===maximum)return wanted;
    const origin=element.getBoundingClientRect().left-element.scrollLeft;
    const positions=Array.from(items,item=>{const rect=item.getBoundingClientRect();return direction<0 ? rect.left-origin : rect.right-origin-width;});
    return direction<0 ? positions.find(position=>position>=wanted-1) ?? maximum : positions.filter(position=>position<=wanted+1).pop() ?? 0;
  };
  catalogUI.components.boardSuggestions = {id:'boardSuggestions', title:'Быстрый подбор комплектующих', context:'configurator', create({products = [], category = 'motherboard', onSelect = () => {}, selectedIds = [], selectionTarget = 'build'} = {}) {
    const root = node('section', 'build-board-suggestions');
    root.dataset.telemetryPlacement=(selectionTarget === 'comparison' ? 'comparison.suggestions.' : 'configurator.suggestions.')+category;root.dataset.categoryId=category;root.dataset.telemetryExposure='suggestions';
    root.setAttribute('aria-label', 'Быстрый подбор комплектующих');
    const track = node('div', 'build-board-track');track.dataset.telemetryScroll='configurator.suggestions';
    for (const board of products) {
      const name = ({motherboard:'Материнская плата ', 'power-supply':'Блок питания ', case:'Корпус '}[category] || '') + board.name;
      const card = node('div', 'build-board-card'); card.dataset.productId = board.id;card.dataset.telemetryId='suggestion.card';card.dataset.telemetryName=board.name;
      const add = node('button', 'build-board-add'); add.type = 'button';add.dataset.telemetryId=selectionTarget === 'comparison' ? 'suggestion.compare' : 'suggestion.select';
      const selected = selectedIds.includes(board.id);
      add.disabled = selected;
      add.setAttribute('aria-label', `${selected ? 'Уже в сравнении' : selectionTarget === 'comparison' ? 'Добавить в сравнение' : 'Добавить в сборку'}: ${name}`);
      const image = node('img', 'build-board-image'); image.alt = ''; image.draggable = false;
      prototypeImages.defer(image, board.image);
      const info = node('div', 'build-board-info');
      info.append(node('strong', 'build-board-price', board.price == null ? '—' : `${board.price.toLocaleString('ru-RU')} ₽`), node('span', 'build-board-name', name));
      card.append(image, info);
      add.addEventListener('click', () => onSelect(board));
      card.append(add);
      track.append(card);
    }
    const viewport = node('div', 'build-board-viewport');
    const previous = catalogUI.railArrow('previous'), next = catalogUI.railArrow('next');
    previous.dataset.telemetryId='suggestion.previous';next.dataset.telemetryId='suggestion.next';
    viewport.append(track, previous, next); root.append(viewport);
    let frame = 0, cancelMotion = null, target = 0, drag = null, suppressClick = false, shiftFrame = 0, shifted = []; track.dataset.telemetryDragSuppressed='false';
    const maximum = () => Math.max(0, track.scrollWidth - track.clientWidth);
    const clamp = left => Math.max(0, Math.min(maximum(), left));
    function stop() { cancelMotion?.();cancelMotion=null; frame = 0; track.style.scrollSnapType = shiftFrame ? 'none' : ''; }
    function updateArrows() {
      const focused = root.getRootNode().activeElement;
      next.hidden = maximum() <= 1;
      previous.hidden = next.hidden || track.scrollLeft <= 1;
      if (previous.hidden && focused === previous) (next.hidden ? track.querySelector('.build-board-add') : next)?.focus({preventScroll:true});
      if (next.hidden && focused === next) track.querySelector('.build-board-add')?.focus({preventScroll:true});
    }
    function animate(left) {
      stop(); target = clamp(left);
      track.style.scrollSnapType = 'none';frame=1;
      cancelMotion=catalogUI.scrollRail(track,target,stop);
    }
    function pageTarget(direction,left) {
      stopShift();track.style.setProperty('--board-snap',direction<0 ? 'start' : 'end');
      return catalogUI.railPageTarget(track,track.children,direction,left);
    }
    previous.addEventListener('click', () => {window.dispatchEvent(new CustomEvent('prototype:telemetry',{detail:{type:'scroll.user',element:track}}));animate(pageTarget(-1, frame ? target : track.scrollLeft));});
    next.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('prototype:telemetry',{detail:{type:'scroll.user',element:track}}));
      const left = frame ? target : track.scrollLeft;
      animate(left >= maximum() - 1 ? 0 : pageTarget(1, left));
    });
    track.addEventListener('scroll', updateArrows, {passive:true});
    track.addEventListener('wheel', () => {stop();stopShift();}, {passive:true});
    track.addEventListener('dragstart', event => event.preventDefault());
    track.addEventListener('pointerdown', event => {
      stop(); stopShift(); suppressClick = false; track.dataset.telemetryDragSuppressed='false';
      if (event.pointerType !== 'mouse' || event.button !== 0 || maximum() <= 1) return;
      drag = {id:event.pointerId, x:event.clientX, y:event.clientY, left:track.scrollLeft, moved:false};
    });
    track.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 5 && Math.abs(dx) > Math.abs(event.clientY - drag.y)) {
        drag.moved = true;track.dataset.telemetryDragSuppressed='true'; track.setPointerCapture(event.pointerId); track.classList.add('is-dragging');
      }
      if (drag.moved) { event.preventDefault(); track.scrollLeft = clamp(drag.left - dx); }
    });
    function finish(event) {
      if (!drag || event.pointerId !== drag.id) return;
      suppressClick = drag.moved; drag = null; track.classList.remove('is-dragging');
      if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    }
    for (const event of ['pointerup','pointercancel','lostpointercapture']) track.addEventListener(event, finish);
    track.addEventListener('pointerleave', event => { if (drag && !drag.moved) finish(event); });
    track.addEventListener('click', event => {
      if (suppressClick && event.detail !== 0) { event.preventDefault(); event.stopImmediatePropagation(); suppressClick = false; track.dataset.telemetryDragSuppressed='false'; }
    }, true);
    function stopShift() {
      cancelAnimationFrame(shiftFrame);shiftFrame=0;
      shifted.forEach(({card})=>{card.style.transform='';});shifted=[];
      if(!frame)track.style.scrollSnapType='';
    }
    root.cardPositions = () => new Map(Array.from(track.children,card=>[card.dataset.productId,card.getBoundingClientRect().left]));
    root.animateShift = positions => {
      stopShift();
      track.style.scrollSnapType='none';
      shifted=Array.from(track.children,card=>({card,offset:(positions.get(card.dataset.productId) ?? card.getBoundingClientRect().left)-card.getBoundingClientRect().left})).filter(({offset})=>Math.abs(offset)>1);
      if(!shifted.length){track.style.scrollSnapType='';return;}
      shifted.forEach(({card,offset})=>{card.style.transform=`translateX(${offset}px)`;});
      const began=performance.now();
      function tick(now) {
        if(!root.isConnected || !track.clientWidth){stopShift();return;}
        const progress=Math.min(1,(now-began)/motionDuration);
        shifted.forEach(({card,offset})=>{card.style.transform=`translateX(${offset*(1-smoothstep(progress))}px)`;});
        if(progress<1)shiftFrame=requestAnimationFrame(tick);else stopShift();
      }
      shiftFrame=requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(() => { stop(); updateArrows(); });
    resize.observe(track);
    root.destroy = () => { stop(); stopShift(); resize.disconnect(); };
    return root;
  }};
  catalogUI.components.buildArticles = {id:'buildArticles', title:'Семь статей по текущей сборке', context:'configurator', create({articles = [], productIds = []} = {}) {
    const root = node('section', 'build-articles'); root.dataset.telemetryPlacement='configurator.articles'; root.setAttribute('aria-label', 'Статьи о комплектующих');
    const items = [...new Map(articles.filter(article => article.status === 'ready').map(article => [article.articleId, article])).values()]
      .slice(0,7);
    root.hidden = !items.length;
    root.dataset.telemetryOffer=JSON.stringify({article_ids:items.map(a=>a.articleId),product_ids:[...productIds].sort(),compatible:true});
    const track = node('div', 'build-articles-track'); track.dataset.telemetryScroll='configurator.articles';
    items.forEach(article => {
      const category = ({cpu:'processor',powerSupply:'power-supply'}[article.topicCategoryIds[0]] || article.topicCategoryIds[0]);
      const direction = {processor:'Процессоры',motherboard:'Материнские платы','power-supply':'Блоки питания',case:'Корпуса',gpu:'Видеокарты'}[category];
      const card = catalogUI.component('articleCard', {...article, reason:direction, configuratorCategory:category});
      card.dataset.categoryId = category;
      track.append(card);
    });
    root.append(track);
    // Fit three complete cards at any sidebar width, including scrollbar space.
    const visible = [...track.children].slice(0,3);
    const resize = new ResizeObserver(() => {
      if (!root.isConnected || !visible.length) return;
      const height = visible.reduce((sum, card) => sum + card.getBoundingClientRect().height, 0) + (visible.length - 1) * 20;
      track.style.maxHeight = `${height}px`;
    });
    visible.forEach(card => resize.observe(card));
    root.destroy = () => resize.disconnect();
    return root;
  }};
  catalogUI.quickPickerItems = (category, products, state) => products.filter(item => {
    switch (category) {
      case 'processor': return catalogUI.cpuFitsBoard(item,state.motherboard);
      case 'motherboard': return catalogUI.cpuFitsBoard(state.processor,item) && catalogUI.caseFitsBoard(state.computerCase, item);
      case 'power-supply': return catalogUI.caseFitsPower(state.computerCase, item) && catalogUI.gpuFitsPower(state.gpu, item);
      case 'case': return catalogUI.caseFitsBoard(item, state.motherboard) && catalogUI.caseFitsPower(item, state.powerSupply) && catalogUI.gpuFitsCase(state.gpu, item);
      case 'gpu': return catalogUI.gpuFitsCase(item, state.computerCase) && catalogUI.gpuFitsPower(item, state.powerSupply);
      default: return false;
    }
  }).map(item => ({item, order:item.order ?? products.indexOf(item)})).sort((a,b) => a.order - b.order).map(entry => entry.item);
  catalogUI.compatibleBoards = (products, state) => products.filter(board => catalogUI.cpuFitsBoard(state.processor,board) && catalogUI.caseFitsBoard(state.computerCase, board));
})();
