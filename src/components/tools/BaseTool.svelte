<script lang="ts">
  import { parseInBase, describeNumber, type Base } from '../../lib/eng';
  import { copyText } from '../../lib/ui.svelte';

  const bases: { id: Base; label: string }[] = [
    { id: 10, label: 'Decimal' },
    { id: 16, label: 'Hex' },
    { id: 2, label: 'Binary' },
    { id: 8, label: 'Octal' }
  ];

  let base = $state<Base>(10);
  let input = $state('2026');

  const parsed = $derived(parseInBase(input, base));
  const value = $derived(typeof parsed === 'number' ? parsed : null);
  const info = $derived(value === null ? null : describeNumber(value));
  const bits = $derived(value === null ? [] : value.toString(2).padStart(32, '0').split(''));

  function write(n: number) {
    input = base === 10 ? String(n) : base === 16 ? n.toString(16).toUpperCase() : base === 2 ? n.toString(2) : n.toString(8);
  }

  function changeBase(next: Base) {
    if (value !== null) {
      base = next;
      write(value);
    } else base = next;
  }

  function toggle(index: number) {
    if (value === null) return;
    const bit = 31 - index;
    write((value ^ (1 << bit)) >>> 0);
  }
</script>

<div class="tool base-tool">
  <div class="tool-controls">
    <div class="segmented" role="group" aria-label="Input base">
      {#each bases as b}<button aria-pressed={base === b.id} onclick={() => changeBase(b.id)}>{b.label}</button>{/each}
    </div>
    <label for="base-input">Number in {bases.find(b => b.id === base)?.label.toLowerCase()}</label>
    <input id="base-input" class="mono-input" bind:value={input} spellcheck="false" autocomplete="off"/>
    <p class="tool-hint">Prefixes like 0x, 0b, and 0o switch the base automatically. Negative decimals are shown as 32-bit two’s complement.</p>
    {#if typeof parsed === 'string'}<p class="tool-message warn" role="status">{parsed}</p>{/if}
  </div>

  <div class="tool-visual base-visual">
    {#if info}
      <dl class="result-grid base-results">
        {#each [['Decimal', info.dec], ['Hexadecimal', info.hex], ['Binary', info.bin], ['Octal', info.oct], ['Signed 32-bit', info.signed], ['ASCII character', info.ascii ?? 'not printable']] as [label, text]}
          <div><dt>{label}</dt><dd><button type="button" class="copyable" onclick={() => copyText(text, `${label} copied`)} title="Copy">{text}</button></dd></div>
        {/each}
      </dl>
      <p class="bit-caption">Click any bit to flip it</p>
      <div class="bit-board">
        {#each bits as bit, i}
          <button type="button" class="bit-toggle" class:on={bit === '1'} class:byte-end={i % 8 === 7 && i !== 31} aria-label={`Bit ${31 - i}, currently ${bit}`} aria-pressed={bit === '1'} onclick={() => toggle(i)}>{bit}</button>
        {/each}
      </div>
    {/if}
  </div>
</div>
