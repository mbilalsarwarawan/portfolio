'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { UIMessage } from 'ai';

type Part = UIMessage['parts'][number];

interface ToolOutput {
  found?: boolean;
  projects?: Array<{
    title: string;
    slug: string;
    description: string;
    tags: string[];
    year: string;
    liveUrl?: string;
    githubUrl?: string;
  }>;
  url?: string;
  label?: string;
  description?: string;
  email?: string;
  location?: string;
  contactPage?: string;
  experience?: Array<{ period: string; role: string; company: string; description: string }>;
  skills?: Record<string, string[]> | string[];
  project?: { title: string; description: string; content: string; tags: string[]; year: string; role: string; liveUrl?: string; githubUrl?: string };
  message?: string;
  note?: string;
}

interface ChatMessageProps {
  message: UIMessage;
}

// Tool part type names from our server tools
const TOOL_NAMES = ['searchProjects', 'getProjectDetail', 'getExperience', 'getSkills', 'suggestNavigation', 'getContactInfo'] as const;

function isToolPart(part: Part): part is Part & { type: string; toolCallId: string; state: string; output?: unknown } {
  return TOOL_NAMES.some((name) => part.type === `tool-${name}`);
}

function getToolName(type: string): string {
  return type.replace(/^tool-/, '');
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 text-white"
          style={{ background: 'var(--accent)' }}
        >
          B
        </div>
      )}
      <div className={`max-w-[82%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {message.parts.map((part, i) => {
          // Text parts
          if (part.type === 'text') {
            return (
              <div
                key={i}
                className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isUser ? 'rounded-br-sm text-white' : 'rounded-bl-sm'
                }`}
                style={
                  isUser
                    ? { background: 'var(--accent)' }
                    : { background: 'var(--surface, color-mix(in srgb, var(--fg) 6%, transparent))', color: 'var(--fg)' }
                }
              >
                <MessageText content={part.text} />
              </div>
            );
          }

          // Tool parts
          if (isToolPart(part)) {
            const toolPart = part as Part & { type: string; toolCallId: string; state: string; output?: unknown };
            const toolName = getToolName(toolPart.type);

            if (toolPart.state !== 'output-available') return null;
            const output = toolPart.output as ToolOutput;

            if (toolName === 'searchProjects' && output.found && output.projects) {
              return (
                <div key={toolPart.toolCallId} className="flex flex-col gap-2 w-full mt-1">
                  {output.projects.map((p) => (
                    <ProjectCard key={p.slug} project={p} />
                  ))}
                </div>
              );
            }

            if (toolName === 'getProjectDetail' && output.found && output.project) {
              const p = output.project;
              return (
                <div
                  key={toolPart.toolCallId}
                  className="rounded-xl p-3 text-sm mt-1 w-full"
                  style={{ background: 'var(--surface, color-mix(in srgb, var(--fg) 6%, transparent))', border: '1px solid var(--border)' }}
                >
                  <p className="font-semibold mb-1" style={{ color: 'var(--fg)' }}>{p.title} <span className="font-normal text-xs opacity-60">({p.year})</span></p>
                  <p className="text-xs opacity-70 mb-2">{p.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {p.tags.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)' }}>{t}</span>
                    ))}
                  </div>
                  {(p.liveUrl || p.githubUrl) && (
                    <div className="flex gap-2 mt-2">
                      {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: 'var(--accent)' }}>Live ↗</a>}
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: 'var(--accent)' }}>GitHub ↗</a>}
                    </div>
                  )}
                </div>
              );
            }

            if (toolName === 'suggestNavigation' && output.url) {
              return (
                <a
                  key={toolPart.toolCallId}
                  href={output.url}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 mt-1"
                  style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}
                >
                  {output.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              );
            }

            if (toolName === 'getContactInfo' && output.email) {
              return (
                <div
                  key={toolPart.toolCallId}
                  className="rounded-xl p-3 text-sm mt-1 w-full space-y-1.5"
                  style={{ background: 'var(--surface, color-mix(in srgb, var(--fg) 6%, transparent))', border: '1px solid var(--border)' }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-2" style={{ color: 'var(--fg)' }}>Contact</p>
                  <p className="text-xs" style={{ color: 'var(--fg)' }}>📧 <a href={`mailto:${output.email}`} className="underline" style={{ color: 'var(--accent)' }}>{output.email}</a></p>
                  <p className="text-xs opacity-70" style={{ color: 'var(--fg)' }}>📍 {output.location}</p>
                  <a
                    href={output.contactPage}
                    className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                    style={{ background: 'var(--accent)', color: '#fff' }}
                  >
                    Open Contact Form ↗
                  </a>
                </div>
              );
            }

            return null;
          }

          // Skip step-start, reasoning, etc.
          return null;
        })}
      </div>
    </motion.div>
  );
}

function MessageText({ content }: { content: string }) {
  // Minimal markdown-lite: bold (**text**) and line breaks
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function ProjectCard({ project }: { project: { title: string; slug: string; description: string; tags: string[]; year: string; liveUrl?: string; githubUrl?: string } }) {
  return (
    <a
      href={`/projects/${project.slug}`}
      className="block rounded-xl p-3 transition-opacity hover:opacity-80"
      style={{ background: 'var(--surface, color-mix(in srgb, var(--fg) 6%, transparent))', border: '1px solid var(--border)' }}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--fg)' }}>{project.title}</p>
        <span className="text-xs opacity-50 flex-shrink-0" style={{ color: 'var(--fg)' }}>{project.year}</span>
      </div>
      <p className="text-xs opacity-65 mb-2 line-clamp-2" style={{ color: 'var(--fg)' }}>{project.description}</p>
      <div className="flex flex-wrap gap-1">
        {project.tags.slice(0, 3).map((t) => (
          <span key={t} className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)' }}>{t}</span>
        ))}
        {project.tags.length > 3 && (
          <span className="px-1.5 py-0.5 rounded text-xs opacity-50" style={{ color: 'var(--fg)' }}>+{project.tags.length - 3}</span>
        )}
      </div>
    </a>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="flex items-center gap-2 mb-3"
    >
      <div
        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
        style={{ background: 'var(--accent)' }}
      >
        B
      </div>
      <div
        className="px-3.5 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center"
        style={{ background: 'color-mix(in srgb, var(--fg) 6%, transparent)' }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--accent)' }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Auto-scroll hook export
export function useAutoScroll(deps: unknown[]) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
