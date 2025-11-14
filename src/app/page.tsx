"use client";

import HeroSlider from "./components/HeroSlider";
import ReferencesSlider from "./components/ReferencesSlider";
import ContactForm from "./components/ContactForm";
import DemoPages from "./components/DemoPages";
import PricingSection from "./components/PricingSection";
import TechSlider from "./components/TechSlider";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[700px] md:min-h-[800px] overflow-hidden bg-black pt-[72px]">
        {/* Background Slider */}
        <div className="absolute inset-0 top-[72px]">
          <HeroSlider />
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Demo Pages Section - From DEMOS table */}
      <DemoPages />

      {/* References Section */}
      <ReferencesSlider />

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4">İLETİŞİME GEÇİN</h2>
            <p className="text-zinc-400 text-lg">
              Projeleriniz için özel çözümler geliştirmek üzere sizinle çalışmaya hazırız.
            </p>
          </div>

          {/* Contact Form */}
          <ContactForm isOpen={true} onClose={() => {}} />
        </div>
      </section>

      {/* Tech Slider */}
      <TechSlider />
    </>
  );
}
