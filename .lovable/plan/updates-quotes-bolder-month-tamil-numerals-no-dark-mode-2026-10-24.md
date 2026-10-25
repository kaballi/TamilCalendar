# Updates: quotes, bolder month, Tamil numerals, no dark mode

## Remove
- Rasi line ("ராசி: …") on the home page and month view.
- All gemstone cards (home page section and month view header).
- Dark mode button and dark colours; site stays in the light cream theme.

## Add: Tamil quotes
- Replace the gemstone section on the home page with a quote card: a famous saying about Tamil, the speaker's name, shown in large bold Tamil inside a brutalist card next to the kolam and ழ medallion.
- Rotates automatically every few seconds with a fade/stamp animation, plus a "அடுத்தது" (next) button.
- About 10 quotes, e.g. Bharathiyar ("யாமறிந்த மொழிகளிலே தமிழ்மொழி போல் இனிதாவது எங்கும் காணோம்"), Bharathidasan ("தமிழுக்கும் அமுதென்று பேர்"), Avvaiyar, Thiruvalluvar, Kambar, plus well-known praise of Tamil from people like G.U. Pope and Max Müller (shown in Tamil translation). Only widely documented quotes are used.

## Home page Tamil month text
- Month name ("ஐப்பசி") in extra-bold weight (800) instead of the current thin look.
- Month and day number sit on one shared baseline and are vertically centred in the card. The weekday/year tag, month+day and the English corner card line up to the same top edge, and nothing overlaps at any screen width.

## Month view: Tamil numerals
- In Tamil mode, dates show as Tamil numerals (௧, ௨, ௩ … ௩௦) by default.
- New toggle "௧௨௩ / 123" next to the Tamil/English toggle switches the numbers to regular digits. The choice is remembered.
- The festival list and month header follow the same number setting.

## Technical details
- Add a `toTamilNumeral(n)` helper (proper Tamil system: ௰ = 10, so 23 = ௨௰௩) with tests for 7, 10, 23 and 30.
- Delete `GemCard`, gem tables, RASI usage; remove `ThemeToggle` and the `.dark` block from styles.css.
- Quotes stored in `src/lib/tamil-quotes.ts`.
