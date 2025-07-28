import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Sparkles, ArrowRight, Diamond } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// VIP Entry Page for cabana.tdstudiosny.com
const VipEntry = () => {
  const [vipCode, setVipCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Auto-check for VIP code in URL params
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl === 'td') {
      // Auto-redirect with VIP code
      setTimeout(() => navigate('/home'), 1000);
    }
  }, [searchParams, navigate]);

  const handleVipAccess = () => {
    if (vipCode.toLowerCase() === 'td') {
      setIsLoading(true);
      // Redirect to main platform
      setTimeout(() => navigate('/home'), 1500);
    } else {
      // Invalid code - shake animation or error
      alert('Invalid VIP code. Contact support for access.');
    }
  };

  // Auto-redirect URL for easy sharing: cabana.tdstudiosny.com?code=td
  const isAutoRedirecting = searchParams.get('code') === 'td';

  return (
    <div className="min-h-screen relative flex items-center justify-center px-2 md:px-4 py-4 md:py-8 overflow-hidden" style={{
      backgroundImage: 'url(/cabana-crystal-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      
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
        
        {/* VIP Branding */}
        <div className="text-center mb-6 md:mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-4"
          >
            <Crown className="w-16 h-16 md:w-20 md:h-20 mx-auto text-yellow-400 drop-shadow-lg" />
          </motion.div>
          
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
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <Diamond className="w-4 h-4 text-yellow-400" />
            <p className="text-base md:text-lg text-white/90 font-medium tracking-wide">
              VIP EXCLUSIVE ACCESS
            </p>
            <Diamond className="w-4 h-4 text-yellow-400" />
          </div>
          
          <p className="text-sm md:text-base text-white/70 font-light">
            Ultra-Premium Creator Platform
          </p>
        </div>

        {isAutoRedirecting ? (
          // Auto-redirecting state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl border border-green-400/50" style={{
              background: 'rgba(34, 197, 94, 0.15)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <Sparkles className="w-12 h-12 mx-auto text-green-400" />
              </motion.div>
              <h2 className="text-xl md:text-2xl font-light text-white mb-2">VIP Access Granted</h2>
              <p className="text-white/70">Redirecting to your exclusive platform...</p>
            </div>
          </motion.div>
        ) : (
          // VIP Code Entry
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/30 shadow-2xl relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            }}
          >
            <div className="text-center mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-light text-white/90 mb-2 tracking-wide">
                ENTER VIP ACCESS CODE
              </h2>
              <p className="text-sm text-white/60">
                Exclusive access for TD Studios VIP members
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  value={vipCode}
                  onChange={(e) => setVipCode(e.target.value)}
                  placeholder="Enter VIP code..."
                  className="h-10 sm:h-12 md:h-14 text-sm md:text-base text-white placeholder:text-white/50 border-0 text-center font-mono tracking-widest uppercase"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(25px) saturate(200%)',
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleVipAccess()}
                  autoFocus
                />
              </div>

              <Button 
                onClick={handleVipAccess}
                disabled={isLoading || !vipCode}
                className="w-full hover:scale-105 transition-all duration-300 h-10 sm:h-12 md:h-14 text-sm md:text-base font-medium text-white relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 165, 0, 0.2) 100%)',
                  backdropFilter: 'blur(25px) saturate(200%)',
                  border: '1px solid rgba(255, 215, 0, 0.4)',
                  borderRadius: '20px',
                }}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    <span className="relative z-10">ACCESS VIP PLATFORM</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-white/50">
                Don't have a VIP code? Contact{' '}
                <a href="mailto:vip@cabana.com" className="text-yellow-400 hover:text-yellow-300">
                  vip@cabana.com
                </a>
              </p>
            </div>
          </motion.div>
        )}

        <div className="text-center mt-4">
          <p className="text-xs sm:text-sm text-white/40">
            Powered by TD Studios • Ultra-Premium Experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default VipEntry;