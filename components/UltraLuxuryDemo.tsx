'use client';

import React from 'react';

interface UltraLuxuryDemoProps {
  className?: string;
}

export const UltraLuxuryDemo: React.FC<UltraLuxuryDemoProps> = ({ className = '' }) => {
  return (
    <div className={`min-h-screen p-8 ${className}`}>
      {/* Ultra-Luxury Hero Section */}
      <div className="text-center mb-16">
        <h1 className="bebas-ultra-display mb-6 td-luxury-glow">
          Cabana Ultra-Luxury
        </h1>
        <p className="text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
          Experience the most premium creator platform with TD Studios ultra-luxury glass design
        </p>
      </div>

      {/* Ultra Glass Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {/* Premium Creator Card */}
        <div className="td-ultra-glass-card p-8">
          <h3 className="bebas-luxury-heading mb-4">
            Premium Creators
          </h3>
          <p className="text-white/70 mb-6 leading-relaxed">
            Join elite content creators earning 6-figures with our ultra-premium platform features and luxury user experience.
          </p>
          <button className="td-ultra-glass-button w-full">
            <span className="font-bebas text-lg tracking-wider">JOIN ELITE</span>
          </button>
        </div>

        {/* VIP Experience Card */}
        <div className="td-ultra-glass-card p-8 td-luxury-glow">
          <h3 className="bebas-luxury-heading mb-4 text-td-accent">
            VIP Experience
          </h3>
          <p className="text-white/70 mb-6 leading-relaxed">
            Exclusive access to premium tools, analytics, and monetization features designed for luxury lifestyle creators.
          </p>
          <button className="td-ultra-glass-button w-full border-td-accent/40">
            <span className="font-bebas text-lg tracking-wider text-td-accent">UPGRADE NOW</span>
          </button>
        </div>

        {/* Ultra Analytics Card */}
        <div className="td-ultra-glass-card p-8">
          <h3 className="bebas-luxury-heading mb-4 text-td-accent2">
            Ultra Analytics
          </h3>
          <p className="text-white/70 mb-6 leading-relaxed">
            Advanced insights and AI-powered recommendations to maximize your earning potential and audience growth.
          </p>
          <button className="td-ultra-glass-button w-full border-td-accent2/40">
            <span className="font-bebas text-lg tracking-wider text-td-accent2">VIEW INSIGHTS</span>
          </button>
        </div>
      </div>

      {/* Luxury Feature Showcase */}
      <div className="td-premium-surface rounded-luxury p-12 mb-16">
        <h2 className="bebas-luxury-title text-center mb-12">
          Ultra-Premium Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Feature 1 */}
          <div className="text-center">
            <div className="td-ultra-glass-card p-6 mb-6 inline-block">
              <div className="w-16 h-16 bg-gradient-to-br from-td-accent to-td-accent2 rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
            </div>
            <h4 className="font-bebas text-2xl tracking-wide text-td-accent mb-3">LUXURY BRANDING</h4>
            <p className="text-white/60">Custom luxury themes and premium brand customization tools</p>
          </div>

          {/* Feature 2 */}
          <div className="text-center">
            <div className="td-ultra-glass-card p-6 mb-6 inline-block">
              <div className="w-16 h-16 bg-gradient-to-br from-td-accent2 to-td-accent rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
            </div>
            <h4 className="font-bebas text-2xl tracking-wide text-td-accent2 mb-3">ELITE PERFORMANCE</h4>
            <p className="text-white/60">Lightning-fast loading with enterprise-grade infrastructure</p>
          </div>
        </div>
      </div>

      {/* Interactive Buttons Showcase */}
      <div className="text-center mb-16">
        <h3 className="bebas-luxury-title mb-8">
          Ultra-Luxury Interactions
        </h3>
        
        <div className="flex flex-wrap justify-center gap-6">
          <button className="td-ultra-glass-button">
            <span className="font-bebas text-lg tracking-wider">PREMIUM ACCESS</span>
          </button>
          
          <button className="td-ultra-glass-button bg-td-accent/10 border-td-accent/40">
            <span className="font-bebas text-lg tracking-wider text-td-accent">VIP MEMBERSHIP</span>
          </button>
          
          <button className="td-ultra-glass-button bg-td-accent2/10 border-td-accent2/40">
            <span className="font-bebas text-lg tracking-wider text-td-accent2">ELITE STATUS</span>
          </button>
        </div>
      </div>

      {/* Typography Showcase */}
      <div className="td-ultra-glass-card p-12 text-center">
        <div className="bebas-ultra-display mb-8">
          Luxury Typography
        </div>
        
        <div className="space-y-6">
          <h2 className="bebas-luxury-title">Premium Bebas Neue Styling</h2>
          <h3 className="bebas-luxury-heading">Ultra-Luxury Creator Platform</h3>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Experience the pinnacle of design excellence with our ultra-premium glass morphism system, 
            featuring enhanced blur effects, luxury shadows, and premium brand colors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UltraLuxuryDemo;