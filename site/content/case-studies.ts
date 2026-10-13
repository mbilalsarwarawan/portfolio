import type { CaseStudyCopy } from './types';

/**
 * Rewritten case-study copy, keyed by `projects.slug` in Supabase.
 * Original DB rows stay untouched so the two can be compared.
 * Every claim here is taken from the DB row or the bio.
 */
export const caseStudies: Record<string, CaseStudyCopy> = {
  meetdrake: {
    kicker: 'Chrome extension + CRM',
    headline: 'A LinkedIn outreach engine that runs inside the browser.',
    summary:
      'Chrome extension and Next.js CRM that turn manual LinkedIn prospecting into automated, synced campaigns. Live on the Chrome Web Store.',
    problem:
      'Teams prospecting on LinkedIn were doing it by hand. They copied profiles into spreadsheets, sent follow-ups one by one and lost track of who had already been contacted. Any tool for this had to work where the work happens, inside LinkedIn, and keep a shared CRM accurate while many users acted on the same profiles.',
    built: [
      'A Chrome extension that sits on top of LinkedIn. It extracts profile details, runs messaging campaigns and follow-up sequences, sends connection requests in controlled batches, and handles routine profile activity such as views, likes and comments.',
      'A Next.js + MongoDB dashboard that acts as the control centre: campaigns, contacts and CRM sync in one place.',
      'A sync layer between the extension and the backend, so both sides agree on state while profiles stream in.',
    ],
    decisions: [
      {
        title: 'One profile record, shared across users',
        body: 'If ten users touch the same LinkedIn profile, it is stored once. A centralised profile model with per-user relationships stops duplicate data, keeps lookups fast and keeps database costs down as the user base grows.',
      },
      {
        title: 'Sync built for concurrency',
        body: 'The extension and the CRM write to the same records. I designed the sync so hundreds of profiles can sync at the same moment without the two sides overwriting each other.',
      },
      {
        title: 'Background-script architecture',
        body: 'Long-running automation lives in the extension’s background scripts, so campaigns keep going while the user moves between tabs. The UI layer is built with Vue.js.',
      },
    ],
    result: [
      'Shipped and published on the Chrome Web Store.',
      'Duplicate profile storage removed by design, not by clean-up jobs.',
      'The extension and web dashboard share campaign and contact state.',
    ],
    stack: ['TypeScript', 'Chrome Extension APIs', 'Vue.js', 'Next.js', 'React', 'Node.js', 'MongoDB'],
    featured: true,
    order: 1,
    seoDescription:
      'Case study: a Chrome extension and Next.js/MongoDB CRM that automate LinkedIn outreach, with a deduplicated shared data model and concurrent sync.',
  },

  'nomia-docs-chatbot': {
    kicker: 'AI · RAG + SQL agents',
    headline: 'One chat box that can answer from documents and from the database.',
    summary:
      'Dual-agent assistant for NOMIA Docs that answers natural-language questions across unstructured documents and structured data, in production behind FastAPI.',
    problem:
      'NOMIA’s knowledge was split. Some answers lived in documents, others in database tables. A standard RAG chatbot handles the first and guesses at the second, so users needed one place to ask either kind of question in plain language.',
    built: [
      'A retrieval-augmented (RAG) agent that answers from unstructured documents.',
      'A SQL agent that turns questions about structured data into database queries.',
      'A FastAPI service that brings both agents behind one chat interface, packaged with Docker and served through Nginx.',
    ],
    decisions: [
      {
        title: 'Two specialised agents instead of one generalist',
        body: 'Retrieval and text-to-SQL fail in different ways. Keeping them as separate LangChain agents meant each could be prompted, tested and tightened on its own.',
      },
      {
        title: 'Boring, reliable deployment',
        body: 'The LLM is the risky part of the stack, so everything around it is deliberately plain: containerised with Docker, behind an Nginx reverse proxy, on a standard FastAPI service.',
      },
    ],
    result: [
      '99.5% uptime in production.',
      'One chat experience now handles questions across documents and structured records.',
    ],
    stack: ['Python', 'LangChain', 'FastAPI', 'Docker', 'Nginx'],
    role: 'AI / Python Engineer',
    featured: true,
    order: 2,
    seoDescription:
      'Case study: a dual-agent LLM assistant combining RAG and SQL agents (LangChain, FastAPI, Docker) that answers questions across documents and databases.',
  },

  'soul-virtue': {
    kicker: 'Telemedicine · real-time video',
    headline: 'Online therapy that works as smoothly as walking into a clinic.',
    summary:
      'Mental-health consultation platform with secure video sessions, appointment workflows and role-based access for psychologists, psychiatrists and patients.',
    problem:
      'Psychologists and psychiatrists needed to run consultations online without patching together a video tool, a calendar and email. Patients needed it to feel private and simple, and practitioners needed it to be dependable.',
    built: [
      'Secure, browser-based video consultations over WebRTC, with Socket.io handling real-time signalling.',
      'Appointment scheduling and management for practitioners and patients.',
      'JWT-based authentication and role-aware access across the platform.',
      'Frontend and backend work across the React/Node codebase, including reliability and accessibility fixes.',
    ],
    decisions: [
      {
        title: 'Peer-to-peer video in the browser',
        body: 'WebRTC keeps sessions inside the platform with no app to install, which matters when a patient is already anxious about the first appointment.',
      },
      {
        title: 'Real-time layer kept separate',
        body: 'Socket.io handles signalling and live state, while the REST API handles bookings and accounts. Each side can change without breaking the other.',
      },
    ],
    result: [
      'Live in production at soulvirtue.lv.',
      'Improved application reliability and usability for practitioners and patients.',
      'Appointments, accounts and browser-based consultations work inside one product.',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'WebRTC', 'Socket.io', 'JWT', 'Tailwind CSS'],
    featured: true,
    order: 3,
    seoDescription:
      'Case study: a telemedicine platform for mental-health professionals with WebRTC video consultations, scheduling and secure authentication.',
  },

  'lit-path': {
    kicker: 'Legacy rebuild · non-profit',
    headline: 'Turning a broken legacy site into one a non-profit can actually run.',
    summary:
      'As lead engineer, rebuilt LitPath’s outdated, unreliable platform into a modern, maintainable site with new features for a mental-health and addiction-recovery non-profit.',
    problem:
      'LitPath supports people through mental-health therapy and addiction recovery. Its website was old, unreliable and hard to change, so the organisation’s main public front door was getting in the way of its work.',
    built: [
      'A rebuilt system architecture to replace the legacy codebase.',
      'A redesigned UI/UX for the people LitPath serves.',
      'New features on top of the modernised platform.',
    ],
    decisions: [
      {
        title: 'Rebuild over patch',
        body: 'The old codebase was unreliable enough that fixing it piece by piece would have cost more than replacing it. I led a move to a maintainable structure with modern development practices.',
      },
      {
        title: 'Built for a small team to own',
        body: 'Non-profits rarely have in-house engineers, so maintainability was a feature in itself: clear structure, current tooling and fewer moving parts.',
      },
    ],
    result: [
      'Live at litpath.org on the rebuilt platform.',
      'The organisation moved from an unreliable legacy codebase to a maintainable foundation for future changes.',
    ],
    stack: ['Full-stack web', 'System modernisation', 'UI/UX'],
    role: 'Lead Engineer',
    featured: true,
    order: 4,
    seoDescription:
      'Case study: leading the rebuild of a mental-health non-profit’s legacy website into a modern, maintainable platform.',
  },

  'local-key': {
    kicker: 'Location-based marketplace',
    headline: 'Local deals, found by location and redeemed with a QR scan.',
    summary:
      'Discount platform that connects businesses with nearby customers through geolocation search, QR-code redemption and separate dashboards for businesses and admins.',
    problem:
      'Local businesses wanted to reach customers nearby, and customers wanted deals they could actually use. Both sides needed a redemption flow that could be trusted.',
    built: [
      'Geolocation-based filtering so customers see offers near them.',
      'QR-code scanning to redeem offers in store.',
      'Multi-role dashboards for businesses and admins to manage offers and see redemption analytics.',
    ],
    decisions: [
      {
        title: 'QR redemption as the source of truth',
        body: 'Each redemption is a scan, so businesses get a verifiable record instead of trusting a screenshot.',
      },
    ],
    result: ['Live at local-key.com.', 'Businesses can publish offers and verify in-person redemptions from the same platform.'],
    stack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS'],
    featured: false,
    order: 5,
    seoDescription:
      'Case study: a location-based discount platform with geolocation search, QR-code redemption and multi-role dashboards.',
  },

  'mister-clay': {
    kicker: 'E-commerce',
    headline: 'A paint store that sells online without a plugin stack.',
    summary:
      'Custom e-commerce platform for paint products: cart, Stripe checkout, inventory management and a responsive storefront.',
    problem:
      'A paint brand needed an online store it controlled, with product inventory that stays accurate and a checkout customers trust.',
    built: [
      'Storefront and shopping cart, responsive across devices.',
      'Stripe payment integration for secure checkout.',
      'Inventory management that tracks stock as orders come in.',
    ],
    decisions: [
      {
        title: 'Stripe for payments',
        body: 'Card handling and compliance stay with Stripe, so the store never touches raw card data.',
      },
    ],
    result: ['Live at misterandclay.com.', 'Customers can browse products, pay through Stripe and complete an order in one responsive storefront.'],
    stack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Stripe'],
    featured: false,
    order: 6,
    seoDescription:
      'Case study: a custom e-commerce platform for paint products with Stripe checkout and inventory management.',
  },

  quickrooms: {
    kicker: 'Hospitality operations · AI-assisted',
    headline: 'Hotel operations in one system instead of six.',
    summary:
      'Contributed to an AI-assisted hotel operations platform that brings reservations, guest services, HR and inventory into one place.',
    problem:
      'Hotels run on scattered tools for bookings, staff, stock and guest requests. QuickRooms brings them into a single platform, with AI-assisted workflows to reduce manual coordination.',
    built: [
      'Features across reservations, guest services, staff coordination and inventory tracking.',
      'Integrations and REST APIs that connect the operational modules.',
      'AI-assisted workflows inside day-to-day operations.',
    ],
    decisions: [
      {
        title: 'Automation through integration',
        body: 'Most of the efficiency comes from operational modules sharing data through APIs rather than from any single feature, so staff stop re-entering the same information in different places.',
      },
    ],
    result: ['Live at quickrooms.co.', 'Reservations, guest services, staff coordination and inventory share one operational system.'],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'AI integration'],
    featured: false,
    order: 7,
    seoDescription:
      'Case study: contributing to an AI-assisted hotel operations platform covering reservations, guest services, HR and inventory.',
  },
};
