import { Link } from "@tanstack/react-router";
import icon from "@/assets/induplix-supplied-icon.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-on-dark-muted">
      <div className="container-site grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-flex flex-col items-start gap-2" aria-label="Induplix home">
            <span className="inline-flex items-center gap-3">
              <img src="/Logo.png" alt="Induplix" className="h-10 w-auto object-contain rounded bg-white/95 p-1" />
            </span>
            <span className="brand-tagline">SMARTER OPERATION. STRONGER GROWTH</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            A Digital Operations Partner for chemical, engineering, and manufacturing businesses — starting with
            Gujarat's industrial clusters.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow mb-4 text-on-dark">Explore</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/solutions" className="hover:text-teal">Solutions</Link></li>
            <li><Link to="/how-we-work" className="hover:text-teal">How We Work</Link></li>
            <li><Link to="/about" className="hover:text-teal">About</Link></li>
            <li><Link to="/contact" className="hover:text-teal">Contact</Link></li>
          </ul>
        </nav>
        <div>
          <p className="eyebrow mb-4 text-on-dark">Get started</p>
          <p className="text-sm">Have a repetitive task or a process that slows your team down?</p>
          <Link to="/contact" className="mt-3 inline-block text-sm font-semibold text-teal hover:underline">
            Discuss your workflow →
          </Link>
        </div>
      </div>
      <div className="border-t border-dark-border">
        <p className="container-site py-6 text-xs">© {new Date().getFullYear()} Induplix. Smarter operations. Stronger growth.</p>
      </div>
    </footer>
  );
}
