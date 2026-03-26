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
    slug: 'loca-key',
    title: 'Loca-Key',
    description:
      'A location-based discount platform with QR code scanning, geolocation filtering, and multi-role dashboards for businesses and admins managing offer redemptions.',
    image: '01',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    year: '2025',
    role: 'Full-Stack Developer',
    content:
      'Loca-Key is a location-based discount platform that connects businesses with nearby customers. Features include QR code scanning for offer redemptions, geolocation-based filtering to discover deals, and multi-role dashboards for businesses and admins. The platform handles real-time offer management and analytics for participating businesses.',
  },
  {
    slug: 'mister-clay',
    title: 'Mister Clay',
    description:
      'Full-featured e-commerce platform for paint products with cart functionality, Stripe payment integration, inventory management, and responsive design.',
    image: '02',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Stripe'],
    year: '2025',
    role: 'Full-Stack Developer',
    content:
      'Mister Clay is a complete e-commerce solution for paint products. Built with the MERN stack, it features a full shopping cart system, Stripe payment integration for secure transactions, real-time inventory management, and a fully responsive design optimized for all devices.',
  },
  {
    slug: 'nomia-docs-chatbot',
    title: 'NOMIA Docs Chatbot',
    description:
      'Dual-agent chatbot system combining RAG and SQL agents using Langchain, enabling natural language queries across both structured and unstructured documents.',
    image: '03',
    tags: ['Python', 'Langchain', 'FastAPI', 'Docker', 'Nginx'],
    year: '2025',
    role: 'Python Developer',
    content:
      'Built a dual-agent chatbot system for NOMIA Docs that combines RAG (Retrieval-Augmented Generation) and SQL agents using Langchain. The system enables natural language queries across both structured databases and unstructured documents. Deployed with FastAPI, Docker containerization, and Nginx reverse proxy, achieving 99.5% uptime in production.',
  },
  {
    slug: 'slaythebear',
    title: 'SlayTheBear Trading Platform',
    description:
      'Trading platform built with Django featuring subscription system with Stripe integration and JWT authentication, increasing paid conversions by 25%.',
    image: '04',
    tags: ['Python', 'Django', 'Stripe', 'JWT', 'PostgreSQL'],
    year: '2025',
    role: 'Python Developer',
    content:
      'Led backend development for SlayTheBear, a trading platform built with Django. Implemented a subscription system with Stripe integration and JWT authentication. The platform features secure payment processing, user management, and trading tools that helped increase paid conversions by 25%.',
  },
  {
    slug: 'audio-streaming-platform',
    title: 'Audio Streaming Platform',
    description:
      'Audio streaming platform using Django, Celery, Redis, and HLS protocol, achieving buffer-free delivery for 500+ concurrent users.',
    image: '05',
    tags: ['Python', 'Django', 'Celery', 'Redis', 'Nginx'],
    year: '2025',
    role: 'Python Developer',
    content:
      'Developed an audio streaming platform using Django, Celery for async task processing, Redis for caching, and HLS protocol for adaptive streaming. Deployed on a Linux server with Nginx, the platform achieves buffer-free audio delivery for 500+ concurrent users.',
  },
  {
    slug: 'ai-plant-recognition',
    title: 'AI Plant Recognition App',
    description:
      'Mobile app with custom CNN model achieving 92% accuracy on 10,000+ plant images across 50 species, deployed via Firebase ML Kit for real-time inference.',
    image: '06',
    tags: ['TensorFlow', 'Keras', 'Firebase ML Kit', 'Flutter'],
    year: '2024',
    role: 'ML Developer',
    content:
      'Final year project — trained a custom CNN model using TensorFlow achieving 92% accuracy on 10,000+ plant images across 50 species. Converted the model to TensorFlow Lite and deployed to Firebase ML Kit for real-time mobile inference with sub-second response time on Flutter.',
  },
];

export const skills = {
  frontend: ['React.js', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Redux', 'Tailwind CSS', 'Bootstrap'],
  backend: ['Node.js', 'Express.js', 'Python', 'Django', 'Django REST Framework', 'FastAPI'],
  database: ['MongoDB', 'PostgreSQL', 'Redis'],
  'ai/ml': ['Langchain', 'OpenAI API', 'RAG Systems', 'TensorFlow', 'Keras'],
  'devops & tools': ['Docker', 'Nginx', 'Git', 'GitHub', 'Linux', 'Celery'],
};

export const experience = [
  {
    period: 'Aug 2025 — Present',
    role: 'Full-Stack Developer (Freelance)',
    company: 'Fintask.ie',
    description: 'Delivered 5+ web applications using MERN stack for international clients, generating $1,000+ revenue with 100% client satisfaction through effective communication and on-time delivery.',
  },
  {
    period: 'Feb 2025 — Aug 2025',
    role: 'Python Developer',
    company: 'Cherrybyte Technologies',
    description: 'Developed audio streaming platforms, dual-agent chatbot systems, and trading platforms using Django, FastAPI, Langchain, and Docker with Nginx deployments.',
  },
  {
    period: 'Jul 2024 — Dec 2024',
    role: 'Python Developer',
    company: 'StechAi',
    description: 'Built OpenAI-powered RAG chatbots, RESTful APIs with Django and FastAPI, and deployed ML models using Docker and MLflow.',
  },
  {
    period: 'Jun 2025 — Jul 2025',
    role: 'AI Data Annotator (Contract)',
    company: 'Turing',
    description: 'Contributed to Anthropic\'s Computer Use Agent model training through data annotation and quality assurance of computer interaction datasets.',
  },
];
