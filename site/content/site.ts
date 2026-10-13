import type { FaqItem, GlanceItem, PageSeo, ProcessStep, Service, Testimonial } from './types';

/** Site-wide copy. Claims come from the bio and verified Supabase rows. */

export const person = {
  name: 'Bilal Awan',
  fullName: 'Muhammad Bilal Awan',
  jobTitle: 'Full-Stack Developer',
  location: 'Lahore, Pakistan',
  timezone: 'PKT (UTC+5), with working-hour overlap for UK and European teams',
  education: { degree: 'BS Computer Science', school: 'GCU Lahore', year: '2024' },
  availability: 'Available for freelance and contract work',
};

export const hero = {
  eyebrow: 'Full-stack developer · Web, mobile & AI',
  headline: ['One developer', 'for your whole product.'],
  valueProp:
    'I’m Bilal. I design, build and launch web apps, mobile apps and useful AI features, including the systems behind them. You work with one person who takes responsibility from the first screen to release.',
  primaryCta: { label: 'Email me', href: '/contact' },
  secondaryCta: { label: 'See my work', href: '/#work' },
  focus: 'Web · Mobile · AI · Backend',
};

/** Labels for the proof strip. Values are computed from Supabase in lib/content.ts. */
export const proof = {
  liveProductsLabel: 'products live in production',
  yearsValue: '2+',
  yearsLabel: 'years building software',
  teamsLabel: 'teams I have worked with',
  companiesHeading: 'Experience across',
};

export const glance: GlanceItem[] = [
  {
    label: 'What I build',
    value: 'Complete digital products',
    detail: 'Web apps, Flutter mobile apps, AI features and backend systems.',
  },
  {
    label: 'How I work',
    value: 'One accountable developer',
    detail: 'A direct line from planning and build through launch and handover.',
  },
  {
    label: 'Where I work',
    value: 'Remote from Lahore',
    detail: 'PKT (UTC+5), with working-hour overlap for UK and European teams.',
  },
  {
    label: 'How to hire me',
    value: 'Freelance or contract',
    detail: 'Start with an email about the problem, product and current stage.',
  },
];

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
  'Flutter',
];

