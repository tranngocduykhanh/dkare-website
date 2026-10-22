/* Add logo-01.png through logo-07.png in images/khach-hang. */
(() => {
  const section = document.getElementById('customers');
  const grid = section?.querySelector('.home-customer-logos');
  if (!grid) return;
  for (let number = 1; number <= 7; number++) {
    const image = new Image();
    image.alt = 'Logo khách hàng REVOX';
    image.width = 600; image.height = 300;
    image.hidden = true;
    image.addEventListener('load', () => {image.hidden = false; section.hidden = false;});
    image.addEventListener('error', () => image.remove());
    grid.append(image);
    image.src = `images/khach-hang/logo-${String(number).padStart(2, '0')}.png`;
  }
})();
