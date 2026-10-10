(() => {
  const section = document.querySelector('.dk-solutions-scroll');
  if (!section) return;
  const stories = [...section.querySelectorAll('.dk-solution-story')];
  const images = [...section.querySelectorAll('.dk-solutions-media img')];
  const activate = index => {
    stories.forEach((story, i) => story.classList.toggle('is-active', i === index));
    images.forEach((image, i) => image.classList.toggle('is-active', i === index));
  };
  activate(0);
  let ticking = false;
  const update = () => {
    const center = window.innerHeight / 2;
    let closest = 0;
    let distance = Infinity;
    stories.forEach((story, index) => {
      const rect = story.getBoundingClientRect();
      const current = Math.abs(rect.top + rect.height / 2 - center);
      if (current < distance) { distance = current; closest = index; }
    });
    activate(closest);
    ticking = false;
  };
  const requestUpdate = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate);
  update();
})();
