import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/induplix-supplied-logo.png.asset.json";

const nav = [
  { to: "/solutions", label: "Solutions" },
  { to: "/how-we-work", label: "How We Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const linkCls =
    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
  const activeCls = "text-foreground bg-accent";

  return (
    <header className="site-header sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-card focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className="site-header-row container-site grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 xl:flex xl:justify-between">
        <Link to="/" aria-label="Induplix home" className="header-home min-w-0 xl:shrink-0" onClick={() => setOpen(false)}>
          <span className="header-identity flex flex-col items-center justify-center text-center">
            <img src="/Logo.png" alt="Induplix" className="h-11 w-auto max-w-[210px] object-contain rounded" />
            <span className="mt-1 text-[10px] font-semibold tracking-wider text-muted-foreground whitespace-nowrap">
              SMARTER OPERATIONS. STRONGER GROWTH.
            </span>
          </span>
        </Link>
        <nav aria-label="Main" className="hidden shrink-0 items-center gap-1 xl:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} activeProps={{ className: activeCls, "aria-current": "page" }}>
              {n.label}
            </Link>
          ))}
          <Button asChild variant="hero" className="ml-3">
            <Link to="/contact">Discuss Your Workflow</Link>
          </Button>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t bg-background xl:hidden">
          <div className="container-site flex flex-col gap-1 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`${linkCls} text-base`}
                activeProps={{ className: activeCls, "aria-current": "page" }}
              >
                {n.label}
              </Link>
            ))}
            <Button asChild variant="hero" size="lg" className="mt-2">
              <Link to="/contact" onClick={() => setOpen(false)}>
                Discuss Your Workflow
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
