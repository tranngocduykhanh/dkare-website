(() => {
  'use strict';
  const input = document.querySelector('#library-search');
  if (!input) return;
  const sections = [...document.querySelectorAll('[data-category]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const count = document.querySelector('.library-count');
  const empty = document.querySelector('#library-empty');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  const valid = new Set(filters.map(button => button.dataset.filter));
  let current = valid.has(location.hash.slice(1)) ? location.hash.slice(1) : 'all';
  const apply = () => {
    const query = normalize(input.value.trim());
    let total = 0;
    sections.forEach(section => {
      let visible = 0;
      section.querySelectorAll('.library-item').forEach(item => {
        const show = (current === 'all' || current === section.dataset.category) && normalize(item.dataset.search).includes(query);
        item.hidden = !show;
        if (show) visible += 1;
      });
      section.hidden = visible === 0;
      total += visible;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(current === button.dataset.filter)));
    count.textContent = `${total} mục${query ? ' phù hợp' : ' trong thư viện'}`;
    empty.hidden = total !== 0;
  };
  filters.forEach(button => button.addEventListener('click', () => {
    current = button.dataset.filter;
    history.replaceState(null, '', current === 'all' ? location.pathname : `#${current}`);
    apply();
  }));
  input.addEventListener('input', apply);
  document.querySelector('#library-reset').addEventListener('click', () => {
    input.value = ''; current = 'all';
    history.replaceState(null, '', location.pathname);
    apply(); input.focus();
  });
  window.addEventListener('hashchange', () => {
    current = valid.has(location.hash.slice(1)) ? location.hash.slice(1) : 'all';
    apply();
  });
  apply();
})();
