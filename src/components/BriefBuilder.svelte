<script lang="ts">
  import { ArrowRight, Copy, Printer, RotateCcw } from '@lucide/svelte';
  import { onMount } from 'svelte';
  import { services, otherService, stages, helpTypes, timelines } from '../lib/content';
  import { brief, openCommission, copyText, toast, prefersReducedMotion } from '../lib/ui.svelte';
  import { makeTicketRef } from '../lib/eng';

  const STORAGE_KEY = 'eoq-brief';
  const serviceOptions = [...services.map(s => s.title), otherService];
  const questions = [
    { key: 'service', name: 'brief-service', label: 'What do you need help with?', options: serviceOptions },
    { key: 'stage', name: 'brief-stage', label: 'Where is the project right now?', options: stages },
    { key: 'help', name: 'brief-help', label: 'What kind of help do you want?', options: helpTypes },
    { key: 'timeline', name: 'brief-timeline', label: 'When do you need it?', options: timelines }
  ] as const;

  let printing = $state(false);
  let dispenserEl = $state<HTMLElement>();
  let ready = false;

  const printed = $derived(Boolean(brief.ref));
  const answered = $derived(questions.filter(q => brief[q.key]).length);
  const complete = $derived(answered === questions.length);
  const barcode = $derived(makeBars(brief.ref || 'EOQ-PREVIEW'));
  const briefText = $derived([
    `Ticket: ${brief.ref || 'not printed'}`,
    `Service: ${brief.service || 'not chosen'}`,
    `Project stage: ${brief.stage || 'not chosen'}`,
    `Help wanted: ${brief.help || 'not chosen'}`,
    `Timeline: ${brief.timeline || 'not chosen'}`,
    `Budget: ${brief.budget.trim() || 'not shared yet'}`,
    '',
    'Details:',
    brief.summary.trim()
  ].join('\n'));

  onMount(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (saved && typeof saved === 'object') {
        for (const key of Object.keys(brief) as (keyof typeof brief)[]) {
          if (typeof saved[key] === 'string' && !brief[key]) brief[key] = saved[key];
        }
      }
    } catch {
      // Storage can be unavailable in private modes; the builder still works without it.
    }
    ready = true;
  });

  $effect(() => {
    const snapshot = JSON.stringify(brief);
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, snapshot); } catch { /* ignore */ }
  });

  function stamp() {
    return new Intl.DateTimeFormat('en-PH', { timeZone: 'Asia/Manila', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date());
  }

  function makeBars(seed: string) {
    const bars: number[] = [];
    for (const char of seed) {
      const code = char.charCodeAt(0);
      bars.push(1 + (code % 3), 1 + ((code >> 2) % 2), 1 + ((code >> 3) % 3), 1);
    }
    return bars;
  }

  function print(event: SubmitEvent) {
    event.preventDefault();
    if (!complete) return;
    if (!brief.ref) brief.ref = makeTicketRef();
    brief.printedAt = stamp();
    printing = true;
    const reduced = prefersReducedMotion();
    setTimeout(() => printing = false, reduced ? 0 : 1200);
    // On narrow screens the ticket sits below the form, so bring it into view.
    if (window.matchMedia('(max-width: 1040px)').matches) {
      dispenserEl?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }
  }

  function send() {
    openCommission({ service: brief.service, details: briefText, ticketRef: brief.ref });
  }

  function reset() {
    for (const key of Object.keys(brief) as (keyof typeof brief)[]) brief[key] = '';
    toast('Brief cleared. Start a new one whenever you’re ready.');
  }
</script>

<section id="request" class="section request" aria-labelledby="request-title">
  <div class="section-top">
    <h2 id="request-title">Take a number.<br/><span>We’ll take it from there.</span></h2>
    <p>Answer four quick questions and print a ticket. It goes straight into your request, so we can reply with the right questions the first time.</p>
  </div>

  <div class="request-layout">
    <form class="brief-form" onsubmit={print} aria-describedby="brief-status">
      {#each questions as question, qi}
        <fieldset class="brief-question" class:answered={Boolean(brief[question.key])}>
          <legend><span class="q-index">{qi + 1}</span>{question.label}</legend>
          <div class="chips">
            {#each question.options as option}
              <label class="chip">
                <input type="radio" name={question.name} value={option} bind:group={brief[question.key]}/>
                <span>{option}</span>
              </label>
            {/each}
          </div>
        </fieldset>
      {/each}

      <div class="brief-extras">
        <label>Budget <span class="optional">optional</span>
          <input bind:value={brief.budget} maxlength="80" placeholder="₱2,000, or not sure yet"/>
        </label>
        <label>What should it do? <span class="optional">optional</span>
          <textarea bind:value={brief.summary} rows="3" maxlength="1500" placeholder="A sentence or two is plenty. You can add more detail before sending."></textarea>
        </label>
      </div>

      <div class="brief-actions">
        <div id="brief-status" class="brief-progress" aria-live="polite">
          <span class="meter" aria-hidden="true"><span style:width={`${(answered / questions.length) * 100}%`}></span></span>
          {complete ? (printed ? 'Ticket printed. Send it when you’re ready.' : 'All set. Print your ticket.') : `${answered} of ${questions.length} answered`}
        </div>
        {#if !printed}
          <button type="submit" class="button primary" disabled={!complete}><Printer size={17}/> Print my ticket</button>
        {:else}
          <button type="button" class="button primary" onclick={send}>Send ticket to the team <ArrowRight size={17}/></button>
          <button type="button" class="button secondary" onclick={() => copyText(briefText, 'Brief copied to clipboard')}><Copy size={16}/> Copy brief</button>
        {/if}
        <button type="button" class="text-link reset-link" onclick={reset}><RotateCcw size={15}/> Start over</button>
      </div>
    </form>

    <div class="dispenser" role="group" aria-label="Ticket preview" bind:this={dispenserEl}>
      <div class="dispenser-head" aria-hidden="true">
        <span class="dispenser-light" class:on={printing}></span>
        <span>Queue ticket printer</span>
      </div>
      <div class="dispenser-slot" aria-hidden="true"></div>
      <div class="ticket-window">
        <article class="ticket" class:printed class:printing>
          <header class="ticket-head">
            <span class="ticket-brand">engineers on queue.</span>
            <span class="ticket-kind">{printed ? 'Ticket' : 'Preview'}</span>
          </header>
          <p class="ticket-ref">{brief.ref || 'EOQ-????'}</p>
          <dl>
            <div><dt>Service</dt><dd>{#if brief.service}{brief.service}{:else}<span class="blank"></span>{/if}</dd></div>
            <div><dt>Stage</dt><dd>{#if brief.stage}{brief.stage}{:else}<span class="blank"></span>{/if}</dd></div>
            <div><dt>Help</dt><dd>{#if brief.help}{brief.help}{:else}<span class="blank"></span>{/if}</dd></div>
            <div><dt>Timeline</dt><dd>{#if brief.timeline}{brief.timeline}{:else}<span class="blank"></span>{/if}</dd></div>
            {#if brief.budget.trim()}<div><dt>Budget</dt><dd>{brief.budget.trim()}</dd></div>{/if}
          </dl>
          {#if brief.summary.trim()}<p class="ticket-summary">“{brief.summary.trim()}”</p>{/if}
          <div class="ticket-barcode" aria-hidden="true">
            {#each barcode as width, i}<span style:width={`${width * 2}px`} class:gap={i % 2 === 1}></span>{/each}
          </div>
          <p class="ticket-foot">{printed ? `Printed ${brief.printedAt}, Manila time` : 'Answer the questions to fill this in'}</p>
        </article>
      </div>
    </div>
  </div>
</section>
