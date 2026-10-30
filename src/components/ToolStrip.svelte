<script lang="ts">
  import { tools } from '../lib/content';
</script>

<section class="tool-strip" aria-label="Tools and topics we work with">
  <p>The tools behind the ideas</p>
  <div class="marquee">
    <ul class="marquee-track">
      {#each tools as tool}<li>{tool}</li>{/each}
    </ul>
    <ul class="marquee-track" aria-hidden="true">
      {#each tools as tool}<li>{tool}</li>{/each}
    </ul>
  </div>
</section>
