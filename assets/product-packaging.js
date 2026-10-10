(() => {
  'use strict';
  document.querySelectorAll('[data-packaging-gallery]').forEach(gallery => {
    const picture = gallery.querySelector('[data-packaging-main]');
    const caption = gallery.querySelector('[data-packaging-caption]');
    const buttons = [...gallery.querySelectorAll('[data-packaging-image]')];
    const count = gallery.querySelector('[data-packaging-count]');
    let selected = 0;
    function select(index) {
      selected = (index + buttons.length) % buttons.length;
      const button = buttons[selected];
      picture.src = button.dataset.packagingImage;
      picture.alt = button.dataset.caption;
      caption.textContent = button.dataset.caption;
      count.textContent = (selected + 1) + ' / ' + buttons.length;
      buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === selected)));
    }
    buttons.forEach((button, index) => button.addEventListener('click', () => select(index)));
    const zoom = gallery.querySelector('[data-packaging-zoom]');
    if (zoom) zoom.addEventListener('click', () => {
      const dialog = document.createElement('dialog');
      dialog.className = 'dk-pack-lightbox';
      const close = document.createElement('button');
      close.type = 'button'; close.textContent = 'Đóng ảnh';
      const large = document.createElement('img');
      large.src = picture.src; large.alt = picture.alt;
      dialog.append(close, large); document.body.append(dialog);
      close.addEventListener('click', () => dialog.close());
      dialog.addEventListener('close', () => { dialog.remove(); zoom.focus(); });
      dialog.showModal();
    });
    gallery.querySelector('[data-packaging-prev]').addEventListener('click', () => select(selected - 1));
    gallery.querySelector('[data-packaging-next]').addEventListener('click', () => select(selected + 1));
    gallery.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); select(selected - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); select(selected + 1); }
    });
  });
})();
