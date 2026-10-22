import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import BakeryRoiCalculator from "../components/landing/BakeryRoiCalculator";
import HowItWorks from "../components/landing/HowItWorks";
import ProductionFlow from "../components/landing/ProductionFlow";
import WhyBakeLytics from "../components/landing/WhyBakeLytics";
import FinalCTA from "../components/landing/FinalCTA";
import { isAuthenticated } from "../services/authService";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[var(--cream)] selection:bg-[#dfc5a8] selection:text-[#2d180c]">
      {/* Floating Navigation Header */}
      <Navbar />

      <main>
        {/* Hero & Interactive Workbench */}
        <Hero />

        {/* Bento Labs: Hydration, Restock Sentinel, Oven Matrix & Unit Economics */}
        <Features />

        {/* Interactive Bakery ROI & Waste Savings Calculator */}
        <BakeryRoiCalculator />

        {/* 4-Stage Operational Pipeline Workflow */}
        <HowItWorks />

        {/* Signature Artisan Recipe Matrix & Margin Breakdown */}
        <ProductionFlow />

        {/* Verified Baker Stories & Operational Proof */}
        <WhyBakeLytics />

        {/* Radiant Ambient Final Call to Action */}
        <FinalCTA />
      </main>

      {/* Architectural Luxury Footer */}
      <Footer />
    </div>
  );
}