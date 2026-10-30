<script lang="ts">
  import { fly } from 'svelte/transition';
  import { toasts, prefersReducedMotion } from '../lib/ui.svelte';
  const reduced = prefersReducedMotion();
</script>

<div class="toasts" role="status" aria-live="polite">
  {#each toasts as item (item.id)}
    <p class="toast" transition:fly={{ y: reduced ? 0 : 12, duration: reduced ? 0 : 200 }}>{item.text}</p>
  {/each}
</div>
