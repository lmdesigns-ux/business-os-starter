/**
 * Renders sidebar navigation from PortalData.navSections.
 * Handles: active highlighting, breadcrumb, search palette (⌘K), mobile drawer.
 */
(function () {
  var D = window.PortalData;
  if (!D || !D.navSections || !D.navSections.length) return;

  function esc(s) {
    if (s == null || s === '') return '';
    var el = document.createElement('span');
    el.textContent = String(s);
    return el.innerHTML;
  }

  function pathSuffix() {
    var p = (window.location.pathname || '').replace(/\\/g, '/');
    try { p = decodeURIComponent(p); } catch (e) {}
    var idx = p.lastIndexOf('/');
    var file = idx !== -1 ? p.slice(idx + 1) : p;
    return file || 'index.html';
  }

  var current = pathSuffix();

  function isActive(href) {
    if (!href) return false;
    var h = href.split('#')[0].split('?')[0];
    return h === current || ('index.html' === current && (h === '' || h === './'));
  }

  var navEl = document.getElementById('site-nav');
  if (!navEl) return;

  var TID = (window.TenantConfig && String(window.TenantConfig.tenantId).replace(/\W/g, '')) || 'ycc';
  var NAV_COLLAPSED_KEY = TID + '-nav-collapsed';

  function readCollapsed() {
    try { var r = localStorage.getItem(NAV_COLLAPSED_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; }
  }
  function writeCollapsed(ids) {
    try { localStorage.setItem(NAV_COLLAPSED_KEY, JSON.stringify(ids)); } catch (e) {}
  }

  /* ── Active item detection ── */
  var activeItem = null;
  var activeSection = null;
  D.navSections.forEach(function (sec) {
    (sec.items || []).forEach(function (item) {
      if (isActive(item.href)) { activeItem = item; activeSection = sec; }
    });
  });

  /* ── Render nav ── */
  var branding = window.TenantConfig && window.TenantConfig.branding;
  var wordmark = branding && branding.brandWordmark ? String(branding.brandWordmark).trim() : (D.site && D.site.name) || 'YCC';
  var html = '';

  html += '<a href="index.html" class="nav-brand" aria-label="' + esc(D.site.name) + '">';
  html += '<span class="nav-brand-wordmark">' + esc(wordmark) + '</span>';
  html += '</a>';

  html += '<button type="button" class="nav-search-btn" id="nav-search-btn" aria-label="Search (⌘K)">';
  html += '<span class="nav-search-icon" aria-hidden="true">&#x2315;</span>';
  html += '<span class="nav-search-btn-text">Search</span>';
  html += '<kbd class="nav-search-kbd">⌘K</kbd>';
  html += '</button>';

  var collapsedIds  = readCollapsed();
  var activeSid     = activeSection ? activeSection.id : '';

  html += '<div class="nav-sections">';
  D.navSections.forEach(function (sec) {
    var sid         = sec.id || '';
    var isActiveSec = activeSection && activeSection.id === sid;
    var isCollapsed = !isActiveSec && collapsedIds.indexOf(sid) !== -1;
    var cls         = 'nav-section' + (isActiveSec ? ' nav-section--active' : '') + (isCollapsed ? ' nav-section--collapsed' : '');
    var listId      = 'nav-list-' + sid.replace(/[^a-z0-9_-]/gi, 'x');
    html += '<section class="' + cls + '" data-nav-section="' + esc(sid) + '">';
    html += '<button type="button" class="nav-section-toggle micro-label" aria-expanded="' + (isCollapsed ? 'false' : 'true') + '" aria-controls="' + esc(listId) + '">' + esc(sec.label) + '</button>';
    html += '<ul class="nav-section-list" id="' + esc(listId) + '">';
    (sec.items || []).forEach(function (item) {
      var active  = isActive(item.href);
      var cls2    = active ? ' class="nav-active"' : '';
      var aria    = active ? ' aria-current="page"' : '';
      html += '<li><a href="' + esc(item.href) + '"' + cls2 + aria + '>' + esc(item.label) + '</a></li>';
    });
    html += '</ul></section>';
  });
  html += '</div>';
  navEl.innerHTML = html;

  /* ── Collapsible sections ── */
  navEl.querySelectorAll('.nav-section-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var secEl = btn.closest('.nav-section');
      if (!secEl) return;
      var sid = secEl.getAttribute('data-nav-section') || '';
      if (sid === activeSid) return;
      var collapsed = secEl.classList.toggle('nav-section--collapsed');
      btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      var ids = readCollapsed();
      var i   = ids.indexOf(sid);
      if (collapsed && i === -1) ids.push(sid);
      if (!collapsed && i !== -1) ids.splice(i, 1);
      writeCollapsed(ids);
    });
  });

  /* ── Breadcrumb ── */
  if (activeItem && current !== 'index.html') {
    var appMain = document.querySelector('.app-main');
    if (appMain) {
      var bc = document.createElement('nav');
      bc.className = 'portal-breadcrumb';
      bc.setAttribute('aria-label', 'Page location');
      bc.innerHTML =
        '<a href="index.html" class="portal-breadcrumb-home">Dashboard</a>'
        + '<span class="portal-breadcrumb-sep" aria-hidden="true">›</span>'
        + '<span class="portal-breadcrumb-page">' + esc(activeItem.label) + '</span>';
      appMain.insertBefore(bc, appMain.firstElementChild);
    }
  }

  /* ── Mobile top bar page title ── */
  var topBarTitle = document.querySelector('.top-bar-title');
  if (topBarTitle && activeItem) topBarTitle.textContent = activeItem.label;

  /* ── Search ── */
  var searchIndex = [];
  D.navSections.forEach(function (sec) {
    (sec.items || []).forEach(function (item) {
      searchIndex.push({
        label: item.label,
        section: sec.label,
        href: item.href,
        searchText: (item.label + ' ' + sec.label).toLowerCase()
      });
    });
  });
  (D.recentActivity || []).forEach(function (a) {
    searchIndex.push({
      label: a.label,
      section: a.section || 'Recent',
      href: a.href,
      searchText: ((a.label || '') + ' ' + (a.section || '')).toLowerCase()
    });
  });

  var searchOverlay = document.createElement('div');
  searchOverlay.id = 'search-overlay';
  searchOverlay.setAttribute('role', 'dialog');
  searchOverlay.setAttribute('aria-modal', 'true');
  searchOverlay.setAttribute('aria-label', 'Search portal');
  searchOverlay.hidden = true;
  searchOverlay.innerHTML = [
    '<div class="search-backdrop"></div>',
    '<div class="search-palette" role="search">',
    '  <div class="search-input-row">',
    '    <span class="search-input-icon" aria-hidden="true">&#x2315;</span>',
    '    <input type="text" class="search-input" placeholder="Search…" autocomplete="off" spellcheck="false" />',
    '    <kbd class="search-esc-hint">esc</kbd>',
    '  </div>',
    '  <ul class="search-results" role="listbox" aria-label="Search results"></ul>',
    '</div>'
  ].join('');
  document.body.appendChild(searchOverlay);

  var searchInput   = searchOverlay.querySelector('.search-input');
  var searchResults = searchOverlay.querySelector('.search-results');
  var currentResults = [];
  var selectedIdx    = -1;

  function score(item, q) {
    var label = (item.label || '').toLowerCase();
    var blob  = item.searchText || label;
    var qq    = q.toLowerCase().trim();
    if (!qq) return 1;
    if (label === qq)        return 6;
    if (label.startsWith(qq)) return 5;
    if (label.includes(qq))   return 4;
    if (blob.indexOf(qq) !== -1) return 3;
    return 0;
  }

  function renderResults(q) {
    currentResults = searchIndex
      .map(function (item) { return { item: item, s: score(item, q) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 8)
      .map(function (x) { return x.item; });

    searchResults.innerHTML = '';
    selectedIdx = currentResults.length ? 0 : -1;

    if (!currentResults.length) {
      searchResults.innerHTML = '<li class="search-no-results">' + (q.trim() ? 'No results for “' + esc(q) + '”' : 'Type to search…') + '</li>';
      return;
    }
    currentResults.forEach(function (item, i) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      li.className = 'search-result' + (i === 0 ? ' search-result--selected' : '');
      li.innerHTML = '<span class="search-result-label">' + esc(item.label) + '</span>'
        + '<span class="search-result-meta"><span class="search-result-section">' + esc(item.section) + '</span></span>';
      li.addEventListener('mouseenter', function () { setSel(i); });
      li.addEventListener('click', function () { navigate(item); });
      searchResults.appendChild(li);
    });
  }

  function setSel(idx) {
    searchResults.querySelectorAll('.search-result').forEach(function (el, i) {
      el.classList.toggle('search-result--selected', i === idx);
      el.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
    selectedIdx = idx;
  }

  function navigate(item) {
    window.location.href = item.href;
    closeSearch();
  }

  function openSearch() {
    searchOverlay.hidden = false;
    searchInput.value = '';
    renderResults('');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeSearch() {
    searchOverlay.hidden = true;
    document.body.style.overflow = '';
    selectedIdx = -1;
  }

  searchInput.addEventListener('input', function () { renderResults(searchInput.value); });
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown')  { e.preventDefault(); setSel(Math.min(selectedIdx + 1, currentResults.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(Math.max(selectedIdx - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (selectedIdx >= 0 && currentResults[selectedIdx]) navigate(currentResults[selectedIdx]); }
    else if (e.key === 'Escape') { e.preventDefault(); closeSearch(); }
  });
  searchOverlay.querySelector('.search-backdrop').addEventListener('click', closeSearch);
  var searchBtn = document.getElementById('nav-search-btn');
  if (searchBtn) searchBtn.addEventListener('click', openSearch);

  /* ── Drawer toggle ── */
  var shell      = document.querySelector('.app-shell');
  var toggle     = document.getElementById('nav-toggle');
  var navOverlay = document.getElementById('nav-overlay');

  function setDrawerOpen(open) {
    if (!shell) return;
    shell.classList.toggle('nav-drawer-open', open);
    if (toggle) { toggle.setAttribute('aria-expanded', open ? 'true' : 'false'); toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
    if (navOverlay) { if (open) navOverlay.removeAttribute('hidden'); else navOverlay.setAttribute('hidden', ''); }
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle) toggle.addEventListener('click', function () { setDrawerOpen(!shell.classList.contains('nav-drawer-open')); });
  if (navOverlay) navOverlay.addEventListener('click', function () { setDrawerOpen(false); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!searchOverlay.hidden) { closeSearch(); return; } setDrawerOpen(false); return; }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); if (searchOverlay.hidden) openSearch(); else closeSearch(); }
  });
  navEl.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a || !navEl.contains(a)) return;
    if (window.matchMedia('(max-width: 900px)').matches) setDrawerOpen(false);
  });

  /* ── Theme toggle in footer ── */
  (function () {
    var main = document.querySelector('main.page');
    if (!main) return;
    var PT = window.PortalTheme;
    if (!PT) return;
    var footer = main.querySelector('.site-footer');
    if (!footer) { footer = document.createElement('footer'); footer.className = 'site-footer'; main.appendChild(footer); }
    if (footer.querySelector('.portal-theme-toggle')) return;
    var wrap = document.createElement('p');
    wrap.className = 'site-footer-theme-wrap';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'portal-theme-toggle';
    var MOON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    var SUN  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
    function sync() {
      var dark = PT.currentMode() === 'dark';
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML = dark ? SUN : MOON;
    }
    btn.addEventListener('click', function () { PT.toggleMode(); sync(); });
    wrap.appendChild(btn);
    footer.appendChild(wrap);
    sync();
  })();
})();
