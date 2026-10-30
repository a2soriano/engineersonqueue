import { services } from './content';

/** App-wide UI state shared between sections, the commission dialog, and the terminal. */
export const ui = $state({
  modalOpen: false,
  terminalOpen: false,
  projectType: services[0].title,
  /** Structured brief handed from the brief builder to the commission form. */
  prefill: '',
  ticketRef: ''
});

/** Answers from the brief builder. Services and the terminal can pre-select a service. */
export const brief = $state({
  service: '',
  stage: '',
  help: '',
  timeline: '',
  budget: '',
  summary: '',
  ref: '',
  printedAt: ''
});

/** Which workbench tool is open, so the terminal can jump straight to one. */
export const workbench = $state({ tool: 'resistor' });

export function openCommission(options: { service?: string; details?: string; ticketRef?: string } = {}) {
  if (options.service) ui.projectType = options.service;
  if (options.details !== undefined) ui.prefill = options.details;
  if (options.ticketRef !== undefined) ui.ticketRef = options.ticketRef;
  ui.terminalOpen = false;
  ui.modalOpen = true;
}

export type Toast = { id: number; text: string };
export const toasts = $state<Toast[]>([]);
let toastId = 0;

export function toast(text: string) {
  const id = ++toastId;
  toasts.push({ id, text });
  setTimeout(() => {
    const index = toasts.findIndex(t => t.id === id);
    if (index !== -1) toasts.splice(index, 1);
  }, 2800);
}

export async function copyText(text: string, message = 'Copied to clipboard') {
  try {
    await navigator.clipboard.writeText(text);
    toast(message);
    return true;
  } catch {
    toast('Copy is blocked in this browser. Select the text and copy it manually.');
    return false;
  }
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
