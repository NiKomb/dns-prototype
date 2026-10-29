let serial = 0;

export function mountContents({ sections, host = document.body }) {
  if (!sections.length) return () => {};
  const root = document.createElement('nav');
  root.className = 'page-contents';
  root.setAttribute('aria-label', 'Содержание страницы');
  root.dataset.dsComponent = 'pageContents';
  const trigger = document.createElement('button');
  trigger.className = 'page-contents__trigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-label', 'Открыть содержание страницы');
  trigger.setAttribute('aria-expanded', 'false');
  const panel = document.createElement('div');
  panel.id = `page-contents-${++serial}`;
  panel.className = 'page-contents__panel';
  panel.hidden = true;
  trigger.setAttribute('aria-controls', panel.id);
  const heading = document.createElement('h2');
  heading.className = 'page-contents__title';
  heading.textContent = 'Содержание';
  const list = document.createElement('ul');
  list.className = 'page-contents__list';
  panel.append(heading, list);
  root.append(trigger, panel);
  host.append(root);

  let suppressed = false;
  let frame = 0;
  const cleanups = [];
  function listen(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  }
  function open() {
    if (suppressed) return;
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    links.find(link => link.hasAttribute('aria-current'))?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }
  function close() {
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  }
  function dismiss() {
    suppressed = true;
    close();
  }
  const marks = [];
  const links = sections.map(({ target, title }) => {
    const mark = document.createElement('span');
    mark.className = 'page-contents__mark';
    mark.setAttribute('aria-hidden', 'true');
    trigger.append(mark);
    marks.push(mark);
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'page-contents__link';
    link.href = `#${target.id}`;
    const label = document.createElement('span');
    label.textContent = title;
    link.append(label);
    item.append(link);
    list.append(item);
    listen(link, 'click', event => {
      if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      dismiss();
      if (location.hash !== link.hash) history.pushState(null, '', link.hash);
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - margin, behavior: 'instant' });
      const focusTarget = target.querySelector('h2') || target;
      const previousTabIndex = focusTarget.getAttribute('tabindex');
      focusTarget.tabIndex = -1;
      focusTarget.focus({ preventScroll: true });
      focusTarget.addEventListener('blur', () => {
        if (previousTabIndex === null) focusTarget.removeAttribute('tabindex');
        else focusTarget.setAttribute('tabindex', previousTabIndex);
      }, { once: true });
      updateCurrent();
    });
    return link;
  });
  function updateCurrent() {
    frame = 0;
    let current = 0;
    for (let i = 0; i < sections.length; i++) {
      const target = sections[i].target;
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      if (target.getBoundingClientRect().top <= margin + 1) current = i;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1) current = sections.length - 1;
    links.forEach((link, i) => {
      for (const node of [link, marks[i]]) {
        if (i === current) node.setAttribute('aria-current', 'location');
        else node.removeAttribute('aria-current');
      }
    });
  }
  function queueUpdate() {
    if (!frame) frame = requestAnimationFrame(updateCurrent);
  }
  listen(root, 'pointerenter', event => {
    if (event.pointerType === 'mouse') { suppressed = false; open(); }
  });
  listen(root, 'pointerleave', () => {
    suppressed = false;
    if (!root.contains(document.activeElement)) close();
  });
  listen(trigger, 'click', () => {
    // Pointer focus does not open the panel, so one tap always toggles it.
    if (!panel.hidden) dismiss();
    else { suppressed = false; open(); }
  });
  listen(root, 'focusin', event => {
    if (event.target === trigger && trigger.matches(':focus-visible')) open();
  });
  listen(root, 'focusout', event => {
    if (!root.contains(event.relatedTarget)) close();
  });
  listen(document, 'pointerdown', event => {
    if (!root.contains(event.target)) { suppressed = false; close(); }
  });
  listen(root, 'keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      dismiss();
      trigger.focus({ preventScroll: true });
    }
  });
  listen(window, 'scroll', queueUpdate, { passive: true });
  listen(window, 'resize', queueUpdate);
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(queueUpdate) : null;
  if (observer) sections.forEach(({ target }) => observer.observe(target));
  updateCurrent();
  return () => {
    cleanups.forEach(cleanup => cleanup());
    observer?.disconnect();
    cancelAnimationFrame(frame);
    root.remove();
  };
}
