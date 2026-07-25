export function initializeSiteHeader(): void {
  const toggles = document.querySelectorAll<HTMLButtonElement>('.mobile-menu-toggle');
  const closeMenus = () => {
    document.body.classList.remove('mobile-menu-open');
    toggles.forEach((toggle) => {
      toggle.setAttribute('aria-expanded', 'false');
      const label = toggle.querySelector<HTMLElement>('.sr-only');
      if (label) label.textContent = 'Open menu';
    });
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const opening = !document.body.classList.contains('mobile-menu-open');
      closeMenus();
      if (!opening) return;
      document.body.classList.add('mobile-menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      const label = toggle.querySelector<HTMLElement>('.sr-only');
      if (label) label.textContent = 'Close menu';
    });
  });
  document.querySelectorAll('.site-header nav a').forEach((link) => link.addEventListener('click', closeMenus));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenus();
  });

  const dropHeader = document.querySelector<HTMLElement>('.site-header--drop');
  if (!dropHeader) return;
  let animationFrame = 0;
  const updateHeader = () => {
    const visible = window.scrollY > 140;
    dropHeader.classList.toggle('is-visible', visible);
    dropHeader.setAttribute('aria-hidden', String(!visible));
    dropHeader.toggleAttribute('inert', !visible);
    animationFrame = 0;
  };
  const requestUpdate = () => {
    if (!animationFrame) animationFrame = requestAnimationFrame(updateHeader);
  };
  updateHeader();
  window.addEventListener('scroll', requestUpdate, { passive: true });
}
