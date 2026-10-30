<script lang="ts">
  import { Check, ShieldCheck } from '@lucide/svelte';
</script>

<section id="about" class="section about" aria-labelledby="about-title">
  <div class="about-copy">
    <h2 id="about-title">Engineers by mindset.<br/><span>Builders at heart.</span></h2>
    <p>We’re Engineers on Queue, a collective of curious problem-solvers who love turning complex challenges into things that actually work.</p>
    <p>We bring together code, electronics, and a hands-on approach. You bring the idea. We’ll figure out the next steps, together.</p>
    <ul class="values">
      <li><Check size={16}/> Clear communication</li>
      <li><Check size={16}/> Thoughtful solutions</li>
      <li><Check size={16}/> Built with you</li>
    </ul>
  </div>
  <article class="credential-card">
    <div class="credential-top"><ShieldCheck size={26} strokeWidth={1.5}/><span>Knowledge that backs the build</span></div>
    <p class="cert-mark">ISC2<span>®</span></p>
    <h3>Certified expertise.<br/>A security-first mindset.</h3>
    <p>Our collective includes an ISC2-certified member, bringing cybersecurity knowledge and a security-conscious perspective to the table.</p>
    <p class="credential-foot"><span class="live-dot" aria-hidden="true"></span> Real people. Real know-how.</p>
  </article>
</section>
