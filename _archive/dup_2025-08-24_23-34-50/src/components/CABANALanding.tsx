import React, { useState } from 'react';

interface CABANALandingProps {
  backgroundImage?: string;
}

export const CABANALanding: React.FC<CABANALandingProps> = ({ backgroundImage }) => {
  const [isVipInput, setIsVipInput] = useState(false);
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [vipCode, setVipCode] = useState('');

  return (
    <div className="relative w-[390px] h-[844px] overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Glass Card */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-[350px] h-[550px] bg-white/10 backdrop-blur-[15px] border border-white/20 rounded-3xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
          
          {/* Logo */}
          <h1 className="text-4xl font-bold text-white text-center mb-2 drop-shadow-lg">
            CABANA
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg text-white/80 text-center mb-8">
            Join The List
          </p>
          
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 bg-white/5 border border-white/30 rounded-xl px-4 text-white placeholder-white/60 mb-4 focus:outline-none focus:border-white/50"
          />
          
          {/* Instagram Input */}
          <input
            type="text"
            placeholder="Instagram Handle"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="w-full h-12 bg-white/5 border border-white/30 rounded-xl px-4 text-white placeholder-white/60 mb-6 focus:outline-none focus:border-white/50"
          />
          
          {/* VIP Code Button/Input */}
          {!isVipInput ? (
            <button
              onClick={() => setIsVipInput(true)}
              className="w-full h-12 bg-white/90 text-gray-900 rounded-xl font-semibold hover:bg-white hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
            >
              VIP Code
            </button>
          ) : (
            <input
              type="text"
              placeholder="Enter VIP Code"
              value={vipCode}
              onChange={(e) => setVipCode(e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/30 rounded-xl px-4 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
              autoFocus
            />
          )}
          
        </div>
      </div>
    </div>
  );
};