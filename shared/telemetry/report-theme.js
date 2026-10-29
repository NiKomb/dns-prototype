// Service-page preference only. No study client, system-theme detection or writes to D1.
(() => {
  const key = 'dns-report-theme';
  const read = () => { try { return localStorage.getItem(key) === 'dark' ? 'dark' : 'light'; } catch { return 'light'; } };
  function apply(scope, value, persist = false) {
    const theme = value === 'dark' ? 'dark' : 'light';
    scope.dataset.reportTheme = theme;
    scope.style.colorScheme = theme;
    if (persist) { try { localStorage.setItem(key, theme); } catch {} }
    window.dispatchEvent(new CustomEvent('report-theme-change', {detail: {scope, theme}}));
    return theme;
  }
  window.dnsReportTheme = {read, apply};
  if (document.documentElement.hasAttribute('data-report-root')) {
    apply(document.documentElement, read());
    window.addEventListener('storage', event => {
      if (event.key === key || event.key === null) apply(document.documentElement, read());
    });
  }
})();
