import { useEffect, useState } from "react";

interface Countdown {
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");

/** Ticking countdown to an ISO target time, recomputed every second. */
export function useCountdown(targetIso: string): Countdown {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, new Date(targetIso).getTime() - Date.now())
  );

  useEffect(() => {
    const target = new Date(targetIso).getTime();
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  const totalSeconds = Math.floor(remaining / 1000);
  return {
    hours: pad(Math.floor(totalSeconds / 3600)),
    minutes: pad(Math.floor((totalSeconds % 3600) / 60)),
    seconds: pad(totalSeconds % 60),
    isExpired: remaining <= 0,
  };
}
