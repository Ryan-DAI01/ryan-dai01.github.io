(() => {
  'use strict';
  const records = JSON.parse(document.getElementById('publication-data').textContent);
  const byId = new Map(records.map(p => [p.id, p]));
  const rows = [...document.querySelectorAll('.publication-row')];
  const rowById = new Map(rows.map(row => [row.dataset.id, row]));
  const byCitations = (a, b) => b.citations - a.citations || b.year - a.year || a.title.localeCompare(b.title);
  function renderOrder() {
    let sections;
    if (sort.value === 'recent') {
      sections = [...new Set(records.map(p => p.year))].sort((a,b) => b-a)
        .map(y => ({key:'year-'+y, label:String(y), papers:records.filter(p => p.year===y).sort(byCitations)}));
      orderHint.textContent = 'Ordered by publication year, newest first.';
    } else if (sort.value === 'cited') {
      sections = [{key:'cited', label:'Citations', papers:[...records].sort(byCitations)}];
      orderHint.textContent = 'Ordered by citation count, highest first.';
    } else {
      sections = [{key:'selected', label:'', papers:records}];
      orderHint.textContent = '';
    }
    orderHint.hidden = sort.value === 'featured';
    const fragment = document.createDocumentFragment();
    for (const group of sections) {
      const section = document.createElement(group.label ? 'section' : 'div');
      section.className = 'publication-group' + (group.label ? '' : ' publication-group-flat');
      if (group.label) {
        const heading = document.createElement('h3');
        heading.id = 'publication-group-' + group.key;
        heading.textContent = group.label;
        section.setAttribute('aria-labelledby', heading.id);
        section.appendChild(heading);
      }
      const list = document.createElement('div');
      for (const p of group.papers) list.appendChild(rowById.get(p.id));
      section.appendChild(list);
      fragment.appendChild(section);
    }
    document.getElementById('publication-list').replaceChildren(fragment);
  }

  const search = document.getElementById('publication-search');
  const year = document.getElementById('year-filter');
  const sort = document.getElementById('publication-sort');
  const orderHint = document.getElementById('order-hint');
  const count = document.getElementById('result-count');
  document.getElementById('filters').hidden = false;
  document.getElementById('publication-tools').hidden = false;
  document.querySelectorAll('.cite-button').forEach(b => { b.hidden = false; });
  function filter() {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    for (const row of rows) {
      const p = byId.get(row.dataset.id);
      const haystack = [p.title, p.authors, p.displayAuthors || '', p.venue, p.short, p.year, 'Yixiang Dai'].join(' ').toLocaleLowerCase();
      const matches = (year.value === 'all' || String(p.year) === year.value) && haystack.includes(query);
      row.hidden = !matches;
      if (matches) visible++;
    }
    for (const group of document.querySelectorAll('.publication-group')) group.hidden = ![...group.querySelectorAll('.publication-row')].some(r => !r.hidden);
    count.textContent = visible === records.length ? visible + ' publications' : visible + ' of ' + records.length + ' publications';
    document.getElementById('empty-state').hidden = visible > 0;
  }
  search.addEventListener('input', filter);
  year.addEventListener('change', filter);
  sort.addEventListener('change', () => { renderOrder(); filter(); });
  document.getElementById('filters').addEventListener('submit', e => e.preventDefault());
  document.getElementById('reset-filters').addEventListener('click', () => {
    search.value = ''; year.value = 'all'; sort.value = 'featured'; renderOrder(); filter(); search.focus();
  });
  const figureDialog = document.getElementById('figure-dialog');
  document.querySelectorAll('[data-figure]').forEach(link => link.addEventListener('click', event => {
    // Preserve open-in-new-tab gestures and the plain image link without JavaScript.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const source = link.querySelector('img');
    const expanded = document.getElementById('figure-image');
    expanded.src = source.src;
    expanded.alt = source.alt;
    document.getElementById('figure-title').textContent = link.dataset.figure;
    document.getElementById('figure-caption').textContent = link.dataset.caption;
    figureDialog.showModal();
    document.getElementById('close-figure').focus();
  }));
  document.getElementById('close-figure').addEventListener('click', () => figureDialog.close());
  figureDialog.addEventListener('click', event => {
    if (event.target !== figureDialog) return;
    const rect = figureDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) figureDialog.close();
  });

  const dialog = document.getElementById('citation-dialog');
  const citationText = document.getElementById('citation-text');
  const copyStatus = document.getElementById('copy-status');
  document.getElementById('main').addEventListener('click', e => {
    const button = e.target.closest('.cite-button');
    if (!button) return;
    const p = byId.get(button.dataset.cite);
    citationText.value = p.authors + ' (' + p.year + '). ' + p.title + '. ' + p.venue + '. ' + p.url;
    copyStatus.textContent = '';
    dialog.showModal();
    document.getElementById('close-citation').focus();
  });
  document.getElementById('close-citation').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {
    if (e.target === dialog) { const rect = dialog.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close(); }
  });
  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(value); return true; } catch {}
    }
    const field = document.createElement('textarea');
    field.value = value; field.style.position = 'fixed'; field.style.top = '0'; field.style.left = '-10000px';
    const oldFocus = document.activeElement;
    (dialog.open ? dialog : document.body).appendChild(field);
    field.focus(); field.select();
    let success = false;
    try { success = document.execCommand('copy'); } catch {}
    field.remove(); oldFocus?.focus();
    return success;
  }
  document.getElementById('copy-citation').addEventListener('click', async () => {
    const ok = await copyText(citationText.value);
    copyStatus.textContent = ok ? 'Citation copied.' : 'Select the citation above to copy it.';
    if (!ok) { citationText.focus(); citationText.select(); }
  });
})();
