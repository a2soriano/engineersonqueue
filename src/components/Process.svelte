<script lang="ts">
  import { processSteps } from '../lib/content';
  import { onTabKeydown } from '../lib/actions';

  let step = $state(0);
  const current = $derived(processSteps[step]);
</script>

<section id="process" class="section process" aria-labelledby="process-title">
  <div class="section-top">
    <h2 id="process-title">How a request<br/><span>becomes a build.</span></h2>
    <p>Four steps, agreed together. Nothing is booked until you have seen the scope and the quote.</p>
  </div>

  <div class="process-track" style:--progress={step / (processSteps.length - 1)}>
    <div class="process-rail" aria-hidden="true"><span></span></div>
    <div class="process-steps" role="tablist" aria-label="Steps in our process">
      {#each processSteps as item, i}
        <button
          id={'step-tab-' + i}
          role="tab"
          class="process-step"
          class:done={i < step}
          aria-selected={step === i}
          aria-controls="step-panel"
          tabindex={step === i ? 0 : -1}
          onclick={() => step = i}
          onkeydown={e => onTabKeydown(e, i, processSteps.length, n => step = n)}
        >
          <span class="step-index">{i + 1}</span>
          <span class="step-title">{item.title}</span>
        </button>
      {/each}
    </div>
  </div>

  <div id="step-panel" class="step-panel" role="tabpanel" aria-labelledby={'step-tab-' + step}>
    {#key step}
      <div class="step-panel-inner">
        <p class="step-count">Step {step + 1} of {processSteps.length}</p>
        <h3>{current.title}</h3>
        <p>{current.text}</p>
        <p class="step-detail">{current.detail}</p>
        <div class="step-nav">
          <button class="text-link" disabled={step === 0} onclick={() => step -= 1}>Previous step</button>
          <button class="text-link" disabled={step === processSteps.length - 1} onclick={() => step += 1}>Next step</button>
        </div>
      </div>
    {/key}
  </div>
</section>
