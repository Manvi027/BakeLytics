import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Menu, X, Sparkles, ChefHat } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 transition-all duration-300 pointer-events-none">
      <div className="mx-auto max-w-6xl pointer-events-auto">
        <nav
          className={`flex items-center justify-between rounded-full px-4 sm:px-6 py-2.5 transition-all duration-300 ${
            isScrolled
              ? "bg-[#fffdf9]/90 backdrop-blur-xl border border-[#ecdcc9] shadow-[0_12px_40px_rgba(45,24,12,0.08)]"
              : "bg-[#fffdf9]/75 backdrop-blur-md border border-[#ecdcc9]/60 shadow-sm"
          }`}
        >
          {/* Brand / Logo */}
          <Link
            to="/"
            className="group flex items-center gap-3 focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ead9c3] to-[#d6be9f] text-lg shadow-inner transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
              🧁
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl font-bold tracking-tight text-[var(--brown-dark)]">
                  BakeLytics
                </span>
                <span className="hidden xl:inline-flex items-center rounded-full bg-[#f4ece1] px-2 py-0.5 text-[10px] font-semibold text-[var(--brown)] border border-[#e4d3c0]">
                  Bakery OS
                </span>
              </div>
              <span className="hidden sm:block text-[8px] font-bold tracking-[0.2em] text-[var(--brown-light)] uppercase">
                Smart Bakery Inventory
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-[#f4ece1]/60 p-1 rounded-full border border-[#eadac7]/60">
            <a
              href="#home"
              className="rounded-full px-4 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-all duration-200 hover:bg-white hover:text-[var(--brown-dark)] hover:shadow-xs"
            >
              Overview
            </a>
            <a
              href="#features"
              className="rounded-full px-4 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-all duration-200 hover:bg-white hover:text-[var(--brown-dark)] hover:shadow-xs"
            >
              Bento Labs
            </a>
            <a
              href="#calculator"
              className="inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-all duration-200 hover:bg-white hover:text-[var(--brown-dark)] hover:shadow-xs"
            >
              <Sparkles size={12} className="text-[#e2872d]" />
              <span>ROI Calculator</span>
            </a>
            <a
              href="#how-it-works"
              className="rounded-full px-4 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-all duration-200 hover:bg-white hover:text-[var(--brown-dark)] hover:shadow-xs"
            >
              Workflow
            </a>
            <a
              href="#about"
              className="rounded-full px-4 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-all duration-200 hover:bg-white hover:text-[var(--brown-dark)] hover:shadow-xs"
            >
              Stories
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-full px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[var(--brown-dark)] transition-all duration-200 hover:bg-[#ebd9c5]/60 hover:text-[var(--brown-deep)] focus:outline-none"
            >
              Chef Login
            </Link>

            <Link
              to="/signup"
              className="group relative inline-flex items-center gap-1.5 sm:gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#8f5839] via-[#a8643c] to-[#754429] px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-[#8f5839]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#8f5839]/30 active:translate-y-0"
            >
              <span>Get Started</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              className="flex lg:hidden h-9 w-9 items-center justify-center rounded-full bg-[#f4ece1] text-[var(--brown-dark)] transition hover:bg-[#ead9c3]"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="mt-2 overflow-hidden rounded-3xl border border-[#ecdcc9] bg-[#fffdf9]/95 p-5 shadow-2xl backdrop-blur-2xl lg:hidden animate-in fade-in slide-in-from-top-3">
            <div className="flex flex-col gap-2">
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--brown-dark)] hover:bg-[#f4ece1]"
              >
                Overview
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--brown-dark)] hover:bg-[#f4ece1]"
              >
                Bento Labs
              </a>
              <a
                href="#calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--brown-dark)] hover:bg-[#f4ece1]"
              >
                <span>ROI Savings Calculator</span>
                <span className="rounded-full bg-[#faedd9] px-2 py-0.5 text-[10px] font-bold text-[#b45309]">
                  Interactive
                </span>
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--brown-dark)] hover:bg-[#f4ece1]"
              >
                Kitchen Workflow
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--brown-dark)] hover:bg-[#f4ece1]"
              >
                Baker Stories
              </a>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#f0e2d4] pt-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-[#e4d5c5] bg-white py-2.5 text-center text-xs font-semibold text-[var(--brown-dark)] shadow-xs"
                >
                  Chef Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-[#8f5839] py-2.5 text-center text-xs font-semibold text-white shadow-xs"
                >
                  Start Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}