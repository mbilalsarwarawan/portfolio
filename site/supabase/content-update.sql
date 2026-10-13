-- Idempotent portfolio content refresh.
-- Run against the linked project after schema.sql and seed.sql.

do $portfolio_content$
begin

update about
set
  bio = 'I’m Bilal, a full-stack developer based in Lahore. I build complete digital products across web, Flutter mobile, AI and backend systems, working remotely with clients and engineering teams.',
  updated_at = now();

update experiences
set
  role = 'Freelance Full-Stack Developer',
  description = 'Builds client products end to end for an Irish software company, including full-stack web apps, Chrome extensions and AI integrations for international clients.'
where company = 'Fintask.ie';

update experiences
set description = 'Built production Python products including an assistant that answers from documents and database records, an audio platform and a subscription product, using Django, FastAPI, Docker and Nginx.'
where company = 'Cherrybyte Technologies';

update experiences
set description = 'Built document-based AI assistants, Django and FastAPI services, and deployment workflows for machine-learning systems.'
where company = 'StechAi';

update experiences
set description = 'Reviewed and quality-checked computer-interaction data used to train a computer-use agent.'
where company = 'Turing';

update projects
set
  description = 'A Chrome extension and web dashboard that turn manual LinkedIn prospecting into organised, synced outreach campaigns.',
  content = 'Built the browser extension, campaign workflows and shared CRM behind MeetDrake. The extension collects approved profile details, runs messaging and follow-up activity, and keeps campaign state in sync with a Next.js dashboard. A central profile model avoids storing the same person repeatedly when several users interact with that profile.',
  role = 'Full-Stack Developer'
where slug = 'meetdrake';

update projects
set
  description = 'One assistant that answers questions from both company documents and structured business data.',
  content = 'Built two specialised assistants behind one chat experience: one retrieves answers from documents and the other translates suitable questions into database queries. Packaged the service with FastAPI and Docker and deployed it behind Nginx.',
  role = 'AI / Python Engineer'
where slug = 'nomia-docs-chatbot';

update projects
set
  description = 'A mental-health consultation platform with browser-based video sessions, appointments and role-based access for practitioners and patients.',
  content = 'Worked across the React and Node.js product to deliver secure video consultations, appointment workflows, authentication and reliability improvements for psychologists, psychiatrists and patients.'
where slug = 'soul-virtue';

update projects
set
  description = 'A modern, maintainable rebuild of an unreliable legacy site for a mental-health and addiction-recovery non-profit.',
  content = 'Led the move from an outdated codebase to a maintainable product structure, improving the public experience and creating a safer foundation for future features.',
  role = 'Lead Engineer'
where slug = 'lit-path';

update projects
set
  description = 'A location-based offers platform where customers find nearby deals and businesses verify redemptions with a QR scan.',
  content = 'Built location filtering, QR-code redemption and separate management views for businesses and administrators, including offer and redemption records.'
where slug = 'local-key';

update projects
set
  description = 'A custom online paint store with a responsive catalogue, cart, Stripe checkout and inventory management.',
  content = 'Built the shopping experience, secure Stripe checkout and stock-management workflow so customers can complete an order in one responsive storefront.'
where slug = 'mister-clay';

update projects
set
  description = 'An AI-assisted hotel operations platform that brings reservations, guest services, staff work and inventory into one system.',
  content = 'Contributed product features, integrations and APIs across hotel operations so teams can coordinate work without repeatedly entering the same information in separate tools.'
where slug = 'quickrooms';

insert into skills (name, category, display_order)
select 'Flutter', 'mobile', 1
where not exists (select 1 from skills where lower(name) = 'flutter');

insert into skills (name, category, display_order)
select 'Dart', 'mobile', 2
where not exists (select 1 from skills where lower(name) = 'dart');

insert into skills (name, category, display_order)
select 'Firebase', 'mobile', 3
where not exists (select 1 from skills where lower(name) = 'firebase');

end
$portfolio_content$;
