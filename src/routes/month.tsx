import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useToday } from "@/hooks/use-today";
import {
  addDays, festivalsOn, sameDay, tamilMonthLength, tamilMonthOffset, tamilMonthStart, toTamil, weekday, type CivilDate,
} from "@/lib/tamil-calendar";
import { EN_MONTHS, EN_WEEKDAYS, TAMIL_MONTHS, TAMIL_WEEKDAYS, toTamilNumeral } from "@/lib/tamil-data";

// soft hyphen lets "Wednesday" break cleanly on very narrow phones instead of dropping a lone letter
const EN_WEEKDAYS_WRAP = EN_WEEKDAYS.map((w) => (w === "Wednesday" ? "Wed­nesday" : w));

export const Route = createFileRoute("/month")({
  head: () => ({
    meta: [
      { title: "தமிழ் மாத நாட்காட்டி | Tamil Monthly Calendar" },
      { name: "description", content: "தமிழ் மாதம் வாரியான நாட்காட்டியில் தமிழ் தேதி, ஆங்கில தேதி, தமிழ் எண்கள் மற்றும் பண்டிகைகளைப் பாருங்கள். View the Tamil monthly calendar with Tamil dates, English dates and festival days." },
      { name: "keywords", content: "தமிழ் மாத காலண்டர், தமிழ் மாத நாட்காட்டி, தமிழ் தேதி காலண்டர், தமிழ் பண்டிகை நாட்கள், Tamil monthly calendar, Tamil calendar dates, Tamil festival calendar" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "தமிழ் மாத நாட்காட்டி | Tamil Monthly Calendar" },
      { property: "og:description", content: "தமிழ் மாதம், தமிழ் தேதிகள், ஆங்கில தேதிகள் மற்றும் தமிழ் பண்டிகைகளுடன் இலவச மாத நாட்காட்டி." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tamil-thirunaal-calendar.lovable.app/month" },
      { property: "og:image", content: "https://tamil-thirunaal-calendar.lovable.app/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "தமிழ் மாத நாட்காட்டி | Tamil Monthly Calendar" },
      { name: "twitter:description", content: "தமிழ் தேதிகள் மற்றும் தமிழ் பண்டிகைகளுடன் இலவச தமிழ் மாத நாட்காட்டி." },
      { name: "twitter:image", content: "https://tamil-thirunaal-calendar.lovable.app/og-image.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://tamil-thirunaal-calendar.lovable.app/month" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "தமிழ் மாத நாட்காட்டி | Tamil Monthly Calendar",
          description: "தமிழ் மாதம் வாரியான நாட்காட்டி — தமிழ் தேதிகள், ஆங்கில தேதிகள் மற்றும் பண்டிகைகள்.",
          url: "https://tamil-thirunaal-calendar.lovable.app/month",
          inLanguage: ["ta", "en"],
          isPartOf: {
            "@type": "WebSite",
            name: "தமிழ் நாட்காட்டி",
            url: "https://tamil-thirunaal-calendar.lovable.app/",
          },
        }),
      },
    ],
  }),
  component: MonthView,
});

