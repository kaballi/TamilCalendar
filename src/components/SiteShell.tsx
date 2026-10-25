import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Coffee } from "lucide-react";
import { BMC_URL } from "@/lib/tamil-data";
import { LetterBackground, Thoranam } from "./Decor";
import logo from "@/assets/logo.webp";

export function CoffeeButton() {
  return (
    <a href={BMC_URL} target="_blank" rel="noreferrer" className="brutal-btn inline-flex items-center gap-2 bg-primary px-3 py-2 font-display text-sm text-primary-foreground">
      <Coffee className="size-4" /> Buy Me a Coffee
    </a>
  );
}

const navCls = "brutal-btn bg-card px-3 py-2 font-bold";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <LetterBackground />
      <Thoranam />
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:py-5">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="தமிழ் நாட்காட்டி" className="size-14" />
          <span className="font-display text-2xl leading-none">தமிழ்<br /><span className="text-secondary">நாட்காட்டி</span></span>
        </Link>
        <nav className="flex flex-wrap items-center gap-3">
          <Link to="/" className={navCls} activeProps={{ className: "!bg-primary" }} activeOptions={{ exact: true }}>முகப்பு</Link>
          <Link to="/month" className={navCls} activeProps={{ className: "!bg-primary" }}>மாத காட்சி</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl pb-16 pl-3 pr-5 sm:px-4">{children}</main>
      <footer className="border-t-[3px] border-border bg-maroon py-6 text-maroon-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
          <p className="font-bold leading-relaxed">
            காலம் கருதி இருப்பர் கலங்காது ஞாலம் கருது பவர்
            <span className="ml-2 text-sm opacity-80">— திருவள்ளுவர் (குறள் 485)</span>
          </p>
          <CoffeeButton />
        </div>
      </footer>
    </div>
  );
}
