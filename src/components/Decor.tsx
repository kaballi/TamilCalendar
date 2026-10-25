import { useEffect, useState } from "react";

const LETTERS = "அஆஇஈஉஊஎஏஐஒஓஔஃகஙசஞடணதநபமயரலவழளறன".split("");
const COLUMNS = 9;
const ROWS = 8;

type LetterSpot = {
  ch: string;
  left: number;
  top: number;
  size: number;
  rot: number;
  delay: number;
};

function randomSpots(): LetterSpot[] {
  const letters = [...LETTERS];
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }

  return Array.from({ length: COLUMNS * ROWS }, (_, i) => ({
    ch: letters[i % letters.length],
    left: ((i % COLUMNS) + 0.2 + Math.random() * 0.6) * (100 / COLUMNS),
    top: (Math.floor(i / COLUMNS) + 0.2 + Math.random() * 0.6) * (100 / ROWS),
    size: 2.4 + Math.random() * 2.4,
    rot: Math.floor(Math.random() * 61) - 30,
    delay: Math.random() * -9,
  }));
}

export function LetterBackground() {
  const [spots, setSpots] = useState<LetterSpot[]>([]);

  useEffect(() => setSpots(randomSpots()), []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {spots.map((s, i) => (
        <span
          key={i}
          className="absolute font-display text-letter animate-drift select-none"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: `clamp(1rem, ${s.size}vw, 3.5rem)`,
            "--r": `${s.rot}deg`,
            animationDelay: `${s.delay}s`,
          }}
        >
          {s.ch}
        </span>
      ))}
    </div>
  );
}

export function Thoranam() {
  return (
    <div aria-hidden className="flex h-7 w-full justify-around overflow-hidden border-b-[3px] border-border bg-maroon">
      {Array.from({ length: 28 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 30" className="h-7 w-5 animate-sway" style={{ animationDelay: `${(i % 5) * -0.6}s` }}>
          <path d="M10 0 C18 10 16 22 10 30 C4 22 2 10 10 0Z" className={i % 3 === 0 ? "fill-primary" : "fill-temple"} stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ))}
    </div>
  );
}

export function Kolam({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      {[30, 60, 90].flatMap((x) => [30, 60, 90].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r="3" className="fill-foreground" />))}
      <path
        className="animate-draw stroke-secondary"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        d="M60 15 C90 15 105 30 105 60 C105 90 90 105 60 105 C30 105 15 90 15 60 C15 30 30 15 60 15 M45 45 C60 30 75 45 75 60 C75 75 60 90 45 75 C30 60 45 45 60 45 C75 45 90 60 75 75"
      />
    </svg>
  );
}

export function Gopuram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={className} aria-hidden>
      <g className="fill-primary stroke-foreground" strokeWidth="3" strokeLinejoin="round">
        <rect x="10" y="95" width="80" height="22" />
        <rect x="18" y="75" width="64" height="20" />
        <rect x="26" y="56" width="48" height="19" />
        <rect x="33" y="39" width="34" height="17" />
        <rect x="40" y="24" width="20" height="15" />
        <path d="M36 24 Q50 4 64 24Z" className="fill-secondary" />
      </g>
      <rect x="42" y="100" width="16" height="17" className="fill-maroon stroke-foreground" strokeWidth="3" />
      {[3, 2, 1].map((n, i) => (
        <circle key={i} cx="50" cy={4 - i} r="0" />
      ))}
    </svg>
  );
}

export function ZhaMedallion() {
  return (
    <div className="relative grid size-20 place-items-center rounded-full brutal-sm bg-secondary text-secondary-foreground">
      <span className="absolute inset-1 rounded-full border-2 border-dashed border-secondary-foreground animate-spin-slow" />
      <span className="font-display text-4xl">ழ</span>
    </div>
  );
}
