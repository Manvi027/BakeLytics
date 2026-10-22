import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Check, ShieldCheck, Flame } from "lucide-react";
import bakeryCroissantImg from "../../assets/bakery_signup.jpg";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#faf5ed] px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[40px] border border-[#d8c5b0] bg-gradient-to-br from-[#1e0e06] via-[#2f160b] to-[#180a04] px-7 py-16 text-center text-white shadow-[0_32px_100px_rgba(30,14,6,0.35)] sm:px-16 sm:py-24">
          
          {/* Subtle warm photography backdrop */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-xs scale-105"
            style={{ backgroundImage: `url(${bakeryCroissantImg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140803]/95 via-[#1a0c06]/85 to-transparent" />

          {/* Warm glowing radiant orbs */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#e2872d]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-[#f59e0b]/20 blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#fde047] backdrop-blur-md">
              <Flame size={14} className="text-[#f59e0b] animate-pulse" />
              <span>THE KITCHEN IS HEATING UP</span>
            </div>

            {/* Headline */}
            <h2 className="mt-6 font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Stop throwing dough away.{" "}
              <span className="block bg-gradient-to-r from-[#fde68a] via-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent italic font-serif">
                Bake with surgical precision.
              </span>
            </h2>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-white/80">
              Join 1,400+ head bakers and café owners tracking flour, butter, and
              daily batch yields in real time. Setup takes less than 3 minutes.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/signup"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#f59e0b] via-[#e2872d] to-[#d97706] px-8 py-4 text-base font-bold text-[#200f06] shadow-xl shadow-amber-950/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-900/50 active:scale-95"
              >
                <span>Start 14-Day Free Kitchen Trial</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5"
              >
                <span>Chef Login</span>
              </Link>
            </div>

            {/* Bullet Points */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/75">
              <span className="flex items-center gap-1.5 font-medium">
                <Check size={14} className="text-[#86efac]" /> Free 14-day full access
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check size={14} className="text-[#86efac]" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check size={14} className="text-[#86efac]" /> Excel/CSV recipe import
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}