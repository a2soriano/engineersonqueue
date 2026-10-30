<script lang="ts">
  import Header from './components/Header.svelte';
  import Hero from './components/Hero.svelte';
  import ToolStrip from './components/ToolStrip.svelte';
  import Services from './components/Services.svelte';
  import Process from './components/Process.svelte';
  import BriefBuilder from './components/BriefBuilder.svelte';
  import Workbench from './components/Workbench.svelte';
  import Projects from './components/Projects.svelte';
  import About from './components/About.svelte';
  import Faq from './components/Faq.svelte';
  import ContactBand from './components/ContactBand.svelte';
  import Footer from './components/Footer.svelte';
  import CommissionModal from './components/CommissionModal.svelte';
  import Terminal from './components/Terminal.svelte';
  import Toasts from './components/Toasts.svelte';
  import { ui } from './lib/ui.svelte';

  function isTyping(target: EventTarget | null) {
    return target instanceof HTMLElement && target.matches('input, textarea, select, [contenteditable="true"]');
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (ui.terminalOpen) ui.terminalOpen = false;
      else if (ui.modalOpen) ui.modalOpen = false;
      return;
    }
    const commandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    const backtick = event.key === '`' && !isTyping(event.target);
    if ((commandK || backtick) && !ui.modalOpen) {
      event.preventDefault();
      ui.terminalOpen = !ui.terminalOpen;
    }
  }
</script>

<svelte:head>
  <meta property="og:title" content="Engineers on Queue: your ideas, engineered."/>
  <meta property="og:description" content="A hands-on engineering collective for code, circuits, embedded systems, and networks. Open for commissions."/>
</svelte:head>

<svelte:window onkeydown={onKeydown}/>

<a class="skip-link" href="#main">Skip to content</a>
<Header/>
<main id="main">
  <Hero/>
  <ToolStrip/>
  <Services/>
  <Process/>
  <BriefBuilder/>
  <Workbench/>
  <Projects/>
  <About/>
  <Faq/>
  <ContactBand/>
</main>
<Footer/>

{#if ui.modalOpen}<CommissionModal/>{/if}
{#if ui.terminalOpen}<Terminal/>{/if}
<Toasts/>
