import {gravityMarkup} from '../journal/icons/gravity.js';
import {changeTargets} from './targets.js';
import {targetOutline, unionMask} from './mask.js';
import {annotationCandidates} from './placement.js';
import {beforeComponents} from './baseline-controls.js';
import {changeDemoIntro} from './intro.js';
import {journalText as bindPrepositions} from '../journal/text.js';
import '../catalog/action-button.js';

const stylesheet = new URL('./styles.css', import.meta.url).href;
// Never expose the popover with the browser's unstyled centered geometry.
const stylesReady = new Promise(resolve => {
  const existing = [...document.querySelectorAll('link[rel="stylesheet"]')].find(link => link.href === stylesheet);
  if (existing?.sheet) {resolve(); return;}
  const link = existing || document.createElement('link');
  link.addEventListener('load', resolve, {once:true});
  if (!existing) {link.rel = 'stylesheet'; link.href = stylesheet; document.head.append(link);}
});
const modes = ['hidden', 'visible', 'highlight'];
const icons = {hidden:'demo-arrow-shape-left-fill', visible:'demo-arrow-shape-right-fill', highlight:'square-dashed'};
const demoBase = new URL('../../',import.meta.url);
const labels = {hidden:'Было', visible:'Стало', highlight:'Элементы'};
const tooltips = {hidden:'Интерфейс до изменений', visible:'Интерфейс с новыми элементами', highlight:'Новые элементы с пояснениями'};
const editable = target => target instanceof Element && target.closest('input,textarea,select,[role="textbox"],[role="combobox"],[contenteditable]:not([contenteditable="false"])');
const node = (tag, className) => {const element = document.createElement(tag); element.className = className; return element;};

