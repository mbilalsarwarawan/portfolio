export interface Project {
  slug: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  year: string;
  role: string;
  content: string;
  liveUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    slug: 'devflow',
    title: 'DevFlow',
    description:
      'A real-time collaborative IDE with integrated CI/CD, live pair programming, and AI-assisted code review. Built for distributed engineering teams.',
    image: '01',
    tags: ['Next.js', 'TypeScript', 'WebSocket', 'PostgreSQL', 'Docker'],
    year: '2025',
    role: 'Full-Stack Lead',
    content:
      'DevFlow is a next-generation collaborative development environment that supports real-time code editing across multiple users. The architecture uses CRDTs for conflict-free state synchronization, WebSocket connections for sub-50ms latency, and a custom LSP bridge for cross-language intelligence. The CI/CD pipeline integrates directly into the editor workspace, giving developers instant feedback on builds and tests.',
    liveUrl: 'https://devflow.example.com',
    githubUrl: 'https://github.com/example/devflow',
  },
  {
    slug: 'finova-dashboard',
    title: 'Finova Dashboard',
    description:
      'High-frequency trading analytics dashboard processing 2M+ data points with sub-second rendering and real-time WebSocket streams.',
    image: '02',
    tags: ['React', 'D3.js', 'Node.js', 'Redis', 'AWS'],
    year: '2024',
    role: 'Frontend Architect',
    content:
      'Finova is a trading analytics platform designed for institutional investors. The dashboard renders complex candlestick charts, heatmaps, and order flow visualizations using D3.js with canvas fallback for performance. Data streams in real-time through WebSocket connections backed by Redis pub/sub. The system handles 2M+ data points while maintaining 60fps rendering through virtualized viewports and web worker offloading.',
    liveUrl: 'https://finova.example.com',
  },
  {
    slug: 'atlas-cms',
    title: 'Atlas CMS',
    description:
      'A headless content management system with visual page builder, role-based access, multi-tenant architecture, and edge-deployed API.',
    image: '03',
    tags: ['Next.js', 'GraphQL', 'MongoDB', 'Cloudflare Workers'],
    year: '2024',
    role: 'Solo Developer',
    content:
      'Atlas is a headless CMS built for agencies that need multi-tenant content management. Features include a drag-and-drop page builder, real-time preview, granular RBAC, and a GraphQL API deployed to the edge via Cloudflare Workers. The visual editor supports nested components, conditional fields, and localization across 12 languages.',
    githubUrl: 'https://github.com/example/atlas-cms',
  },
  {
    slug: 'pulse-health',
    title: 'Pulse Health',
    description:
      'Cross-platform health tracking app with wearable device integration, ML-powered insights, and HIPAA-compliant data handling.',
    image: '04',
    tags: ['React Native', 'Python', 'FastAPI', 'TensorFlow', 'PostgreSQL'],
    year: '2023',
    role: 'Full-Stack Developer',
    content:
      'Pulse Health is a comprehensive wellness platform that syncs with Apple Watch, Fitbit, and Garmin devices. The backend runs FastAPI with async processing for real-time health metrics. An ML pipeline built on TensorFlow analyzes sleep patterns, heart rate variability, and activity data to generate personalized health insights. All data handling is HIPAA-compliant with end-to-end encryption.',
    liveUrl: 'https://pulsehealth.example.com',
  },
  {
    slug: 'nexus-ecommerce',
    title: 'Nexus Commerce',
    description:
      'Headless e-commerce platform handling $3M+ annual GMV with Stripe Connect, inventory sync, and AI-powered product recommendations.',
    image: '05',
    tags: ['Next.js', 'Stripe', 'Prisma', 'Redis', 'Vercel'],
    year: '2023',
    role: 'Tech Lead',
    content:
      'Nexus is a multi-vendor e-commerce platform built on a headless architecture. It features Stripe Connect for marketplace payments, real-time inventory synchronization across vendors, and an AI recommendation engine that increased AOV by 34%. The storefront is statically generated with ISR for product pages, achieving sub-second load times globally.',
    liveUrl: 'https://nexus.example.com',
    githubUrl: 'https://github.com/example/nexus',
  },
  {
    slug: 'spectra-design',
    title: 'Spectra Design System',
    description:
      'Enterprise design system with 80+ components, Figma-to-code pipeline, automated visual regression testing, and full a11y compliance.',
    image: '06',
    tags: ['React', 'Storybook', 'TypeScript', 'Chromatic', 'Figma API'],
    year: '2023',
    role: 'Design Engineer',
    content:
      'Spectra is a design system used across 12 product teams at a Series C startup. It includes 80+ React components with full TypeScript coverage, automated visual regression testing via Chromatic, and a custom Figma plugin that syncs design tokens directly to code. Every component meets WCAG 2.1 AA standards with comprehensive keyboard navigation and screen reader support.',
    githubUrl: 'https://github.com/example/spectra',
  },
];

export const skills = {
  frontend: ['React', 'Next.js', 'TypeScript', 'Vue.js', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
  backend: ['Node.js', 'Python', 'Go', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL'],
  infrastructure: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Vercel', 'Cloudflare'],
  practices: ['System Design', 'TDD', 'Agile', 'Code Review', 'Performance Tuning', 'a11y'],
};

export const experience = [
  {
    period: '2023 — Present',
    role: 'Senior Full-Stack Engineer',
    company: 'Scale Studio',
    description: 'Leading architecture and development of high-performance web applications for startups and enterprises.',
  },
  {
    period: '2021 — 2023',
    role: 'Full-Stack Developer',
    company: 'Velocity Labs',
    description: 'Built and shipped 15+ client projects ranging from e-commerce platforms to real-time dashboards.',
  },
  {
    period: '2019 — 2021',
    role: 'Frontend Developer',
    company: 'PixelCraft Agency',
    description: 'Developed responsive web experiences and component libraries for Fortune 500 clients.',
  },
];
