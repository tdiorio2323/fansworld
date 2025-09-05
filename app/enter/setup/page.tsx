'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Upload, User, Palette, Type, Crown } from 'lucide-react';

interface CreatorProfile {
  name: string;
  username: string;
  profileImage: string | null;
  theme: string;
  font: string;
}

export default function CreatorSetupPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<CreatorProfile>({
    name: '',
    username: '',
    profileImage: null,
    theme: 'noir',
    font: 'urbanist'
  });
  
  const [dragActive, setDragActive] = useState(false);

  const themes = [
    { 
      id: 'noir', 
      name: 'Noir', 
      description: 'Sophisticated elegance with gold accents',
      gradient: 'from-gray-900 via-black to-gray-800',
      accent: 'text-yellow-400'
    },
    { 
      id: 'desert', 
      name: 'Desert', 
      description: 'Warm luxury with bronze tones',
      gradient: 'from-orange-900 via-red-800 to-yellow-900',
      accent: 'text-orange-400'
    },
    { 
      id: 'neon', 
      name: 'Neon', 
      description: 'Electric luxury with cyber aesthetics',
      gradient: 'from-purple-900 via-pink-800 to-blue-900',
      accent: 'text-cyan-400'
    },
    { 
      id: 'ocean', 
      name: 'Ocean', 
      description: 'Deep blue luxury with aqua highlights',
      gradient: 'from-blue-900 via-teal-800 to-cyan-900',
      accent: 'text-blue-400'
    }
  ];

  const fonts = [
    { id: 'urbanist', name: 'Urbanist', className: 'font-sans' },
    { id: 'inter', name: 'Inter', className: 'font-mono' },
    { id: 'poppins', name: 'Poppins', className: 'font-serif' },
    { id: 'playfair', name: 'Playfair', className: 'font-bold' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const canContinue = () => {
    switch (step) {
      case 1:
        return profile.name.trim() && profile.username.trim();
      case 2:
        return profile.profileImage !== null;
      case 3:
        return profile.theme !== '';
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Navigate to features page
      window.location.href = '/enter/features';
    }
  };

  const stepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <User className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-title text-white mb-2">What's your name?</h2>
              <p className="text-gray-300">This will appear on your creator page</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  placeholder="Your display name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors text-lg"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">cabana.link/</span>
                  <input
                    type="text"
                    placeholder="username"
                    value={profile.username}
                    onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') }))}
                    className="w-full pl-28 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none transition-colors text-lg"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">This will be your unique link</p>
              </div>
            </div>
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <Upload className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-title text-white mb-2">Upload your photo</h2>
              <p className="text-gray-300">This will be your profile picture</p>
            </div>
            
            <div className="flex justify-center">
              <div
                className={`relative w-48 h-48 rounded-full border-2 border-dashed transition-all duration-300 cursor-pointer
                  ${dragActive ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-600 hover:border-gray-400'}
                  ${profile.profileImage ? 'border-yellow-400' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Drop image here or click</p>
                    </div>
                  </div>
                )}
                
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {profile.profileImage && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <Palette className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-title text-white mb-2">Choose your style</h2>
              <p className="text-gray-300">Pick a theme and font for your page</p>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Page Theme</h3>
                <div className="grid grid-cols-2 gap-4">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => setProfile(prev => ({ ...prev, theme: theme.id }))}
                      className={`relative p-4 rounded-xl cursor-pointer transition-all border-2
                        ${profile.theme === theme.id ? 'border-yellow-400 scale-105' : 'border-gray-700 hover:border-gray-500'}`}
                    >
                      <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${theme.gradient} mb-3`}></div>
                      <h4 className={`font-semibold mb-1 ${theme.accent}`}>{theme.name}</h4>
                      <p className="text-xs text-gray-400">{theme.description}</p>
                      
                      {profile.theme === theme.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Crown size={12} className="text-black" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Font Style</h3>
                <div className="grid grid-cols-2 gap-3">
                  {fonts.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setProfile(prev => ({ ...prev, font: font.id }))}
                      className={`p-3 rounded-xl border-2 transition-all text-left
                        ${profile.font === font.id ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-700 hover:border-gray-500'}`}
                    >
                      <span className={`text-white ${font.className}`}>{font.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-noir">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <nav className="relative z-50 p-8">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-2xl font-black text-gradient-gold tracking-tight">
            CABANA
          </h1>
          <div className="text-gray-400">
            Step {step} of 3
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="relative z-10 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-8 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8">
            {stepContent()}
            
            {/* Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-700">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="glass-button flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              <button
                onClick={handleNext}
                disabled={!canContinue()}
                className={`glass-button-primary ${!canContinue() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {step === 3 ? 'Continue to Features' : 'Next'}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}