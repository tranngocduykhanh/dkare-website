(() => {
  document.querySelectorAll('[data-product-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.dk-product-track');
    const previous = carousel.querySelector('[data-carousel-previous]');
    const next = carousel.querySelector('[data-carousel-next]');
    if (!track || !previous || !next) return;
    const step = () => Math.min(track.clientWidth * .82, 580);
    const update = () => {
      const max = Math.max(0, track.scrollWidth - track.clientWidth);
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    };
    previous.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  });
})();
