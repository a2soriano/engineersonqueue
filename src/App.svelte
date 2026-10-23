<script lang="ts">
  import { ArrowUpRight, ArrowRight, Zap, Code2, Cpu, CircuitBoard, Network, ShieldCheck, Plus, Minus, Menu, X, Check, Copy, Layers } from '@lucide/svelte';
  import { commissionEmail } from './lib/contact';
  let menuOpen = false;
  let activeFaq: number | null = null;
  let modalOpen = false;
  let copied = false;
  let projectType = 'Programming & software';
  let projectDetails = '';
  let projectName = '';
  let clientEmail = '';
  let otherContact = '';
  let honeypot = '';
  let sending = false;
  let submitted = false;
  let submitError = '';
  let brief = '';
  const services = [
    { icon: Code2, number: '01', title: 'Programming & software', text: 'Clean code. Real solutions. From your first algorithm to a working application.', tags: ['C / C++', 'Arduino IDE', 'Debugging'], class: 'code' },
    { icon: Cpu, number: '02', title: 'Embedded & automation', text: 'Make the physical world respond. Smart systems built around your idea.', tags: ['Microcontrollers', 'Sensors', 'Motor control'], class: 'embedded' },
    { icon: CircuitBoard, number: '03', title: 'Electronics & circuits', text: 'From a schematic to a working prototype. We connect every piece.', tags: ['PCB design', 'Simulation', 'Prototyping'], class: 'circuits' },
    { icon: Network, number: '04', title: 'Networks & cybersecurity', text: 'Understand your network. Build your defenses. Learn by doing.', tags: ['Packet Tracer', 'Networking', 'Security training'], class: 'network' }
  ];
  const faqs = [
    ['What kind of projects do you accept?', 'We take on programming, Arduino, electronics, circuit design, basic embedded systems, automation, networking simulations, and cybersecurity training. We review the scope and complexity together before committing.'],
    ['How much does a commission cost?', 'Every project is different. Share your requirements, budget, and deadline, and we’ll scope the work and agree on a quote before starting.'],
    ['Can you help with an existing project?', 'Yes. We can help debug code, troubleshoot hardware, integrate components, or work through a specific issue in an existing project.'],
    ['How do we work together?', 'Start with a project brief. We’ll discuss feasibility, agree on scope, pricing, and milestones, then build and test the solution with updates along the way.'],
    ['Do you offer training or project walkthroughs?', 'Yes. Ask about guided explanations, programming support, Packet Tracer exercises, and cybersecurity training when you submit your brief.']
  ];
  function modalFocus(node: HTMLDivElement) {
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    node.focus();
    function trap(event: KeyboardEvent) {
      if (event.key !== 'Tab') return;
      const items = Array.from(node.querySelectorAll<HTMLElement>('button:not(:disabled), input:not([tabindex="-1"]), select, textarea, a[href]'));
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === node)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    node.addEventListener('keydown', trap);
    return { destroy() { node.removeEventListener('keydown', trap); document.body.style.overflow = oldOverflow; previous?.focus(); } };
  }
  function makeBrief() { brief = `PROJECT INQUIRY — ENGINEERS ON QUEUE\n\nName: ${projectName}\nService: ${projectType}\n\n${projectDetails}`; }
  async function sendCommission() {
    if (sending || submitted) return;
    submitError = '';
    if (!commissionEmail) { makeBrief(); return; }
    if (honeypot) { submitError = 'Please leave the website field empty and try again.'; return; }
    sending = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(commissionEmail)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name: projectName.trim(),
          email: clientEmail.trim(),
          other_contact: otherContact.trim() || 'Not provided',
          service: projectType,
          message: projectDetails.trim(),
          _subject: 'New commission request — Engineers on Queue',
          _template: 'table',
          _honey: honeypot
        })
      });
      const result = await response.json();
      if (!response.ok || (result.success !== true && result.success !== 'true')) throw new Error('Submission rejected');
      submitted = true;
    } catch {
      submitError = 'We couldn’t confirm your submission. Your details are still here. Try again, or email the team directly.';
    } finally {
      clearTimeout(timeout);
      sending = false;
    }
  }
  function newCommission() {
    submitted = false;
    submitError = '';
    projectName = '';
    clientEmail = '';
    otherContact = '';
    projectDetails = '';
    honeypot = '';
    brief = '';
    copied = false;
  }
  async function copyBrief() { try { await navigator.clipboard.writeText(brief); copied = true; } catch { copied = false; } }