// The same control is used in the prototype and its interactive library specimen.
export function mountChangeDemo({scope = document, host = document.body, specimen = false, entries = changeTargets} = {}) {
  const stateRoot = scope === document ? document.documentElement : scope;
  const before = specimen ? null : beforeComponents(scope);
  let mode = 'visible', holding = false, frame = 0;
  const isConfigurator = document.body.classList.contains('configurator-page');
  let returningFromArticle = false;
  if (!specimen) {
    // A return link may open the configurator in the article's tab.
    try {
      const referrer = new URL(document.referrer);
      returningFromArticle = isConfigurator && performance.getEntriesByType('navigation')[0]?.type !== 'reload' && referrer.origin === location.origin && /^\/articles\/[a-z0-9-]+\.html$/.test(referrer.pathname.slice(demoBase.pathname.length-1));
    } catch {}
    try {
      returningFromArticle ||= isConfigurator && sessionStorage.getItem('dns-change-demo-article-return') === '1';
      if (isConfigurator) sessionStorage.removeItem('dns-change-demo-article-return');
      else if (/^\/articles\/[a-z0-9-]+\.html$/.test(location.pathname.slice(demoBase.pathname.length-1))) sessionStorage.setItem('dns-change-demo-article-return', '1');
      const saved = sessionStorage.getItem('dns-change-demo-mode');
      if ((!isConfigurator || returningFromArticle) && modes.includes(saved)) mode = saved;
    } catch {}
  }
  let ready = false, destroyed = false;
  const intro = !specimen && isConfigurator && !returningFromArticle ? changeDemoIntro() : null;
  const control = node('div', 'change-demo-control'); control.hidden = true;
  control.dataset.dsComponent = 'changes.toggle'; control.dataset.telemetryExclude = '';
  if (!specimen) control.setAttribute('popover', 'manual');
  control.setAttribute('role', 'group');
  control.setAttribute('aria-label', 'Режим демонстрации изменений');
  const tabs = modes.map(value => {
    const tab = catalogActionButton({label:''});
    tab.classList.add('change-demo-tab'); tab.dataset.mode = value;
    tab.innerHTML = gravityMarkup[icons[value]];
    const icon = tab.querySelector('svg');
    icon.setAttribute('aria-hidden', 'true'); icon.setAttribute('focusable', 'false');
    const label = node('span', 'change-demo-tab-label'); label.textContent = labels[value]; label.setAttribute('aria-hidden', 'true'); tab.append(label);
    tab.setAttribute('aria-label', labels[value]);
    const tooltip = node('span', 'change-demo-tab-tooltip'); tooltip.setAttribute('aria-hidden', 'true');
    tooltip.textContent = tooltips[value]; tab.append(tooltip);
    const showTooltip = () => {if (!holding) tab.dataset.tooltipOpen = '';};
    const hideTooltip = () => {delete tab.dataset.tooltipOpen;};
    tab.addEventListener('pointerenter', showTooltip);
    tab.addEventListener('pointerleave', hideTooltip);
    tab.addEventListener('focus', () => {if (tab.matches(':focus-visible')) showTooltip();});
    tab.addEventListener('blur', hideTooltip);
    tab.addEventListener('click', event => {event.stopPropagation(); holding = false; mode = value; render();});
    control.append(tab); return tab;
  });
  host.append(control);

  const overlay = node('div', 'change-demo-overlay'); overlay.setAttribute('popover', 'manual');
  overlay.dataset.telemetryExclude = ''; overlay.setAttribute('aria-label', 'Новые элементы прототипа');
  const shade = node('div', 'change-demo-shade'), annotations = node('div', 'change-demo-annotations');
  overlay.append(shade, annotations); document.body.append(overlay);
  const status = specimen ? node('span', 'change-demo-specimen-status') : null;
  if (status) {status.setAttribute('role', 'status'); host.append(status);}
  const effectiveMode = () => holding ? 'highlight' : mode;
  const showControl = () => {if (!specimen && !control.matches(':popover-open')) control.showPopover();};
  function tagTargets() {
    before?.sync();
    for (const entry of entries) for (const target of scope.querySelectorAll(entry.selector)) target.classList.add('change-demo-target');
  }
  function rectFor(target) {
    if (!target.checkVisibility()) return null;
    const rect = target.getBoundingClientRect();
    const outline = targetOutline(target);
    let left = Math.max(0, rect.left), top = Math.max(0, rect.top);
    let right = Math.min(innerWidth, rect.right), bottom = Math.min(innerHeight, rect.bottom);
    // A product further down a scroll container must never cut a hole over its header/footer.
    for (let parent = target.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
      const style = getComputedStyle(parent), box = parent.getBoundingClientRect();
      if (/(auto|scroll|hidden|clip)/.test(style.overflowY)) {top = Math.max(top, box.top); bottom = Math.min(bottom, box.bottom);}
      if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) {left = Math.max(left, box.left); right = Math.min(right, box.right);}
    }
    if (right - left < 4 || bottom - top < 4) return null;
    return {left, top, right, bottom, width:right - left, height:bottom - top, outline, iconOnly:target.matches('.catalog-compare-icon,.comparison-filter-open,.build-board-toggle,.comparison-open')};
  }
  const overlaps = (a, b) => a.left < b.right + 8 && a.right + 8 > b.left && a.top < b.bottom + 8 && a.bottom + 8 > b.top;
  function draw() {
    frame = 0; if (effectiveMode() !== 'highlight') return;
    // Only the foreground workspace is annotated while a catalogue/comparison is open.
    const foreground = specimen ? scope : [...document.querySelectorAll('.processor-modal:not([hidden]),.catalog-comparison:not([hidden]),dialog:modal')].filter(el => el.checkVisibility()).pop();
    const groups = entries.map(entry => {
      const targets = [...scope.querySelectorAll(entry.selector)]
        .filter(target => !foreground || foreground.contains(target) || target.contains(foreground));
      // An open quick-picker strip takes precedence over earlier category arrows.
      if (entry.preferredSelector) targets.sort((a,b) => Number(b.matches(entry.preferredSelector)) - Number(a.matches(entry.preferredSelector)));
      return {entry, rects:targets.map(rectFor).filter(Boolean).slice(0, 1)};
    }).filter(group => group.rects.length);
    const rects = groups.flatMap(group => group.rects);
    shade.style.maskImage = unionMask(rects, innerWidth, innerHeight);
    annotations.replaceChildren();
    const occupied = [...rects, control.getBoundingClientRect()];
    for (const {entry, rects} of groups) {
      // A thin remnant of a scrolled block is still part of the blur mask,
      // but is no longer a useful anchor for its explanation.
      const targets = rects.filter(r => r.height >= Math.min(48, (r.outline.bottom - r.outline.top) / 2) && r.width >= Math.min(48, (r.outline.right - r.outline.left) / 2));
      if (!targets.length) continue;
      const note = node('section', 'study-dialog change-demo-note'); note.dataset.changeDemoNote = entry.id;
      const text = document.createElement('p');
      text.textContent = bindPrepositions(entry.text); note.append(text); annotations.append(note);
      const w = note.offsetWidth, h = note.offsetHeight;
      const compensation = Number(getComputedStyle(note).getPropertyValue('--change-demo-corner-compensation'));
      const candidates = targets.flatMap(r => annotationCandidates(r, w, h, r.iconOnly ? 0 : compensation));
      const position = candidates.map(p => ({...p, right:p.left + w, bottom:p.top + h})).find(p => p.left >= 16 && p.right <= innerWidth - 16 && p.top >= 16 && p.bottom <= innerHeight - 16 && !occupied.some(r => overlaps(p, r)));
      // Hide the caption when there is no space beside its target; never detach it to a screen edge.
      if (!position) {note.remove(); continue;}
      note.style.left = `${position.left}px`; note.style.top = `${position.top}px`; occupied.push(position);
    }
  }
  function schedule() {if (effectiveMode() === 'highlight' && !frame) frame = requestAnimationFrame(draw);}
  function hideTooltips() {for (const tab of tabs) delete tab.dataset.tooltipOpen;}
  function render() {
    if (!ready || destroyed) return;
    const current = effectiveMode(); stateRoot.dataset.changeDemoMode = current; before?.apply(current);
    control.dataset.mode = current;
    for (const tab of tabs) {
      const active = tab.dataset.mode === current;
      tab.setAttribute('aria-pressed', String(active));
    }
    if (status) status.textContent = labels[current];
    if (current === 'highlight') {
      if (!overlay.matches(':popover-open')) {overlay.showPopover(); if (!specimen) {const focused = control.contains(document.activeElement) ? document.activeElement : null; control.hidePopover(); showControl(); focused?.focus({preventScroll:true});}}
      schedule();
    } else if (overlay.matches(':popover-open')) overlay.hidePopover();
    // Restoring focus after reordering top-layer popovers must not reopen a tooltip.
    hideTooltips();
    if (!specimen) try {sessionStorage.setItem('dns-change-demo-mode', mode);} catch {}
  }
  // Service controls must not dismiss an open quick picker as an outside click.
  control.addEventListener('focusin', event => event.stopPropagation());
  control.addEventListener('click', event => event.stopPropagation());
  function keydown(event) {
    if (event.code !== 'Space' || event.altKey || event.ctrlKey || event.metaKey || event.isComposing || editable(event.target)) return;
    if (specimen && !scope.contains(event.target)) return;
    if (intro?.open) intro.querySelector('button').click();
    if (event.repeat) {if (holding) {event.preventDefault(); event.stopImmediatePropagation();} return;}
    event.preventDefault(); event.stopImmediatePropagation(); if (!holding) {holding = true; render();}
  }
  function release() {if (holding) {holding = false; render();}}
  function keyup(event) {
    if (event.code === 'Space' && holding) {event.preventDefault(); event.stopImmediatePropagation(); release();}}
  function escape(event) {if (event.key === 'Escape') hideTooltips(); if (intro?.open) return; if (event.key === 'Escape' && effectiveMode() === 'highlight') {event.preventDefault(); event.stopImmediatePropagation(); if (holding) holding = false; else mode = 'visible'; render();}}
  const observer = new MutationObserver(records => {
    if (records.every(record => control.contains(record.target) || overlay.contains(record.target))) return;
    tagTargets(); schedule();
  });
  // Only structural/state changes; annotation writes never feed back into this observer.
  observer.observe(scope === document ? document.body : scope, {subtree:true, childList:true, attributes:true, attributeFilter:['hidden','open','aria-expanded']});
  document.addEventListener('keydown', keydown, true); document.addEventListener('keyup', keyup, true);
  document.addEventListener('keydown', escape, true); window.addEventListener('blur', release);
  const visibility = () => {if (document.hidden) release();}; document.addEventListener('visibilitychange', visibility);
  window.addEventListener('scroll', schedule, true); window.addEventListener('resize', schedule);
  const resize = new ResizeObserver(schedule); resize.observe(stateRoot === document.documentElement ? document.body : stateRoot);
  stylesReady.then(() => {
    if (destroyed) return;
    ready = true; tagTargets(); render(); control.hidden = false; showControl();
    if (intro) {document.body.append(intro); intro.showModal();}
  });
  return {control, destroy() {
    destroyed = true;
    observer.disconnect(); resize.disconnect(); cancelAnimationFrame(frame);
    document.removeEventListener('keydown', keydown, true); document.removeEventListener('keyup', keyup, true);
    document.removeEventListener('keydown', escape, true);
    window.removeEventListener('blur', release); document.removeEventListener('visibilitychange', visibility);
    window.removeEventListener('scroll', schedule, true); window.removeEventListener('resize', schedule);
    delete stateRoot.dataset.changeDemoMode; scope.querySelectorAll('.change-demo-target').forEach(el => el.classList.remove('change-demo-target'));
    before?.destroy(); intro?.remove(); overlay.remove(); control.remove(); status?.remove();
  }};
}

if (new URL(location.href).searchParams.get('demo') === 'changes') {
  if (document.readyState === 'loading') await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, {once:true}));
  mountChangeDemo();
}
