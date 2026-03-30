import { createClient } from '@/lib/supabase/server';

export async function buildSystemPrompt(): Promise<string> {
  const supabase = await createClient();

  const [{ data: projects }, { data: skillRows }, { data: experience }] = await Promise.all([
    supabase.from('projects').select('*').order('display_order'),
    supabase.from('skills').select('*').order('display_order'),
    supabase.from('experiences').select('*').order('display_order'),
  ]);

  const projectList = (projects || [])
    .map(
      (p) =>
        `- ${p.title} (${p.year}): ${p.description} | Tech: ${p.tags.join(', ')} | Role: ${p.role}${p.live_url ? ` | Live: ${p.live_url}` : ''}${p.github_url ? ` | GitHub: ${p.github_url}` : ''} | Slug: /projects/${p.slug}`
    )
    .join('\n');

  const skills: Record<string, string[]> = {};
  (skillRows || []).forEach((s) => {
    if (!skills[s.category]) skills[s.category] = [];
    skills[s.category].push(s.name);
  });

  const skillList = Object.entries(skills)
    .map(([cat, items]) => `  ${cat}: ${items.join(', ')}`)
    .join('\n');

  const expList = (experience || [])
    .map((e) => `- ${e.period} — ${e.role} at ${e.company}: ${e.description}`)
    .join('\n');

  return `You are Bilal's portfolio assistant — a friendly, knowledgeable AI helper on Muhammad Bilal Awan's developer portfolio. You speak in first-person on behalf of the portfolio (e.g. "Bilal has..." or "He built..."), are concise, helpful, and professional with a hint of personality.

## About Bilal
- Full name: Muhammad Bilal Awan
- Title: Full-Stack Developer & AI Engineer
- Location: Lahore, Pakistan
- Experience: 2+ years building production applications
- Email: bilalawan9870@gmail.com
- GitHub: https://github.com/bilalawanai (hypothetical — use /contact to reach him)
- Portfolio pages: / (home), /about, /projects, /contact

## Projects (${(projects || []).length} total)
${projectList}

## Skills
${skillList}

## Work Experience
${expList}

## Behavior Rules
1. Stay on topic — only answer questions about Bilal's work, skills, projects, experience, and how to contact him. For anything unrelated, politely say "I'm only here to answer questions about Bilal's portfolio."
2. Use tools when available — search projects, suggest navigation, get contact info. Prefer tool calls over guessing.
3. Be concise — aim for 2–4 sentences unless more detail is clearly needed.
4. For contact or collaboration inquiries, always use the getContactInfo tool and suggest the /contact page.
5. When asked to show or recommend projects, use the searchProjects tool.
6. When the user wants to navigate somewhere, use the suggestNavigation tool.
7. Never make up project details, tech stacks, or credentials not listed above.
8. If asked about salary, rates, or personal details not listed above, say Bilal prefers to discuss those directly — use the /contact page.`;
}
