import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bakerySignupImg from "../../assets/bakery_signup.jpg";
import { registerUser, isAuthenticated } from "../../services/authService";
import SocialAuthSection from "../../components/auth/SocialAuthSection";

export default function Signup() {
  const navigate = useNavigate();
  const [bakeryName, setBakeryName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Auto-redirect if already logged in so user cannot see signup page on going back
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // Email format validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service to continue.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter your user name.");
      return;
    }

    if (name.trim().length < 3) {
      setError("User name must be at least 3 characters.");
      return;
    }

    if (!email.trim() || !isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({
        username: name.trim(),
        email: email.trim(),
        password,
        bakeryName: bakeryName.trim() || "My Bakery",
      });
      setSuccess("Account created successfully! Navigating to dashboard...");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 400);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#24140b] px-4 py-8 sm:px-6 lg:px-8">
      {/* Ambient background with warm bakery atmosphere */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-lg scale-105"
        style={{ backgroundImage: `url(${bakerySignupImg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1b0d06]/90 via-[#2a170d]/80 to-[#180c05]/95" />

      {/* Warm animated ambient glowing orbs */}
      <div className="login-orb login-orb-one opacity-60" />
      <div className="login-orb login-orb-two opacity-60" />

      {/* Floating Exit / Home Link on top-left of page */}
      <Link
        to="/"
        className="fixed top-5 left-5 z-30 flex items-center gap-2 rounded-full bg-black/40 px-3.5 py-2 text-xs font-medium text-white/85 backdrop-blur-md border border-white/10 transition-all hover:bg-black/60 hover:text-white"
      >
        <span className="text-base leading-none">←</span>
        <span>Back to Home</span>
      </Link>

      {/* Center Modal Split-Card */}
      <div className="auth-modal-card relative z-20 grid w-full max-w-[980px] overflow-hidden rounded-[30px] border border-[#e8d9c7]/80 bg-white shadow-[0_28px_85px_rgba(25,12,6,0.4)] lg:grid-cols-[1.08fr_0.92fr]">
        
        {/* Mobile top image banner */}
        <div className="relative h-44 w-full overflow-hidden bg-[#180e08] lg:hidden">
          <img
            src={bakerySignupImg}
            alt="Fresh Bakery Pastries"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <Link
            to="/"
            aria-label="Close"
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
          >
            <X size={16} />
          </Link>
          <div className="absolute bottom-4 left-5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ead9c3] text-lg shadow">
              🧁
            </div>
            <div>
              <p className="font-serif text-xl font-bold text-white leading-tight">
                BakeLytics
              </p>
              <p className="text-[8px] tracking-[0.15em] text-[#ead9c3] uppercase">
                Bakery Inventory
              </p>
            </div>
          </div>
        </div>

        {/* LEFT COLUMN: Clean Form Panel */}
        <section className="flex flex-col justify-between p-7 sm:p-10 lg:p-11 bg-white">
          <div>
            {/* Desktop Brand Header */}
            <div className="hidden lg:flex items-center justify-between">
              <Link to="/" className="group flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ead9c3] text-lg shadow-sm transition-transform duration-200 group-hover:scale-105">
                  🧁
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold tracking-tight text-[var(--brown-dark)]">
                    BakeLytics
                  </span>
                  <p className="text-[8px] font-semibold tracking-[0.18em] text-[var(--brown-light)] uppercase">
                    Know your stock • Bake smarter
                  </p>
                </div>
              </Link>

              <span className="rounded-full bg-[#faf2e8] px-3 py-1 text-[11px] font-semibold text-[var(--brown)] border border-[#ede0cf]">
                Free Trial
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="mt-4 sm:mt-7">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--brown-dark)]">
                Create Your Account
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Start managing raw ingredients, batch costs, and daily yields.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 animate-fadeIn">
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 p-3 text-xs font-medium text-green-700 animate-fadeIn">
                <Check size={16} className="shrink-0 text-green-600" />
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
              {/* Bakery Name & User Name in 2 columns on tablets/desktops */}
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {/* Bakery Name */}
                <div>
                  <label
                    htmlFor="bakery-name"
                    className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#6d5747]"
                  >
                    Bakery Name
                  </label>
                  <div className="relative flex items-center">
                    <Building2
                      size={17}
                      className="absolute left-3.5 text-[#a8907e] pointer-events-none transition-colors"
                    />
                    <input
                      id="bakery-name"
                      type="text"
                      required
                      value={bakeryName}
                      onChange={(e) => setBakeryName(e.target.value)}
                      placeholder="Enter bakery name"
                      className="w-full rounded-xl border border-[#e4d6c6] bg-[#fdfbf7] py-2.5 pl-10 pr-3 text-sm text-[var(--brown-dark)] placeholder-[#ad9d90] outline-none transition-all duration-200 focus:border-[var(--brown)] focus:bg-white focus:ring-4 focus:ring-[#8f5839]/10"
                    />
                  </div>
                </div>

                {/* User Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#6d5747]"
                  >
                    User Name
                  </label>
                  <div className="relative flex items-center">
                    <UserRound
                      size={17}
                      className="absolute left-3.5 text-[#a8907e] pointer-events-none transition-colors"
                    />
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter user name"
                      className="w-full rounded-xl border border-[#e4d6c6] bg-[#fdfbf7] py-2.5 pl-10 pr-3 text-sm text-[var(--brown-dark)] placeholder-[#ad9d90] outline-none transition-all duration-200 focus:border-[var(--brown)] focus:bg-white focus:ring-4 focus:ring-[#8f5839]/10"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#6d5747]"
                >
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail
                    size={17}
                    className="absolute left-3.5 text-[#a8907e] pointer-events-none transition-colors"
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full rounded-xl border border-[#e4d6c6] bg-[#fdfbf7] py-2.5 pl-10 pr-10 text-sm text-[var(--brown-dark)] placeholder-[#ad9d90] outline-none transition-all duration-200 focus:border-[var(--brown)] focus:bg-white focus:ring-4 focus:ring-[#8f5839]/10"
                  />

                  {/* Dynamic Validation checkmark badge */}
                  {isEmailValid && (
                    <div
                      title="Valid Email format"
                      className="auth-check-pop absolute right-3.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-sm"
                    >
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#6d5747]"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <LockKeyhole
                    size={17}
                    className="absolute left-3.5 text-[#a8907e] pointer-events-none transition-colors"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-[#e4d6c6] bg-[#fdfbf7] py-2.5 pl-10 pr-10 text-sm tracking-wider text-[var(--brown-dark)] placeholder-[#ad9d90] outline-none transition-all duration-200 focus:border-[var(--brown)] focus:bg-white focus:ring-4 focus:ring-[#8f5839]/10"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-lg text-[#8f7c70] transition hover:bg-[#f3e6d8] hover:text-[var(--brown-dark)]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="flex flex-1 gap-1">
                      <div
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          strength >= 1 ? "bg-[#e11d48]" : "bg-[#e5e7eb]"
                        }`}
                      />
                      <div
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          strength >= 2 ? "bg-[#f59e0b]" : "bg-[#e5e7eb]"
                        }`}
                      />
                      <div
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          strength >= 3 ? "bg-[#10b981]" : "bg-[#e5e7eb]"
                        }`}
                      />
                      <div
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          strength >= 4 ? "bg-[#059669]" : "bg-[#e5e7eb]"
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-[#8a7566]">
                      {strength <= 1 && "Weak"}
                      {strength === 2 && "Fair"}
                      {strength === 3 && "Good"}
                      {strength >= 4 && "Strong"}
                    </span>
                  </div>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setAgreedToTerms((prev) => !prev)}
                  className="group flex cursor-pointer items-start gap-2.5 text-xs text-[var(--text-secondary)] select-none text-left"
                >
                  <div
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-all duration-200 ${
                      agreedToTerms
                        ? "border-[#16a34a] bg-[#16a34a] text-white shadow-sm"
                        : "border-[#cfc0b1] bg-white group-hover:border-[var(--brown)]"
                    }`}
                  >
                    {agreedToTerms && <Check size={11} strokeWidth={3} />}
                  </div>
                  <span className="leading-snug">
                    I agree to BakeLytics{" "}
                    <span className="font-semibold text-[var(--brown)] hover:underline">
                      Terms
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-[var(--brown)] hover:underline">
                      Privacy Policy
                    </span>
                  </span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative mt-2 flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#8f5839] to-[#754429] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#8f5839]/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8f5839]/35 active:translate-y-0 active:scale-[0.99] disabled:opacity-75"
              >
                {isLoading ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Third-Party Authentication (Google, GitHub, Facebook) */}
            <SocialAuthSection
              defaultBakeryName={bakeryName}
              onSuccess={() => {
                setSuccess("Account ready! Navigating to dashboard...");
                setTimeout(() => {
                  navigate("/dashboard", { replace: true });
                }, 300);
              }}
            />
          </div>

          {/* Bottom Switch Link */}
          <div className="mt-6 border-t border-[#f0e4d7] pt-4 text-center">
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[var(--brown)] transition-colors hover:text-[var(--brown-dark)] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </section>

        {/* RIGHT COLUMN: Rich Bakery Pastry Image Panel */}
        <section className="relative hidden overflow-hidden bg-[#150b06] lg:block">
          {/* Animated Slow Ken-Burns Image */}
          <img
            src={bakerySignupImg}
            alt="Fresh Bakery Pastries"
            className="auth-kenburns h-full w-full object-cover object-center"
          />

          {/* Dark Luxury Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#150a04]/90 via-black/25 to-black/30 pointer-events-none" />

          {/* Top Close / Return to Home Button */}
          <Link
            to="/"
            title="Return to website"
            className="absolute top-6 right-6 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/85 backdrop-blur-md border border-white/20 transition-all duration-200 hover:bg-black/70 hover:text-white hover:scale-110"
          >
            <X size={17} />
          </Link>

          {/* Top Badge */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-2 rounded-full bg-black/45 px-3.5 py-1.5 text-xs font-medium text-[#f5ebd9] backdrop-blur-md border border-white/15 shadow-sm">
            <Sparkles size={13} className="text-[#f59e0b]" />
            <span>Join 1,400+ Smart Bakeries</span>
          </div>

          {/* Bottom Glassmorphic Feature Badge */}
          <div className="auth-float-badge absolute bottom-8 left-8 right-8 z-20 rounded-2xl border border-white/20 bg-black/55 p-4 text-white backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-2xl backdrop-blur-sm shadow-inner">
                🥐
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-white">
                  Bake with Confidence
                </h3>
                <p className="mt-0.5 text-xs text-white/75 leading-relaxed">
                  Turn raw flour, butter & sugar into predictable, profitable daily batches.
                </p>
              </div>
            </div>

            <div className="mt-3.5 flex items-center justify-between border-t border-white/15 pt-2.5 text-[11px] text-[#edd5be]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
                Zero Setup Fee
              </span>
              <span className="font-semibold text-[#86efac]">★★★★★ 4.9 Rating</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}