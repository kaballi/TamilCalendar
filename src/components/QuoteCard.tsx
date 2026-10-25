import { useEffect, useState } from "react";
import { TAMIL_QUOTES } from "@/lib/tamil-quotes";

export function QuoteCard() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % TAMIL_QUOTES.length), 7000);
    return () => clearInterval(id);
  }, [i]);
  const q = TAMIL_QUOTES[i] ?? TAMIL_QUOTES[0]!;
  return (
    <div className="brutal flex min-w-0 flex-col justify-between gap-4 bg-card p-4 sm:p-6">
      <blockquote key={i} className="animate-stamp">
        <p className="text-xl font-extrabold leading-snug sm:text-2xl md:text-3xl">“{q.text}”</p>
        <footer className="mt-3 inline-block brutal-sm bg-temple px-3 py-1 font-bold text-temple-foreground">— {q.by}</footer>
      </blockquote>
      <button onClick={() => setI((i + 1) % TAMIL_QUOTES.length)} className="brutal-btn self-start bg-primary px-4 py-2 font-bold text-primary-foreground">
        அடுத்தது →
      </button>
    </div>
  );
}
