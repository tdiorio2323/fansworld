import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Loader2, Star, Crown, Shield, Users, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/hooks/use-toast';
import { isValidVipCodeFormat, sanitizeErrorMessage, checkRateLimit, generateSecureSessionId } from '@/lib/security';

// VIP Tier Definitions matching Netlify system
const VIP_TIERS = [
  {
    id: 'founder',
    name: 'Founder Circle',
    level: 5,
    price: '$2499 one-time',
    icon: Crown,
    color: 'from-amber-400 to-orange-500',
    features: [
      '90 days early access',
      'Lifetime platform access',
      'Revenue sharing program',
      'Product development input'
    ],
    memberCount: 12,
    maxMembers: 50,
    available: true
  },
  {
    id: 'platinum',
    name: 'VIP Platinum',
    level: 4,
    price: '$999 one-time',
    icon: Star,
    color: 'from-purple-400 to-pink-500',
    features: [
      '60 days early access',
      'Priority support',
      'Advanced analytics',
      'Custom branding'
    ],
    memberCount: 89,
    maxMembers: 200,
    available: true
  },
  {
    id: 'gold',
    name: 'VIP Gold',
    level: 3,
    price: '$499 one-time',
    icon: Shield,
    color: 'from-blue-400 to-cyan-500',
    features: [
      '30 days early access',
      'Premium features',
      'Priority onboarding',
      'VIP badge'
    ],
    memberCount: 234,
    maxMembers: 500,
    available: true
  },
  {
    id: 'early',
    name: 'Early Access',
    level: 2,
    price: 'Free',
    icon: Users,
    color: 'from-green-400 to-emerald-500',
    features: [
      '14 days early access',
      'Free premium trial',
      'Early platform access',
      'Community access'
    ],
    memberCount: 567,
    maxMembers: 1000,
    available: true
  }
];

