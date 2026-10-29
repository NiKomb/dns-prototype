import {changeDemoIntro} from '../../shared/change-demo/intro.js';
import {mountChangeDemo} from '../../shared/change-demo/index.js';
const host = document.createElement('div'); host.className = 'change-demo-specimen'; host.tabIndex = 0;
const example = catalogUI.component('comparisonOpen', {count:2}); host.append(example);
libraryUI.sample('#ds-study-pending', 'changes.toggle', 'Демонстрация изменений', host, {state:'Три режима · удержание пробела'});
mountChangeDemo({scope:host, host, specimen:true, entries:[{id:'comparison-example', selector:'.comparison-open', title:'Сравнение товаров', text:'Нажмите таб или зажмите пробел, чтобы увидеть новые элементы'}]});

libraryUI.sample('#ds-study-pending', 'changes.intro', 'Подсказка деморежима', changeDemoIntro({specimen:true}), {state:'Подсветка по пробелу'});
