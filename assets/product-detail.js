(() => {
  'use strict';
  // HTML contains all content; these controls also work when opened as local files.
  document.querySelectorAll('[data-media-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('[data-media-section]');
      section.querySelectorAll('[data-media-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      section.querySelectorAll('[data-media-kind]').forEach(item => {
        item.hidden = button.dataset.mediaFilter !== 'all' && item.dataset.mediaKind !== button.dataset.mediaFilter;
        if (item.hidden) item.querySelectorAll('video').forEach(video => video.pause());
      });
    });
  });
  const dialog = document.querySelector('[data-image-dialog]');
  const triggers = [...document.querySelectorAll('[data-zoom-image]')];
  let selected = 0, returnFocus;
  if (dialog) {
    const picture = dialog.querySelector('img');
    const caption = dialog.querySelector('[data-image-caption]');
    function show(index) {
      selected = (index + triggers.length) % triggers.length;
      const source = triggers[selected];
      picture.src = source.dataset.zoomImage;
      picture.alt = source.dataset.caption;
      caption.textContent = `${selected + 1}/${triggers.length} — ${source.dataset.caption}`;
    }
    triggers.forEach((trigger, index) => trigger.addEventListener('click', () => {
      returnFocus = trigger; show(index); dialog.showModal();
    }));
    dialog.querySelector('[data-image-close]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-image-prev]').addEventListener('click', () => show(selected - 1));
    dialog.querySelector('[data-image-next]').addEventListener('click', () => show(selected + 1));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') {event.preventDefault(); show(selected - 1);}
      if (event.key === 'ArrowRight') {event.preventDefault(); show(selected + 1);}
    });
    dialog.addEventListener('close', () => { picture.removeAttribute('src'); returnFocus?.focus(); });
  }
  document.querySelectorAll('[data-product-inquiry]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const message = form.elements.message;
      message.setCustomValidity(message.value.trim() ? '' : 'Nhập nội dung cần tư vấn.');
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const phone = String(values.get('phone')).replace(/[\s().-]/g, '');
      const field = form.elements.phone;
      field.setCustomValidity(/^\+?\d{9,15}$/.test(phone) ? '' : 'Nhập số điện thoại từ 9 đến 15 chữ số.');
      if (!form.reportValidity()) return;
      const content = `Sản phẩm: ${values.get('product_code')}\nHọ tên: ${String(values.get('name')).trim()}\nĐiện thoại: ${phone}\nNhu cầu: ${values.get('need')}\nNội dung: ${String(values.get('message')).trim()}`;
      const result = form.querySelector('[data-inquiry-result]');
      result.hidden = false;
      result.querySelector('[data-inquiry-text]').textContent = content;
      const link = result.querySelector('[data-inquiry-email]');
      link.href = `mailto:dkarepaint@gmail.com?subject=${encodeURIComponent('Tư vấn sản phẩm ' + values.get('product_code'))}&body=${encodeURIComponent(content)}`;
      result.querySelector('[data-inquiry-status]').textContent = 'Nội dung đã được soạn trên thiết bị của bạn, chưa gửi đến D.KARE. Chọn mở email để gửi bằng ứng dụng email, hoặc gọi D.KARE.';
      result.querySelector('[data-inquiry-copy]').onclick = async () => {
        try { await navigator.clipboard.writeText(content); result.querySelector('[data-inquiry-status]').textContent = 'Đã sao chép nội dung. Bạn có thể gửi cho D.KARE qua kênh liên hệ đang sử dụng.'; }
        catch (_) { result.querySelector('[data-inquiry-status]').textContent = 'Bạn có thể chọn và sao chép nội dung bên trên để gửi cho D.KARE.'; }
      };
    });
    form.elements.message.addEventListener('input', () => form.elements.message.setCustomValidity(''));
    form.elements.phone.addEventListener('input', () => form.elements.phone.setCustomValidity(''));
  });
})();
