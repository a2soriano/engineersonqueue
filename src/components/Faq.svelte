<script lang="ts">
  import { ArrowUpRight, Plus } from '@lucide/svelte';
  import { faqs } from '../lib/content';
  import { openCommission } from '../lib/ui.svelte';

  let open = $state<number | null>(0);
</script>

<section id="faq" class="section faq" aria-labelledby="faq-title">
  <div>
    <h2 id="faq-title">A little clarity.<br/><span>A better start.</span></h2>
    <p>Something else on your mind?</p>
    <button class="text-link" onclick={() => openCommission()}>Ask us directly <ArrowUpRight size={16}/></button>
  </div>
  <div class="faq-list">
    {#each faqs as [question, answer], i}
      <div class="faq-item" class:open={open === i}>
        <h3>
          <button id={'faq-q-' + i} aria-expanded={open === i} aria-controls={'faq-a-' + i} onclick={() => open = open === i ? null : i}>
            {question}<span class="faq-icon" aria-hidden="true"><Plus size={18}/></span>
          </button>
        </h3>
        <div id={'faq-a-' + i} class="faq-answer" role="region" aria-labelledby={'faq-q-' + i} inert={open !== i ? true : undefined}>
          <div><p>{answer}</p></div>
        </div>
      </div>
    {/each}
  </div>
</section>
