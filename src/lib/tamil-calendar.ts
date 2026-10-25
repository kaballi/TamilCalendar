import { FIXED_FESTIVALS, LUNAR_FESTIVALS, TAMIL_YEARS } from "./tamil-data";

export type CivilDate = { y: number; m: number; d: number }; // m: 1-12

const DAY = 86400000;
const rad = (x: number) => (x * Math.PI) / 180;
const norm = (x: number) => ((x % 360) + 360) % 360;

function siderealSun(ms: number): number {
  const jd = ms / DAY + 2440587.5;
  const T = (jd - 2451545) / 36525;
  const L0 = 280.46646 + 36000.76983 * T;
  const M = rad(357.52911 + 35999.05029 * T);
  const C =
    (1.914602 - 0.004817 * T) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M);
  const omega = rad(125.04 - 1934.136 * T);
  const apparent = L0 + C - 0.00569 - 0.00478 * Math.sin(omega);
  const ayanamsa = 23.853 + ((jd - 2451545) / 365.25) * 0.013969; // Lahiri
  return norm(apparent - ayanamsa);
}

const toMs = (c: CivilDate) => Date.UTC(c.y, c.m - 1, c.d);
export const fromMs = (ms: number): CivilDate => {
  const t = new Date(ms);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
};
export const addDays = (c: CivilDate, n: number) => fromMs(toMs(c) + n * DAY);
export const weekday = (c: CivilDate) => new Date(toMs(c)).getUTCDay();
export const isoKey = (c: CivilDate) =>
  `${c.y}-${String(c.m).padStart(2, "0")}-${String(c.d).padStart(2, "0")}`;
export const sameDay = (a: CivilDate, b: CivilDate) => toMs(a) === toMs(b);

// Rasi at approximate sunset in Tamil Nadu (18:00 IST = 12:30 UTC)
function rasiAtSunset(c: CivilDate): number {
  return Math.floor(siderealSun(toMs(c) + 12.5 * 3600000) / 30);
}

export type TamilDate = { month: number; day: number; yearName: string };

export function toTamil(c: CivilDate): TamilDate {
  const r = rasiAtSunset(c);
  let k = 0;
  while (k < 33 && rasiAtSunset(addDays(c, -(k + 1))) === r) k++;
  const startYear = c.m <= 4 && r >= 8 ? c.y - 1 : c.y;
  const yearName = TAMIL_YEARS[(((startYear - 1987) % 60) + 60) % 60] ?? "";
  return { month: r, day: k + 1, yearName };
}

export function tamilMonthStart(c: CivilDate): CivilDate {
  return addDays(c, -(toTamil(c).day - 1));
}

export function tamilMonthLength(start: CivilDate): number {
  const r = rasiAtSunset(start);
  let n = 1;
  while (rasiAtSunset(addDays(start, n)) === r) n++;
  return n;
}

export function tamilMonthOffset(from: CivilDate, to: CivilDate): number {
  const fromStart = tamilMonthStart(from);
  const toStart = tamilMonthStart(to);
  let cursor = fromStart;
  let offset = 0;

  while (toMs(cursor) < toMs(toStart)) {
    cursor = addDays(cursor, tamilMonthLength(cursor));
    offset++;
  }

  while (toMs(cursor) > toMs(toStart)) {
    cursor = tamilMonthStart(addDays(cursor, -1));
    offset--;
  }

  return offset;
}

export function todayIST(): CivilDate {
  return fromMs(Date.now() + 5.5 * 3600000);
}

export function festivalsOn(c: CivilDate): string[] {
  const t = toTamil(c);
  const out: string[] = [];
  for (const f of FIXED_FESTIVALS) {
    if (f.m !== t.month) continue;
    if (f.d === t.day) out.push(f.name);
    if (f.d === -1 && toTamil(addDays(c, 1)).month !== t.month) out.push(f.name);
  }
  const lunar = LUNAR_FESTIVALS[isoKey(c)];
  if (lunar) out.push(lunar);
  return out;
}
