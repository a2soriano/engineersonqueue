<script lang="ts">
  import { ledResistor, ohmsToBands, colorByName, formatOhms, si } from '../../lib/eng';

  const presets = [
    { name: 'Red', vf: 2.0, hex: '#ff4b3e' },
    { name: 'Yellow', vf: 2.1, hex: '#ffd23f' },
    { name: 'Green', vf: 2.2, hex: '#5bd96b' },
    { name: 'Blue', vf: 3.2, hex: '#4b8dff' },
    { name: 'White', vf: 3.2, hex: '#f4f6ff' }
  ];

  let supply = $state('5');
  let forward = $state('2.0');
  let currentMa = $state('15');
  let ledColor = $state('#ff4b3e');

  const result = $derived(ledResistor(Number(supply), Number(forward), Number(currentMa)));
  const bands = $derived.by(() => {
    if (!result || !result.ok) return null;
    const b = ohmsToBands(result.standard, 2);
    return typeof b === 'string' ? null : [...b.digits, b.multiplier, 'Gold'].map(colorByName);
  });
  const brightness = $derived(Math.min(1, Math.max(0.15, Number(currentMa) / 20)));

  function choose(preset: (typeof presets)[number]) {
    forward = preset.vf.toFixed(1);
    ledColor = preset.hex;
  }
</script>

<div class="tool led-tool">
  <div class="tool-visual led-visual">
    <svg viewBox="0 0 240 150" aria-hidden="true" class="led-svg" style:--led={ledColor} style:--glow={brightness}>
      <defs>
        <radialGradient id="led-glow-gradient">
          <stop offset="0" class="led-glow-stop" stop-opacity=".9"/>
          <stop offset="1" class="led-glow-stop" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle class="led-glow" cx="70" cy="58" r="58" fill="url(#led-glow-gradient)"/>
      <path class="led-lens" d="M48 82 L48 52 A22 22 0 0 1 92 52 L92 82 Z"/>
      <rect class="led-rim" x="42" y="80" width="56" height="8" rx="2"/>
      <line class="led-leg" x1="60" y1="88" x2="60" y2="138"/>
      <line class="led-leg" x1="80" y1="88" x2="80" y2="128"/>
      {#if bands}
        <line class="led-leg" x1="80" y1="128" x2="128" y2="128"/>
        <rect x="128" y="117" width="62" height="22" rx="9" fill="#d4b67c"/>
        {#each bands as band, i}<rect x={138 + i * 10 + (i === 3 ? 8 : 0)} y="117" width="6" height="22" fill={band.hex}/>{/each}
        <line class="led-leg" x1="190" y1="128" x2="232" y2="128"/>
      {/if}
    </svg>
    <div class="readout" aria-live="polite">
      {#if !result}
        <span class="readout-sub">Enter the supply voltage, LED forward voltage, and current.</span>
      {:else if !result.ok}
        <span class="readout-sub warn">{result.error}</span>
      {:else}
        <span class="readout-value">{formatOhms(result.standard)}</span>
        <span class="readout-sub">Exact value {formatOhms(result.exact)}, rounded up to the next standard E12 resistor.</span>
        <span class="readout-sub">Actual current {si(result.actualCurrent, 'A')}, dissipating {si(result.power, 'W')}. A <b>{result.rating}</b> resistor is plenty.</span>
      {/if}
    </div>
  </div>

  <div class="tool-controls">
    <fieldset class="preset-row">
      <legend>LED color</legend>
      <div class="presets">
        {#each presets as preset}
          <button type="button" class="preset" aria-pressed={ledColor === preset.hex} onclick={() => choose(preset)} style:--swatch={preset.hex}>
            <span class="preset-dot" aria-hidden="true"></span>{preset.name} <small>{preset.vf.toFixed(1)} V</small>
          </button>
        {/each}
      </div>
    </fieldset>
    <div class="field-grid">
      <label>Supply voltage (V)<input inputmode="decimal" bind:value={supply}/></label>
      <label>LED forward voltage (V)<input inputmode="decimal" bind:value={forward}/></label>
      <label>LED current (mA)<input inputmode="decimal" bind:value={currentMa}/></label>
    </div>
    <p class="tool-hint">Forward voltages are typical values. Check your LED’s datasheet, and keep standard 5 mm LEDs at 20 mA or less.</p>
  </div>
</div>
