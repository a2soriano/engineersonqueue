import { web3formsAccessKey } from './contact';
import { ui, brief } from './ui.svelte';

const DRAFT_KEY = 'eoq-commission-draft';

/** Form fields live outside the dialog so closing it never loses input or interrupts a send. */
export const form = $state({
  name: '',
  email: '',
  otherContact: '',
  details: '',
  honeypot: false
});

export const status = $state({
  sending: false,
  sendingSlow: false,
  submitted: false,
  deliveryUnconfirmed: false,
  error: ''
});

try {
  const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null');
  if (saved && typeof saved === 'object') {
    for (const key of ['name', 'email', 'otherContact', 'details'] as const) {
      if (typeof saved[key] === 'string') form[key] = saved[key];
    }
    if (typeof saved.projectType === 'string' && saved.projectType) ui.projectType = saved.projectType;
  }
} catch {
  // A missing or unreadable draft just means starting fresh.
}

export function saveDraft() {
  if (status.submitted) return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      name: form.name,
      email: form.email,
      otherContact: form.otherContact,
      details: form.details,
      projectType: ui.projectType
    }));
  } catch { /* storage unavailable */ }
}

export function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch { /* storage unavailable */ }
}

let slowTimer: ReturnType<typeof setTimeout> | undefined;
let requestTimer: ReturnType<typeof setTimeout> | undefined;
let controller: AbortController | undefined;

function clearTimers() {
  clearTimeout(slowTimer);
  clearTimeout(requestTimer);
}

export async function sendCommission() {
  if (status.sending || status.submitted || status.deliveryUnconfirmed) return;
  status.error = '';
  if (!web3formsAccessKey) {
    status.error = 'Online requests are not enabled yet. Please email the team directly.';
    return;
  }
  if (form.honeypot) {
    status.error = 'Please leave the website field empty and try again.';
    return;
  }
  status.sending = true;
  status.sendingSlow = false;
  controller = new AbortController();
  const signal = controller.signal;
  slowTimer = setTimeout(() => status.sendingSlow = true, 8000);
  requestTimer = setTimeout(() => controller?.abort(), 30000);
  const ref = ui.ticketRef;
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal,
      body: JSON.stringify({
        access_key: web3formsAccessKey,
        name: form.name.trim(),
        email: form.email.trim(),
        from_name: 'Engineers on Queue',
        subject: ref ? `New commission request (${ref}) | Engineers on Queue` : 'New commission request | Engineers on Queue',
        service: ui.projectType,
        ticket: ref || 'None',
        other_contact: form.otherContact.trim() || 'Not provided',
        message: form.details.trim(),
        botcheck: form.honeypot
      })
    });
    const result = await response.json();
    if (response.ok && result?.success === true) {
      status.submitted = true;
      clearDraft();
      for (const key of Object.keys(brief) as (keyof typeof brief)[]) brief[key] = '';
    } else if (result?.success === false && response.status < 500) {
      status.error = 'Your request was not accepted. Check your details and try again, or email the team directly.';
    } else {
      status.deliveryUnconfirmed = true;
    }
  } catch {
    // A lost reply or timeout does not prove the email failed to send.
    status.deliveryUnconfirmed = true;
  } finally {
    clearTimers();
    controller = undefined;
    status.sending = false;
    status.sendingSlow = false;
  }
}

export function newCommission() {
  status.submitted = false;
  status.error = '';
  status.deliveryUnconfirmed = false;
  form.name = '';
  form.email = '';
  form.otherContact = '';
  form.details = '';
  form.honeypot = false;
  ui.ticketRef = '';
  ui.prefill = '';
}
