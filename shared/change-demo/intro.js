import {studyDialog} from '../telemetry/study-dialog.js';
import {gravityMarkup} from '../journal/icons/gravity.js';

// The startup dialog and library specimen share the same schematic and controls.
export function changeDemoIntro({specimen = false} = {}) {
  const dialog = studyDialog({
    title:'',
    text:'',
    actionLabel:'Нажать пробел', titleId:specimen ? 'change-demo-intro-example-title' : 'change-demo-intro-title', specimen,
  });
  dialog.querySelector('h2').remove();
  dialog.removeAttribute('aria-labelledby');
  dialog.setAttribute('aria-label', 'Подсказка деморежима');
  const text = dialog.querySelector('p');
  const space = document.createElement('strong'); space.textContent = 'пробел';
  const panel = document.createElement('strong'); panel.textContent = 'панели';
  text.append('Зажмите ', space, ', чтобы выделить добавленные элементы или переключите вид в ', panel, ' сверху');
  dialog.classList.add('change-demo-intro');
  dialog.dataset.dsComponent = 'changes.intro'; dialog.dataset.telemetryExclude = '';
  const illustration = document.createElement('div');
  illustration.className = 'change-demo-intro-illustration'; illustration.setAttribute('aria-hidden', 'true');
  illustration.innerHTML = `<div class="change-demo-intro-sketch"><div class="change-demo-intro-sketch-header"></div><div class="change-demo-intro-sketch-body"><div><span></span><span></span><span></span></div><aside></aside></div></div><div class="change-demo-intro-mini-panel"><span class="change-demo-intro-mini-tab">${gravityMarkup['demo-arrow-shape-left-fill']}</span><span class="change-demo-intro-mini-tab">${gravityMarkup['demo-arrow-shape-right-fill']}</span><span class="change-demo-intro-mini-tab change-demo-intro-mini-tab-active"></span></div><div class="change-demo-intro-element"><span class="change-demo-intro-element-icon"></span><span class="change-demo-intro-element-tiles"><span></span><span></span><span></span></span></div><div class="change-demo-intro-caption"></div>`;
  dialog.prepend(illustration);
  return dialog;
}
