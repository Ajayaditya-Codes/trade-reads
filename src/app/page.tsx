import CTASection from "@/components/global/landing/cta-section";
import FeaturesSection from "@/components/global/landing/features-section";
import HeaderNav from "@/components/global/landing/header-nav";
import HeroSection from "@/components/global/landing/hero-section";
import WhyTRSection from "@/components/global/landing/why-tr-section";
import { ModeToggle } from "@/components/ui/theming/mode-toggle";

export default function Home() {
  return (
    <div className="w-full">
      <HeaderNav />
      <main className="p-10">
        <HeroSection />
        <FeaturesSection />
        <WhyTRSection />
        <CTASection />
      </main>
      <footer className="w-full flex flex-row space-x-5 items-center justify-center md:text-base text-sm p-10 px-0 text-center">
        <p>
          © Trade Reads, 2025. All rights reserved. Developed by Ajayaditya ✨
        </p>
        <ModeToggle />
      </footer>{" "}
    </div>
  );
}
