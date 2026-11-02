(() => {
  'use strict';
  const records = JSON.parse(document.getElementById('publication-data').textContent);
  const byId = new Map(records.map(p => [p.id, p]));
  const rows = [...document.querySelectorAll('.publication-row')];
  const groups = [...document.querySelectorAll('.publication-year')];
  const tabs = [...document.querySelectorAll('[data-filter]')];
  const search = document.getElementById('publication-search');
  const year = document.getElementById('year-filter');
  const count = document.getElementById('result-count');
  let authorship = 'all';
  document.getElementById('filters').hidden = false;
  document.getElementById('copy-email').hidden = false;
  document.querySelectorAll('.cite-button').forEach(b => { b.hidden = false; });
  function filter() {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    for (const row of rows) {
      const p = byId.get(row.dataset.id);
      const haystack = [p.title, p.authors, p.displayAuthors || '', p.venue, p.short, p.year, 'Yixiang Dai'].join(' ').toLocaleLowerCase();
      const matches = (authorship === 'all' || p.first) && (year.value === 'all' || String(p.year) === year.value) && haystack.includes(query);
      row.hidden = !matches;
      if (matches) visible++;
    }
    for (const group of groups) group.hidden = ![...group.querySelectorAll('.publication-row')].some(r => !r.hidden);
    count.textContent = visible === records.length ? visible + ' publications' : visible + ' of ' + records.length + ' publications';
    document.getElementById('empty-state').hidden = visible > 0;
  }
  tabs.forEach(tab => tab.addEventListener('click', () => {
    authorship = tab.dataset.filter;
    tabs.forEach(t => { const on = t === tab; t.classList.toggle('active', on); t.setAttribute('aria-pressed', String(on)); });
    filter();
  }));
  search.addEventListener('input', filter);
  year.addEventListener('change', filter);
  document.getElementById('filters').addEventListener('submit', e => e.preventDefault());
  document.getElementById('reset-filters').addEventListener('click', () => {
    search.value = ''; year.value = 'all'; tabs[0].click(); search.focus();
  });
  const dialog = document.getElementById('citation-dialog');
  const citationText = document.getElementById('citation-text');
  const copyStatus = document.getElementById('copy-status');
  document.getElementById('publication-list').addEventListener('click', e => {
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
  document.getElementById('copy-email').addEventListener('click', async () => {
    const ok = await copyText('daiyx23@mails.tsinghua.edu.cn');
    document.getElementById('email-status').textContent = ok ? 'Email address copied.' : 'Email: daiyx23@mails.tsinghua.edu.cn';
  });
})();