export const stackGroups = [
  { title: 'Web', items: ['TypeScript', 'React', 'Next.js', 'Vue.js', 'Node.js', 'Tailwind CSS'] },
  { title: 'Mobile', items: ['Flutter', 'Dart', 'Firebase', 'REST APIs'] },
  { title: 'AI', items: ['Python', 'LLM APIs', 'LangChain', 'RAG pipelines', 'FastAPI'] },
  { title: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Nginx'] },
];

export const services: Service[] = [
  {
    id: 'web',
    title: 'Web apps & dashboards',
    outcome: 'A complete web product, not a collection of disconnected pages.',
    body: 'I build the customer-facing app and the less visible parts that make it useful: accounts, payments, dashboards, admin tools and browser automation. Keeping that work with one developer means fewer hand-offs and clearer ownership.',
    deliverables: ['Customer and admin experiences', 'Accounts, roles and payments', 'Chrome extensions and automation', 'Launch and handover'],
    tech: ['React', 'Next.js', 'Vue.js', 'Node.js', 'TypeScript'],
    proof: ['meetdrake', 'soul-virtue', 'local-key', 'mister-clay'],
  },
  {
    id: 'mobile',
    title: 'Mobile apps',
    outcome: 'One app for iPhone and Android, built from one codebase.',
    body: 'I build cross-platform Flutter apps and connect them to the same accounts, data and services as your web product. My client mobile work is covered by an NDA, so I discuss the relevant approach and responsibilities privately.',
    deliverables: ['iOS and Android from one codebase', 'App screens and user flows', 'API and service integration', 'Release-ready builds'],
    tech: ['Flutter', 'Dart', 'REST APIs', 'Firebase'],
    proof: [],
  },
  {
    id: 'ai',
    title: 'AI features',
    outcome: 'AI that works with your information and solves a defined task.',
    body: 'I add assistants that can search your documents, answer questions about business data and use approved tools. The goal is not an AI label; it is a useful feature with clear boundaries that your team can understand and operate.',
    deliverables: ['Document and knowledge assistants', 'Data-aware chat and search', 'Tool-using workflows', 'Deployable AI services'],
    tech: ['LLM APIs', 'LangChain', 'RAG', 'Python', 'FastAPI'],
    proof: ['nomia-docs-chatbot', 'quickrooms'],
  },
  {
    id: 'backend',
    title: 'Backend & scaling',
    outcome: 'The system behind your app, built to stay dependable as usage grows.',
    body: 'I design the data, integrations and background work behind a product. I focus on the things users notice when they go wrong: slow responses, duplicate records, failed jobs and changes that are difficult to deploy.',
    deliverables: ['Data models and APIs', 'Payments and third-party integrations', 'Background work and caching', 'Deployment and monitoring setup'],
    tech: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker'],
    proof: ['meetdrake', 'nomia-docs-chatbot', 'lit-path'],
  },
];

export const process: ProcessStep[] = [
  {
    title: 'Understand the job',
    body: 'We start with the problem, the people using the product and what a successful first release needs to do. I turn that into a written scope before development starts.',
  },
  {
    title: 'Plan the build',
    body: 'I break the work into clear milestones, identify the risky parts early and choose tools that fit the product. You can see what is included, what is not and what comes next.',
  },
  {
    title: 'Build in the open',
    body: 'You get short written updates and working previews you can try. Questions and trade-offs are raised early, while they are still inexpensive to change.',
  },
  {
    title: 'Launch & hand over',
    body: 'I prepare the production release, document the important parts and walk you through access and day-to-day use. I also remain available for agreed follow-up work.',
  },
];

export const about = {
  short:
    'I’m Bilal, a full-stack developer based in Lahore. I work across the visible product and the systems behind it, so clients do not need a different person for every layer. My experience covers web platforms, Flutter apps, AI assistants, browser automation and production backend services.',
  story: [
    'I help clients turn a product idea or an unfinished system into software people can use. That can mean building the full product, joining an existing team for a difficult part, or connecting the user experience to a more reliable backend.',
    'I earned a BS in Computer Science from GCU Lahore in 2024. At StechAi, I built document-based AI assistants, Django and FastAPI services, and deployment workflows for machine-learning systems.',
    'At Cherrybyte Technologies, I worked on production Python products including an assistant that could answer from both documents and database records, an audio platform and a subscription product.',
    'A contract with Turing added hands-on experience reviewing computer-interaction data used to train a computer-use agent. Since August 2025, I have worked as a freelance full-stack developer with Fintask.ie, shipping web products, Chrome extensions and AI integrations for clients.',
  ],
  principles: [
    { title: 'Own the outcome', body: 'I care whether the finished product solves the job, not only whether the code is complete.' },
    { title: 'Keep work visible', body: 'Written updates, working previews and recorded decisions keep remote projects clear.' },
    { title: 'Use the simplest fit', body: 'I use new technology where it creates value and proven tools everywhere else.' },
  ],
};

/**
 * Experience copy, keyed by `experiences.company` in Supabase.
 * Falls back to the DB description when a company is missing here.
 */
export const experienceCopy: Record<string, { role?: string; summary: string }> = {
  'Fintask.ie': {
    role: 'Freelance Full-Stack Developer',
    summary:
      'Builds client products end to end for an Irish software company, including full-stack web apps, Chrome extensions and AI integrations for international clients.',
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

/** Add the verified Fintask Upwork review here once its exact text and public URL are available. */
export const testimonials: Testimonial[] = [];

export const contact = {
  heading: 'Tell me what you want to build.',
  body: 'Share the problem, who the product is for and what stage you are at. I’ll reply personally with the questions and next step needed to see whether I’m a good fit.',
  responseTime: 'Direct replies. No sales team.',
};

export const faq: FaqItem[] = [
  {
    question: 'I’m not technical. Can we still work together?',
    answer:
      'Yes. You can describe the business problem and the experience you want customers to have. I will translate that into a practical scope, explain choices without jargon and make the open decisions visible before development begins.',
  },
  {
    question: 'Can you join an existing product or engineering team?',
    answer:
      'Yes. I can take ownership of a defined feature, work across the frontend and backend, or help with AI and browser-automation work. I document decisions and adapt to the team’s existing review and release process.',
  },
  {
    question: 'How do you handle communication across time zones?',
    answer:
      'I work from Lahore in PKT (UTC+5), with useful working-hour overlap for UK and European teams. I rely on concise written updates, clear questions and working previews so progress does not depend on constant meetings.',
  },
  {
    question: 'Who owns the code and project access?',
    answer:
      'You do. Repositories, production accounts and third-party services should be held in client-controlled accounts wherever possible. Handover includes the access and documentation needed to keep operating the product.',
  },
  {
    question: 'Can you work under an NDA?',
    answer:
      'Yes. I have client work, including mobile development, that cannot be shown publicly. I can sign a reasonable NDA and keep private product details out of public case studies and repositories.',
  },
  {
    question: 'What happens after launch?',
    answer:
      'The initial scope includes an agreed handover and follow-up period. Ongoing improvements, monitoring or support can then continue as a separate contract when the product needs it.',
  },
];

/** Section headings. Wrap a word in *asterisks* to set it in the accent colour. */
export const sections = {
  work: {
    eyebrow: 'Selected work',
    title: 'Real products, explained through the *problem* they solve.',
    intro: 'Selected web, AI and backend work with the challenge, my contribution and the decisions behind the result.',
    moreTitle: 'More shipped work',
    moreCta: 'All projects',
    empty: 'Case studies are being updated. Check back shortly or get in touch for a walkthrough.',
  },
  services: {
    eyebrow: 'What I do',
    title: 'Four parts of a product, handled by *one developer*.',
    intro: 'Start with the outcome you need. The technical detail is there for the people who need to evaluate it.',
  },
  process: {
    eyebrow: 'How I work',
    title: 'From brief to shipped, *in writing*.',
    intro: 'Remote work runs on clarity. You always know what’s happening, what’s next and what I need from you.',
  },
  about: {
    eyebrow: 'About',
    title: 'A developer who can see the *whole* product.',
    cta: 'More about me',
  },
  testimonials: {
    eyebrow: 'Kind words',
    title: 'What it’s like to *work* with me.',
  },
  stack: {
    heading: 'Tools I ship with',
    hint: 'Numbers show case studies using it. Hover to pause.',
  },
  contact: {
    eyebrow: 'Start a conversation',
  },
  glance: {
    eyebrow: 'At a glance',
    title: 'The short version, before the *details*.',
  },
  faq: {
    eyebrow: 'Common questions',
    title: 'What clients usually want to know *before we start*.',
    intro: 'Straight answers about working remotely, ownership, confidentiality and what happens after launch.',
  },
};

/** Copy for standalone pages. */
export const pages = {
  projects: {
    eyebrow: 'Work',
    title: 'Everything I’ve *shipped* lately.',
    intro: 'Client products, AI systems and tools that are live today. Filter by technology, or open any project for the full case study.',
    allLabel: 'All',
    empty: 'No projects use that technology yet. Try another filter.',
  },
  caseStudy: {
    back: 'All work',
    role: 'Role',
    year: 'Year',
    live: 'Live',
    visit: 'Visit live site',
    source: 'Source code',
    problem: 'The problem',
    built: 'What I built',
    how: 'How: key decisions',
    result: 'Result',
    stack: 'Stack',
    gallery: 'Screens',
    next: 'Next case study',
    ctaTitle: 'Need something like this built?',
  },
  about: {
    eyebrow: 'About',
    title: 'One developer, from the first screen to the *system behind it*.',
    storyHeading: 'The short version',
    experienceHeading: 'Where I’ve shipped',
    principlesHeading: 'How I work',
    stackHeading: 'What I build with',
    resume: 'Download CV',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Start with the problem. We’ll work out the *right build*.',
    emailLabel: 'Email',
    elsewhereLabel: 'Elsewhere',
    locationLabel: 'Location',
    timeLabel: 'My local time',
    goodFitHeading: 'Good fit if you need',
  },
  notFound: {
    title: 'This page *shipped* somewhere else.',
    body: 'The link may be old or mistyped. The work is still here.',
    cta: 'Back to home',
  },
};

export const nav = [
  { label: 'Services', href: '/#services', section: 'services' },
  { label: 'Work', href: '/#work', section: 'work' },
  { label: 'About', href: '/about', section: 'about' },
  { label: 'FAQ', href: '/#faq', section: 'faq' },
  { label: 'Contact', href: '/contact', section: 'contact' },
];

export const seo: Record<'home' | 'projects' | 'about' | 'contact', PageSeo> = {
  home: {
    title: 'Bilal Awan: Full-Stack Developer for Web, Mobile & AI',
    description:
      'Hire one developer for your web app, Flutter mobile app, AI feature and backend. Bilal Awan builds complete products for remote clients and teams.',
  },
  projects: {
    title: 'Work: Case Studies',
    description:
      'Products I’ve built and shipped: a LinkedIn automation Chrome extension, a dual-agent RAG + SQL assistant, a telemedicine platform, and more.',
  },
  about: {
    title: 'About',
    description:
      'Bilal Awan is a full-stack developer in Lahore who builds web products, Flutter apps, AI features and backend systems for remote clients.',
  },
  contact: {
    title: 'Contact: Let’s Work Together',
    description:
      'Contact Bilal Awan about a web app, Flutter mobile app, AI feature, Chrome extension or backend project.',
  },
};
