(() => {
  const form = document.getElementById('revox-contact-form');
  if (!form) return;
  const button = document.getElementById('submit-btn');
  const label = document.getElementById('submit-text');
  const spinner = document.getElementById('submit-spinner');
  const responseBox = document.getElementById('form-response');
  const base = (window.REVOX_API_BASE || '').replace(/\/$/, '');
  const providerNote = document.querySelector('[data-form-provider]');
  if (providerNote) providerNote.textContent = base ? 'Biểu mẫu được lưu trong hệ thống của REVOX.' : 'Biểu mẫu được truyền qua Web3Forms.';
  let lastPayload = '', requestKey = '';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled || !form.reportValidity()) return;
    button.disabled = true; label.classList.add('hidden'); spinner.classList.remove('hidden'); responseBox.classList.add('hidden');
    try {
      const values = new FormData(form);
      let result, res;
      if (base) {
        const payload = {
          name: values.get('name'), phone: values.get('phone'), email: values.get('email'), company: values.get('company'),
          service: values.get('service'), message: values.get('message'), privacy_consent: values.has('privacy_consent'), botcheck: values.has('botcheck')
        };
        const serialized = JSON.stringify(payload);
        if (serialized !== lastPayload) { requestKey = crypto.randomUUID(); lastPayload = serialized; }
        res = await fetch(base + '/api/v1/leads', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': requestKey }, body: serialized, signal: AbortSignal.timeout(20000) });
      } else {
        res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: values, signal: AbortSignal.timeout(20000) });
      }
      result = await res.json();
      if (!res.ok || result.success !== true) throw new Error(base ? result.message || 'Không thể lưu yêu cầu lúc này.' : 'Không thể gửi yêu cầu lúc này.');
      responseBox.className = 'success-box';
      responseBox.replaceChildren();
      const title = document.createElement('p'); title.className = 'font-semibold text-lg'; title.textContent = 'Đã gửi yêu cầu thành công.';
      const copy = document.createElement('p'); copy.textContent = 'REVOX sẽ liên hệ với bạn trong thời gian sớm nhất.';
      responseBox.append(title, copy); form.reset(); lastPayload = ''; requestKey = '';
    } catch (error) {
      responseBox.className = 'error-box'; responseBox.replaceChildren();
      const copy = document.createElement('p');
      copy.textContent = error.name === 'TimeoutError' ? 'Chưa nhận được xác nhận. Bạn có thể gửi lại; hệ thống REVOX sẽ kiểm tra tránh ghi trùng.' : 'Không thể gửi yêu cầu: ' + (error.message || 'Vui lòng thử lại hoặc gọi 079 539 7519.');
      responseBox.append(copy);
    } finally {
      responseBox.classList.remove('hidden'); label.classList.remove('hidden'); spinner.classList.add('hidden'); button.disabled = false;
      responseBox.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    }
  });
})();
