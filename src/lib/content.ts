import { Code2, Cpu, CircuitBoard, Network } from '@lucide/svelte';

export type Service = {
  id: string;
  icon: typeof Code2;
  title: string;
  text: string;
  tags: string[];
  requests: string[];
};

export const services: Service[] = [
  {
    id: 'code',
    icon: Code2,
    title: 'Programming & software',
    text: 'Clean code and real solutions, from your first algorithm to a working application.',
    tags: ['C / C++', 'Arduino IDE', 'Debugging'],
    requests: [
      'A program that compiles but gives the wrong output',
      'Turning a flowchart or pseudocode into working C or C++',
      'A walkthrough of how an algorithm actually runs, line by line'
    ]
  },
  {
    id: 'embedded',
    icon: Cpu,
    title: 'Embedded & automation',
    text: 'Make the physical world respond, with smart systems built around your idea.',
    tags: ['Microcontrollers', 'Sensors', 'Motor control'],
    requests: [
      'Reading a sensor and acting on it with an Arduino',
      'Driving servos, DC motors, or relays from a microcontroller',
      'Finding out why a sketch uploads but the hardware does nothing'
    ]
  },
  {
    id: 'circuits',
    icon: CircuitBoard,
    title: 'Electronics & circuits',
    text: 'From a schematic to a working prototype, with every piece connected.',
    tags: ['PCB design', 'Simulation', 'Prototyping'],
    requests: [
      'Checking a schematic before you buy parts',
      'Simulating a circuit before building it on a breadboard',
      'Laying out a simple PCB from a working prototype'
    ]
  },
  {
    id: 'network',
    icon: Network,
    title: 'Networks & cybersecurity',
    text: 'Understand your network, build your defenses, and learn by doing.',
    tags: ['Packet Tracer', 'Networking', 'Security training'],
    requests: [
      'A Packet Tracer topology that will not ping across subnets',
      'Planning an IP addressing scheme for a lab or small office',
      'Guided practice on security basics for a class or team'
    ]
  }
];

export const otherService = 'Something else';

export const faqs: [string, string][] = [
  ['What kind of projects do you accept?', 'We take on programming, Arduino, electronics, circuit design, basic embedded systems, automation, networking simulations, and cybersecurity training. We review the scope and complexity together before committing.'],
  ['How much does a commission cost?', 'Every project is different. Share your requirements, budget, and deadline, and we’ll scope the work and agree on a quote before starting.'],
  ['Can you help with an existing project?', 'Yes. We can help debug code, troubleshoot hardware, integrate components, or work through a specific issue in an existing project.'],
  ['How do we work together?', 'Send your contact details and project requirements. We’ll discuss feasibility, agree on scope, pricing, and milestones, then build and test the solution with updates along the way.'],
  ['Do you offer training or project walkthroughs?', 'Yes. Ask about guided explanations, programming support, Packet Tracer exercises, and cybersecurity training when you send your request.'],
  ['Are the workbench tools free to use?', 'Yes. The calculators on this page run entirely in your browser, need no account, and send nothing to us. Use them as often as you like.']
];

export const processSteps = [
  {
    title: 'Share the idea',
    text: 'Tell us what you are trying to build or fix, your deadline, and your budget if you have one. A rough idea is enough to start.',
    detail: 'The brief builder below turns this into a ticket you can send in under two minutes.'
  },
  {
    title: 'Scope and quote',
    text: 'We review feasibility with you, agree on what is in and out of scope, and settle the price and milestones before any work begins.',
    detail: 'Sending a request never commits you to anything. Nothing is booked until you agree to the quote.'
  },
  {
    title: 'Build and update',
    text: 'We build and test the solution, sharing progress along the way so there are no surprises at the end.',
    detail: 'If something in the plan needs to change, we raise it early and agree on it together.'
  },
  {
    title: 'Hand off and explain',
    text: 'You get the finished work plus a walkthrough of how it works, so you can present it, maintain it, or build on it.',
    detail: 'Ask for a deeper walkthrough if you want to understand every line or every connection.'
  }
];

export const stages = ['Just an idea', 'Partly built', 'Built but not working', 'Already working, needs improving'];
export const helpTypes = ['Build it with me', 'Fix or debug it', 'Explain and teach it', 'Review and improve it'];
export const timelines = ['No fixed deadline', 'Within a month', 'Within two weeks', 'This week'];

export const tools = ['C / C++', 'Arduino', 'Embedded systems', 'PCB design', 'Cisco Packet Tracer', 'Microcontrollers', 'Sensors', 'Motor control', 'Circuit simulation', 'Prototyping', 'Networking', 'Security training', 'Debugging'];
