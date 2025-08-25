import Link from 'next/link';

export default function CabanaLanding() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background gradient is handled by body in globals.css */}
      
      {/* Floating background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/3 w-80 h-80 bg-purple-400 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-pink-400 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Central Content Container */}
      <div className="relative z-10 w-full max-w-2xl text-center space-y-12">
        
        {/* Header with Logo */}
        <div className="space-y-8">
          {/* Diamond Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-12 h-12 bg-transparent border-2 border-white transform rotate-45"></div>
            </div>
          </div>
          
          {/* Brand Name */}
          <h1 className="text-3xl font-light tracking-wider text-white">Cabana</h1>
          
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Platform Screenshots Gallery
          </h2>
        </div>

        {/* VIP Access Glassmorphism Card */}
        <div className="glass max-w-md mx-auto p-8 space-y-6 backdrop-blur-xl">
          
          {/* Card Header with Logo */}
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 bg-transparent border border-white/60 transform rotate-45"></div>
            <span className="text-white font-medium">Cabana</span>
          </div>
          
          {/* VIP Access Title */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">VIP ACCESS</h3>
            <p className="text-white/70 text-sm">Enter your VIP code below</p>
          </div>
          
          {/* Input and Button */}
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="ENTER VIP CODE"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
            />
            
            <Link 
              href="/auth/login"
              className="w-full block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Access Platform →
            </Link>
          </div>
          
          {/* Footer Text */}
          <div className="text-xs text-white/60 space-y-1 pt-2">
            <p>By VIP for users means:</p>
            <p>→ Get on waitlist</p>
            <div className="pt-2">
              <p>Powered by TD Studios</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}