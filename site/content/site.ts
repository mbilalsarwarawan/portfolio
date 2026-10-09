import type { PageSeo, ProcessStep, Service, Testimonial } from './types';

/**
 * Site-wide copy. Facts come from the bio and the Supabase rows.
 * Unknown numbers are marked [TODO: ...] and stripped in production.
 */

export const person = {
  name: 'Bilal Awan',
  fullName: 'Muhammad Bilal Awan',
  jobTitle: 'Full-Stack & AI Engineer',
  location: 'Lahore, Pakistan',
  timezone: 'PKT (UTC+5), overlapping European working hours',
  currentCompany: { name: 'Fintask.ie', url: 'https://fintask.ie', country: 'Ireland' },
  education: { degree: 'BS Computer Science', school: 'GCU Lahore', year: '2024' },
  availability: 'Open to contract and freelance work',
};

export const hero = {
  eyebrow: 'Full-stack & AI engineer · Lahore → Ireland, remote',
  headline: ['Software that ships:', 'products, AI agents,', 'and the plumbing between.'],
  valueProp:
    'I design, build and run web products end to end, from the Chrome extension your users install to the RAG pipeline that answers their questions. Right now I ship remotely for Fintask.ie in Ireland.',
  primaryCta: { label: 'Let’s work together', href: '/contact' },
  secondaryCta: { label: 'View selected work', href: '/#work' },
};

/** Labels for the proof strip. Values are computed from Supabase in lib/content.ts. */
export const proof = {
  liveProductsLabel: 'products live in production',
  yearsValue: '2+',
  yearsLabel: 'years shipping for clients',
  teamsLabel: 'engineering teams shipped with',
  extraStat: { value: '[TODO: add metric]', label: '[TODO: e.g. users served across products]' },
  companiesHeading: 'Shipped with',
};

/** Core stack from the bio. Merged with the Supabase `skills` table for the marquee. */
export const coreStack = [
  'TypeScript',
  'Vue.js',
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'MongoDB',
  'Redis',
  'Supabase',
  'Chrome Extension APIs',
  'LangChain',
  'RAG pipelines',
  'LLM APIs',
  'FastAPI',
];

export const services: Service[] = [
  {
    id: 'product',
    title: 'Full-stack product builds',
    outcome: 'From brief to a product people can log into.',
    body: 'I take a product from schema to deployed UI: auth, payments, dashboards and the admin tooling nobody remembers until launch week. One engineer owns the whole thing, so nothing falls through the cracks between frontend and backend.',
    deliverables: ['React / Vue / Next.js frontends', 'Node.js or Python APIs', 'Stripe, auth, roles', 'Deployed and documented'],
    proof: ['soul-virtue', 'local-key', 'mister-clay'],
  },
  {
    id: 'ai',
    title: 'AI, RAG & LLM integrations',
    outcome: 'Assistants that answer from your data, not from thin air.',
    body: 'I connect LLMs to the knowledge you already have: retrieval over documents, agents that query your database and tools the model can call. I keep the deployment around them plain and observable. You can try one now: the chat assistant on this site is wired to my own data.',
    deliverables: ['RAG pipelines', 'SQL / tool-using agents', 'LLM API integration', 'FastAPI services in Docker'],
    proof: ['nomia-docs-chatbot', 'quickrooms'],
  },
  {
    id: 'automation',
    title: 'Browser automation & Chrome extensions',
    outcome: 'Turn repetitive browser work into a button.',
    body: 'I build extensions that work inside the tools your team already uses, with background workers that keep running and a backend that stays in sync. That covers both production Chrome Web Store releases and internal automation.',
    deliverables: ['Manifest V3 extensions', 'Background & content scripts', 'Extension ↔ backend sync', 'Web Store publishing'],
    proof: ['meetdrake'],
  },
  {
    id: 'backend',
    title: 'Backend & API systems',
    outcome: 'APIs and data models that hold up when usage grows.',
    body: 'I design data models, REST APIs and background jobs with the boring virtues: deduplicated data, safe concurrency, caching where it pays and deployments you can restart without holding your breath.',
    deliverables: ['Data modelling (MongoDB, Postgres)', 'REST APIs', 'Redis caching & queues', 'Docker + Nginx deploys'],
    proof: ['meetdrake', 'nomia-docs-chatbot', 'lit-path'],
  },
];

export const process: ProcessStep[] = [
  {
    title: 'Brief & scope',
    body: 'A call to understand the problem, the users and what “done” means. You get a written scope with milestones and the open questions, before any code.',
  },
  {
    title: 'Architecture',
    body: 'I pick the simplest stack that fits and write down the decisions that matter: data model, integrations, where the risk is. No surprises later.',
  },
  {
    title: 'Build in the open',
    body: 'Short cycles with a working preview link you can click. Progress updates in writing, so you never have to ask where things stand.',
  },
  {
    title: 'Ship & hand over',
    body: 'Production deploy, monitoring, and a handover your team can actually use: docs, access and a walkthrough. Then I stay available for fixes.',
  },
];

