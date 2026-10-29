// Named filter metadata derived only from the current catalog's supplied characteristics.
const processorFilters = (() => {
  const definitions = [
    ['family', 'Семейство процессоров'],
    ['performanceCores', 'Количество производительных ядер'],
    ['cores', 'Общее количество ядер'],
    ['graphics', 'Интегрированное графическое ядро'],
    ['generation', 'Поколение процессоров'],
    ['memory', 'Тип памяти'],
    ['model', 'Модель'],
    ['baseClock', 'Базовая частота процессора (ГГц)'],
    ['tdp', 'Тепловыделение (TDP) (Вт)']
  ];
  const properties = item => item;
  const has = (item,key,value) => productContract.has(item,key,value);
  const options = (items, key) => [...new Set(items.flatMap(item => item[key] == null ? [] : Array.isArray(item[key]) ? item[key] : [String(item[key])]))].sort((a,b) => a.localeCompare(b, 'ru', {numeric: true}));
  const label = (key, value) => key === 'graphics' ? (value === 'true' ? 'Есть' : 'Нет') : value;
  function section(items, key, title) {
    const node = catalogUI.facetSection(title, key, options(items, key));
    node.querySelectorAll('label').forEach(option => {option.querySelector('span').textContent = label(key, option.dataset.value);});
    return node;
  }
  return {definitions, properties, has, options, label, section};
})();
