import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { QuoteCard } from "@/components/QuoteCard";
import { MoonPhase } from "@/components/MoonPhase";
import { SunriseTime } from "@/components/SunriseTime";
import { useToday } from "@/hooks/use-today";
import { festivalsOn, toTamil, weekday } from "@/lib/tamil-calendar";
import { EN_MONTHS, EN_WEEKDAYS, TAMIL_MONTHS, TAMIL_WEEKDAYS } from "@/lib/tamil-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "தமிழ் நாட்காட்டி" },
      { name: "description", content: "இன்றைய தமிழ் தேதி, தமிழ் மாதம், தமிழ் வருடம் மற்றும் பண்டிகைகளை அறியுங்கள். இலவச தமிழ் நாட்காட்டி — Tamil calendar, Tamil date today, Tamil month and festival dates, கணிப்புகள் சூரியனின் நிலையை அடிப்படையாகக் கொண்டவை." },
      { name: "keywords", content: "தமிழ் நாட்காட்டி, தமிழ் காலண்டர், இன்றைய தமிழ் தேதி, தமிழ் மாதம், தமிழ் பண்டிகைகள், Tamil calendar, Tamil date today, Tamil monthly calendar, Tamil festivals" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "தமிழ் நாட்காட்டி" },
      { property: "og:description", content: "இன்றைய தமிழ் தேதி, தமிழ் மாதம் மற்றும் பண்டிகைகளை அறியுங்கள். இலவச தமிழ் நாட்காட்டி மற்றும் Tamil calendar with today's Tamil date and festival dates." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tamil-thirunaal-calendar.lovable.app/" },
      { property: "og:image", content: "https://tamil-thirunaal-calendar.lovable.app/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "தமிழ் நாட்காட்டி" },
      { name: "twitter:description", content: "இன்றைய தமிழ் தேதி, தமிழ் மாதம் மற்றும் பண்டிகைகளை அறியுங்கள் — இலவச தமிழ் நாட்காட்டி." },
      { name: "twitter:image", content: "https://tamil-thirunaal-calendar.lovable.app/og-image.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://tamil-thirunaal-calendar.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "தமிழ் நாட்காட்டி — Tamil Calendar",
          url: "https://tamil-thirunaal-calendar.lovable.app/",
          applicationCategory: "UtilitiesApplication",
          applicationSubCategory: "Tamil calendar",
          operatingSystem: "Any",
          inLanguage: ["ta", "en"],
          keywords: "தமிழ் நாட்காட்டி, இன்றைய தமிழ் தேதி, தமிழ் மாதம், தமிழ் பண்டிகைகள், Tamil calendar, Tamil date today",
          isAccessibleForFree: true,
          featureList: [
            "இன்றைய தமிழ் தேதி",
            "தமிழ் மாத நாட்காட்டி",
            "தமிழ் பண்டிகை நாட்கள்",
            "நிலா நிலை மற்றும் சூரிய உதய நேரம்",
            "Tamil date today and monthly calendar",
          ],
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          description: "இன்றைய தமிழ் தேதி, தமிழ் மாத நாட்காட்டி மற்றும் தமிழ் பண்டிகைகள் — வானியல் அடிப்படையில் கணிக்கப்படும் இலவச தமிழ் நாட்காட்டி.",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const today = useToday();
  const [swapped, setSwapped] = useState(false);
  const swap = () => setSwapped((s) => !s);

  if (!today) return <SiteShell><div className="h-96" /></SiteShell>;
  const t = toTamil(today);
  const wd = weekday(today);
  const fest = festivalsOn(today);

  const tamilBig = (
    <div key="ta-big">
      <div className="mb-2 inline-block brutal-sm bg-temple px-3 py-1 font-bold text-temple-foreground">{TAMIL_WEEKDAYS[wd]} • {today.y}</div>
      <h1 className="mt-4 flex flex-wrap items-baseline gap-x-6 font-display leading-none">
        <span className="animate-stamp font-tamil text-[clamp(3.5rem,11vw,9rem)] font-extrabold">{TAMIL_MONTHS[t.month]}</span>
        <span className="animate-stamp text-[clamp(6rem,20vw,16rem)] text-secondary [animation-delay:0.25s]">{t.day}</span>
      </h1>
    </div>
  );
  const englishBig = (
    <div key="en-big">
      <div className="mb-2 inline-block brutal-sm bg-temple px-3 py-1 font-display text-temple-foreground">{EN_WEEKDAYS[wd]} • {today.y}</div>
      <h1 className="mt-4 flex flex-wrap items-baseline gap-x-6 font-display leading-none">
        <span className="animate-stamp text-[clamp(4rem,12vw,9rem)]">{EN_MONTHS[today.m - 1]}</span>
        <span className="animate-stamp text-[clamp(6rem,20vw,16rem)] text-secondary [animation-delay:0.25s]">{today.d}</span>
      </h1>
    </div>
  );
  const corner = swapped ? (
    <div className="brutal bg-primary p-4 text-primary-foreground">
      <div className="text-sm font-bold">{TAMIL_WEEKDAYS[wd]}</div>
      <div className="font-display text-3xl">{TAMIL_MONTHS[t.month]} {t.day}</div>
      <div className="text-sm font-bold">{today.y}</div>
    </div>
  ) : (
    <div className="brutal bg-primary p-4 font-display text-primary-foreground">
      <div className="text-sm">{EN_WEEKDAYS[wd]}</div>
      <div className="text-3xl">{today.d} {EN_MONTHS[today.m - 1]}</div>
      <div className="text-sm">{today.y}</div>
    </div>
  );

  return (
    <SiteShell>
      <section className="brutal relative mt-4 overflow-hidden bg-card p-4 sm:p-6 md:p-10">
        <div className="kolam-bg absolute inset-x-0 top-0 h-3 opacity-60" />
        <div className="flex flex-col-reverse gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="min-w-0 flex-1">{swapped ? englishBig : tamilBig}</div>
          <div className="flex shrink-0 flex-row flex-wrap items-center justify-between gap-3 md:flex-col md:items-end">
            {corner}
            <button onClick={swap} className="brutal-btn inline-flex items-center gap-2 bg-secondary px-4 py-2 font-bold text-secondary-foreground">
              <ArrowLeftRight className="size-4" /> இடம் மாற்று
            </button>
          </div>
        </div>
        {fest.length > 0 && (
          <div className="mt-6 inline-block brutal-sm bg-primary px-4 py-2 text-xl font-extrabold text-primary-foreground">🪔 இன்று: {fest.join(", ")}</div>
        )}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_auto]">
        <QuoteCard />
        <div className="brutal flex min-w-0 flex-col items-center justify-center gap-5 bg-muted p-4 sm:p-6 md:flex-row">
          <MoonPhase />
          <SunriseTime date={today} />
        </div>
      </section>
    </SiteShell>
  );
}