export const about = {
  short:
    'I’m Bilal, a full-stack engineer in Lahore working remotely with an Irish software company. I build the whole product, not just a layer of it, and I’m increasingly focused on the AI side: retrieval, agents and browser automation that do real work.',
  story: [
    'I studied Computer Science at GCU Lahore and graduated in 2024. My first role was at StechAi, building OpenAI-powered RAG chatbots and Django/FastAPI APIs and deploying ML models with Docker and MLflow.',
    'At Cherrybyte Technologies I worked on production Python systems, including a dual-agent RAG + SQL assistant, an audio streaming platform and a subscription trading platform, all deployed with Docker and Nginx.',
    'Along the way I took a short contract with Turing doing data annotation and quality assurance on computer-interaction datasets used to train a computer-use agent model. It gave me a close look at how agentic systems succeed and fail.',
    'Since August 2025 I’ve been shipping client products end to end for Fintask.ie: full-stack web apps, Chrome extensions and AI integrations, working remotely across time zones from Lahore.',
  ],
  principles: [
    { title: 'Own the outcome', body: 'I’d rather ship a smaller thing that works than a bigger thing that almost does.' },
    { title: 'Write it down', body: 'Decisions, trade-offs and status in writing, so remote never means out of the loop.' },
    { title: 'Boring infrastructure', body: 'Use novel tech where it earns its place, like LLMs, and proven tech everywhere else.' },
  ],
};

/**
 * Experience copy, keyed by `experiences.company` in Supabase.
 * Falls back to the DB description when a company is missing here.
 */
export const experienceCopy: Record<string, { role?: string; summary: string }> = {
  'Fintask.ie': {
    // Bio says remote engineer; DB says "Freelance". Confirm which is right.
    role: 'Full-Stack Software Engineer · Remote',
    summary:
      'Shipping client products end to end for an Irish software company: full-stack web apps, Chrome extensions and AI integrations. [TODO: add metric: products shipped or clients served]',
  },
  'Cherrybyte Technologies': {
    summary:
      'Built production Python systems: a dual-agent RAG + SQL assistant, an audio streaming platform and a subscription trading platform, all on Django/FastAPI and deployed with Docker and Nginx.',
  },
  Turing: {
    summary:
      'Data annotation and quality assurance on computer-interaction datasets used to train a computer-use agent model.',
  },
  StechAi: {
    summary:
      'Built OpenAI-powered RAG chatbots and REST APIs with Django and FastAPI, and deployed ML models with Docker and MLflow.',
  },
};

/** Placeholder slots. Hidden in production until real quotes are added. */
export const testimonials: Testimonial[] = [
  { quote: '[TODO: add a client testimonial]', name: '[TODO: name]', role: '[TODO: role, company]' },
  { quote: '[TODO: add a client testimonial]', name: '[TODO: name]', role: '[TODO: role, company]' },
];

export const contact = {
  heading: 'Have something that needs to ship?',
  body: 'Tell me what you’re building and where it’s stuck. I’ll reply with honest next steps, even if the answer is “you don’t need me for this”.',
  responseTime: '[TODO: confirm reply time, e.g. within 1 working day]',
};

export const nav = [
  { label: 'Work', href: '/#work', section: 'work' },
  { label: 'Services', href: '/#services', section: 'services' },
  { label: 'Process', href: '/#process', section: 'process' },
  { label: 'About', href: '/about', section: 'about' },
  { label: 'Contact', href: '/contact', section: 'contact' },
];

export const seo: Record<'home' | 'projects' | 'about' | 'contact', PageSeo> = {
  home: {
    title: 'Bilal Awan: Full-Stack & AI Engineer',
    description:
      'Full-stack and AI engineer who ships real products: web apps, RAG and LLM integrations, Chrome extensions and backend systems. Based in Lahore, working remotely with teams in Europe.',
  },
  projects: {
    title: 'Work: Case Studies',
    description:
      'Products I’ve built and shipped: a LinkedIn automation Chrome extension, a dual-agent RAG + SQL assistant, a telemedicine platform, and more.',
  },
  about: {
    title: 'About',
    description:
      'Bilal Awan is a full-stack engineer in Lahore, Pakistan, building web products and AI integrations remotely for an Irish software company.',
  },
  contact: {
    title: 'Contact: Let’s Work Together',
    description:
      'Hire Bilal Awan for full-stack product builds, AI/RAG integrations, Chrome extensions or backend systems. Tell me what you’re building.',
  },
};
