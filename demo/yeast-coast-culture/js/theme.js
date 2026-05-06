/**
 * Theme engine — Yeast Coast Culture (YCC) demo portal.
 * Manages light/dark mode. Palette is fixed to 'ycc'.
 */
(function () {
  var TID =
    (typeof window !== 'undefined' &&
      window.TenantConfig &&
      window.TenantConfig.tenantId &&
      String(window.TenantConfig.tenantId).replace(/\W/g, '')) ||
    'ycc';
  var MODE_KEY    = TID + '-mode-v2';
  var DEFAULT_PALETTE = 'ycc';

  function getStored(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function setStored(key, val) {
    try {
      if (val != null) localStorage.setItem(key, val);
      else localStorage.removeItem(key);
    } catch (e) {}
  }
  function systemMode() {
    if (typeof window.matchMedia !== 'function') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function apply(mode) {
    var root = document.documentElement;
    root.setAttribute('data-mode', mode);
    root.setAttribute('data-theme', mode);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#16110A' : '#FAF8F3');
  }
  function currentMode() {
    var m = document.documentElement.getAttribute('data-mode');
    if (m === 'dark' || m === 'light') return m;
    return getStored(MODE_KEY) || systemMode();
  }
  function init() {
    var mode = getStored(MODE_KEY);
    if (mode !== 'dark' && mode !== 'light') mode = 'light';
    apply(mode);
    setStored(MODE_KEY, mode);
    window.addEventListener('storage', function (e) {
      if (e.key === MODE_KEY) apply(getStored(MODE_KEY) || currentMode());
    });
  }
  function toggleMode() {
    var next = currentMode() === 'dark' ? 'light' : 'dark';
    setStored(MODE_KEY, next);
    apply(next);
    return next;
  }
  function setMode(mode) {
    if (mode !== 'dark' && mode !== 'light') return;
    setStored(MODE_KEY, mode);
    apply(mode);
  }

  window.PortalTheme = { init: init, toggleMode: toggleMode, toggle: toggleMode, setMode: setMode, current: currentMode, currentMode: currentMode };
  init();
})();
