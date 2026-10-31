<script lang="ts">
  import { X } from '@lucide/svelte';
  import { tick } from 'svelte';
  import { fly } from 'svelte/transition';
  import { trapFocus } from '../lib/actions';
  import { services, faqs, processSteps } from '../lib/content';
  import { commissionEmail } from '../lib/contact';
  import { ui, brief, workbench, openCommission, scrollToSection, copyText, prefersReducedMotion } from '../lib/ui.svelte';
  import { parseOhms, ohmsToBands, formatOhms, subnet, parseInBase, describeNumber, ledResistor, si } from '../lib/eng';

  type Line = { kind: 'in' | 'out' | 'err' | 'ok' | 'dim'; text: string };

  const reduced = prefersReducedMotion();
  const sections: Record<string, string> = {
    home: 'top', services: 'services', process: 'process', request: 'request', ticket: 'request',
    workbench: 'workbench', tools: 'workbench', projects: 'projects', work: 'projects', about: 'about', faq: 'faq'
  };
  const toolIds: Record<string, string> = { resistor: 'resistor', ohm: 'ohm', led: 'led', subnet: 'subnet', base: 'base', bases: 'base' };

  const help: [string, string][] = [
    ['help', 'show this list'],
    ['ls', 'list the sections of this site'],
    ['cd <section>', 'jump to a section, e.g. cd workbench'],
    ['services', 'what we work on'],
    ['process', 'how a request becomes a build'],
    ['faq [n]', 'list questions, or read answer n'],
    ['resistor <value>', 'color bands for a value, e.g. resistor 4.7k'],
    ['led <V> <Vf> <mA>', 'LED series resistor, e.g. led 5 2 20'],
    ['subnet <ip/prefix>', 'subnet details, e.g. subnet 10.0.4.9/22'],
    ['conv <number>', 'convert a number, e.g. conv 0xFF'],
    ['tool <name>', 'open a workbench tool (resistor, ohm, led, subnet, base)'],
    ['ticket', 'go to the brief builder'],
    ['request', 'open the commission form'],
    ['email', 'copy our email address'],
    ['date', 'current time in Manila'],
    ['history', 'commands you have run'],
    ['clear', 'clear the screen'],
    ['exit', 'close the terminal']
  ];
  const commandNames = ['help', 'ls', 'cd', 'services', 'process', 'faq', 'resistor', 'led', 'subnet', 'conv', 'tool', 'ticket', 'request', 'email', 'date', 'history', 'clear', 'exit', 'whoami', 'echo', 'sudo'];

  let lines = $state<Line[]>([
    { kind: 'ok', text: 'eoq shell 2.0, connected to the queue.' },
    { kind: 'dim', text: 'Type help to see what this terminal can do.' }
  ]);
  let value = $state('');
  let output = $state<HTMLDivElement>();
  let input = $state<HTMLInputElement>();
  const history: string[] = [];
  let historyIndex = -1;

  const print = (text: string, kind: Line['kind'] = 'out') => { lines.push({ kind, text }); };

  function go(id: string) {
    ui.terminalOpen = false;
    requestAnimationFrame(() => scrollToSection(id));
  }

  function run(raw: string) {
    const commandLine = raw.trim();
    print(`guest@eoq:~$ ${commandLine}`, 'in');
    if (!commandLine) return;
    history.push(commandLine);
    historyIndex = history.length;
    const [command, ...args] = commandLine.split(/\s+/);
    const arg = args.join(' ');

    switch (command.toLowerCase()) {
      case 'help':
        help.forEach(([cmd, text]) => print(`${cmd.padEnd(20)}${text}`));
        break;
      case 'ls':
        print('services/  process/  request/  workbench/  projects/  about/  faq/');
        break;
      case 'cd':
      case 'open': {
        const target = sections[(args[0] ?? '').replace(/\/$/, '').toLowerCase()];
        if (!args[0] || args[0] === '~') { go('top'); break; }
        if (!target) { print(`cd: no such section: ${args[0]}. Try ls.`, 'err'); break; }
        go(target);
        break;
      }
      case 'services':
        services.forEach(s => print(`${s.title.padEnd(28)}${s.tags.join(', ')}`));
        print('Run ticket to start a request for any of these.', 'dim');
        break;
      case 'process':
        processSteps.forEach((s, i) => print(`${i + 1}. ${s.title}: ${s.text}`));
        break;
      case 'faq': {
        const n = Number(args[0]);
        if (args[0] && Number.isInteger(n) && n >= 1 && n <= faqs.length) {
          print(faqs[n - 1][0], 'ok');
          print(faqs[n - 1][1]);
        } else {
          faqs.forEach(([q], i) => print(`${i + 1}. ${q}`));
          print('Run faq <number> to read an answer.', 'dim');
        }
        break;
      }
      case 'resistor': {
        const ohms = parseOhms(arg);
        if (ohms === null) { print('usage: resistor <value>, e.g. resistor 220 or resistor 4k7', 'err'); break; }
        const four = ohmsToBands(ohms, 2);
        const five = ohmsToBands(ohms, 3);
        print(`${formatOhms(ohms)}`, 'ok');
        print(typeof four === 'string' ? `4-band: ${four}` : `4-band: ${[...four.digits, four.multiplier].join(', ')}, then tolerance`);
        print(typeof five === 'string' ? `5-band: ${five}` : `5-band: ${[...five.digits, five.multiplier].join(', ')}, then tolerance`);
        break;
      }
      case 'led': {
        const [supply, forward, ma] = args.map(Number);
        const result = ledResistor(supply, forward, ma);
        if (!result) { print('usage: led <supply V> <forward V> <current mA>, e.g. led 5 2 20', 'err'); break; }
        if (!result.ok) { print(result.error, 'err'); break; }
        print(`Use ${formatOhms(result.standard)} (exact ${formatOhms(result.exact)})`, 'ok');
        print(`Current ${si(result.actualCurrent, 'A')}, power ${si(result.power, 'W')}, rating ${result.rating}`);
        break;
      }
      case 'subnet': {
        const result = subnet(arg);
        if (typeof result === 'string') { print(result, 'err'); break; }
        print(`${result.network}/${result.prefix}  ${result.scope}, class ${result.ipClass}`, 'ok');
        print(`mask      ${result.mask}   wildcard ${result.wildcard}`);
        print(`hosts     ${result.firstHost} to ${result.lastHost} (${result.usableHosts.toLocaleString('en-US')} usable)`);
        print(`broadcast ${result.broadcast}`);
        break;
      }
      case 'conv':
      case 'hex':
      case 'bin':
      case 'dec': {
        const parsed = parseInBase(arg, 10);
        if (typeof parsed === 'string') { print(arg ? parsed : 'usage: conv <number>, e.g. conv 255, conv 0xFF, conv 0b1010', 'err'); break; }
        const d = describeNumber(parsed);
        print(`dec ${d.dec}   hex ${d.hex}   oct ${d.oct}`, 'ok');
        print(`bin ${d.bin}`);
        break;
      }
      case 'tool': {
        const id = toolIds[(args[0] ?? '').toLowerCase()];
        if (!id) { print('usage: tool <resistor | ohm | led | subnet | base>', 'err'); break; }
        workbench.tool = id;
        go('workbench');
        break;
      }
      case 'ticket':
        go('request');
        break;
      case 'request':
      case 'contact':
        openCommission(brief.ref ? { service: brief.service, ticketRef: brief.ref } : {});
        break;
      case 'email':
        print(commissionEmail, 'ok');
        void copyText(commissionEmail, 'Email address copied');
        break;
      case 'date':
      case 'time':
        print(new Intl.DateTimeFormat('en-PH', { timeZone: 'Asia/Manila', dateStyle: 'full', timeStyle: 'short' }).format(new Date()) + ' (Manila)');
        break;
      case 'whoami':
        print('guest. Curious, presumably. Run ticket when you have something to build.');
        break;
      case 'echo':
        print(arg);
        break;
      case 'sudo':
        print('Permission denied. Nice try, though.', 'err');
        break;
      case 'history':
        history.forEach((h, i) => print(`${String(i + 1).padStart(3)}  ${h}`));
        break;
      case 'clear':
        lines.length = 0;
        break;
      case 'exit':
      case 'quit':
        ui.terminalOpen = false;
        break;
      default:
        print(`${command}: command not found. Type help for the list.`, 'err');
    }
  }

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    run(value);
    value = '';
    await tick();
    if (output) output.scrollTop = output.scrollHeight;
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' && history.length) {
      event.preventDefault();
      historyIndex = Math.max(0, historyIndex - 1);
      value = history[historyIndex];
    } else if (event.key === 'ArrowDown' && history.length) {
      event.preventDefault();
      historyIndex = Math.min(history.length, historyIndex + 1);
      value = history[historyIndex] ?? '';
    } else if (event.key === 'Tab' && value.trim() && !value.includes(' ')) {
      const matches = commandNames.filter(c => c.startsWith(value.trim().toLowerCase()));
      if (matches.length === 1) { event.preventDefault(); value = matches[0] + ' '; }
      else if (matches.length > 1) { event.preventDefault(); print(matches.join('  '), 'dim'); }
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      lines.length = 0;
    }
  }
</script>

<div class="terminal-backdrop" role="presentation" onclick={e => { if (e.target === e.currentTarget) ui.terminalOpen = false; }}>
  <div class="terminal" role="dialog" aria-modal="true" aria-label="Engineers on Queue terminal" tabindex="-1" use:trapFocus={{ initial: 'input' }} transition:fly={{ y: reduced ? 0 : 24, duration: reduced ? 0 : 220 }}>
    <div class="terminal-bar">
      <span class="terminal-dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="terminal-title">guest@eoq: ~</span>
      <button class="terminal-close" aria-label="Close the terminal" onclick={() => ui.terminalOpen = false}><X size={16}/></button>
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="terminal-output" bind:this={output} onclick={() => input?.focus()} aria-live="polite">
      {#each lines as line}<p class={'t-' + line.kind}>{line.text}</p>{/each}
    </div>
    <form class="terminal-input" onsubmit={submit}>
      <label for="terminal-command" class="prompt">guest@eoq:~$</label>
      <input id="terminal-command" bind:this={input} bind:value={value} onkeydown={onKeydown} autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go"/>
    </form>
  </div>
</div>
