(() => {
  'use strict';
  const track = document.querySelector('.home-project-track');
  if (!track) return;
  const cards = [...track.querySelectorAll('.home-project-card')];
  if (!cards.length) return;
  const dots = [...document.querySelectorAll('.home-project-dots button')];
  const previous = document.querySelector('.home-project-prev');
  const next = document.querySelector('.home-project-next');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const offset = index => cards[index].offsetLeft - cards[0].offsetLeft;
  const step = () => cards.length > 1 ? offset(1) : track.clientWidth;
  const move = left => track.scrollTo({left, behavior: reduced.matches ? 'auto' : 'smooth'});
  const update = () => {
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    if (previous) previous.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft >= max - 2;
    const active = max > 0 && track.scrollLeft >= max - 2 ? cards.length - 1 : cards.reduce((best, _, index) => Math.abs(offset(index) - track.scrollLeft) < Math.abs(offset(best) - track.scrollLeft) ? index : best, 0);
    dots.forEach((dot, index) => dot.setAttribute('aria-pressed', String(index === active)));
  };
  previous?.addEventListener('click', () => move(track.scrollLeft - step()));
  next?.addEventListener('click', () => move(track.scrollLeft + step()));
  dots.forEach((dot, index) => dot.addEventListener('click', () => move(offset(index))));
  track.addEventListener('scroll', update, {passive:true});
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
  else addEventListener('resize', update);
  update();
})();
