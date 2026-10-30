<script lang="ts">
  import { solveOhm, parseOhms, si, formatOhms, type OhmTarget } from '../../lib/eng';

  let target = $state<OhmTarget>('R');
  let voltage = $state('5');
  let current = $state('20');
  let resistance = $state('250');

  const targets: { id: OhmTarget; label: string; formula: string }[] = [
    { id: 'V', label: 'Voltage', formula: 'V = I × R' },
    { id: 'I', label: 'Current', formula: 'I = V ÷ R' },
    { id: 'R', label: 'Resistance', formula: 'R = V ÷ I' }
  ];

  const result = $derived.by(() => {
    const V = Number(voltage);
    const I = Number(current) / 1000;
    const R = parseOhms(resistance);
    if (target !== 'V' && (voltage.trim() === '' || !Number.isFinite(V))) return 'Enter the voltage in volts.';
    if (target !== 'I' && (current.trim() === '' || !Number.isFinite(I))) return 'Enter the current in milliamps.';
    if (target !== 'R' && (R === null || !Number.isFinite(R))) return 'Enter the resistance, like 220 or 4.7k.';
    if (target === 'I' && R === 0) return 'Resistance can’t be zero when solving for current.';
    if (target === 'R' && I === 0) return 'Current can’t be zero when solving for resistance.';
    return solveOhm(target, V, I, R ?? 0);
  });

  const working = $derived.by(() => {
    if (typeof result === 'string') return '';
    if (target === 'V') return `${si(result.I, 'A')} × ${formatOhms(result.R)} = ${si(result.V, 'V')}`;
    if (target === 'I') return `${si(result.V, 'V')} ÷ ${formatOhms(result.R)} = ${si(result.I, 'A')}`;
    return `${si(result.V, 'V')} ÷ ${si(result.I, 'A')} = ${formatOhms(result.R)}`;
  });
</script>

<div class="tool ohm-tool">
  <div class="tool-visual ohm-visual">
    <div class="ohm-triangle" aria-hidden="true">
      <span class:solve={target === 'V'} class="tri-v">V</span>
      <span class:solve={target === 'I'} class="tri-i">I</span>
      <span class:solve={target === 'R'} class="tri-r">R</span>
    </div>
    <div class="readout" aria-live="polite">
      {#if typeof result === 'string'}
        <span class="readout-sub">{result}</span>
      {:else}
        <span class="readout-value">{target === 'V' ? si(result.V, 'V') : target === 'I' ? si(result.I, 'A') : formatOhms(result.R)}</span>
        <span class="readout-sub">{working}</span>
        <span class="readout-sub">Power dissipated: <b>{si(result.P, 'W')}</b></span>
      {/if}
    </div>
  </div>

  <div class="tool-controls">
    <div class="segmented" role="group" aria-label="Solve for">
      {#each targets as t}
        <button aria-pressed={target === t.id} onclick={() => target = t.id}>Solve {t.label.toLowerCase()}</button>
      {/each}
    </div>
    <p class="formula">{targets.find(t => t.id === target)?.formula}</p>
    <div class="field-grid">
      <label class:computed={target === 'V'}>Voltage (V)
        <input inputmode="decimal" bind:value={voltage} disabled={target === 'V'} placeholder="5"/>
      </label>
      <label class:computed={target === 'I'}>Current (mA)
        <input inputmode="decimal" bind:value={current} disabled={target === 'I'} placeholder="20"/>
      </label>
      <label class:computed={target === 'R'}>Resistance (Ω)
        <input bind:value={resistance} disabled={target === 'R'} placeholder="220 or 4.7k" spellcheck="false"/>
      </label>
    </div>
    <p class="tool-hint">Resistance accepts shorthand like 4.7k or 4k7. The field you’re solving for is ignored.</p>
  </div>
</div>
