/* Beams background adapted to the existing vanilla website. */
(() => {
  const hero = document.querySelector('[data-liquid-hero]');
  const canvas = hero?.querySelector('.home-beams-canvas');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, beams = [], frame = 0, last = 0, visible = true;
  const createBeam = () => ({
    x: Math.random() * width * 1.5 - width * .25,
    y: Math.random() * height * 1.5 - height * .25,
    width: 30 + Math.random() * 60, length: height * 2.5,
    angle: (-35 + Math.random() * 10) * Math.PI / 180,
    speed: .6 + Math.random() * 1.2, opacity: .12 + Math.random() * .16,
    hue: 190 + Math.random() * 70, pulse: Math.random() * Math.PI * 2,
    pulseSpeed: .02 + Math.random() * .03
  });
  function draw(step) {
    ctx.clearRect(0, 0, width, height);
    for (const beam of beams) {
      beam.y -= beam.speed * step;
      beam.pulse += beam.pulseSpeed * step;
      if (beam.y + beam.length < -100) {
        beam.y = height + 100;
        beam.x = Math.random() * width;
      }
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate(beam.angle);
      const opacity = beam.opacity * (.8 + Math.sin(beam.pulse) * .2);
      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
      for (const [stop, strength] of [[0,0],[.1,.5],[.4,1],[.6,1],[.9,.5],[1,0]]) {
        gradient.addColorStop(stop, `hsla(${beam.hue},85%,65%,${opacity * strength})`);
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    }
  }
  function tick(time) {
    draw(last ? Math.min((time - last) / 16.667, 2) : 1);
    last = time;
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    last = 0;
    if (!motion.matches && visible && !document.hidden) frame = requestAnimationFrame(tick);
    else draw(0);
  }
  function resize() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    // Soft beams need no high-resolution buffer; cap rendering cost.
    const scale = Math.min(devicePixelRatio || 1, 1);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    beams = Array.from({length: width < 700 ? 18 : 30}, createBeam);
    sync();
  }
  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(entries => {visible = entries[0].isIntersecting; sync();}).observe(hero);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  resize();
})();