// Modern VIP Entry Page for CABANA  
const VipEntry = () => {
  const [vipCode, setVipCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVipAccess, setShowVipAccess] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Auto-check for VIP code in URL params and track affiliate links
  useEffect(() => {
    const codeFromUrl = searchParams.get('code') || searchParams.get('vip');
    const refFromUrl = searchParams.get('ref');
    
    if (codeFromUrl) {
      setVipCode(codeFromUrl.toUpperCase());
      
      // Special auto-redirect for TD development code
      if (codeFromUrl.toLowerCase() === 'td') {
        setTimeout(() => navigate('/home'), 1000);
        return;
      }
    }
    
    // Track affiliate link click if ref parameter exists
    if (refFromUrl) {
      trackAffiliateClick(refFromUrl);
    }
  }, [searchParams, navigate]);

  const trackAffiliateClick = async (refCode: string) => {
    try {
      // Generate secure session ID if none exists
      let sessionId = sessionStorage.getItem('session_id')
      if (!sessionId) {
        sessionId = generateSecureSessionId()
        sessionStorage.setItem('session_id', sessionId)
      }
      
      await supabase.rpc('record_link_click', {
        short_code: refCode,
        user_agent: navigator.userAgent,
        referer: document.referrer || null,
        device_type: /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        session_id: sessionId
      });
    } catch (error) {
      // Don't expose internal errors
      console.warn('Affiliate tracking unavailable')
    }
  };

  const generateTierCode = async (tierType: string) => {
    try {
      const codePrefix = {
        founder: 'FOUNDER',
        platinum: 'PLATINUM', 
        gold: 'GOLD',
        early: 'EARLY'
      }[tierType] || 'VIP';
      
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newCode = `${codePrefix}${randomSuffix}`;
      
      // Create invite in database with tier info
      const { error } = await supabase
        .from('invites')
        .insert([{
          invite_code: newCode,
          passcode: crypto.randomUUID().substring(0, 10),
          created_by: 'admin',
          description: `${tierType} tier access code`,
          max_uses: 1,
          current_uses: 0,
          status: 'active',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      
      if (!error) {
        setGeneratedCodes(prev => [...prev, newCode]);
        toast({
          title: "Code Generated!",
          description: `${tierType.toUpperCase()} code: ${newCode}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate code",
        variant: "destructive"
      });
    }
  };

  const handleVipAccess = async () => {
    const trimmedCode = vipCode.trim().toUpperCase()
    
    if (!trimmedCode) {
      setError('Please enter a VIP code');
      return;
    }

    // Basic format validation
    if (!isValidVipCodeFormat(trimmedCode) && trimmedCode !== 'TD') {
      setError('Invalid VIP code format');
      return;
    }

    // Rate limiting check
    const clientIP = 'unknown' // In production, get from server
    if (!checkRateLimit(`vip-${clientIP}`, 5, 300000)) { // 5 attempts per 5 minutes
      setError('Too many attempts. Please try again later.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Add constant delay to prevent timing attacks
    const minProcessingTime = 1000;
    const startTime = Date.now();
    
    try {
      // Secure handling of development code (remove in production)
      if (process.env.NODE_ENV === 'development' && trimmedCode === 'TD') {
        toast({
          title: "Development Access Granted",
          description: "Redirecting to platform...",
        });
        await new Promise(resolve => setTimeout(resolve, Math.max(minProcessingTime - (Date.now() - startTime), 0)));
        navigate('/home');
        return;
      }

      // Check if VIP code exists in invites table
      const { data: invite, error: inviteError } = await supabase
        .from('invites')
        .select('*')
        .eq('invite_code', trimmedCode)
        .eq('status', 'active')
        .maybeSingle();

      // Always wait minimum time to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, Math.max(minProcessingTime - (Date.now() - startTime), 0)));

      if (inviteError) {
        setError(sanitizeErrorMessage(inviteError));
        return;
      }

      if (!invite) {
        setError('Invalid VIP code. Please check your code and try again.');
        return;
      }

      // Check if invite has expired
      if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
        setError('This VIP code has expired.');
        return;
      }
      
      // Mark invite as used
      const { error: updateError } = await supabase
        .from('invites')
        .update({ 
          status: 'used', 
          used_by: null,
          used_at: new Date().toISOString(),
          current_uses: (invite.current_uses || 0) + 1
        })
        .eq('invite_code', trimmedCode);

      if (updateError) {
        setError(sanitizeErrorMessage(updateError));
        return;
      }

      // Set up secure session data for registration
      sessionStorage.setItem('validatedInvite', JSON.stringify({
        inviteCode: trimmedCode,
        inviteId: invite.id,
        inviteType: invite.invite_type || 'creator',
        validatedAt: Date.now(),
        sessionId: generateSecureSessionId()
      }));
      
      toast({
        title: "VIP Access Granted!",
        description: "Redirecting to registration...",
      });
      
      setTimeout(() => {
        navigate('/register', { 
          state: { 
            fromInvite: true,
            inviteCode: trimmedCode,
            inviteInfo: invite 
          }
        });
      }, 1500);
      
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, Math.max(minProcessingTime - (Date.now() - startTime), 0)));
      setError(sanitizeErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };


  // Auto-redirect URL for easy sharing: cabana.tdstudiosny.com?code=td
  const isAutoRedirecting = searchParams.get('code') === 'td';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white overflow-hidden relative">
      
      {/* Purple gradient background with animated elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Glass Card Container */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
            
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 border-2 border-white rotate-45 rounded-sm mr-3"></div>
                <h1 className="text-2xl font-light italic text-white">Cabana</h1>
              </div>
              
              <h2 className="text-lg font-semibold text-white mb-1">
                MEMBER LOGIN
              </h2>
              <p className="text-sm text-white/70">
                VIP access for authorized members
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Email</label>
                <Input
                  type="email"
                  placeholder=""
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Password</label>
                <Input
                  type="password"
                  placeholder=""
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                />
              </div>
              
              {/* Social Auth Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  type="button"
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl py-3 text-white font-medium transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                
                <Button
                  type="button"
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl py-3 text-white font-medium transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Apple
                </Button>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white/20 hover:bg-white/30 border border-white/30 rounded-2xl py-3 text-white font-semibold transition-all duration-200 mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            
            {/* VIP Access Toggle */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <Button
                type="button"
                onClick={() => setShowVipAccess(!showVipAccess)}
                className="w-full bg-transparent hover:bg-white/10 border border-white/30 rounded-2xl py-3 text-white/80 font-medium transition-all duration-200"
              >
                <Key className="w-4 h-4 mr-2" />
                VIP Access Code
              </Button>
            </div>
            
            {/* VIP Access Code Section */}
            {showVipAccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-4"
              >
                <div>
                  <label className="block text-white/80 text-sm mb-2">VIP Access Code</label>
                  <Input
                    type="text"
                    value={vipCode}
                    onChange={(e) => setVipCode(e.target.value.toUpperCase())}
                    placeholder="VIP ACCESS CODE"
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-center tracking-widest uppercase font-medium"
                    maxLength={12}
                    onKeyPress={(e) => e.key === 'Enter' && handleVipAccess()}
                  />
                  
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-300 text-sm mt-2 text-center bg-red-500/20 rounded-xl p-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
                
                <Button
                  onClick={handleVipAccess}
                  disabled={isLoading || !vipCode}
                  className="w-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 border-0 rounded-2xl py-3 text-white font-semibold transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    <>
                      Access Platform →
                    </>
                  )}
                </Button>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowVipAccess(false)}
                    className="text-white/60 hover:text-white/80 text-sm flex items-center justify-center gap-2 transition-colors mx-auto"
                  >
                    ← Back to member login
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t border-white/20">
              <p className="text-white/50 text-xs">Powered by TD Studios</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VipEntry;