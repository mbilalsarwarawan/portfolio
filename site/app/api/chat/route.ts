import { groq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
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

  // Only send the last message (no conversational context) to the model
  const cappedMessages = messages.slice(-1);

  const supabase = await createClient();
  const systemPrompt = await buildSystemPrompt();

  const result = streamText({
    model: groq('qwen/qwen3-32b'),
    system: systemPrompt,
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
        execute: async ({ query }) => {
          const q = query.toLowerCase();
          const { data: allProjects } = await supabase.from('projects').select('*').order('display_order');
          const matched = (allProjects || []).filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.tags.some((t: string) => t.toLowerCase().includes(q)) ||
              (p.content || '').toLowerCase().includes(q) ||
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
              live_url: p.live_url,
              github_url: p.github_url,
            })),
          };
        },
      }),

      getProjectDetail: tool({
        description: 'Get full details about a specific project by its slug.',
        inputSchema: z.object({
          slug: z.string().describe('The project slug, e.g. "nomia-docs-chatbot"'),
        }),
        execute: async ({ slug }) => {
          const { data: project } = await supabase.from('projects').select('*').eq('slug', slug).single();
          if (!project) return { found: false };
          return { found: true, project };
        },
      }),

      getExperience: tool({
        description: "Return Bilal's full work experience timeline.",
        inputSchema: z.object({ _: z.string().optional().describe('Unused — leave empty') }),
        execute: async () => {
          const { data } = await supabase.from('experiences').select('*').order('display_order');
          return { experience: data || [] };
        },
      }),

      getSkills: tool({
        description: "Return Bilal's skills, optionally filtered by category.",
        inputSchema: z.object({
          category: z
            .string()
            .optional()
            .describe('Optional category filter: frontend, backend, database, ai/ml, devops & tools'),
        }),
        execute: async ({ category }) => {
          let query = supabase.from('skills').select('*').order('display_order');
          if (category) {
            query = query.eq('category', category.toLowerCase());
          }
          const { data } = await query;
          const grouped: Record<string, string[]> = {};
          (data || []).forEach((s) => {
            if (!grouped[s.category]) grouped[s.category] = [];
            grouped[s.category].push(s.name);
          });
          if (category) {
            const key = category.toLowerCase();
            if (grouped[key]) return { category: key, skills: grouped[key] };
            return { error: `Unknown category "${category}". Available: ${Object.keys(grouped).join(', ')}` };
          }
          return { skills: grouped };
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
        inputSchema: z.object({ _: z.string().optional().describe('Unused — leave empty') }),
        execute: async () => {
          const { data } = await supabase.from('contact_info').select('*').limit(1).single();
          return {
            email: data?.email || '',
            location: data?.location || '',
            contactPage: '/contact',
            socials: {
              github: data?.github_url || '',
              linkedin: data?.linkedin_url || '',
            },
            note: 'Best way to reach Bilal is through the contact form at /contact or via email.',
          };
        },
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
