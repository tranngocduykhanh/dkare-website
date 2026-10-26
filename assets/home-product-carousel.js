(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-product-carousel]').forEach((carousel, index) => {
    const track = carousel.querySelector('.dk-product-track');
    const previous = carousel.querySelector('[data-carousel-previous]');
    const next = carousel.querySelector('[data-carousel-next]');
    if (!track || !previous || !next) return;
    track.id ||= `home-product-track-${index}`;
    previous.setAttribute('aria-controls', track.id);
    next.setAttribute('aria-controls', track.id);
    const step = () => {
      const cards = track.querySelectorAll('.dk-home-product-card');
      return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
    };
    const update = () => {
      const max = Math.max(0, track.scrollWidth - track.clientWidth);
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    };
    const move = direction => track.scrollBy({left: direction * step(), behavior: reduced.matches ? 'auto' : 'smooth'});
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', update, {passive:true});
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
    else addEventListener('resize', update);
    update();
  });
})();
