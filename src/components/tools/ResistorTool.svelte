<script lang="ts">
  import {
    digitColors, multiplierColors, toleranceColors, colorByName,
    bandsToOhms, formatOhms, parseOhms, ohmsToBands
  } from '../../lib/eng';

  let bandCount = $state<4 | 5>(4);
  let digits = $state(['Yellow', 'Violet', 'Black']);
  let multiplier = $state('Red');
  let tolerance = $state('Gold');
  let valueInput = $state('');
  let message = $state('');

  const significant = $derived(bandCount === 4 ? digits.slice(0, 2) : digits);
  const ohms = $derived(bandsToOhms(significant, multiplier));
  const tol = $derived(colorByName(tolerance).tol ?? 0);
  const bands = $derived([...significant, multiplier, tolerance].map(colorByName));
  const bandX = $derived(bandCount === 4 ? [168, 208, 248, 352] : [158, 192, 226, 260, 352]);
  const ordinal = ['1st digit', '2nd digit', '3rd digit'];

  const multiplierNames: Record<number, string> = {
    [-2]: '0.01', [-1]: '0.1', 0: '1', 1: '10', 2: '100', 3: '1k', 4: '10k', 5: '100k', 6: '1M', 7: '10M', 8: '100M', 9: '1G'
  };

  function multiplierLabel(exp: number) {
    return '×' + multiplierNames[exp];
  }

  function setBandCount(count: 4 | 5) {
    if (count === bandCount) return;
    const current = ohms;
    bandCount = count;
    const result = ohmsToBands(current, count === 4 ? 2 : 3);
    if (typeof result === 'string') {
      message = `${formatOhms(current)} can’t be shown with ${count} bands, so the digits were kept as they are.`;
      return;
    }
    message = '';
    digits = count === 4 ? [...result.digits, digits[2]] : result.digits;
    multiplier = result.multiplier;
  }

  function findBands(event: SubmitEvent) {
    event.preventDefault();
    const value = parseOhms(valueInput);
    if (value === null) { message = 'Enter a value like 220, 4.7k, 4k7, or 1M.'; return; }
    const result = ohmsToBands(value, bandCount === 4 ? 2 : 3);
    if (typeof result === 'string') { message = result; return; }
    message = `Showing the bands for ${formatOhms(value)}.`;
    digits = bandCount === 4 ? [...result.digits, digits[2]] : result.digits;
    multiplier = result.multiplier;
  }
</script>

<div class="tool resistor-tool">
  <div class="tool-visual">
    <svg viewBox="0 0 520 120" role="img" aria-label={`Resistor with ${bands.map(b => b.name).join(', ')} bands`}>
      <defs>
        <linearGradient id="resistor-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#e9d3a3"/>
          <stop offset="0.45" stop-color="#d4b67c"/>
          <stop offset="1" stop-color="#9c8150"/>
        </linearGradient>
        <linearGradient id="resistor-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity=".35"/>
          <stop offset=".35" stop-color="#fff" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".25"/>
        </linearGradient>
        <clipPath id="resistor-clip">
          <path d="M118 34 Q118 24 132 24 L176 24 Q186 34 200 34 L320 34 Q334 34 344 24 L388 24 Q402 24 402 34 L402 86 Q402 96 388 96 L344 96 Q334 86 320 86 L200 86 Q186 86 176 96 L132 96 Q118 96 118 86 Z"/>
        </clipPath>
      </defs>
      <line class="lead" x1="0" y1="60" x2="122" y2="60"/>
      <line class="lead" x1="398" y1="60" x2="520" y2="60"/>
      <g clip-path="url(#resistor-clip)">
        <rect x="110" y="20" width="300" height="80" fill="url(#resistor-body)"/>
        {#each bands as band, i}
          <rect class="band" x={bandX[i]} y="20" width="20" height="80" fill={band.hex}/>
        {/each}
        <rect x="110" y="20" width="300" height="80" fill="url(#resistor-shine)"/>
      </g>
    </svg>
    <div class="readout" aria-live="polite">
      <span class="readout-value">{formatOhms(ohms)}</span>
      <span class="readout-sub">±{tol}%, so anywhere from {formatOhms(ohms * (1 - tol / 100))} to {formatOhms(ohms * (1 + tol / 100))}</span>
    </div>
  </div>

  <div class="tool-controls">
    <div class="segmented" role="group" aria-label="Number of bands">
      <button aria-pressed={bandCount === 4} onclick={() => setBandCount(4)}>4 bands</button>
      <button aria-pressed={bandCount === 5} onclick={() => setBandCount(5)}>5 bands</button>
    </div>

    {#each { length: bandCount === 4 ? 2 : 3 } as _, i}
      <fieldset class="swatch-row">
        <legend>{ordinal[i]} <b>{digits[i]} ({colorByName(digits[i]).digit})</b></legend>
        <div class="swatches">
          {#each digitColors as color}
            <label class="swatch" style:--swatch={color.hex} title={`${color.name} = ${color.digit}`}>
              <input type="radio" name={'digit-' + i} value={color.name} bind:group={digits[i]}/>
              <span class="sr-only">{color.name}, {color.digit}</span>
            </label>
          {/each}
        </div>
      </fieldset>
    {/each}

    <fieldset class="swatch-row">
      <legend>Multiplier <b>{multiplier} ({multiplierLabel(colorByName(multiplier).exp ?? 0)})</b></legend>
      <div class="swatches">
        {#each multiplierColors as color}
          <label class="swatch" style:--swatch={color.hex} title={`${color.name} = ${multiplierLabel(color.exp ?? 0)}`}>
            <input type="radio" name="multiplier" value={color.name} bind:group={multiplier}/>
            <span class="sr-only">{color.name}, {multiplierLabel(color.exp ?? 0)}</span>
          </label>
        {/each}
      </div>
    </fieldset>

    <fieldset class="swatch-row">
      <legend>Tolerance <b>{tolerance} (±{tol}%)</b></legend>
      <div class="swatches">
        {#each toleranceColors as color}
          <label class="swatch" style:--swatch={color.hex} title={`${color.name} = ±${color.tol}%`}>
            <input type="radio" name="tolerance" value={color.name} bind:group={tolerance}/>
            <span class="sr-only">{color.name}, plus or minus {color.tol} percent</span>
          </label>
        {/each}
      </div>
    </fieldset>

    <form class="inline-form" onsubmit={findBands}>
      <label for="resistor-value">Know the value? Find its bands</label>
      <div class="inline-input">
        <input id="resistor-value" bind:value={valueInput} placeholder="4.7k, 220, 1M" autocomplete="off" spellcheck="false"/>
        <button class="button secondary" type="submit">Show bands</button>
      </div>
    </form>
    {#if message}<p class="tool-message" role="status">{message}</p>{/if}
  </div>
</div>