</script>

<svelte:head><meta property="og:title" content="Engineers on Queue — Your ideas. Engineered."/><meta property="og:description" content="A hands-on engineering collective for code, circuits, embedded systems, and beyond. Open for commissions."/></svelte:head>

<header id="top">
  <a href="#top" class="brand" aria-label="Engineers on Queue home"><span class="brand-icon"><Zap size={23} fill="currentColor"/></span><span>engineers<span class="brand-bottom">on queue<span class="brand-dot">.</span></span></span></a>
  <nav class:open={menuOpen} aria-label="Main navigation"><a href="#services" onclick={() => menuOpen = false}>What we do</a><a href="#projects" onclick={() => menuOpen = false}>Our work</a><a href="#about" onclick={() => menuOpen = false}>The collective</a><a href="#faq" onclick={() => menuOpen = false}>FAQs</a></nav>
  <button class="nav-cta" onclick={() => modalOpen = true}>Let’s talk <ArrowUpRight size={16}/></button>
  <button class="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onclick={() => menuOpen = !menuOpen}>{#if menuOpen}<X/>{:else}<Menu/>{/if}</button>
</header>

<main>
<section class="hero">
  <div class="hero-grid"></div><div class="hero-glow"></div>
  <div class="hero-copy"><div class="availability"><span></span> OPEN FOR COMMISSIONS <span class="availability-line"></span> LET’S BUILD SOMETHING</div>
  <h1>Your ideas.<br/>Our expertise.<br/><span>Real possibilities.</span></h1>
  <p>From lines of code to circuits that come alive.<br class="desktop-break"/> We’re the engineering collective that helps you<br class="desktop-break"/> turn “what if” into what’s next.</p>
  <div class="hero-actions"><button class="button primary" onclick={() => modalOpen = true}>Start a project <ArrowUpRight size={18}/></button><a class="button secondary" href="#services">Explore our capabilities <ArrowRight size={17}/></a></div>
  <div class="hero-note"><span class="tiny-stars">✦</span> Built on curiosity. Driven by engineering.</div></div>
  <div class="machine" aria-label="Illustration of connected engineering systems" role="img">
    <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orbit orbit-three"></div>
    <div class="circuit-lines"><i></i><i></i><i></i><i></i></div>
    <div class="float-label label-code"><Code2 size={15}/> code. create. connect.</div>
    <div class="float-label label-system"><span class="live-dot"></span> SYSTEMS ONLINE</div>
    <div class="chip-base base-bottom"></div><div class="chip-base base-middle"></div><div class="chip-base base-top"><div class="chip-inner"><Zap size={66} strokeWidth={1.5} fill="currentColor"/></div><span class="chip-inscription">EOQ — CORE / 01</span></div>
    <div class="float-label label-coordinates">14.5995° N &nbsp; 120.9842° E</div>
    <div class="orbit-node node-one"></div><div class="orbit-node node-two"></div><div class="orbit-node node-three"></div>
    <span class="machine-caption">HUMAN IDEAS. ENGINEERED POSSIBILITIES.</span>
  </div>
  <div class="hero-bottom"><span>SMALL TEAM. WIDE POSSIBILITIES.</span><a href="#services">SCROLL TO EXPLORE <span>↓</span></a></div>
</section>

<div class="tech-strip"><span>THE TOOLS BEHIND THE IDEAS</span><div><b>C / C++</b><b class="arduino">∞ <span>ARDUINO</span></b><b><Cpu size={21}/> Embedded systems</b><b><CircuitBoard size={21}/> PCB design</b><b><Network size={21}/> Cisco Packet Tracer</b></div></div>

