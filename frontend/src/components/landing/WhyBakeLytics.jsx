import { Link } from "react-router-dom";
import {
  Sparkles,
  Star,
  Quote,
  TrendingDown,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import chefHandsImg from "../../assets/baker_hands.jpg";

const bakerStories = [
  {
    name: "Chef David Miller",
    role: "Head Baker, Golden Crust Bakery",
    location: "Austin, TX",
    quote:
      "Before BakeLytics, we would hit 6:00 AM on Saturdays only to discover our fresh butter was short by 8 kilograms. Now, the Limiter Engine warns our morning shift 48 hours in advance.",
    stat: "42% Less Waste",
    statSub: "Saved $1,340/mo in discarded dough",
    tag: "High-Volume Bakery",
    rating: 5,
  },
  {
    name: "Sarah Jenkins",
    role: "Founder & Master Baker, Hearthwood Bakery",
    location: "Portland, OR",
    quote:
      "The formula scaling engine transformed our kitchen. Sifting, mixing times, and oven temperatures are standardized across all apprentice bakers.",
    stat: "99.2% Consistency",
    statSub: "Zero miscalculated batch yields",
    tag: "Bread & Pastry Kitchen",
    rating: 5,
  },
  {
    name: "Elena Ross",
    role: "Executive Pastry Chef, Sweet Botanica Bakery",
    location: "Chicago, IL",
    quote:
      "Tracking wholesale chocolate and vanilla price changes used to be a nightmare in spreadsheets. BakeLytics immediately shows us when a cake's margin drops below 75%.",
    stat: "+9.4% Margin",
    statSub: "Reclaimed 12 hours/mo from spreadsheets",
    tag: "Bakery & Cake Shop",
    rating: 5,
  },
];

export default function WhyBakeLytics() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#faf5ed] py-24 sm:py-32 border-t border-[#ebdccb]"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ddcaa8] bg-white px-4 py-1.5 text-xs font-bold text-[var(--brown)] shadow-2xs">
            <Sparkles size={14} className="text-[#e2872d]" />
            <span>PROVEN IN REAL PRODUCTION KITCHENS</span>
          </div>

          <h2 className="mt-5 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[var(--brown-dark)]">
            Crafted for bakers who obsess over
            <span className="block italic font-serif text-[var(--brown)]">
              crumb, crust, and calm mornings.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
            Hear from artisan breadmakers and pastry chefs who traded chaotic spreadsheets
            for BakeLytics precision.
          </p>
        </div>

        {/* Stories 3-Column Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {bakerStories.map((story, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-[32px] border border-[#e8dacb] bg-[#fffdfa] p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#8f5839]"
            >
              <div>
                {/* Rating & Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex text-[#f59e0b]">
                    {[...Array(story.rating)].map((_, idx) => (
                      <Star key={idx} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <span className="rounded-full bg-[#f4ece1] px-2.5 py-0.5 text-[10px] font-bold text-[var(--brown)] border border-[#ead9c8]">
                    {story.tag}
                  </span>
                </div>

                {/* Quote */}
                <p className="mt-5 text-sm sm:text-base leading-relaxed text-[var(--brown-dark)] italic">
                  "{story.quote}"
                </p>
              </div>

              {/* Bottom Stat & Author */}
              <div className="mt-8 border-t border-[#f0e3d5] pt-5">
                <div className="rounded-2xl bg-[#faf4ec] p-3.5 border border-[#ecdcc9]">
                  <p className="font-serif text-xl font-bold text-[#16a34a]">
                    {story.stat}
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] font-medium">
                    {story.statSub}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="font-serif font-bold text-base text-[var(--brown-dark)]">
                    {story.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {story.role}
                  </p>
                  <p className="text-[11px] text-[#a18f83]">
                    {story.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Seal Banner */}
        <div className="mt-14 rounded-3xl border border-[#e8dacb] bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f4ece1] text-[var(--brown)] shadow-inner text-2xl">
              🥖
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[var(--brown-dark)]">
                Ready to bring peace of mind to tomorrow morning's bake?
              </h4>
              <p className="text-xs text-[var(--text-secondary)]">
                Join 1,400+ craft bakeries, pastry shops, and cafés.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/signup"
              className="rounded-2xl bg-[var(--brown-dark)] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#1a0e07] transition"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="rounded-2xl border border-[#d8c5b0] bg-[#faf5ed] px-5 py-3.5 text-xs sm:text-sm font-bold text-[var(--brown-dark)] hover:bg-[#faedd9] transition"
            >
              Chef Login
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

