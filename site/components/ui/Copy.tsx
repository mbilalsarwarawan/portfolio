import { Fragment } from 'react';

/** Renders copy and highlights any [TODO: ...] markers (only present in development). */
export function Copy({ text }: { text: string }) {
  if (!text.includes('[TODO')) return <>{text}</>;
  const parts = text.split(/(\[TODO:[^\]]*\])/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('[TODO') ? (
          <mark key={i} className="todo-mark">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
