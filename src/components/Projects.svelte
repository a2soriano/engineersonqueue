<script lang="ts">
  import { ArrowRight } from '@lucide/svelte';
  import { inView } from '../lib/actions';
  import { scrollToSection } from '../lib/ui.svelte';
</script>

<section id="projects" class="section projects" aria-labelledby="projects-title">
  <div class="section-top">
    <h2 id="projects-title">Great work starts<br/><span>with a first project.</span></h2>
    <p>No borrowed case studies. No made-up results. Just a new collective ready to make its mark.</p>
  </div>

  <div class="project-slot">
    <div class="project-art" use:inView>
      <svg viewBox="0 0 320 240" class="blueprint" aria-hidden="true">
        <rect class="bp-frame" x="20" y="20" width="280" height="200" rx="4"/>
        <path class="bp-line" pathLength="1" d="M60 120 H112 M208 120 H260 M160 72 V40 M160 168 V200"/>
        <rect class="bp-line" pathLength="1" x="112" y="72" width="96" height="96" rx="12"/>
        <rect class="bp-line" pathLength="1" x="128" y="88" width="64" height="64" rx="6"/>
        <g class="bp-pins">
          {#each [0, 1, 2, 3, 4] as p}
            <path class="bp-line" pathLength="1" d={`M${124 + p * 18} 72 V62 M${124 + p * 18} 168 V178 M112 ${84 + p * 18} H102 M208 ${84 + p * 18} H218`}/>
          {/each}
        </g>
        <circle class="bp-node" cx="60" cy="120" r="5"/><circle class="bp-node" cx="260" cy="120" r="5"/>
        <circle class="bp-node" cx="160" cy="40" r="5"/><circle class="bp-node" cx="160" cy="200" r="5"/>
        <text x="34" y="210" class="bp-text">PROJECT_001</text>
        <text x="236" y="40" class="bp-text">SLOT OPEN</text>
      </svg>
    </div>
    <div class="project-copy">
      <p class="pill"><span class="live-dot" aria-hidden="true"></span> Slot 001 is open</p>
      <h3>Your idea could be our first feature.</h3>
      <p>Our portfolio is a blank canvas. Help us fill it with something worth building, and be part of our story from day one. We’ll only publish your project here with your permission.</p>
      <button class="text-link" onclick={() => scrollToSection('request')}>Build something with us <ArrowRight size={17}/></button>
    </div>
  </div>
</section>
