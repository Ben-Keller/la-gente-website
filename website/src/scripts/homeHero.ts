export function initializeHomeHero(): void {
  const hero = document.querySelector<HTMLElement>('.home-hero');
  const posters = Array.from(document.querySelectorAll<HTMLImageElement>('.home-hero__poster'));
  const poster = posters[0];
  const video = document.querySelector<HTMLVideoElement>('.home-hero__video');
  const mobile = window.matchMedia('(max-width: 800px)');

  if (!hero || !poster || !video || posters.length < 2) return;

  if (mobile.matches) {
    video.pause();
    video.removeAttribute('autoplay');
    const images: string[] = JSON.parse(hero.dataset.mobileImages ?? '[]');
    let activeLayer = 0;
    let imageIndex = 1;
    posters[0].classList.add('is-mobile-active');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      posters[1].remove();
      return;
    }

    window.setInterval(async () => {
      const nextLayer = activeLayer === 0 ? 1 : 0;
      const nextPoster = posters[nextLayer];
      if (!nextPoster || images.length < 2) return;
      nextPoster.src = images[imageIndex];
      try { await nextPoster.decode(); } catch {}
      nextPoster.classList.add('is-mobile-active');
      posters[activeLayer]?.classList.remove('is-mobile-active');
      activeLayer = nextLayer;
      imageIndex = (imageIndex + 1) % images.length;
    }, 6500);
    return;
  }

  const minimumPosterTime = 1600;
  let posterVisibleAt = performance.now();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    poster.classList.add('is-visible');
    posterVisibleAt = performance.now();
  }));

  const revealVideo = () => {
    const remainingHold = Math.max(0, minimumPosterTime - (performance.now() - posterVisibleAt));
    window.setTimeout(() => {
      video.classList.add('is-playing');
      poster.classList.add('is-fading-out');
      poster.classList.remove('is-visible');
    }, remainingHold);
  };

  video.addEventListener('playing', revealVideo, { once: true });
  if (!video.paused && video.currentTime > 0) revealVideo();
}
