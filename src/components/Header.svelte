<script lang="ts">
  import { ArrowUpRight, Menu, X, Terminal as TerminalIcon } from '@lucide/svelte';
  import { onMount } from 'svelte';
  import Brand from './Brand.svelte';
  import { ui, openCommission } from '../lib/ui.svelte';

  const links = [
    { id: 'services', label: 'What we do' },
    { id: 'process', label: 'How it works' },
    { id: 'workbench', label: 'Workbench' },
    { id: 'about', label: 'The collective' },
    { id: 'faq', label: 'FAQs' }
  ];

  let menuOpen = $state(false);
  let scrolled = $state(false);
  let progress = $state(0);
  let active = $state('');
  let shortcut = $state('Ctrl K');

  onMount(() => {
    if (/Mac|iPhone|iPad/.test(navigator.userAgent)) shortcut = '⌘K';
    let frame = 0;
    function measure() {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      scrolled = window.scrollY > 12;
    }
    function onScroll() { if (!frame) frame = requestAnimationFrame(measure); }
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) active = entry.target.id;
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      observer.disconnect();
    };
  });

  function openTerminal() {
    menuOpen = false;
    ui.terminalOpen = true;
  }
</script>

<svelte:window onkeydown={e => { if (e.key === 'Escape') menuOpen = false; }}/>

<header class="site-header" class:scrolled class:menu-open={menuOpen}>
  <div class="header-inner">
    <Brand href="#top" label="Engineers on Queue home"/>
    <nav id="site-nav" class:open={menuOpen} aria-label="Main navigation">
      {#each links as link}
        <a href={'#' + link.id} aria-current={active === link.id ? 'true' : undefined} onclick={() => menuOpen = false}>{link.label}</a>
      {/each}
      <button class="nav-terminal-mobile" onclick={openTerminal}><TerminalIcon size={16}/> Open the terminal</button>
    </nav>
    <div class="header-actions">
      <button class="terminal-trigger" onclick={openTerminal} aria-label="Open the terminal" title="Open the terminal ({shortcut})">
        <TerminalIcon size={16}/><kbd>{shortcut}</kbd>
      </button>
      <button class="nav-cta" onclick={() => { menuOpen = false; openCommission(); }}>Let’s talk <ArrowUpRight size={16}/></button>
      <button class="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="site-nav" onclick={() => menuOpen = !menuOpen}>
        {#if menuOpen}<X/>{:else}<Menu/>{/if}
      </button>
    </div>
  </div>
  <div class="scroll-progress" aria-hidden="true" style:transform={`scaleX(${progress})`}></div>
</header>
