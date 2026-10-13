'use client';

import { useEffect, useState } from 'react';

/** Live local time for a time zone. Renders a stable placeholder on the server to avoid hydration mismatch. */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <time suppressHydrationWarning className="tabular-nums">
      {time ?? '--:--'}
    </time>
  );
}
