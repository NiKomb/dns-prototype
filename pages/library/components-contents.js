import { mountContents } from '../../shared/contents/contents.js';

const sections = [...document.querySelectorAll('main.ds-shell > .ds-section[id]')]
  .map(section => ({ target: section, title: section.querySelector(':scope > h2')?.textContent.trim() }))
  .filter(section => section.title);

mountContents({ sections });
