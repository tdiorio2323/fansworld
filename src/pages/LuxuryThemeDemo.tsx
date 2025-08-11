import React from 'react';

const LuxuryThemeDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4 luxury-gradient-text">
            CABANA
          </h1>
          <p className="text-xl text-gray-300">
            Luxury Theme Demo
          </p>
        </div>
        
        {/* Luxury Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-card p-8 rounded-2xl backdrop-blur-xl">
            <div className="luxury-gradient w-16 h-16 rounded-full mb-6"></div>
            <h3 className="text-2xl font-bold text-white mb-4">Premium Features</h3>
            <p className="text-gray-300">
              Experience the luxury of premium content creation tools.
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="glass-card p-8 rounded-2xl backdrop-blur-xl">
            <div className="chrome-effect w-16 h-16 rounded-full mb-6"></div>
            <h3 className="text-2xl font-bold text-white mb-4">Chrome Effects</h3>
            <p className="text-gray-300">
              Stunning metallic and chrome visual effects.
            </p>
          </div>
          
          {/* Card 3 */}
          <div className="glass-card p-8 rounded-2xl backdrop-blur-xl">
            <div className="holographic w-16 h-16 rounded-full mb-6"></div>
            <h3 className="text-2xl font-bold text-white mb-4">Holographic</h3>
            <p className="text-gray-300">
              Mesmerizing holographic design elements.
            </p>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="text-center mt-16">
          <button className="luxury-button px-12 py-4 rounded-full text-white font-semibold text-lg shimmer">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default LuxuryThemeDemo;
