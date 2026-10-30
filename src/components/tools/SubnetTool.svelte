<script lang="ts">
  import { subnet } from '../../lib/eng';
  import { copyText } from '../../lib/ui.svelte';

  let input = $state('192.168.10.37/26');
  const result = $derived(subnet(input));
  const ok = $derived(typeof result !== 'string' ? result : null);

  const rows = $derived(ok ? [
    ['Network address', ok.network],
    ['Broadcast address', ok.broadcast],
    ['Subnet mask', `${ok.mask} (/${ok.prefix})`],
    ['Wildcard mask', ok.wildcard],
    ['First usable host', ok.firstHost],
    ['Last usable host', ok.lastHost],
    ['Usable hosts', ok.usableHosts.toLocaleString('en-US')],
    ['Address type', `${ok.scope}, class ${ok.ipClass}`]
  ] : []);

  function setPrefix(event: Event) {
    if (!ok) return;
    input = `${ok.ip}/${(event.currentTarget as HTMLInputElement).value}`;
  }

  const examples = ['192.168.1.130/25', '10.0.0.1/8', '172.16.5.4 255.255.240.0', '200.10.20.33/30'];
</script>

<div class="tool subnet-tool">
  <div class="tool-controls">
    <label for="subnet-input">IPv4 address with a prefix or mask</label>
    <input id="subnet-input" class="mono-input" bind:value={input} spellcheck="false" autocomplete="off" placeholder="192.168.1.10/24"/>
    <div class="example-row">
      <span>Try</span>
      {#each examples as example}<button type="button" onclick={() => input = example}>{example}</button>{/each}
    </div>
    {#if ok}
      <label class="range-label" for="prefix-range">Prefix length <b>/{ok.prefix}</b> <span>{ok.totalAddresses.toLocaleString('en-US')} addresses in this block</span></label>
      <input id="prefix-range" type="range" min="0" max="32" value={ok.prefix} oninput={setPrefix}/>
    {/if}
  </div>

  <div class="tool-visual subnet-visual" aria-live="polite">
    {#if ok}
      <div class="bit-strip" role="img" aria-label={`${ok.prefix} network bits followed by ${32 - ok.prefix} host bits`}>
        {#each ok.ipBits.split('') as bit, i}
          <span class="bit" class:net={i < ok.prefix} class:octet-end={i % 8 === 7 && i !== 31}>{bit}</span>
        {/each}
      </div>
      <p class="bit-legend"><span class="key net"></span> Network bits <span class="key"></span> Host bits</p>
      <dl class="result-grid">
        {#each rows as [label, value]}
          <div>
            <dt>{label}</dt>
            <dd><button type="button" class="copyable" onclick={() => copyText(value, `${label} copied`)} title="Copy">{value}</button></dd>
          </div>
        {/each}
      </dl>
    {:else}
      <p class="tool-message warn" role="status">{result}</p>
    {/if}
  </div>
</div>
