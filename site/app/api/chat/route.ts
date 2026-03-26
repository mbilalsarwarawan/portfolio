import { groq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import { projects, skills, experience } from '@/lib/data';
import { buildSystemPrompt } from '@/lib/chatbot-context';

// Simple in-memory rate limiter: 15 messages per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 15) return false;
  entry.count++;
  return true;
}

export async function POST(req: Request) {
  try {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let messages: any[];
  try {
    const body = await req.json();
    messages = body.messages ?? [];
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Cap conversation to last 20 messages to control token usage
  const cappedMessages = messages.slice(-20);

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(cappedMessages),
    maxOutputTokens: 1024,
    temperature: 0.7,
    stopWhen: stepCountIs(3),
    tools: {
      searchProjects: tool({
        description:
          'Search and filter Bilal\'s projects by technology, keyword, or category. Use this whenever the user asks to see projects or filter by tech.',
        inputSchema: z.object({
          query: z.string().describe('Search term — can be a tech name (e.g. "Python", "React"), project type, or keyword'),
        }),
        execute: async ({ query }): Promise<
          | { found: false; message: string }
          | { found: true; count: number; projects: { title: string; slug: string; description: string; tags: string[]; year: string; role: string; liveUrl?: string; githubUrl?: string }[] }
        > => {
          const q = query.toLowerCase();
          const matched = projects.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.tags.some((t) => t.toLowerCase().includes(q)) ||
              p.content.toLowerCase().includes(q) ||
              p.role.toLowerCase().includes(q)
          );
          if (matched.length === 0) {
            return { found: false, message: `No projects found matching "${query}".` };
          }
          return {
            found: true,
            count: matched.length,
            projects: matched.map((p) => ({
              title: p.title,
              slug: p.slug,
              description: p.description,
              tags: p.tags,
              year: p.year,
              role: p.role,
              liveUrl: p.liveUrl,
              githubUrl: p.githubUrl,
            })),
          };
        },
      }),

      getProjectDetail: tool({
        description: 'Get full details about a specific project by its slug.',
        inputSchema: z.object({
          slug: z.string().describe('The project slug, e.g. "nomia-docs-chatbot"'),
        }),
        execute: async ({ slug }): Promise<{ found: false } | { found: true; project: typeof projects[number] }> => {
          const project = projects.find((p) => p.slug === slug);
          if (!project) return { found: false };
          return { found: true, project };
        },
      }),

      getExperience: tool({
        description: "Return Bilal's full work experience timeline.",
        inputSchema: z.object({}),
        execute: async () => ({ experience }),
      }),

      getSkills: tool({
        description: "Return Bilal's skills, optionally filtered by category.",
        inputSchema: z.object({
          category: z
            .string()
            .optional()
            .describe('Optional category filter: frontend, backend, database, ai/ml, devops & tools'),
        }),
        execute: async ({ category }): Promise<{ skills: typeof skills } | { category: string; skills: string[] } | { error: string }> => {
          if (category) {
            const key = category.toLowerCase() as keyof typeof skills;
            const found = skills[key];
            if (found) return { category: key, skills: found };
            return { error: `Unknown category "${category}". Available: ${Object.keys(skills).join(', ')}` };
          }
          return { skills };
        },
      }),

      suggestNavigation: tool({
        description:
          'Suggest a page URL for the user to visit based on their intent. Returns a URL and label.',
        inputSchema: z.object({
          intent: z
            .string()
            .describe('What the user wants to do — e.g. "see all projects", "contact Bilal", "learn about him"'),
        }),
        execute: async ({ intent }) => {
          const i = intent.toLowerCase();
          if (i.includes('contact') || i.includes('hire') || i.includes('email') || i.includes('reach')) {
            return { url: '/contact', label: 'Contact Bilal', description: "Get in touch with Bilal directly." };
          }
          if (i.includes('project') || i.includes('work') || i.includes('portfolio')) {
            return { url: '/projects', label: 'View All Projects', description: "Browse all 6 projects." };
          }
          if (i.includes('about') || i.includes('bio') || i.includes('experience') || i.includes('skill')) {
            return { url: '/about', label: 'About Bilal', description: "Learn about Bilal's background and skills." };
          }
          return { url: '/', label: 'Go Home', description: "Return to the portfolio homepage." };
        },
      }),

      getContactInfo: tool({
        description: "Get Bilal's contact information and social links.",
        inputSchema: z.object({}),
        execute: async () => ({
          email: 'bilalawan9870@gmail.com',
          location: 'Lahore, Pakistan',
          contactPage: '/contact',
          socials: {
            github: 'https://github.com/bilalawanai',
            linkedin: 'https://linkedin.com/in/bilal-awan-dev',
          },
          note: 'Best way to reach Bilal is through the contact form at /contact or via email.',
        }),
      }),
    },
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      // Surface Groq function-call failures and other stream errors as readable text
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('Failed to call a function') || msg.includes('invalid_request_error')) {
        return 'Sorry, I had trouble using my tools with that request. Could you rephrase or ask something simpler?';
      }
      return 'Something went wrong. Please try again.';
    },
  });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
