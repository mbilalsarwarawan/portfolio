/** Shared content types for the public portfolio. */

export interface CaseStudyDecision {
  title: string;
  body: string;
}

export interface CaseStudyCopy {
  /** Short category line shown above the title, e.g. "Chrome extension + CRM". */
  kicker: string;
  /** Outcome-led headline for the case study page. */
  headline: string;
  /** One or two sentences for cards and the project grid. */
  summary: string;
  problem: string;
  built: string[];
  decisions: CaseStudyDecision[];
  result: string[];
  /** Clean stack list. Falls back to the DB tags when omitted. */
  stack?: string[];
  /** Display role, overriding the DB role when the context needs it. */
  role?: string;
  featured: boolean;
  order: number;
  seoDescription: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Service {
  id: string;
  title: string;
  outcome: string;
  body: string;
  deliverables: string[];
  /** Technical detail shown after the plain-English service description. */
  tech: string[];
  /** DB project slugs that back this service up. */
  proof: string[];
}

export interface ProcessStep {
  title: string;
  body: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  source?: string;
  href?: string;
}

export interface GlanceItem {
  label: string;
  value: string;
  detail: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PageSeo {
  title: string;
  description: string;
}
