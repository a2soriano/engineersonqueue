<script lang="ts">
  import { ArrowRight, ArrowUpRight, Check, Ticket, X } from '@lucide/svelte';
  import { fade, fly } from 'svelte/transition';
  import { commissionEmail, web3formsAccessKey } from '../lib/contact';
  import { services, otherService } from '../lib/content';
  import { trapFocus } from '../lib/actions';
  import { ui, prefersReducedMotion } from '../lib/ui.svelte';
  import { form, status, sendCommission, newCommission, saveDraft } from '../lib/commission.svelte';

  const reduced = prefersReducedMotion();
  const MAX_DETAILS = 5000;

  if (ui.prefill) {
    form.details = ui.prefill;
    ui.prefill = '';
  }

  $effect(() => {
    // Reading every field registers it, so any edit saves the draft.
    void [form.name, form.email, form.otherContact, form.details, ui.projectType];
    saveDraft();
  });

  function close() { ui.modalOpen = false; }

  function submit(event: SubmitEvent) {
    event.preventDefault();
    void sendCommission();
  }
</script>

<div class="modal-backdrop" role="presentation" transition:fade={{ duration: reduced ? 0 : 160 }} onclick={e => { if (e.target === e.currentTarget) close(); }}>
  <div use:trapFocus class="modal" role="dialog" aria-modal="true" aria-labelledby="commission-title" tabindex="-1" in:fly={{ y: reduced ? 0 : 18, duration: reduced ? 0 : 240 }}>
    <button class="modal-close" aria-label="Close commission request" onclick={close}><X/></button>
    <h2 id="commission-title">{status.submitted ? 'Your idea is in the queue.' : 'Send a commission request.'}</h2>

    {#if status.submitted}
      <div class="submission-success" role="status"><span class="success-mark"><Check size={22}/></span><p>Your request was submitted. We’ll review your project and reply to the email address you provided.</p></div>
      <p class="modal-copy">Sending a request doesn’t confirm a booking. We’ll discuss the scope, timeline, and quote with you first.</p>
      <button class="button primary" onclick={newCommission}>Send another request <ArrowRight size={17}/></button>
    {:else}
      <p class="modal-copy">Leave your contact details and tell us what you need. Your request is emailed to our team so we can get back to you. Your draft is saved on this device until you send it.</p>

      {#if ui.ticketRef}
        <div class="ticket-chip"><Ticket size={16}/> Ticket <b>{ui.ticketRef}</b> is attached to this request <button type="button" aria-label="Detach ticket" onclick={() => ui.ticketRef = ''}><X size={14}/></button></div>
      {/if}
      {#if !web3formsAccessKey}<div class="submission-notice" role="status"><strong>Online requests are not enabled yet.</strong><p>You can still send your project details directly to <a href={'mailto:' + commissionEmail}>{commissionEmail}</a>.</p></div>{/if}
      {#if status.sending}<div class="submission-pending" role="status" aria-live="polite"><span class="sending-spinner" aria-hidden="true"></span><p>{status.sendingSlow ? 'Still waiting for confirmation. Please keep this tab open and don’t submit again.' : 'Sending your request… Please keep this tab open.'}</p></div>{/if}
      {#if status.deliveryUnconfirmed}<div class="submission-notice" role="status"><strong>Delivery not confirmed</strong><p>Your request may already have arrived. To avoid duplicates, please check with our team before sending it again.</p><a href={'mailto:' + commissionEmail}>Contact {commissionEmail} <ArrowUpRight size={14}/></a></div>{/if}

      <form onsubmit={submit} aria-busy={status.sending}>
        <fieldset disabled={status.sending}>
          <div class="form-row">
            <label>Your name<input name="name" bind:value={form.name} required placeholder="How should we call you?" maxlength="100" autocomplete="name"/></label>
            <label>Your email<input name="email" type="email" bind:value={form.email} required maxlength="254" placeholder="you@example.com" autocomplete="email" aria-describedby="client-email-help"/></label>
          </div>
          <p id="client-email-help" class="field-hint">We’ll use this address to reply about your project.</p>
          <label>Other contact <span class="optional">optional</span><input name="other_contact" bind:value={form.otherContact} maxlength="200" placeholder="Phone number, Messenger link, or Discord username"/></label>
          <label>What do you need?
            <select name="service" bind:value={ui.projectType}>
              {#each services as service}<option>{service.title}</option>{/each}
              <option>{otherService}</option>
            </select>
          </label>
          <label>Tell us about your project
            <textarea name="message" bind:value={form.details} required minlength="20" maxlength={MAX_DETAILS} rows="7" placeholder="Your idea, requirements, timeline, and budget if you have one…" aria-describedby="details-count"></textarea>
          </label>
          <p id="details-count" class="field-hint counter" class:short={form.details.trim().length < 20}>
            {form.details.trim().length < 20 ? `${20 - form.details.trim().length} more characters needed` : `${form.details.length.toLocaleString('en-US')} / ${MAX_DETAILS.toLocaleString('en-US')}`}
          </p>
          <div class="form-honeypot" aria-hidden="true"><label>Leave this field empty<input type="checkbox" name="botcheck" bind:checked={form.honeypot} tabindex="-1" autocomplete="off"/></label></div>
          <p class="form-disclosure">By sending, you agree to share these details with Engineers on Queue through <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer">Web3Forms</a> to handle your inquiry.</p>
          <button class="button primary submit-button" type="submit" disabled={status.sending || status.deliveryUnconfirmed || !web3formsAccessKey}>{status.sending ? 'Sending request…' : 'Send commission request'} <ArrowRight size={17}/></button>
        </fieldset>
        {#if status.error}<div class="submission-error" role="alert"><p>{status.error}</p><a href={'mailto:' + commissionEmail}>Email {commissionEmail} <ArrowUpRight size={14}/></a></div>{/if}
      </form>
    {/if}
  </div>
</div>
