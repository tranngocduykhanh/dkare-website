(() => {
  'use strict';
  // One authoritative card per product in the material group. Secondary
  // groups reuse it and keep the same product URL, price and description.
  const primerPanel = document.getElementById('tab-son-lot');
  if (primerPanel) {
    const primers = ['lpp', 'lpom'].map(code =>
      document.querySelector(`#tab-nhua a[href="san-pham/son-nhua/${code}.html"]`));
    if (primers.every(Boolean)) {
      primerPanel.replaceChildren(...primers.map(source => {
        const card = source.cloneNode(true);
        card.classList.remove('fade-in');
        const membership = document.createElement('p');
        membership.className = 'catalog-membership';
        membership.textContent = 'Nhóm: Sơn nhựa · Sơn lót';
        card.append(membership);
        return card;
      }));
    }
  }
  const tabs = [...document.querySelectorAll('.tab-btn')];
  const panels = tabs.map(tab => document.getElementById(`tab-${tab.dataset.tab}`));
  if (!tabs.length || !panels.every(Boolean)) return;
  const search = document.createElement('label');
  search.className = 'catalog-search';
  search.textContent = 'Tìm trong nhóm sản phẩm';
  const input = document.createElement('input');
  input.type = 'search'; input.placeholder = 'Nhập tên, màu hoặc mã sản phẩm';
  search.append(input);
  const status = document.createElement('p');
  status.className = 'catalog-status'; status.setAttribute('role', 'status');
  panels[0].before(search, status);
  let selected = 0;
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
  function filter() {
    const query = normalize(input.value.trim());
    const cards = [...panels[selected].querySelectorAll('.product-card')];
    let count = 0;
    cards.forEach(card => {card.hidden = !normalize(card.textContent).includes(query); if (!card.hidden) count++;});
    status.textContent = count ? `${count} sản phẩm${query ? ' phù hợp' : ''}` : panels[selected].querySelector('.catalog-pending') ? 'Danh mục đang cập nhật thông tin sản phẩm.' : 'Không tìm thấy sản phẩm. Thử tên hoặc màu khác.';
  }
  function select(index, updateURL = false) {
    selected = index;
    tabs.forEach((tab, i) => {
      tab.id = `catalog-tab-${tab.dataset.tab}`;
      tab.setAttribute('aria-controls', panels[i].id);
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      tab.classList.toggle('active', i === index);
      panels[i].hidden = i !== index;
      panels[i].classList.remove('hidden');
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].setAttribute('aria-labelledby', tab.id);
      panels[i].tabIndex = 0;
    });
    if (updateURL) history.pushState(null, '', `#${panels[index].id}`);
    input.value = '';
    filter();
  }
  function fromHash() {
    const key = location.hash.slice(1).replace(/^tab-/, '');
    const index = tabs.findIndex(tab => tab.dataset.tab === key);
    select(index < 0 ? 0 : index);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index, true));
    tab.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : undefined;
      if (next === undefined) return;
      event.preventDefault(); select(next, true); tabs[next].focus();
    });
  });
  input.addEventListener('input', filter);
  window.addEventListener('hashchange', fromHash);
  window.addEventListener('popstate', fromHash);
  fromHash();
})();
