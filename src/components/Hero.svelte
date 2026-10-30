<script lang="ts">
  import { ArrowDown, ArrowRight, Code2, Zap } from '@lucide/svelte';
  import { onMount } from 'svelte';
  import { scrollToSection, prefersReducedMotion } from '../lib/ui.svelte';

  const phrases = ['working code.', 'live circuits.', 'smart systems.', 'secure networks.'];

  let typed = $state(phrases[0]);
  let ready = $state(false);
  let reduced = $state(false);
  let tiltX = $state(0);
  let tiltZ = $state(0);
  let booting = $state(false);
  let reboots = $state(0);
  let clock = $state('');
  let heroEl = $state<HTMLElement>();

  onMount(() => {
    reduced = prefersReducedMotion();
    requestAnimationFrame(() => ready = true);

    const format = new Intl.DateTimeFormat('en-PH', { timeZone: 'Asia/Manila', hour: 'numeric', minute: '2-digit' });
    const tick = () => clock = format.format(new Date());
    tick();
    const clockTimer = setInterval(tick, 10_000);

    let timer: ReturnType<typeof setTimeout> | undefined;
    let index = 0;
    const later = (fn: () => void, ms: number) => { timer = setTimeout(fn, ms); };
    function nextPhrase() {
      index = (index + 1) % phrases.length;
      const target = phrases[index];
      if (reduced) { typed = target; later(nextPhrase, 3400); return; }
      const erase = () => {
        if (typed.length) { typed = typed.slice(0, -1); later(erase, 26); }
        else write(1);
      };
      const write = (n: number) => {
        typed = target.slice(0, n);
        if (n < target.length) later(() => write(n + 1), 58);
        else later(nextPhrase, 2800);
      };
      erase();
    }
    later(nextPhrase, 3000);

    const el = heroEl;
    el?.addEventListener('pointermove', onPointerMove);
    el?.addEventListener('pointerleave', resetTilt);

    return () => {
      clearInterval(clockTimer);
      clearTimeout(timer);
      clearTimeout(bootTimer);
      el?.removeEventListener('pointermove', onPointerMove);
      el?.removeEventListener('pointerleave', resetTilt);
    };
  });

  function onPointerMove(event: PointerEvent) {
    if (reduced || event.pointerType !== 'mouse' || !heroEl) return;
    const rect = heroEl.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltZ = x * 12;
    tiltX = y * -10;
  }

  function resetTilt() { tiltX = 0; tiltZ = 0; }

  let bootTimer: ReturnType<typeof setTimeout> | undefined;
  function powerCycle() {
    booting = true;
    reboots += 1;
    clearTimeout(bootTimer);
    bootTimer = setTimeout(() => booting = false, 1500);
  }
</script>

<section id="top" class="hero" class:ready class:booting bind:this={heroEl} aria-labelledby="hero-title">
  <div class="hero-grid" aria-hidden="true"></div>
  <div class="hero-glow" aria-hidden="true"></div>

  <div class="hero-copy">
    <p class="availability"><span class="live-dot" aria-hidden="true"></span> Open for commissions</p>
    <h1 id="hero-title">
      <span class="sr-only">Your ideas, engineered into working code, live circuits, smart systems, and secure networks.</span>
      <span aria-hidden="true">Your ideas,<br/>engineered into<br/><span class="typed">{typed}<span class="caret"></span></span></span>
    </h1>
    <p class="hero-lede">From lines of code to circuits that come alive. We’re the engineering collective that helps you turn “what if” into what’s next.</p>
    <div class="hero-actions">
      <button class="button primary" onclick={() => scrollToSection('request')}>Start a request <ArrowRight size={18}/></button>
      <button class="button secondary" onclick={() => scrollToSection('workbench')}>Try the free tools</button>
    </div>
    <p class="hero-note"><span aria-hidden="true">✦</span> Built on curiosity. Driven by engineering.</p>
  </div>

  <div class="machine" style:--tilt-x={`${tiltX}deg`} style:--tilt-z={`${tiltZ}deg`}>
    <svg class="machine-svg" viewBox="0 0 550 510" aria-hidden="true">
      <g class="orbit" transform="rotate(-28 280 255)">
        <ellipse cx="280" cy="255" rx="245" ry="150"/>
        {#if !reduced}<circle r="3.5" class="orbit-node"><animateMotion dur="22s" repeatCount="indefinite" path="M35,255 a245,150 0 1,0 490,0 a245,150 0 1,0 -490,0"/></circle>{/if}
      </g>
      <g class="orbit dashed" transform="rotate(33 280 255)">
        <ellipse cx="280" cy="255" rx="220" ry="120"/>
        {#if !reduced}<circle r="2.5" class="orbit-node"><animateMotion dur="16s" repeatCount="indefinite" path="M500,255 a220,120 0 1,1 -440,0 a220,120 0 1,1 440,0"/></circle>{/if}
      </g>
      <g class="orbit faint" transform="rotate(-55 278 254)">
        <ellipse cx="278" cy="254" rx="260" ry="185"/>
        {#if !reduced}<circle r="2.5" class="orbit-node"><animateMotion dur="30s" repeatCount="indefinite" path="M18,254 a260,185 0 1,0 520,0 a260,185 0 1,0 -520,0"/></circle>{/if}
      </g>
      <g class="traces">
        <path pathLength="100" d="M214 222 L176 184 L176 140"/>
        <path pathLength="100" d="M352 336 L378 362 L398 362"/>
        <path pathLength="100" d="M336 196 L384 148 L480 148"/>
        <path pathLength="100" d="M226 352 L188 390 L108 390"/>
      </g>
      <g class="pulses">
        <path pathLength="100" d="M214 222 L176 184 L176 140"/>
        <path pathLength="100" d="M352 336 L378 362 L398 362"/>
        <path pathLength="100" d="M336 196 L384 148 L480 148"/>
        <path pathLength="100" d="M226 352 L188 390 L108 390"/>
      </g>
      <g class="pads">
        <circle cx="480" cy="148" r="4"/><circle cx="108" cy="390" r="4"/>
      </g>
    </svg>

    <div class="float-label label-code"><Code2 size={15}/> code. create. connect.</div>
    <div class="float-label label-system" role="status"><span class="live-dot" aria-hidden="true"></span> {booting ? 'Rebooting core…' : 'All systems online'}</div>
    <div class="float-label label-clock">14.5995° N, 120.9842° E <span>Manila, {clock || '--:--'}</span></div>

    <div class="chip-base base-bottom" aria-hidden="true"></div>
    <div class="chip-base base-middle" aria-hidden="true"></div>
    <div class="chip-base base-top">
      <button class="chip-inner" onclick={powerCycle} aria-label="Power-cycle the core">
        <Zap size={66} strokeWidth={1.5} fill="currentColor"/>
      </button>
      <span class="chip-inscription" aria-hidden="true">EOQ CORE / 01{reboots ? ` / R${reboots}` : ''}</span>
    </div>
    <span class="machine-caption">Tap the core to power-cycle it</span>
  </div>

  <div class="hero-bottom">
    <span>Small team. Wide possibilities.</span>
    <button onclick={() => scrollToSection('services')}>Scroll to explore <ArrowDown size={15}/></button>
  </div>
</section>
