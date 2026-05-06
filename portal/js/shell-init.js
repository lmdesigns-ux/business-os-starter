/**
 * Apply tenant branding to document title, top bar, and accent color.
 * Expects window.TenantConfig loaded before theme.js.
 */
(function () {
  function apply() {
    var T = window.TenantConfig;
    if (!T || !T.site) return;
    var name = T.site.name || 'Portal';
    var raw  = document.title || '';
    var pagePart = raw;
    var idx = raw.indexOf(' — ');
    if (idx !== -1) pagePart = raw.slice(0, idx).trim();
    if (pagePart) document.title = pagePart + ' — ' + name;

    var bar = document.querySelector('.top-bar-title');
    if (bar) bar.textContent = name;

    if (T.branding && T.branding.accent) {
      document.documentElement.style.setProperty('--accent', T.branding.accent);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
