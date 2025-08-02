import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/hooks/use-toast';

// Modern VIP Entry Page for CABANA
const VipEntry = () => {
  const [vipCode, setVipCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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
      await supabase.rpc('record_link_click', {
        short_code: refCode,
        user_agent: navigator.userAgent,
        referer: document.referrer || null,
        device_type: /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        session_id: sessionStorage.getItem('session_id') || Math.random().toString(36)
      });
    } catch (error) {
      console.error('Failed to track affiliate click:', error);
    }
  };

  const handleVipAccess = async () => {
    if (!vipCode.trim()) {
      setError('Please enter a VIP code');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Special case for TD development code
      if (vipCode.toLowerCase() === 'td') {
        toast({
          title: "Development Access Granted",
          description: "Redirecting to platform...",
        });
        setTimeout(() => navigate('/home'), 1500);
        return;
      }

      // Check if VIP code exists in invites table (using actual schema)
      const { data: invite, error: inviteError } = await supabase
        .from('invites')
        .select('*')
        .eq('code', vipCode.toUpperCase())
        .eq('used', false)
        .single();

      if (inviteError || !invite) {
        setError('Invalid VIP code. Please check your code and try again.');
        return;
      }

      // Check if invite has expired
      if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
        setError('This VIP code has expired.');
        return;
      }
      
      // For this simple schema, redirect directly to registration
      // Mark invite as used first
      const { error: updateError } = await supabase
        .from('invites')
        .update({ 
          used: true, 
          used_by: null, // Will be set when user actually registers
          used_at: new Date().toISOString() 
        })
        .eq('code', vipCode.toUpperCase());

      if (updateError) {
        console.error('Failed to mark invite as used:', updateError);
        setError('Failed to process VIP code. Please try again.');
        return;
      }

      // Set up session data for registration
      sessionStorage.setItem('validatedInvite', JSON.stringify({
        inviteCode: vipCode.toUpperCase(),
        inviteId: invite.id,
        inviteType: invite.invite_type || 'creator',
        validatedAt: Date.now()
      }));
      
      toast({
        title: "VIP Access Granted!",
        description: "Redirecting to registration...",
      });
      
      setTimeout(() => {
        navigate('/register', { 
          state: { 
            fromInvite: true,
            inviteCode: vipCode.toUpperCase(),
            inviteInfo: invite 
          }
        });
      }, 1500);
      
    } catch (error) {
      console.error('VIP code validation error:', error);
      setError('Failed to validate VIP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove the old logic that was trying to handle passcodes
  const handleVipAccessOld = () => {
    // This is the old hardcoded logic - keeping for reference
    if (false) { // Disabled
      // Old hardcoded 'td' logic for reference
      setTimeout(() => navigate('/home'), 1500);
    }
  };

  // Auto-redirect URL for easy sharing: cabana.tdstudiosny.com?code=td
  const isAutoRedirecting = searchParams.get('code') === 'td';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        
        {/* Modern Branding */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg"></div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-2 tracking-tight">
              CABANA
            </h1>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              VIP Access
            </div>
          </motion.div>
          
          <p className="text-lg text-black font-light max-w-sm mx-auto">
            Premium Creator Management Platform
          </p>
        </div>

        {isAutoRedirecting ? (
          // Auto-redirecting state
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6"
              >
                <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              </motion.div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Granted</h2>
              <p className="text-gray-600">Redirecting to your platform...</p>
            </div>
          </motion.div>
        ) : (
          // VIP Code Entry
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-black mb-2">
                Enter Access Code
              </h2>
              <p className="text-black">
                VIP access for authorized members
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Input
                  type="text"
                  value={vipCode}
                  onChange={(e) => setVipCode(e.target.value)}
                  placeholder="VIP Access Code"
                  className="h-14 text-center font-mono tracking-widest uppercase text-lg border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleVipAccess()}
                  autoFocus
                />
                
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2 text-center font-bold"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <Button 
                onClick={handleVipAccess}
                disabled={isLoading || !vipCode}
                className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Access Platform
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Need access?{' '}
                <a href="mailto:access@cabana.com" className="text-amber-600 hover:text-amber-700 font-medium">
                  Contact Support
                </a>
              </p>
            </div>
          </motion.div>
        )}

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Powered by TD Studios
          </p>
        </div>
      </div>
    </div>
  );
};

export default VipEntry;