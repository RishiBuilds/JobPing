import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustedCompanies } from "@/components/landing/TrustedCompanies";
import { Features } from "@/components/landing/Features";
import { StatsBar } from "@/components/landing/StatsBar";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { RecentJobs } from "@/components/landing/RecentJobs";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar />
      <Hero />
      <TrustedCompanies />
      <StatsBar />
      <Features />
      <RecentJobs />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  );
}
