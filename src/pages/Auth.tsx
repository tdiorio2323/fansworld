import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

// World-class sparkling and holographic effects
const worldClassEffects = `
  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(180deg); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(5deg); }
    66% { transform: translateY(5px) rotate(-5deg); }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%) skewX(-15deg); }
    100% { transform: translateX(200%) skewX(-15deg); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1), 0 0 40px rgba(255, 255, 255, 0.05); }
    50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.2), 0 0 60px rgba(255, 255, 255, 0.1); }
  }
  
  .sparkle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: radial-gradient(circle, #fff 0%, transparent 70%);
    border-radius: 50%;
    animation: sparkle 3s infinite ease-in-out;
    pointer-events: none;
  }
  
  .sparkle:nth-child(1) { top: 20%; left: 15%; animation-delay: 0s; }
  .sparkle:nth-child(2) { top: 60%; left: 80%; animation-delay: 0.7s; }
  .sparkle:nth-child(3) { top: 30%; left: 70%; animation-delay: 1.4s; }
  .sparkle:nth-child(4) { top: 80%; left: 25%; animation-delay: 2.1s; }
  .sparkle:nth-child(5) { top: 10%; left: 90%; animation-delay: 2.8s; }
  .sparkle:nth-child(6) { top: 70%; left: 10%; animation-delay: 1.2s; }
  .sparkle:nth-child(7) { top: 45%; left: 55%; animation-delay: 0.4s; }
  .sparkle:nth-child(8) { top: 85%; left: 75%; animation-delay: 1.8s; }
  
  .floating-card {
    animation: float 6s ease-in-out infinite, pulse-glow 4s ease-in-out infinite;
  }
  
  .shimmer-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    animation: shimmer 3s infinite;
    pointer-events: none;
  }
  
  .premium-glass {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(25px) saturate(180%);
    -webkit-backdrop-filter: blur(25px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.25);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 1px rgba(255, 255, 255, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.05);
  }
  
  .text-shadow-luxury {
    text-shadow: 
      0 0 20px rgba(255, 255, 255, 0.5),
      0 4px 8px rgba(0, 0, 0, 0.3),
      0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;
import { GoogleSignIn } from '@/components/auth/GoogleSignIn';
import { AppleSignIn } from '@/components/auth/AppleSignIn';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function Auth() {
  const { user, signIn, signUp, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/home';

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    displayName: '',
    role: 'fan' as 'creator' | 'fan'
  });

  // Bypass: Don't redirect automatically, let users see the auth page first
  // if (user && !loading) {
  //   return <Navigate to={from} replace />;
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bypass authentication - just redirect to home
    navigate('/home');
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <style>{worldClassEffects}</style>
      <div className="min-h-screen relative flex items-center justify-center px-2 md:px-4 py-4 md:py-8 overflow-hidden" style={{
        backgroundImage: 'url(/cabana-crystal-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      
      {/* Sparkling particles overlay */}
      <div className="absolute inset-0">
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
      </div>
      
      {/* Enhanced prismatic glass overlay */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 60%),
          radial-gradient(circle at 80% 70%, rgba(255, 0, 255, 0.12) 0%, transparent 60%),
          radial-gradient(circle at 30% 80%, rgba(0, 255, 255, 0.12) 0%, transparent 60%),
          radial-gradient(circle at 70% 20%, rgba(255, 255, 0, 0.12) 0%, transparent 60%),
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)
        `,
        backdropFilter: 'blur(2px) saturate(150%)'
      }}></div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40"></div>
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-lg relative z-10">
        <div className="text-center mb-6 md:mb-12">
          {/* Premium Cabana Script Title with world-class styling */}
          <h1 className="mb-4 md:mb-6 text-shadow-luxury" style={{
            fontSize: 'clamp(3rem, 10vw, 7rem)',
            fontFamily: '"Dancing Script", cursive',
            fontWeight: '600',
            color: 'white',
            letterSpacing: '2px',
            lineHeight: '0.9',
            filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))'
          }}>
            Cabana
          </h1>
          <p className="text-base md:text-lg text-white/80 font-light tracking-wide">
            Premium Member Portal
          </p>
        </div>

        <Card className="floating-card p-4 sm:p-6 md:p-8 border border-white/30 shadow-2xl relative overflow-hidden" style={{
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(40px) saturate(180%)',
          borderRadius: '32px',
          boxShadow: `
            0 25px 50px rgba(0, 0, 0, 0.25), 
            inset 0 1px 1px rgba(255, 255, 255, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 8px 32px rgba(255, 255, 255, 0.05)
          `,
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        }}>
          {/* Shimmer overlay effect */}
          <div className="shimmer-overlay"></div>
          <CardHeader className="pb-3 sm:pb-4 md:pb-6 text-center">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-light text-white/90 mb-3 sm:mb-4 md:mb-6 tracking-wide">
              MEMBER LOGIN
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-white/80 text-xs sm:text-sm font-normal">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="Enter your email"
                  className="h-10 sm:h-12 md:h-14 text-sm md:text-base text-white placeholder:text-white/50 border-0 premium-glass transition-all duration-300 focus:scale-[1.02]"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-white/80 text-xs sm:text-sm font-normal">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    placeholder="Enter your password"
                    className="h-10 sm:h-12 md:h-14 text-sm md:text-base text-white placeholder:text-white/50 border-0 pr-10 sm:pr-12 premium-glass transition-all duration-300 focus:scale-[1.02]"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10 text-white/60"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 md:mt-8 space-y-2 sm:space-y-3 md:space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 text-white/60" style={{ 
                      background: 'rgba(255, 255, 255, 0.1)', 
                      backdropFilter: 'blur(10px)', 
                      borderRadius: '12px',
                      padding: '4px 12px'
                    }}>or</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 sm:h-10 md:h-12 text-xs sm:text-sm text-white border-0 hover:scale-105 transition-all duration-300 premium-glass"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-0.5 sm:mr-1 md:mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="hidden sm:inline">Google</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 sm:h-10 md:h-12 text-xs sm:text-sm text-white border-0 hover:scale-105 transition-all duration-300 premium-glass"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-0.5 sm:mr-1 md:mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5Z"/>
                    </svg>
                    <span className="hidden sm:inline">Apple</span>
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full hover:scale-105 transition-all duration-300 h-10 sm:h-12 md:h-14 text-sm md:text-base font-medium text-white mt-3 sm:mt-4 md:mt-6 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
                    backdropFilter: 'blur(25px) saturate(200%)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '20px',
                    fontWeight: '600',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    boxShadow: `
                      0 8px 32px rgba(255, 255, 255, 0.1),
                      inset 0 1px 1px rgba(255, 255, 255, 0.5),
                      0 0 0 1px rgba(255, 255, 255, 0.1)
                    `
                  }}
                >
                  <span className="relative z-10">Login</span>
                  <div className="shimmer-overlay"></div>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-3 sm:mt-4 md:mt-6">
          <p className="text-xs sm:text-sm text-muted-foreground px-2">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
    </>
  );
}