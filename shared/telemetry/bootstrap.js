import {hosting,apiFetch,siteBase} from './hosting.js';
import {studyUnavailableDialog} from './study-dialog.js';

// Only explicit study routes load this module; ordinary prototype visits stay silent.
const local = location.pathname.slice(siteBase.pathname.length);
const entry = /^new-attempt(?:\/|\/index\.html)?$/.test(local);
const current = new URL(location.href);
let unavailable, loading = false, installed = false;
const style = document.createElement('link');
style.rel = 'stylesheet'; style.href = new URL('./study.css',import.meta.url).href;
document.head.append(style);
async function boot() {
  if (loading || installed) return;
  loading = true;
  try {
    const host = await hosting();
    const sessionKey = host.storageNamespace + '-session';
    if (entry && current.searchParams.get('study') !== '1') {
      localStorage.removeItem(sessionKey);
      current.searchParams.set('study','1');
      history.replaceState(history.state,'',current);
    }
    const requested = performance.now();
    const response = await apiFetch('/api/study-config?entry='+(entry?'new-attempt':'resume'), {cache:'no-store',referrerPolicy:'no-referrer-when-downgrade'});
    if (!response.ok) throw Error('receiver');
    const config = await response.json();
    if (!config.clock || !config.version) throw Error('config');
    window.__studyConfig = {...config,apiOrigin:host.apiOrigin,storageNamespace:host.storageNamespace};
    window.__studyClockStart = (requested+performance.now())/2;
    unavailable?.destroy(); unavailable = null;
    installed = true;
    await import('./client.js');
    window.removeEventListener('online',boot);
  } catch {
    if (!unavailable) {
      unavailable = studyUnavailableDialog();
      document.body.append(unavailable); unavailable.show();
    }
    window.addEventListener('online',boot);
  } finally {loading = false;}
}
if (document.readyState === 'loading') await new Promise(resolve => document.addEventListener('DOMContentLoaded',resolve,{once:true}));
await boot();
