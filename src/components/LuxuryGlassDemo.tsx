import React from 'react';

interface LuxuryGlassDemoProps {
  className?: string;
}

export const LuxuryGlassDemo: React.FC<LuxuryGlassDemoProps> = ({ className = '' }) => {
  return (
    <div className={`space-y-8 p-8 ${className}`}>
      {/* Demo Header */}
      <div className="text-center mb-12">
        <h1 className="bebas-title text-white mb-4">
          TD Studios Luxury Glass System
        </h1>
        <p className="text-td-muted text-lg">
          Frosted glass cards and buttons with Bebas Neue typography
        </p>
      </div>

      {/* Glass Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 - Basic Glass Card */}
        <div className="td-glass-card p-6">
          <h3 className="bebas-heading text-white mb-3">
            Premium Features
          </h3>
          <p className="text-td-muted mb-4">
            Experience the luxury of frosted glass design with perfect blur effects and elegant shadows.
          </p>
          <button className="td-glass-button w-full">
            Explore Features
          </button>
        </div>

        {/* Card 2 - Accent Colors */}
        <div className="td-glass-card p-6">
          <h3 className="bebas-heading td-accent mb-3">
            Golden Elegance
          </h3>
          <p className="text-td-muted mb-4">
            Featuring the signature TD Studios golden accent color for premium branding.
          </p>
          <button className="td-glass-button w-full td-focus-ring">
            View Collection
          </button>
        </div>

        {/* Card 3 - Blue Accent */}
        <div className="td-glass-card p-6">
          <h3 className="bebas-heading td-accent2 mb-3">
            Sky Blue Luxury
          </h3>
          <p className="text-td-muted mb-4">
            Cool blue tones complement the warm gold for a sophisticated color palette.
          </p>
          <button className="td-glass-button w-full">
            Learn More
          </button>
        </div>
      </div>

      {/* Interactive Glass Buttons */}
      <div className="mt-12">
        <h2 className="bebas-heading text-white mb-6 text-center">
          Interactive Glass Elements
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button className="td-glass-button td-focus-ring">
            <span className="bebas-display text-sm">Primary Action</span>
          </button>
          
          <button className="td-glass-button td-focus-ring">
            <span className="bebas-display text-sm">Secondary</span>
          </button>
          
          <button className="td-glass-button td-focus-ring">
            <span className="bebas-display text-sm td-accent">Golden Button</span>
          </button>
          
          <button className="td-glass-button td-focus-ring">
            <span className="bebas-display text-sm td-accent2">Sky Button</span>
          </button>
        </div>
      </div>

      {/* Typography Showcase */}
      <div className="td-glass-card p-8 mt-12">
        <h2 className="bebas-title text-white text-center mb-6">
          Bebas Neue Typography
        </h2>
        
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="bebas-display text-2xl text-white">
              Display Text - Clean & Bold
            </h3>
          </div>
          
          <div className="text-center">
            <h4 className="bebas-heading td-accent">
              Heading Text - Golden Accent
            </h4>
          </div>
          
          <div className="text-center">
            <p className="bebas-display text-lg td-accent2">
              Uppercase Display - Sky Blue
            </p>
          </div>
        </div>
      </div>

      {/* Glass Surface Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="glass-surface glass-border rounded-2xl p-6">
          <h4 className="bebas-heading text-white mb-3">Glass Surface</h4>
          <p className="text-td-muted">
            Utility classes for creating custom glass elements with consistent styling.
          </p>
        </div>
        
        <div className="glass-surface glass-border glass-blur rounded-2xl p-6">
          <h4 className="bebas-heading text-white mb-3">Enhanced Blur</h4>
          <p className="text-td-muted">
            Additional blur effects for more dramatic glass appearances.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LuxuryGlassDemo;