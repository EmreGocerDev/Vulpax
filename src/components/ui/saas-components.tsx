"use client";

import React from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "./button";

// GlassCard Component - Novu.co style with glow effects
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowIntensity?: "low" | "medium" | "high";
  hoverGlow?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className = "", glowIntensity = "medium", hoverGlow = true }, ref) => {
    const glowOpacity = {
      low: "30",
      medium: "60",
      high: "90"
    };

    return (
      <div ref={ref} className={`relative group ${className}`}>
        {/* Outer glow */}
        <div 
          className={`absolute -inset-4 bg-gradient-to-r from-[#2666E3]/30 via-[#67DBFF]/30 to-[#2666E3]/30 rounded-2xl blur-[60px] ${hoverGlow ? 'opacity-0 group-hover:opacity-' + glowOpacity[glowIntensity] : 'opacity-' + glowOpacity[glowIntensity]} transition-opacity duration-300`}
        />
        
        {/* Glass card */}
        <div className="relative bg-gradient-to-br from-[#0a0f1a]/80 via-[#0d1117]/60 to-[#05050B]/80 backdrop-blur-xl border border-[#BAFFFF]/20 group-hover:border-[#BAFFFF]/50 rounded-xl transition-all duration-300">
          {children}
        </div>
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

// Navigation Component - SaaS style adapted for Vulpax
interface NavigationProps {
  logo?: React.ReactNode;
  links?: Array<{ href: string; label: string }>;
  actions?: React.ReactNode;
}

export const SaaSNavigation = React.memo<NavigationProps>(({ 
  logo,
  links = [],
  actions
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-[#BAFFFF]/10 bg-black/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {logo || <div className="text-xl font-semibold text-white">Logo</div>}
          
          <div className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {links.map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                className="text-sm text-white/60 hover:text-[#BAFFFF] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {actions}
          </div>

          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-[#BAFFFF]/10 animate-[slideDown_0.3s_ease-out]">
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 hover:text-[#BAFFFF] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-[#BAFFFF]/10">
              {actions}
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

SaaSNavigation.displayName = "SaaSNavigation";

// Hero Section Component
interface HeroSectionProps {
  badge?: string;
  badgeLink?: { href: string; label: string };
  title: React.ReactNode;
  description?: string;
  primaryAction?: { label: string; onClick?: () => void; href?: string };
  secondaryAction?: { label: string; onClick?: () => void; href?: string };
  image?: { src: string; alt: string };
  glowImage?: string;
}

export const SaaSHero = React.memo<HeroSectionProps>(({
  badge,
  badgeLink,
  title,
  description,
  primaryAction,
  secondaryAction,
  image,
  glowImage
}) => {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-start px-6 py-20 md:py-24"
      style={{ animation: "fadeIn 0.6s ease-out" }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {badge && (
        <aside className="mb-8 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full border border-[#BAFFFF]/30 bg-[#0a0f1a]/50 backdrop-blur-sm max-w-full">
          <span className="text-xs text-center whitespace-nowrap text-zinc-400">
            {badge}
          </span>
          {badgeLink && (
            <a
              href={badgeLink.href}
              className="flex items-center gap-1 text-xs text-[#BAFFFF] hover:text-white transition-all active:scale-95 whitespace-nowrap"
              aria-label={badgeLink.label}
            >
              {badgeLink.label}
              <ArrowRight size={12} />
            </a>
          )}
        </aside>
      )}

      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-medium text-center max-w-3xl px-6 leading-tight mb-6"
        style={{
          background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(186, 255, 255, 0.8))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.05em"
        }}
      >
        {title}
      </h1>

      {description && (
        <p className="text-sm md:text-base text-center max-w-2xl px-6 mb-10 text-zinc-400">
          {description}
        </p>
      )}

      <div className="flex items-center gap-4 relative z-10 mb-16">
        {primaryAction && (
          <Button
            type="button"
            variant="glass"
            size="lg"
            className="rounded-lg flex items-center justify-center"
            onClick={primaryAction.onClick}
            aria-label={primaryAction.label}
          >
            {primaryAction.label}
          </Button>
        )}
        {secondaryAction && (
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="rounded-lg flex items-center justify-center border border-[#BAFFFF]/20 hover:border-[#BAFFFF]/50"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>

      {image && (
        <div className="w-full max-w-5xl relative pb-20">
          {glowImage && (
            <div
              className="absolute left-1/2 w-[90%] pointer-events-none z-0"
              style={{ top: "-23%", transform: "translateX(-50%)" }}
              aria-hidden="true"
            >
              <img src={glowImage} alt="" className="w-full h-auto" loading="eager" />
            </div>
          )}
          
          <div className="relative z-10">
            <GlassCard className="overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto rounded-lg"
                loading="eager"
              />
            </GlassCard>
          </div>
        </div>
      )}
    </section>
  );
});

SaaSHero.displayName = "SaaSHero";

// Feature Card Component
interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard = React.memo<FeatureCardProps>(({
  icon,
  title,
  description,
  className = ""
}) => {
  return (
    <GlassCard className={className}>
      <div className="p-6">
        {icon && (
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2666E3]/20 to-[#67DBFF]/20 flex items-center justify-center mb-4 text-[#BAFFFF]">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
    </GlassCard>
  );
});

FeatureCard.displayName = "FeatureCard";

// Export all components
export { Button, ArrowRight, Menu, X };
