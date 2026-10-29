// Demonstration annotations only; production components own data and behavior.
export const changeTargets = [
  {id:'comparison-table', selector:'.catalog-comparison-panel > .comparison-host > .catalog-comparison', title:'Таблица сравнения', text:'Сравните характеристики товаров и выберите подходящий для сборки'},
  {id:'comparison-entry', selector:'.comparison-filter-open', title:'Открыть сравнение', text:'Здесь можно открыть товары, которые вы добавили к сравнению'},
  {id:'comparison-card', selector:'.processor-product .catalog-compare-icon:not(.comparison-open)', title:'Добавить к сравнению', text:'Нажмите эту кнопку, чтобы добавить товар к сравнению'},
  {id:'catalog-articles', selector:'.processor-modal .catalog-articles', title:'Статьи о комплектующих', text:'Эти статьи помогут выбрать подходящий товар'},
  {id:'build-articles', selector:'#build-articles-host .build-articles', title:'Статьи по вашей сборке', text:'Здесь статьи о комплектующих из вашей сборки'},
  {id:'quick-picker', selector:'.build-board-anchor .build-board-suggestions, .build-board-toggle', preferredSelector:'.build-board-suggestions', title:'Быстрый подбор', text:'Нажмите стрелку, чтобы выбрать и добавить товар прямо в сборку'},
  {id:'article-return', selector:'.club-build-panel', title:'Ваша сборка под рукой', text:'Вернитесь к сборке из статьи, выбранные товары сохранятся'},
];