function MonthView() {
  const today = useToday();
  const [mode, setMode] = useState<"ta" | "en">("ta");
  const [offset, setOffset] = useState(0);
  const [taNum, setTaNum] = useState(true);
  const [birthdayValue, setBirthdayValue] = useState("");
  useEffect(() => setTaNum(localStorage.getItem("taNum") !== "0"), []);
  const flipNum = (v: boolean) => { setTaNum(v); localStorage.setItem("taNum", v ? "1" : "0"); };
  const num = (n: number) => (mode === "ta" && taNum ? toTamilNumeral(n) : String(n));
  if (!today) return <SiteShell><div className="h-96" /></SiteShell>;
  const birthday = birthdayValue
    ? (() => {
        const [y, m, d] = birthdayValue.split("-").map(Number);
        return { y, m, d };
      })()
    : null;
  const tamilBirthday = birthday ? toTamil(birthday) : null;
  const findBirthday = () => {
    if (!birthday) return;
    setMode("ta");
    setOffset(tamilMonthOffset(today, birthday));
  };

  let start: CivilDate;
  let len: number;
  if (mode === "ta") {
    start = tamilMonthStart(today);
    for (let i = 0; i < offset; i++) start = addDays(start, tamilMonthLength(start));
    for (let i = 0; i > offset; i--) start = tamilMonthStart(addDays(start, -1));
    len = tamilMonthLength(start);
  } else {
    const idx = today.y * 12 + today.m - 1 + offset;
    start = { y: Math.floor(idx / 12), m: (idx % 12) + 1, d: 1 };
    len = new Date(Date.UTC(start.y, start.m, 0)).getUTCDate();
  }
  const days = Array.from({ length: len }, (_, i) => addDays(start, i));
  const lead = weekday(start);
  const tStart = toTamil(start);
  const allFest = days.flatMap((d) => festivalsOn(d).map((f) => ({ d, f })));

  const title = mode === "ta"
    ? `${TAMIL_MONTHS[tStart.month]} — ${start.y}`
    : `${EN_MONTHS[start.m - 1]} ${start.y}`;

  const tabCls = (on: boolean) => `px-4 py-2 font-bold ${on ? "bg-primary text-primary-foreground" : "bg-card"}`;

  return (
    <SiteShell>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-between sm:gap-4">
        <div className="brutal-sm flex">
          <button className={tabCls(mode === "ta")} onClick={() => { setMode("ta"); setOffset(0); }}>தமிழ் மாதம்</button>
          <button className={`${tabCls(mode === "en")} border-l-[3px] border-border font-display`} onClick={() => { setMode("en"); setOffset(0); }}>English</button>
        </div>
        {mode === "ta" && (
          <div className="brutal-sm flex" aria-label="எண் முறை">
            <button className={tabCls(taNum)} onClick={() => flipNum(true)}>௧௨௩</button>
            <button className={`${tabCls(!taNum)} border-l-[3px] border-border font-display`} onClick={() => flipNum(false)}>123</button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <button aria-label="முந்தைய ஆண்டு" title="முந்தைய ஆண்டு" onClick={() => setOffset(offset - 12)} className="brutal-btn bg-card p-2"><ChevronsLeft /></button>
          <button aria-label="முந்தைய மாதம்" onClick={() => setOffset(offset - 1)} className="brutal-btn bg-card p-2"><ChevronLeft /></button>
          <button onClick={() => setOffset(0)} className="brutal-btn bg-temple px-3 py-2 font-bold text-temple-foreground">இன்று</button>
          <button aria-label="அடுத்த மாதம்" onClick={() => setOffset(offset + 1)} className="brutal-btn bg-card p-2"><ChevronRight /></button>
          <button aria-label="அடுத்த ஆண்டு" title="அடுத்த ஆண்டு" onClick={() => setOffset(offset + 12)} className="brutal-btn bg-card p-2"><ChevronsRight /></button>
        </div>
      </div>

      <section className="brutal mt-6 flex flex-wrap items-end gap-4 bg-card p-4 sm:p-6">
        <div className="min-w-56 flex-1">
          <label htmlFor="tamil-birthday" className="mb-2 block font-bold">
            உங்கள் தமிழ் பிறந்தநாளைக் கண்டறியுங்கள்
          </label>
          <input
            id="tamil-birthday"
            type="date"
            max={`${today.y}-${String(today.m).padStart(2, "0")}-${String(today.d).padStart(2, "0")}`}
            value={birthdayValue}
            onChange={(event) => setBirthdayValue(event.target.value)}
            className="brutal-sm w-full bg-background px-3 py-2 font-display"
          />
          {tamilBirthday && birthday && (
            <p className="mt-2 font-bold text-muted-foreground">
              {TAMIL_WEEKDAYS[weekday(birthday)]} • {TAMIL_MONTHS[tamilBirthday.month]} {num(tamilBirthday.day)}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={findBirthday}
          disabled={!birthday}
          className="brutal-btn bg-primary px-4 py-2 font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          பிறந்த தேதியை காலண்டரில் காண்க
        </button>
      </section>

      <section className="brutal mt-6 bg-card p-1 sm:p-4 md:p-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 key={title} className="animate-stamp font-tamil font-extrabold text-[clamp(2.5rem,7vw,5rem)] leading-none">{title}</h1>
            {mode === "ta" && <p className="mt-1 font-bold text-muted-foreground">{num(len)} நாட்கள்</p>}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0.5 sm:gap-1.5 md:gap-3">
          {TAMIL_WEEKDAYS.map((w, i) => (
            <div key={w} className={`min-w-0 py-1 text-center ${i === 0 ? "text-secondary" : "text-foreground"}`}>
              <div className="break-words font-tamil font-extrabold leading-tight text-[clamp(0.47rem,2.1vw,1.05rem)]">{w}</div>
              <div className="break-words font-display font-bold leading-tight text-[clamp(0.44rem,1.3vw,0.78rem)] text-muted-foreground">{EN_WEEKDAYS_WRAP[i]}</div>
            </div>
          ))}
          {Array.from({ length: lead }, (_, i) => <div key={`e${i}`} />)}
          {days.map((d) => {
            const t = toTamil(d);
            const fest = festivalsOn(d);
            const isToday = sameDay(d, today);
            const isBirthday = birthday !== null && sameDay(d, birthday);
            const big = mode === "ta" ? num(t.day) : d.d;
            const small = mode === "ta" ? `${d.d} ${(EN_MONTHS[d.m - 1] ?? "").slice(0, 3)}` : `${TAMIL_MONTHS[t.month]} ${t.day}`;
            return (
              <div
                key={d.d + "-" + d.m}
                className={`relative flex min-h-14 min-w-0 flex-col items-center justify-between overflow-hidden border-2 border-border p-0.5 text-center sm:min-h-16 sm:border-[3px] sm:p-1.5 md:min-h-24 md:items-start md:p-2 md:text-left ${
                  isToday ? "bg-primary text-primary-foreground shadow-[var(--shadow-brutal-sm)]" : fest.length ? "bg-secondary text-secondary-foreground" : "bg-background"
                } ${isBirthday ? "ring-4 ring-inset ring-secondary" : ""}`}
              >
                <span className={`max-w-full leading-tight whitespace-nowrap ${mode === "ta" && taNum ? "font-tamil font-extrabold text-[clamp(0.7rem,3.4vw,1.875rem)]" : "font-display text-[clamp(1rem,4.5vw,1.875rem)]"}`}>{big}</span>
                <span className={`max-w-full text-[9px] font-bold leading-tight sm:text-[10px] md:text-xs ${mode === "ta" ? "font-display" : ""}`}>
                  <span className="sm:hidden">
                    {mode === "ta" ? d.d : (
                      <span className="flex flex-col items-center">
                        <span className="max-w-full break-all font-tamil text-[7px]">{TAMIL_MONTHS[t.month]}</span>
                        <span className="font-tamil">{t.day}</span>
                      </span>
                    )}
                  </span>
                  <span className="hidden sm:inline">{small}</span>
                </span>
                {fest.length > 0 && <span className="hidden truncate text-[11px] font-extrabold md:block">🪔 {fest[0]}</span>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="brutal mt-6 bg-card p-6">
        <h2 className="mb-4 font-display text-2xl">இம்மாத தமிழ் பண்டிகைகள்</h2>
        {allFest.length === 0 ? (
          <p className="font-bold text-muted-foreground">இம்மாதம் முக்கிய தமிழ் பண்டிகைகள் இல்லை.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {allFest.map(({ d, f }) => {
              const t = toTamil(d);
              return (
                <li key={f + d.d} className="brutal-sm flex items-center justify-between gap-3 bg-primary px-4 py-3 text-primary-foreground">
                  <span className="text-lg font-extrabold">🪔 {f}</span>
                  <span className="text-right text-sm font-bold">{TAMIL_MONTHS[t.month]} {num(t.day)}<br /><span className="font-display">{d.d} {EN_MONTHS[d.m - 1]}</span></span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </SiteShell>
  );
}
