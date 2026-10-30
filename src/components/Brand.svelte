<script lang="ts">
  import { Zap } from '@lucide/svelte';
  let { href = '#top', label = 'Engineers on Queue home', compact = false }: { href?: string; label?: string; compact?: boolean } = $props();
</script>

<a {href} class="brand" class:compact aria-label={label}>
  <span class="brand-icon" aria-hidden="true"><Zap size={compact ? 19 : 22} fill="currentColor"/></span>
  <span class="brand-word" aria-hidden="true">engineers<span class="brand-bottom">on queue<span class="brand-dot">.</span></span></span>
</a>
