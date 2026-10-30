/** Keeps keyboard focus inside a dialog, locks page scroll, and restores focus on close. */
export function trapFocus(node: HTMLElement, options: { initial?: string } = {}) {
  const previous = document.activeElement as HTMLElement | null;
  const oldOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  const initial = options.initial ? node.querySelector<HTMLElement>(options.initial) : null;
  (initial ?? node).focus();

  function trap(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;
    const items = Array.from(node.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled):not([type="hidden"]):not([tabindex="-1"]), select:not(:disabled), textarea:not(:disabled), a[href]'
    )).filter(item => item.getClientRects().length > 0);
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === node)) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }

  node.addEventListener('keydown', trap);
  return {
    destroy() {
      node.removeEventListener('keydown', trap);
      document.body.style.overflow = oldOverflow;
      previous?.focus({ preventScroll: true });
    }
  };
}

/** Arrow-key, Home, and End navigation for a row of role="tab" buttons. */
export function onTabKeydown(event: KeyboardEvent, index: number, count: number, select: (next: number) => void) {
  const keys: Record<string, number> = {
    ArrowRight: (index + 1) % count,
    ArrowDown: (index + 1) % count,
    ArrowLeft: (index - 1 + count) % count,
    ArrowUp: (index - 1 + count) % count,
    Home: 0,
    End: count - 1
  };
  if (!(event.key in keys)) return;
  event.preventDefault();
  const next = keys[event.key];
  select(next);
  const tabs = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('[role="tab"]');
  tabs?.[next]?.focus();
}

/** Adds the `in-view` class the first time an element scrolls into view. */
export function inView(node: HTMLElement, threshold = 0.35) {
  if (!('IntersectionObserver' in window)) { node.classList.add('in-view'); return {}; }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) { node.classList.add('in-view'); observer.disconnect(); }
    }
  }, { threshold });
  observer.observe(node);
  return { destroy() { observer.disconnect(); } };
}
