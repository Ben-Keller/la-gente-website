type AccordionOptions = {
  scroll?: boolean;
  hold?: boolean;
};

export function initializeInvolvementAccordions(): void {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.organization-accordion'));
  if (!cards.length) return;

  const hoverEnabled = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const typingTimers = new WeakMap<HTMLElement, number>();
  const hoverTimers = new WeakMap<HTMLElement, number>();
  let programmaticScroll = false;
  let scrollReleaseTimer = 0;
  let lastPointerMoveAt = 0;
  let lastPointerX: number | null = null;
  let lastPointerY: number | null = null;

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    if (lastPointerX === null || Math.abs(event.clientX - lastPointerX) + Math.abs(event.clientY - lastPointerY!) >= 3) {
      lastPointerMoveAt = performance.now();
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
    }
  }, { passive: true });

  const finishProgrammaticScroll = () => {
    if (!programmaticScroll) return;
    programmaticScroll = false;
    document.body.classList.remove('is-programmatic-scroll');
    window.clearTimeout(scrollReleaseTimer);
  };

  const scrollToCard = (card: HTMLElement) => {
    programmaticScroll = true;
    document.body.classList.add('is-programmatic-scroll');
    window.clearTimeout(scrollReleaseTimer);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      const header = document.querySelector<HTMLElement>('.site-header--drop.is-visible, .site-header:not(.site-header--hero)');
      const targetTop = window.scrollY + card.getBoundingClientRect().top - (header?.offsetHeight ?? 96) - 24;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      if (reduceMotion.matches) finishProgrammaticScroll();
      else scrollReleaseTimer = window.setTimeout(finishProgrammaticScroll, 1400);
    }));
  };

  const writeDescription = (card: HTMLElement) => {
    const target = card.querySelector<HTMLElement>('.organization-accordion__typed');
    if (!target) return;
    const fullText = target.dataset.text ?? '';
    const priorTimer = typingTimers.get(target);
    if (priorTimer) window.clearInterval(priorTimer);
    if (reduceMotion.matches) {
      target.textContent = fullText;
      return;
    }

    target.textContent = '';
    let cursor = 0;
    const timer = window.setInterval(() => {
      cursor = Math.min(fullText.length, cursor + 3);
      target.textContent = fullText.slice(0, cursor);
      if (cursor >= fullText.length) {
        window.clearInterval(timer);
        typingTimers.delete(target);
      }
    }, 12);
    typingTimers.set(target, timer);
  };

  const setCardOpen = (card: HTMLElement, open: boolean, options: AccordionOptions = {}) => {
    const trigger = card.querySelector<HTMLElement>('.organization-accordion__trigger');
    const panel = card.querySelector<HTMLElement>('.organization-accordion__panel');
    card.classList.toggle('is-open', open);
    card.classList.toggle('is-held', open && Boolean(options.hold));
    trigger?.setAttribute('aria-expanded', String(open));
    panel?.setAttribute('aria-hidden', String(!open));
    if (open) {
      writeDescription(card);
      if (options.scroll) scrollToCard(card);
    }
  };

  cards.forEach((card) => {
    const trigger = card.querySelector<HTMLButtonElement>('.organization-accordion__trigger');
    trigger?.addEventListener('click', () => {
      const opening = !card.classList.contains('is-open') || !card.classList.contains('is-held');
      cards.forEach((other) => {
        if (other !== card) setCardOpen(other, false);
      });
      setCardOpen(card, opening, { hold: opening });
    });

    card.addEventListener('mouseenter', () => {
      const priorTimer = hoverTimers.get(card);
      if (priorTimer) window.clearTimeout(priorTimer);
      const timer = window.setTimeout(() => {
        hoverTimers.delete(card);
        const movedRecently = performance.now() - lastPointerMoveAt < 180;
        if (movedRecently && !programmaticScroll && hoverEnabled.matches && !card.classList.contains('is-held')) {
          setCardOpen(card, true);
        }
      }, 35);
      hoverTimers.set(card, timer);
    });

    card.addEventListener('mouseleave', () => {
      const priorTimer = hoverTimers.get(card);
      if (priorTimer) window.clearTimeout(priorTimer);
      hoverTimers.delete(card);
      if (!programmaticScroll && hoverEnabled.matches && !card.classList.contains('is-held')) {
        setCardOpen(card, false);
      }
    });
  });

  if ('onscrollend' in window) window.addEventListener('scrollend', finishProgrammaticScroll);

  window.addEventListener('la-gente:organization-select', ((event: CustomEvent<{ index: number }>) => {
    const card = cards[Number(event.detail?.index)];
    if (!card) return;
    cards.forEach((other) => {
      if (other !== card) setCardOpen(other, false);
    });
    setCardOpen(card, true, { scroll: true, hold: true });
    card.classList.remove('is-map-selected');
    requestAnimationFrame(() => card.classList.add('is-map-selected'));
  }) as EventListener);
}