<section id="services" class="section services"><div class="section-top"><div><div class="eyebrow"><span></span> OUR CAPABILITIES</div><h2>Different disciplines.<br/><span>One curious collective.</span></h2></div><p>Whether it’s software, hardware, or the space<br class="desktop-break"/> in between — we help connect the dots.</p></div>
<div class="service-grid">{#each services as service}<article class="service-card"><div class="service-top"><span class="service-icon"><service.icon size={25} strokeWidth={1.4}/></span><span class="number">/{service.number}</span></div><h3>{service.title}</h3><p>{service.text}</p><div class="tags">{#each service.tags as tag}<span>{tag}</span>{/each}</div><button class="service-link" onclick={() => { projectType = service.title; modalOpen = true; }}>Let’s build it <ArrowUpRight size={17}/></button></article>{/each}</div>
<div class="scope-note"><Plus size={15}/><span>Have something a little different in mind? We like a good challenge.</span><button onclick={() => modalOpen = true}>Tell us about it <ArrowRight size={15}/></button></div></section>

<section id="projects" class="section projects"><div class="section-top"><div><div class="eyebrow"><span></span> THE BUILD LOG</div><h2>Great work starts<br/>with <span>a first project.</span></h2></div><p>No borrowed case studies. No made-up results.<br/>Just a new collective ready to make its mark.</p></div>
<div class="project-placeholder"><div class="project-art"><div class="blueprint"><div class="blueprint-center"><Layers size={45} strokeWidth={1}/></div><span class="bp-corner top-left"></span><span class="bp-corner bottom-right"></span><span class="bp-label">PROJECT_001</span><span class="bp-cross">+</span></div></div><div class="project-copy"><span class="pill"><span></span> THE NEXT CHAPTER</span><h3>Your idea could<br/>be our first feature.</h3><p>Our portfolio is a blank canvas. Help us fill it with something worth building — and be part of our story from day one.</p><button class="text-link" onclick={() => modalOpen = true}>Build something with us <ArrowUpRight size={18}/></button></div></div></section>

<section id="about" class="section about"><div class="about-copy"><div class="eyebrow"><span></span> PEOPLE BEHIND THE PROCESS</div><h2>Engineers by mindset.<br/><span>Builders at heart.</span></h2><p>We’re Engineers on Queue — a collective of curious problem-solvers who love turning complex challenges into things that actually work.</p><p>We bring together code, electronics, and a hands-on approach. You bring the idea. We’ll figure out the next steps, together.</p><div class="values"><span><Check size={15}/> Clear communication</span><span><Check size={15}/> Thoughtful solutions</span><span><Check size={15}/> Built with you</span></div></div><div class="credential-card"><div class="credential-top"><ShieldCheck size={27} strokeWidth={1.4}/><span>KNOWLEDGE THAT BACKS THE BUILD</span></div><div class="cert-mark">ISC2<span>®</span></div><h3>Certified expertise.<br/>A security-first mindset.</h3><p>Our collective includes an ISC2-certified member, bringing cybersecurity knowledge and a security-conscious perspective to the table.</p><div class="credential-foot"><span class="live-dot"></span> REAL PEOPLE. REAL KNOW-HOW.</div></div></section>

<section id="faq" class="section faq"><div><div class="eyebrow"><span></span> GOOD QUESTIONS</div><h2>A little clarity.<br/><span>A better start.</span></h2><p>Something else on your mind?</p><button class="text-link" onclick={() => modalOpen = true}>Let’s talk about it <ArrowUpRight size={16}/></button></div><div class="faq-list">{#each faqs as faq, i}<div class="faq-item"><button aria-expanded={activeFaq === i} onclick={() => activeFaq = activeFaq === i ? null : i}>{faq[0]}{#if activeFaq === i}<Minus size={18}/>{:else}<Plus size={18}/>{/if}</button>{#if activeFaq === i}<p>{faq[1]}</p>{/if}</div>{/each}</div></section>

<section class="contact-band"><div class="contact-grid"></div><div class="eyebrow"><span></span> YOUR NEXT IDEA STARTS HERE</div><h2>Got a “what if”?<br/>Let’s <span>make it work.</span></h2><p>A rough sketch. A stubborn bug. An ambitious idea.<br/>Whatever’s on your mind, we’re all ears.</p><button class="button primary" onclick={() => modalOpen = true}>Put your idea in the queue <ArrowUpRight size={18}/></button><div class="contact-note"><span class="live-dot"></span> Open for commissions & collaborations</div></section>
</main>
<footer><div class="footer-top"><a href="#top" class="brand"><span class="brand-icon"><Zap size={23} fill="currentColor"/></span><span>engineers<span class="brand-bottom">on queue<span class="brand-dot">.</span></span></span></a><p>Curiosity in. Possibilities out.</p><a href="#services">Capabilities <ArrowUpRight size={13}/></a><a href="#projects">Our work <ArrowUpRight size={13}/></a><button onclick={() => modalOpen = true}>Get in touch <ArrowUpRight size={13}/></button></div><div class="footer-bottom"><span>© {new Date().getFullYear()} Engineers on Queue. All rights reserved.</span><span>Made with intention. Built for possibility. <span class="green">✦</span></span></div></footer>

{#if modalOpen}
  <div class="modal-backdrop" role="presentation" onclick={(e) => { if (e.target === e.currentTarget) modalOpen = false; }}>
    <div use:modalFocus class="modal" role="dialog" aria-modal="true" aria-labelledby="brief-title" tabindex="-1">
      <button class="modal-close" aria-label="Close project brief" onclick={() => modalOpen = false}><X/></button>
      <div class="eyebrow"><span></span> LET’S BUILD SOMETHING</div>
      <h2 id="brief-title">{submitted ? 'Your idea is in the queue.' : 'Start with your idea.'}</h2>
      {#if submitted}
        <div class="submission-success" role="status"><Check size={23}/><p>Your request was submitted. We’ll review your project and reply to the email address you provided.</p></div>
        <p>Sending a request doesn’t confirm a booking. We’ll discuss the scope, timeline, and quote with you first.</p>
        <button class="button primary" onclick={newCommission}>Send another request <ArrowRight size={17}/></button>
      {:else if !brief}
        <p>{commissionEmail ? 'Tell us what you have in mind. Send your request to our team and we’ll get back to you by email.' : 'Create a brief to share with the team. Direct online inquiries will be available when our contact channel launches.'}</p>
        <form onsubmit={(e) => { e.preventDefault(); void sendCommission(); }} aria-busy={sending}>
          <fieldset disabled={sending}>
            <label>Your name<input name="name" bind:value={projectName} required placeholder="How should we call you?" maxlength="100" autocomplete="name"/></label>
            {#if commissionEmail}<label>Your email<input name="email" type="email" bind:value={clientEmail} required maxlength="254" placeholder="you@example.com" autocomplete="email" aria-describedby="client-email-help"/></label><p id="client-email-help" class="field-hint">We’ll use this address to reply about your project.</p><label>Other contact (optional)<input name="other_contact" bind:value={otherContact} maxlength="200" placeholder="Phone number, Messenger link, or Discord username"/></label>{/if}
            <label>What do you need?<select name="service" bind:value={projectType}>{#each services as service}<option>{service.title}</option>{/each}<option>Something else</option></select></label>
            <label>Tell us about your project<textarea name="message" bind:value={projectDetails} required minlength="20" maxlength="5000" rows="5" placeholder="Your idea, requirements, timeline, and budget if you have one…"></textarea></label>
            <div class="form-honeypot" aria-hidden="true"><label>Leave this field empty<input name="_honey" bind:value={honeypot} tabindex="-1" autocomplete="off"/></label></div>
            {#if commissionEmail}<p class="form-disclosure">By sending, you agree to share these details with Engineers on Queue through <a href="https://formsubmit.co/privacy.pdf" target="_blank" rel="noopener noreferrer">FormSubmit</a> to handle your inquiry.</p>{/if}
            <button class="button primary submit-button" type="submit">{sending ? 'Sending request…' : commissionEmail ? 'Send commission request' : 'Create project brief'} <ArrowRight size={17}/></button>
          </fieldset>
          {#if submitError}<div class="submission-error" role="alert"><p>{submitError}</p><a href={'mailto:' + commissionEmail}>Email {commissionEmail} <ArrowUpRight size={14}/></a></div>{/if}
        </form>
      {:else}
        <p>Your brief is ready. Download it or copy it to share with Engineers on Queue. This brief has not been sent.</p><pre>{brief}</pre>
        <div class="brief-actions"><button class="button primary" onclick={copyBrief}>{#if copied}<Check size={16}/> Copied{:else}<Copy size={16}/> Copy brief{/if}</button><a class="button secondary" href={'data:text/plain;charset=utf-8,' + encodeURIComponent(brief)} download="engineers-on-queue-brief.txt">Download .txt <ArrowRight size={16}/></a></div>
        <button class="text-link" onclick={() => { brief = ''; copied = false; }}>Edit brief</button>
      {/if}
    </div>
  </div>
{/if}
<svelte:window onkeydown={(e) => { if (e.key === 'Escape') { modalOpen = false; menuOpen = false; } }}/>
