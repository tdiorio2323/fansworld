import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, Sparkles, Timer, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExitIntentPopupProps {
  enabled?: boolean;
  onEmailCapture?: (email: string) => void;
  onClose?: () => void;
}

export const ExitIntentPopup = ({ 
  enabled = true, 
  onEmailCapture,
  onClose 
}: ExitIntentPopupProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [hasShown, setHasShown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown && enabled) {
        setShowPopup(true);
        setHasShown(true);
      }
    };

    if (enabled) {
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, [hasShown, enabled]);

  // Timer countdown
  useEffect(() => {
    if (showPopup && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showPopup, timeLeft]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      // Simulate email capture
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onEmailCapture) {
        onEmailCapture(email);
      }
      
      setIsSubmitted(true);
      
      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error) {
      console.error('Email capture failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    if (onClose) {
      onClose();
    }
  };

  const handleVipAccess = () => {
    window.open('/vip?code=EXCLUSIVE50', '_blank');
    handleClose();
  };

  const handleOpenChange = (open: boolean) => {
    setShowPopup(open);
    if (!open && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={showPopup} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-gradient-to-br from-purple-900 to-pink-900 border-white/20 max-w-lg">
        {!isSubmitted ? (
          <div className="text-center p-6">
            {/* Animated Icons */}
            <div className="flex justify-center items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />
              <Sparkles className="w-6 h-6 text-purple-400 animate-bounce" />
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl font-bold text-white mb-4">
              Wait! Don't Leave Yet 🚀
            </h2>
            <p className="text-white/80 mb-6">
              Get VIP access + save 50% on your first month
            </p>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl mb-6">
              <Timer className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-semibold">
                Offer expires in {formatTime(timeLeft)}
              </span>
            </div>

            {/* Special Offers */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <Gift className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-green-400 font-semibold">Free until $10K earnings</div>
                  <div className="text-sm text-green-300/80">0% platform fees for new creators</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <Crown className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-purple-400 font-semibold">VIP Onboarding Support</div>
                  <div className="text-sm text-purple-300/80">Personal success manager included</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-pink-400 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-pink-400 font-semibold">Early Access Features</div>
                  <div className="text-sm text-pink-300/80">Get new tools before everyone else</div>
                </div>
              </div>
            </div>

            {/* Email Capture Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for VIP access"
                className="h-12 bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400"
                required
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold h-12"
                >
                  {isSubmitting ? "Getting Access..." : "Get VIP Access"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVipAccess}
                  className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 h-12"
                >
                  Enter VIP Code
                </Button>
              </div>
            </form>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-4 pt-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>{Math.floor(Math.random() * 50) + 150} creators online</span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div>
                <span>{Math.floor(Math.random() * 100) + 500}+ joined today</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-center gap-2 pt-2">
              <Badge variant="secondary" className="text-xs bg-black/20 text-gray-300">
                🔒 256-bit SSL
              </Badge>
              <Badge variant="secondary" className="text-xs bg-black/20 text-gray-300">
                💳 Secure Payments
              </Badge>
              <Badge variant="secondary" className="text-xs bg-black/20 text-gray-300">
                ⚡ Instant Setup
              </Badge>
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">
              Welcome to VIP Access! 🎉
            </h3>
            <p className="text-purple-200 mb-4">
              Check your email for exclusive access code and setup instructions.
            </p>
            
            <Button
              onClick={handleVipAccess}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
            >
              Continue to Platform
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};