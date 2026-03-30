-- Seed data for portfolio
-- Run this in the Supabase SQL Editor after running schema.sql

-- Projects
INSERT INTO projects (slug, title, description, image_url, tags, year, role, content, live_url, github_url, display_order)
VALUES
  ('loca-key', 'Loca-Key', 'A location-based discount platform with QR code scanning, geolocation filtering, and multi-role dashboards for businesses and admins managing offer redemptions.', NULL, ARRAY['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'], '2025', 'Full-Stack Developer', 'Loca-Key is a location-based discount platform that connects businesses with nearby customers. Features include QR code scanning for offer redemptions, geolocation-based filtering to discover deals, and multi-role dashboards for businesses and admins. The platform handles real-time offer management and analytics for participating businesses.', NULL, NULL, 1),
  ('mister-clay', 'Mister Clay', 'Full-featured e-commerce platform for paint products with cart functionality, Stripe payment integration, inventory management, and responsive design.', NULL, ARRAY['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Stripe'], '2025', 'Full-Stack Developer', 'Mister Clay is a complete e-commerce solution for paint products. Built with the MERN stack, it features a full shopping cart system, Stripe payment integration for secure transactions, real-time inventory management, and a fully responsive design optimized for all devices.', NULL, NULL, 2),
  ('nomia-docs-chatbot', 'NOMIA Docs Chatbot', 'Dual-agent chatbot system combining RAG and SQL agents using Langchain, enabling natural language queries across both structured and unstructured documents.', NULL, ARRAY['Python', 'Langchain', 'FastAPI', 'Docker', 'Nginx'], '2025', 'Python Developer', 'Built a dual-agent chatbot system for NOMIA Docs that combines RAG (Retrieval-Augmented Generation) and SQL agents using Langchain. The system enables natural language queries across both structured databases and unstructured documents. Deployed with FastAPI, Docker containerization, and Nginx reverse proxy, achieving 99.5% uptime in production.', NULL, NULL, 3),
  ('slaythebear', 'SlayTheBear Trading Platform', 'Trading platform built with Django featuring subscription system with Stripe integration and JWT authentication, increasing paid conversions by 25%.', NULL, ARRAY['Python', 'Django', 'Stripe', 'JWT', 'PostgreSQL'], '2025', 'Python Developer', 'Led backend development for SlayTheBear, a trading platform built with Django. Implemented a subscription system with Stripe integration and JWT authentication. The platform features secure payment processing, user management, and trading tools that helped increase paid conversions by 25%.', NULL, NULL, 4),
  ('audio-streaming-platform', 'Audio Streaming Platform', 'Audio streaming platform using Django, Celery, Redis, and HLS protocol, achieving buffer-free delivery for 500+ concurrent users.', NULL, ARRAY['Python', 'Django', 'Celery', 'Redis', 'Nginx'], '2025', 'Python Developer', 'Developed an audio streaming platform using Django, Celery for async task processing, Redis for caching, and HLS protocol for adaptive streaming. Deployed on a Linux server with Nginx, the platform achieves buffer-free audio delivery for 500+ concurrent users.', NULL, NULL, 5),
  ('ai-plant-recognition', 'AI Plant Recognition App', 'Mobile app with custom CNN model achieving 92% accuracy on 10,000+ plant images across 50 species, deployed via Firebase ML Kit for real-time inference.', NULL, ARRAY['TensorFlow', 'Keras', 'Firebase ML Kit', 'Flutter'], '2024', 'ML Developer', 'Final year project — trained a custom CNN model using TensorFlow achieving 92% accuracy on 10,000+ plant images across 50 species. Converted the model to TensorFlow Lite and deployed to Firebase ML Kit for real-time mobile inference with sub-second response time on Flutter.', NULL, NULL, 6);

-- Skills
INSERT INTO skills (name, category, display_order) VALUES
  ('React.js', 'frontend', 1),
  ('JavaScript (ES6+)', 'frontend', 2),
  ('HTML5', 'frontend', 3),
  ('CSS3', 'frontend', 4),
  ('Redux', 'frontend', 5),
  ('Tailwind CSS', 'frontend', 6),
  ('Bootstrap', 'frontend', 7),
  ('Node.js', 'backend', 1),
  ('Express.js', 'backend', 2),
  ('Python', 'backend', 3),
  ('Django', 'backend', 4),
  ('Django REST Framework', 'backend', 5),
  ('FastAPI', 'backend', 6),
  ('MongoDB', 'database', 1),
  ('PostgreSQL', 'database', 2),
  ('Redis', 'database', 3),
  ('Langchain', 'ai/ml', 1),
  ('OpenAI API', 'ai/ml', 2),
  ('RAG Systems', 'ai/ml', 3),
  ('TensorFlow', 'ai/ml', 4),
  ('Keras', 'ai/ml', 5),
  ('Docker', 'devops & tools', 1),
  ('Nginx', 'devops & tools', 2),
  ('Git', 'devops & tools', 3),
  ('GitHub', 'devops & tools', 4),
  ('Linux', 'devops & tools', 5),
  ('Celery', 'devops & tools', 6);

-- Experiences
INSERT INTO experiences (company, role, period, description, type, display_order) VALUES
  ('Fintask.ie', 'Full-Stack Developer (Freelance)', 'Aug 2025 — Present', 'Delivered 5+ web applications using MERN stack for international clients, generating $1,000+ revenue with 100% client satisfaction through effective communication and on-time delivery.', 'work', 1),
  ('Cherrybyte Technologies', 'Python Developer', 'Feb 2025 — Aug 2025', 'Developed audio streaming platforms, dual-agent chatbot systems, and trading platforms using Django, FastAPI, Langchain, and Docker with Nginx deployments.', 'work', 2),
  ('StechAi', 'Python Developer', 'Jul 2024 — Dec 2024', 'Built OpenAI-powered RAG chatbots, RESTful APIs with Django and FastAPI, and deployed ML models using Docker and MLflow.', 'work', 3),
  ('Turing', 'AI Data Annotator (Contract)', 'Jun 2025 — Jul 2025', E'Contributed to Anthropic''s Computer Use Agent model training through data annotation and quality assurance of computer interaction datasets.', 'work', 4);

-- About (single row)
INSERT INTO about (bio, resume_url) VALUES
  ('I''m a full-stack developer with 2+ years of experience building scalable web applications using MERN stack and Python frameworks. I''ve delivered 5+ production-ready applications for international clients.', NULL);

-- Contact Info (single row)
INSERT INTO contact_info (email, phone, location, github_url, linkedin_url) VALUES
  ('mbilalsarwarawan@gmail.com', '', 'Lahore, Pakistan', 'https://github.com/mbilalsarwarawan', 'https://linkedin.com/in/muhammad-awan-bilal');
