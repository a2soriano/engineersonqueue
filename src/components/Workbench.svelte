<script lang="ts">
  import ResistorTool from './tools/ResistorTool.svelte';
  import OhmTool from './tools/OhmTool.svelte';
  import LedTool from './tools/LedTool.svelte';
  import SubnetTool from './tools/SubnetTool.svelte';
  import BaseTool from './tools/BaseTool.svelte';
  import { onTabKeydown } from '../lib/actions';
  import { workbench } from '../lib/ui.svelte';

  const tabs = [
    { id: 'resistor', label: 'Resistor color code', hint: 'Electronics', component: ResistorTool },
    { id: 'ohm', label: 'Ohm’s law', hint: 'Circuits', component: OhmTool },
    { id: 'led', label: 'LED resistor', hint: 'Arduino', component: LedTool },
    { id: 'subnet', label: 'Subnet calculator', hint: 'Networking', component: SubnetTool },
    { id: 'base', label: 'Number bases', hint: 'Programming', component: BaseTool }
  ];

  const index = $derived(Math.max(0, tabs.findIndex(t => t.id === workbench.tool)));
  const Current = $derived(tabs[index].component);
</script>

<section id="workbench" class="section workbench" aria-labelledby="workbench-title">
  <div class="section-top">
    <h2 id="workbench-title">The workbench.<br/><span>Free tools we use every week.</span></h2>
    <p>Quick calculators for class labs and side projects. They run in your browser and send nothing anywhere.</p>
  </div>

  <div class="bench">
    <div class="bench-tabs" role="tablist" aria-label="Workbench tools">
      {#each tabs as tab, i}
        <button
          id={'tool-tab-' + tab.id}
          role="tab"
          class="bench-tab"
          aria-selected={index === i}
          aria-controls="tool-panel"
          tabindex={index === i ? 0 : -1}
          onclick={() => workbench.tool = tab.id}
          onkeydown={e => onTabKeydown(e, i, tabs.length, n => workbench.tool = tabs[n].id)}
        >
          <span class="bench-tab-label">{tab.label}</span>
          <span class="bench-tab-hint">{tab.hint}</span>
        </button>
      {/each}
    </div>
    <div id="tool-panel" class="bench-panel" role="tabpanel" aria-labelledby={'tool-tab-' + tabs[index].id}>
      <Current/>
    </div>
  </div>
</section>
