import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Check, Heart } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-[#e8dacb] bg-[#221209] text-[#f5ebd9] px-6 pb-12 pt-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Upper Footer Grid */}
        <div className="grid gap-12 lg:grid-cols-12">

          {/* Brand & Mission Column (5 cols) */}
          <div className="lg:col-span-5">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ead9c3] text-2xl shadow-inner transition group-hover:rotate-6">
                🧁
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  BakeLytics
                </span>
                <p className="text-[9px] font-bold tracking-[0.2em] text-[#e8c59f] uppercase">
                  Bakery Operating System
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#c7b5a5]">
              Designed specifically for bakeries, pastry shops, and artisan bread houses.
              Connect every gram of raw pantry stock directly to daily batch yields and profits.
            </p>

            {/* System Status Pill */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs text-[#86efac] border border-white/10">
              <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="font-mono text-[11px] font-semibold">
                Kitchen Systems Operational • 99.98%
              </span>
            </div>
          </div>

          {/* Navigation Links Column (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#e8c59f]">
              Platform
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#c7b5a5]">
              <li>
                <a href="#home" className="hover:text-white transition">
                  Overview
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition">
                  Bento Labs
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-white transition flex items-center gap-1.5">
                  <span>ROI Calculator</span>
                  <span className="rounded bg-[#8f5839] px-1.5 py-0.2 text-[9px] font-bold text-white">
                    New
                  </span>
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition">
                  Kitchen Workflow
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition">
                  Baker Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Access / Auth Column (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#e8c59f]">
              Direct Access
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#c7b5a5]">
              <li>
                <Link to="/login" className="hover:text-[#fde047] font-semibold transition">
                  Chef Login →
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-[#fde047] font-semibold transition">
                  Start Free Trial →
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  Live Kitchen Cockpit
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#e8c59f]">
              The Baker's Gazette
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-[#c7b5a5]">
              Bi-weekly dispatch on bread baking science, butter markets, and yield optimization.
            </p>

            <form onSubmit={handleSubscribe} className="mt-4">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="chef@bakery.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 pl-3.5 pr-10 text-xs text-white placeholder-white/40 outline-none transition focus:border-[#f59e0b] focus:bg-white/15"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#f59e0b] text-[#200f06] transition hover:bg-[#fbbf24]"
                >
                  <ArrowRight size={13} />
                </button>
              </div>
              {subscribed && (
                <p className="mt-2 text-[11px] text-[#86efac] flex items-center gap-1 font-semibold">
                  <Check size={12} /> Subscribed to The Baker's Gazette!
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Lower Copyright & Legal Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row text-xs text-[#a18f83]">
          <p>
            © {new Date().getFullYear()} BakeLytics Technologies Inc. Built with reverence for traditional craftsmanship.
          </p>

          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-white transition">Privacy Notice</a>
            <a href="#home" className="hover:text-white transition">Terms of Service</a>
            <span className="text-[#e8c59f] font-mono">BakeLytics v2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

