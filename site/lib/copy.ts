/**
 * `[TODO: ...]` markers in copy are shown (highlighted) in development so
 * they're easy to find, and removed in production so they never ship.
 */
const TODO_RE = /\s*\[TODO:[^\]]*\]/g;
export const SHOW_TODOS = process.env.NODE_ENV !== 'production';

export function isTodo(text: string): boolean {
  return text.includes('[TODO');
}

/** Strips TODO markers in production. Returns '' if nothing is left. */
export function copy(text: string): string {
  if (SHOW_TODOS) return text;
  return text.replace(TODO_RE, '').trim();
}

/** Applies copy() to a list and drops items that end up empty. */
export function copyList(items: string[]): string[] {
  return items.map(copy).filter(Boolean);
}
