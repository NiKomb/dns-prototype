// Public deployment settings only. Credentials and respondent data never go here.
export const siteBase = new URL('../../', import.meta.url);
let settings;
export const hosting = () => settings ||= fetch(new URL('./hosting.json', import.meta.url), {cache:'no-store'}).then(r => {
  if (!r.ok) throw Error('Не удалось получить настройки подключения');
  return r.json();
});
export async function apiFetch(path, options = {}) {
  const config = await hosting();
  return fetch(new URL(path, config.apiOrigin), {...options, credentials:'omit'});
}
export const siteURL = path => new URL(path.replace(/^\//, ''), siteBase);
