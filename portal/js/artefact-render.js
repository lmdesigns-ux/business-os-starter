/**
 * Parse and render workshop artefact markdown for artefact.html
 */
window.ArtefactRender = (function () {
  function esc(s) {
    if (s == null || s === '') return '';
    var el = document.createElement('span');
    el.textContent = String(s);
    return el.innerHTML;
  }

  function stripMdBold(s) {
    return String(s || '').replace(/\*\*/g, '');
  }

  function parseJsonFence(md) {
    var m = md.match(/```(?:json)?\s*\n([\s\S]*?)```/);
    if (!m) return null;
    try {
      return JSON.parse(m[1].trim());
    } catch (_) {
      return null;
    }
  }

  function bodyAfterFence(md) {
    var idx = md.search(/```(?:json)?\s*\n[\s\S]*?```/);
    if (idx === -1) return md;
    return md.slice(idx).replace(/```(?:json)?\s*\n[\s\S]*?```/, '').trim();
  }

  function splitSections(md) {
    var parts = md.split(/^## /m);
    var sections = [];
    for (var i = 0; i < parts.length; i++) {
      if (!parts[i].trim()) continue;
      var nl = parts[i].indexOf('\n');
      var title = nl === -1 ? parts[i].trim() : parts[i].slice(0, nl).trim();
      var body = nl === -1 ? '' : parts[i].slice(nl + 1).trim();
      sections.push({ title: title, body: body });
    }
    return sections;
  }

  function renderInline(text) {
    return esc(stripMdBold(text))
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function renderParagraphs(text) {
    return text.split(/\n\n+/).map(function (block) {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('- ')) return renderList(block);
      if (/^\|.+\|/.test(block)) return renderTable(block);
      if (block.startsWith('```')) return renderCodeFence(block);
      return '<p>' + renderInline(block).replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }

  function renderList(block) {
    var items = block.split('\n').filter(function (l) { return /^- /.test(l); });
    return '<ul>' + items.map(function (l) {
      return '<li>' + renderInline(l.replace(/^- /, '')) + '</li>';
    }).join('') + '</ul>';
  }

  function renderTable(block) {
    var rows = block.split('\n').filter(function (l) { return l.trim().startsWith('|'); });
    if (rows.length < 2) return '<pre>' + esc(block) + '</pre>';
    var html = '<div class="table-scroll"><table class="data-table"><thead><tr>';
    var headerCells = rows[0].split('|').filter(Boolean).map(function (c) { return c.trim(); });
    headerCells.forEach(function (c) {
      html += '<th>' + renderInline(c) + '</th>';
    });
    html += '</tr></thead><tbody>';
    for (var i = 2; i < rows.length; i++) {
      var cells = rows[i].split('|').filter(Boolean).map(function (c) { return c.trim(); });
      if (!cells.length) continue;
      html += '<tr>';
      cells.forEach(function (c) {
        html += '<td>' + renderInline(c) + '</td>';
      });
      html += '</tr>';
    }
    html += '</tbody></table></div>';
    return html;
  }

  function renderCodeFence(block) {
    var m = block.match(/```(\w*)\n([\s\S]*?)```/);
    if (!m) return '<pre>' + esc(block) + '</pre>';
    var lang = m[1];
    var code = m[2];
    if (lang === 'mermaid') {
      return '<div class="mermaid-wrap"><pre class="mermaid">' + esc(code.trim()) + '</pre></div>';
    }
    return '<pre class="code-block"><code>' + esc(code) + '</code></pre>';
  }

  function renderSectionBody(body) {
    var chunks = [];
    var re = /```[\s\S]*?```/g;
    var last = 0;
    var match;
    while ((match = re.exec(body)) !== null) {
      if (match.index > last) {
        chunks.push({ type: 'text', content: body.slice(last, match.index) });
      }
      chunks.push({ type: 'fence', content: match[0] });
      last = match.index + match[0].length;
    }
    if (last < body.length) chunks.push({ type: 'text', content: body.slice(last) });

    return chunks.map(function (chunk) {
      if (chunk.type === 'fence') return renderCodeFence(chunk.content);
      return renderParagraphs(chunk.content.trim());
    }).join('');
  }

  function statusBadgeClass(status) {
    if (status === 'review') return 'badge-review';
    if (status === 'ready') return 'badge-complete';
    return 'badge-draft';
  }

  function typeLabel(type) {
    return type === 'workshop' ? 'Workshop' : 'Process map';
  }

  function renderMetaBar(meta, compiled) {
    var c = compiled || {};
    var items = [];
    items.push('<span class="badge ' + statusBadgeClass(meta.status) + '">' + esc(meta.status) + '</span>');
    items.push('<span class="meta-item">' + esc(typeLabel(meta.type)) + '</span>');
    if (meta.sku || c.sku) items.push('<span class="meta-item">SKU ' + esc(meta.sku || c.sku) + '</span>');
    if (meta.duration || c.duration) items.push('<span class="meta-item">' + esc(meta.duration || c.duration) + '</span>');
    if (meta.audience || c.audience) items.push('<span class="meta-item">' + esc(meta.audience || c.audience) + '</span>');
    if (meta.scope || c.scope) items.push('<span class="meta-item">' + esc(meta.scope || c.scope) + '</span>');
    items.push('<span class="meta-item">Updated ' + esc(meta.updated || c.updated || '') + '</span>');

    var external = meta.externalUrl || c.externalUrl;
    var extBtn = external
      ? '<a href="' + esc(external) + '" class="external-link" target="_blank" rel="noopener noreferrer">Open external board ↗</a>'
      : '';

    return '<div class="artefact-meta-bar">' + items.join('') + extBtn + '</div>';
  }

  function renderSections(sections) {
    return sections.map(function (sec) {
      var isReview = sec.title.toLowerCase() === 'review notes';
      var cls = 'artefact-section' + (isReview ? ' artefact-section-review' : '');
      return '<section class="' + cls + '">'
        + '<h2>' + esc(sec.title) + '</h2>'
        + '<div class="section-body">' + renderSectionBody(sec.body) + '</div>'
        + '</section>';
    }).join('');
  }

  function initMermaid() {
    if (typeof mermaid === 'undefined') return Promise.resolve();
    mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'loose' });
    var nodes = document.querySelectorAll('.mermaid');
    if (!nodes.length) return Promise.resolve();
    return mermaid.run({ nodes: nodes });
  }

  return {
    esc: esc,
    parseJsonFence: parseJsonFence,
    bodyAfterFence: bodyAfterFence,
    splitSections: splitSections,
    renderMetaBar: renderMetaBar,
    renderSections: renderSections,
    initMermaid: initMermaid
  };
})();
