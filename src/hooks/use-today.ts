import { useEffect, useState } from "react";
import { todayIST, type CivilDate } from "@/lib/tamil-calendar";

export function useToday(): CivilDate | null {
  const [t, setT] = useState<CivilDate | null>(null);
  useEffect(() => setT(todayIST()), []);
  return t;
}
