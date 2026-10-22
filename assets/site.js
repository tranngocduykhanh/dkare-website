(() => {
  'use strict';
  const script = document.currentScript;
  const base = new URL('../', script.src);
  const href = file => new URL(file, base).href;
  const navigation = [
    { file: 'index.html', label: 'Trang chủ', match: ['index.html'] },
    { file: 'gioi-thieu.html', label: 'Giới thiệu', match: ['gioi-thieu.html'] },
    { file: 'san-pham.html', label: 'Sản phẩm', match: ['/san-pham', 'san-pham.html'] },
    { file: 'giai-phap.html', label: 'Giải pháp', match: ['giai-phap.html', 'gia-cong-son.html', 'phan-phoi-vat-tu.html', 'dao-tao.html', 'doi-mau.html', 'danh-cho-gara.html', 'danh-cho-detailing.html'] },
    { file: 'du-an.html', label: 'Dự án', match: ['du-an.html'] },
    { file: 'blog.html', label: 'Kiến thức', match: ['blog.html', '/bai-viet/'] }
  ];
  const activeFor = item => {
    const path = location.pathname.toLowerCase();
    return item.match.some(part => path.includes(part));
  };
  const groups = {
    'san-pham.html': [
      ['Sơn nội thất', [['Sơn nhựa nội thất ô tô','san-pham.html#tab-nhua'],['Sơn da nội thất ô tô','san-pham.html#tab-da'],['Sơn nỉ nội thất ô tô','san-pham.html#tab-ni']]],
      ['Sơn hiệu ứng & vật tư', [['Sơn bạc hiệu ứng Chrome','san-pham.html#son-chrome'],['Keo dán bọc nội thất','san-pham.html#keo-dan'],['Bả Matit tạo vân da','san-pham.html#matit'],['Sơn lót','san-pham.html#son-lot'],['Sơn phủ','san-pham.html#son-phu'],['Chất tạo cảm giác da','san-pham.html#cam-giac-da']]]
    ],
    'giai-phap.html': [['Giải pháp REVOX', [['Phục hồi da nội thất ô tô','giai-phap.html#phuc-hoi-da'],['Dịch vụ sơn nội thất cho Garage & Đối tác','gia-cong-son.html'],['Phân phối vật tư','phan-phoi-vat-tu.html'],['Đào tạo 3 tháng','dao-tao.html'],['Đổi màu nội thất','doi-mau.html']]]]
  };
  const navMarkup = className => navigation.map(item => {
    const link = `<a class="${className}" href="${href(item.file)}"${activeFor(item) ? ' aria-current="page"' : ''}>${item.label}</a>`;
    if (!groups[item.file]) return link;
    const id = `${className}-${item.file.replace('.html','')}`;
    return `<div class="dk-nav-group">${link}<button class="dk-sub-toggle" type="button" aria-label="Mở danh mục ${item.label}" aria-expanded="false" aria-controls="${id}"></button><div class="dk-submenu" id="${id}" hidden>${groups[item.file].map(([title,links])=>`<div><p>${title}</p>${links.map(([label,url])=>`<a href="${href(url)}">${label}</a>`).join('')}</div>`).join('')}</div></div>`;
  }).join('');

  function buildHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    header.className = 'dk-global-header';
    header.setAttribute('role', 'banner');
    header.innerHTML = `
      <div class="dk-global-inner">
        <a href="${href('index.html')}" class="dk-brand" aria-label="REVOX — Trang chủ">
          <img src="${href('images/logo/revox/wordmark.png')}" alt="REVOX" width="2172" height="724">
        </a>
        <nav class="dk-desktop-nav" aria-label="Điều hướng chính">${navMarkup('dk-nav-link')}</nav>
        <div class="dk-header-actions">
          <a class="dk-header-contact" href="${href('lien-he.html')}">Nhận tư vấn</a>
          <button class="dk-menu-toggle" id="mobile-menu-btn" type="button" aria-label="Mở menu" aria-controls="mobile-menu" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
      </div>
      <nav id="mobile-menu" class="dk-mobile-nav" aria-label="Điều hướng trên điện thoại">
        ${navMarkup('dk-mobile-link')}
        <a class="dk-mobile-contact" href="${href('lien-he.html')}">Nhận tư vấn</a>
        <a class="dk-mobile-phone" href="tel:0795397519">Gọi 079 539 7519</a>
      </nav>`;
  }

  function setupMenu() {
    const menu = document.getElementById('mobile-menu');
    const toggle = document.getElementById('mobile-menu-btn');
    if (!menu || !toggle) return;
    const setOpen = open => {
      menu.classList.toggle('is-open', open);
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    };
    toggle.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  function setupProductSearch() {
    const tabs = [...document.querySelectorAll('.tab-btn')];
    const panels = [...document.querySelectorAll('#tab-nhua,#tab-da,#tab-phukien')];
    if (panels.length !== 3 || !tabs.length) return;
    const box = document.createElement('div');
    box.className = 'dk-search';
    box.innerHTML = '<label for="product-search">Tìm sản phẩm</label><input id="product-search" type="search" placeholder="Nhập mã, tên hoặc màu sắc…" autocomplete="off"><p id="product-count" role="status" aria-live="polite"></p><p id="product-empty" hidden>Chưa tìm thấy sản phẩm phù hợp.</p>';
    panels[0].before(box);
    const input = box.querySelector('input');
    const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
    const filter = () => {
      let count = 0;
      const query = normalize(input.value.trim());
      panels.forEach(panel => panel.querySelectorAll('.product-card').forEach(card => {
        const match = normalize(card.textContent).includes(query);
        card.toggleAttribute('data-search-hidden', !match);
        if (match && !panel.classList.contains('hidden')) count += 1;
      }));
      box.querySelector('#product-count').textContent = `${count} sản phẩm trong danh mục`;
      box.querySelector('#product-empty').hidden = count > 0;
      tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.classList.contains('active'))));
    };
    input.addEventListener('input', filter);
    tabs.forEach(tab => tab.addEventListener('click', () => {
      history.replaceState(null, '', `#${tab.dataset.tab}`);
      setTimeout(filter, 0);
    }));
    const initial = tabs.find(tab => tab.dataset.tab === location.hash.slice(1));
    if (initial) initial.click();
    filter();
  }

  function setupForms() {
    document.querySelectorAll('input[type="tel"]').forEach(input => {
      input.autocomplete = 'tel';
      input.inputMode = 'tel';
      input.pattern = '[+0-9() .-]{9,20}';
      input.title = 'Nhập số điện thoại từ 9 đến 20 ký tự';
    });
    document.querySelectorAll('input[type="email"]').forEach(input => input.autocomplete = 'email');
    const status = document.getElementById('form-response');
    if (status) {
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
    }
  }

  function addFooterLinks() {
    const footer = document.querySelector('footer');
    if (!footer || footer.classList.contains('dk-sticky-footer') || footer.querySelector('.dk-footer-links')) return;
    const nav = document.createElement('nav');
    nav.className = 'dk-footer-links';
    nav.setAttribute('aria-label', 'Hỗ trợ và thông tin');
    [['du-an.html', 'Dự án'], ['blog.html', 'Kiến thức'], ['tai-lieu.html', 'Tài liệu'], ['bao-hanh.html', 'Bảo hành'], ['doi-tra.html', 'Đổi trả'], ['chinh-sach-bao-mat.html', 'Bảo mật']].forEach(([url, label]) => {
      const link = document.createElement('a');
      link.href = href(url);
      link.textContent = label;
      nav.append(link);
    });
    footer.append(nav);
  }

  function ready() {
    if (![...document.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href.includes('family=Manrope'))) {
      const font = document.createElement('link');
      font.rel = 'stylesheet';
      font.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap';
      document.head.append(font);
    }
    buildHeader();
    document.querySelectorAll('.dk-nav-group').forEach(group => {
      const button = group.querySelector('button'), panel = group.querySelector('.dk-submenu');
      const label = group.querySelector('a')?.textContent.trim() || 'danh mục';
      const open = value => {panel.hidden = !value; button.setAttribute('aria-expanded', String(value));button.setAttribute('aria-label', `${value ? 'Đóng' : 'Mở'} danh mục ${label}`);};
      button.addEventListener('click', () => open(panel.hidden));
      group.addEventListener('pointerenter', event => {if (event.pointerType === 'mouse' && matchMedia('(min-width:981px)').matches) open(true);});
      group.addEventListener('pointerleave', () => {if (!group.contains(document.activeElement)) open(false);});
      group.addEventListener('focusin', () => {if (matchMedia('(min-width:981px)').matches) open(true);});
      group.addEventListener('focusout', event => {if (!group.contains(event.relatedTarget)) open(false);});
      group.addEventListener('keydown', event => {if(event.key === 'Escape'){open(false);button.focus();event.stopPropagation();}});
      document.addEventListener('click', event => {if(!group.contains(event.target)) open(false);});
    });
    setupMenu();
    setupProductSearch();
    setupForms();
    addFooterLinks();
    document.querySelectorAll('a[target="_blank"]').forEach(link => link.rel = 'noopener noreferrer');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
