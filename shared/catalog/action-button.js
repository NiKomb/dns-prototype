// One DOM factory for catalog selection and participant dialog actions.
// Usable as a classic script and as an imported side-effect module on articles.
globalThis.catalogActionButton ||= function ({label = 'Добавить', variant = 'default'} = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'catalog-action-button';
  if (variant === 'brand') button.classList.add('catalog-action-button-brand');
  button.textContent = label;
  return button;
};
