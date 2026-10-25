# Tamil Calendar (தமிழ் நாட்காட்டி) - Micro SaaS

All interface text in Tamil; English only for the Gregorian date, month names, and the Buy Me a Coffee link label.

## Pages

**Home (/)**
- Huge neo-brutalist display of today's Tamil month and day (e.g. "ஐப்பசி 8"), plus Tamil year name (e.g. விசுவாவசு) and Tamil weekday.
- Top-right corner card: English date (e.g. "Saturday, 24 October 2026").
- "இடம் மாற்று" (swap) button flips positions: English becomes huge, Tamil moves to the corner. Choice remembered on the device.
- Gemstone card for the current month (Tamil name + stone colour swatch).

**Month view (/maadham)**
- Grid of the current Tamil month (e.g. ஐப்பசி from day 1 to its last day), each cell showing the Tamil date large and the English date small.
- Toggle "தமிழ் / English" switches the grid between Tamil-month layout and English-month layout (English month cells show Tamil date small).
- Previous / next month arrows.
- Tamil festivals only, marked on their dates with a small badge and listed below the grid (e.g. தை பொங்கல், தமிழ் புத்தாண்டு, ஆடிப்பெருக்கு, கார்த்திகை தீபம், தைப்பூசம், பங்குனி உத்திரம், வைகாசி விசாகம், ஆடி அமாவாசை, தீபாவளி, மாட்டுப் பொங்கல், காணும் பொங்கல், போகி). Fixed-date ones calculated; moon/star-based ones from a curated list for 2025–2027.
- Month header grouped with its gemstone: Tamil month mapped to its rasi gemstone (e.g. சித்திரை - மாணிக்கம் / Ruby for Mesha), and the English month's birthstone shown alongside.

**Shared**
- Header with nav (முகப்பு, மாத காட்சி), light/dark toggle (remembered), and a bold "Buy Me a Coffee ☕" button linking to https://buymeacoffee.com/prasathari (also in the footer).

## Design
- Neo-brutalism with a Tamil Nadu ethnic feel: thick black borders, hard offset shadows, flat colours inspired by Kanchipuram silk and temples — turmeric yellow, kumkum red, temple green, maroon on cream; dark mode on near-black with the same accents. No gradients.
- Background: Tamil letters (அ, ஆ, க, ங, ழ, ஃ ...) scattered in bold outlined type, slowly drifting, low contrast so text stays readable.
- Ethnic decorations: kolam dot-pattern borders, temple gopuram silhouette and thoranam (mango-leaf garland) strip in the header, drawn as simple flat illustrations.
- Tamil-themed animations: kolam lines drawing themselves on load, the huge Tamil date "stamping" in letter by letter, a rotating "ழ" medallion, floating letters gently bobbing, swap/toggle buttons with chunky press effects. Animations pause for users who prefer reduced motion.
- Fonts: "Mukta Malar" / "Catamaran" for Tamil, "Archivo Black" for English numerals and headings.

## Technical details
- No backend or payments needed; all calculation runs in the browser.
- Tamil solar month computed astronomically: sun's sidereal longitude (Lahiri ayanamsa) determines the month (each 30° rasi = one month); the month starts on the day of sankranti (sunset rule used by Tamil calendars). Implemented in `src/lib/tamil-calendar.ts` with a small solar-position algorithm (Meeus low-precision).
- Data tables: Tamil month names, weekdays, 60-year cycle names, rasi gemstones, Gregorian birthstones in `src/lib/tamil-data.ts`.
- Tests for known dates (e.g. 14 Apr 2026 = சித்திரை 1, 24 Oct 2026 = ஐப்பசி 7/8 verified against panchangam).
- Theme via `.dark` class with tokens in `src/styles.css`; per-route Tamil titles/descriptions in head().
