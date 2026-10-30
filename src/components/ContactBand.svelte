<script lang="ts">
  import { ArrowUpRight, Copy } from '@lucide/svelte';
  import { commissionEmail } from '../lib/contact';
  import { openCommission, copyText } from '../lib/ui.svelte';
</script>

<section class="contact-band" aria-labelledby="contact-title">
  <div class="contact-grid" aria-hidden="true"></div>
  <h2 id="contact-title">Got a “what if”?<br/>Let’s make it work.</h2>
  <p>A rough sketch. A stubborn bug. An ambitious idea. Whatever’s on your mind, we’re all ears.</p>
  <div class="contact-actions">
    <button class="button primary" onclick={() => openCommission()}>Put your idea in the queue <ArrowUpRight size={18}/></button>
    <button class="button secondary" onclick={() => copyText(commissionEmail, 'Email address copied')}><Copy size={16}/> {commissionEmail}</button>
  </div>
  <p class="contact-note"><span class="live-dot" aria-hidden="true"></span> Open for commissions and collaborations</p>
</section>
