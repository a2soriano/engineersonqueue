<script lang="ts">
  import { ArrowRight, Check } from '@lucide/svelte';
  import { services } from '../lib/content';
  import { brief, openCommission, scrollToSection } from '../lib/ui.svelte';
  import { onTabKeydown } from '../lib/actions';

  let selected = $state(0);
  const current = $derived(services[selected]);

  function plan() {
    brief.service = current.title;
    scrollToSection('request');
  }
</script>

<section id="services" class="section services" aria-labelledby="services-title">
  <div class="section-top">
    <h2 id="services-title">Different disciplines.<br/><span>One curious collective.</span></h2>
    <p>Software, hardware, or the space in between. Pick a discipline to see the kind of problems we help with.</p>
  </div>

  <div class="service-tabs" role="tablist" aria-label="Services">
    {#each services as service, i}
      <button
        id={'service-tab-' + service.id}
        class="service-tile"
        role="tab"
        aria-selected={selected === i}
        aria-controls="service-panel"
        tabindex={selected === i ? 0 : -1}
        onclick={() => selected = i}
        onkeydown={e => onTabKeydown(e, i, services.length, n => selected = n)}
      >
        <span class="service-icon"><service.icon size={24} strokeWidth={1.5}/></span>
        <span class="service-name">{service.title}</span>
        <span class="service-text">{service.text}</span>
      </button>
    {/each}
  </div>

  <div id="service-panel" class="service-panel" role="tabpanel" aria-labelledby={'service-tab-' + current.id}>
    {#key current.id}
      <div class="service-panel-inner">
        <div>
          <h3>{current.title}</h3>
          <div class="tags">{#each current.tags as tag}<span>{tag}</span>{/each}</div>
        </div>
        <div>
          <p class="panel-label">People usually come to us with</p>
          <ul class="request-list">
            {#each current.requests as request}<li><Check size={16}/> {request}</li>{/each}
          </ul>
        </div>
        <div class="panel-actions">
          <button class="button primary" onclick={plan}>Plan this request <ArrowRight size={17}/></button>
          <button class="text-link" onclick={() => openCommission({ service: current.title })}>Or message us directly</button>
        </div>
      </div>
    {/key}
  </div>

  <p class="scope-note">Have something a little different in mind? We like a good challenge. <button onclick={() => openCommission({ service: 'Something else' })}>Tell us about it</button></p>
</section>
