<script lang="ts">
  import { ArrowUp } from '@lucide/svelte';
  import Brand from './Brand.svelte';
  import { commissionEmail } from '../lib/contact';
  import { ui, openCommission, scrollToSection } from '../lib/ui.svelte';
</script>

<footer class="site-footer">
  <div class="footer-top">
    <div class="footer-brand">
      <Brand compact/>
      <p>Curiosity in. Possibilities out.</p>
    </div>
    <nav class="footer-links" aria-label="Footer">
      <a href="#services">Capabilities</a>
      <a href="#workbench">Workbench</a>
      <a href="#projects">Our work</a>
      <button onclick={() => openCommission()}>Get in touch</button>
      <button onclick={() => ui.terminalOpen = true}>Terminal</button>
    </nav>
    <button class="back-to-top" onclick={() => scrollToSection('top')} aria-label="Back to top"><ArrowUp size={18}/></button>
  </div>
  <div class="footer-bottom">
    <span>© {new Date().getFullYear()} Engineers on Queue. All rights reserved.</span>
    <a href={'mailto:' + commissionEmail}>{commissionEmail}</a>
    <span>Made with intention. Built for possibility. <span class="green" aria-hidden="true">✦</span></span>
  </div>
</footer>
