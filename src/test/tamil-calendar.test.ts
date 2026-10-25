import { describe, expect, it } from "vitest";
import { festivalsOn, tamilMonthOffset, toTamil } from "@/lib/tamil-calendar";

describe("tamil calendar", () => {
  it("14 Apr 2026 is Chithirai 1, year Parabhava", () => {
    const t = toTamil({ y: 2026, m: 4, d: 14 });
    expect(t.month).toBe(0);
    expect(t.day).toBe(1);
    expect(t.yearName).toBe("பராபவ");
  });
  it("14 Apr 2025 is Chithirai 1, year Visuvasu", () => {
    const t = toTamil({ y: 2025, m: 4, d: 14 });
    expect([t.month, t.day]).toEqual([0, 1]);
    expect(t.yearName).toBe("விசுவாவசு");
  });
  it("13 Apr 2026 is still Panguni", () => {
    expect(toTamil({ y: 2026, m: 4, d: 13 }).month).toBe(11);
  });
  it("finds the month offset between Tamil calendar dates", () => {
    expect(tamilMonthOffset({ y: 2026, m: 4, d: 14 }, { y: 2025, m: 4, d: 14 })).toBe(-12);
    expect(tamilMonthOffset({ y: 2026, m: 4, d: 14 }, { y: 2026, m: 4, d: 14 })).toBe(0);
  });
  it("Tamil new year is a festival", () => {
    expect(festivalsOn({ y: 2026, m: 4, d: 14 })).toContain("தமிழ் புத்தாண்டு");
  });
});

import { toTamilNumeral } from "@/lib/tamil-data";
import { TAMIL_QUOTES } from "@/lib/tamil-quotes";
describe("tamil numerals", () => {
  it("7", () => expect(toTamilNumeral(7)).toBe("௭"));
  it("10", () => expect(toTamilNumeral(10)).toBe("௰"));
  it("23", () => expect(toTamilNumeral(23)).toBe("௨௰௩"));
  it("30", () => expect(toTamilNumeral(30)).toBe("௩௰"));
});

describe("Thirukkural quote", () => {
  it("uses the requested Kural 485 wording", () => {
    expect(TAMIL_QUOTES).toContainEqual({
      text: "காலம் கருதி இருப்பர் கலங்காது ஞாலம் கருது பவர்",
      by: "திருவள்ளுவர் (குறள் 485)",
    });
  });
});
