const SYNODIC = 29.530588853;
const NEW_MOON_REF = Date.UTC(2000, 0, 6, 18, 14);

export function moonAge(ms: number) {
  const a = ((ms - NEW_MOON_REF) / 86400000) % SYNODIC;
  return a < 0 ? a + SYNODIC : a;
}

export function moonPhaseName(age: number) {
  if (age < 1 || age > SYNODIC - 1) return "அமாவாசை";
  if (Math.abs(age - SYNODIC / 2) < 1) return "பௌர்ணமி";
  return age < SYNODIC / 2 ? "வளர்பிறை" : "தேய்பிறை";
}

export function MoonPhase() {
  const age = moonAge(Date.now());
  const frac = age / SYNODIC;
  const illum = Math.round(((1 - Math.cos(2 * Math.PI * frac)) / 2) * 100);
  const waxing = frac < 0.5;
  const r = 40;
  const k = Math.cos(2 * Math.PI * frac); // 1 new, -1 full
  const rx = Math.abs(k) * r;
  // lit limb on the right when waxing
  const sweepOuter = waxing ? 1 : 0;
  const sweepInner = k > 0 ? (waxing ? 0 : 1) : waxing ? 1 : 0;
  const d = `M50 ${50 - r} A${r} ${r} 0 0 ${sweepOuter} 50 ${50 + r} A${rx} ${r} 0 0 ${sweepInner} 50 ${50 - r}Z`;
  const tithi = Math.min(15, Math.floor((age % (SYNODIC / 2)) / (SYNODIC / 30)) + 1);
  return (
    <div className="flex min-w-0 items-center gap-3 sm:gap-5">
      <svg viewBox="0 0 100 100" className="size-20 shrink-0 sm:size-28" aria-label="இன்றைய நிலவு">
        <circle cx="50" cy="50" r={r} className="fill-ink stroke-foreground" strokeWidth="3" />
        <path d={d} className="fill-primary" />
        <circle cx="50" cy="50" r={r} fill="none" className="stroke-foreground" strokeWidth="3" />
      </svg>
      <div>
        <div className="text-sm font-bold text-muted-foreground">இன்றைய நிலவு</div>
        <div className="font-tamil text-2xl font-extrabold sm:text-3xl">{moonPhaseName(age)}</div>
        <div className="mt-1 font-bold">திதி {tithi} • ஒளி {illum}%</div>
      </div>
    </div>
  );
}
