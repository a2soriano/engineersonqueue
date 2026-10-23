/** Refresh an open production tab when a newer deployment becomes available. */
export function startSiteVersionCheck() {
  if (!import.meta.env.PROD) return () => {};

  let checking = false;
  let stopped = false;

  function isEditing() {
    const focused = document.activeElement;
    return Boolean(document.querySelector('[role="dialog"][aria-modal="true"], dialog[open]')) ||
      (focused instanceof HTMLElement && (
        focused.matches('input, textarea, select, [contenteditable="true"]') || Boolean(focused.closest('form'))
      ));
  }

  async function check() {
    if (checking || stopped || isEditing()) return;
    checking = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10_000);
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}version.json?t=${Date.now()}`, {
        cache: 'no-store',
        signal: controller.signal
      });
      if (!response.ok) return;
      const { version } = await response.json();
      if (typeof version !== 'string' || !version || version === __SITE_VERSION__ || stopped || isEditing()) return;

      const url = new URL(window.location.href);
      // An edge cache may briefly serve old assets even after a fresh navigation.
      if (url.searchParams.get('v') === version) return;
      url.searchParams.set('v', version);
      window.location.replace(url.href);
    } catch {
      // An offline tab or unavailable version file should keep working normally.
    } finally {
      window.clearTimeout(timeout);
      checking = false;
    }
  }

  function onVisible() {
    if (document.visibilityState === 'visible') void check();
  }

  const interval = window.setInterval(onVisible, 60_000);
  document.addEventListener('visibilitychange', onVisible);
  void check();

  return () => {
    stopped = true;
    window.clearInterval(interval);
    document.removeEventListener('visibilitychange', onVisible);
  };
}
