import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustedCompanies } from "@/components/landing/TrustedCompanies";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";
import { RecentJobs } from "@/components/landing/RecentJobs";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-muted/50">
      <Navbar />
      <Hero />
      <TrustedCompanies />
      <RecentJobs />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  );
}
