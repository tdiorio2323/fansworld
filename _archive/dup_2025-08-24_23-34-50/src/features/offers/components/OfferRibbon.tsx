/**
 * Offer Ribbon Component - Eye-catching promotional banners
 * FansWorld Creator Platform
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Percent, Zap, Gift, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { useFlag } from '@/hooks/useFlag';
import { offersService, type Offer } from '../services/offersService';

interface OfferRibbonProps {
  offer: Offer;
  onClaim?: (offer: Offer) => void;
  onDismiss?: (offerId: string) => void;
  onView?: (offerId: string) => void;
  variant?: 'banner' | 'card' | 'floating';
  position?: 'top' | 'bottom';
  showDismiss?: boolean;
  className?: string;
}

export function OfferRibbon({ 
  offer, 
  onClaim, 
  onDismiss, 
  onView,
  variant = 'banner',
  position = 'top',
  showDismiss = true,
  className 
}: OfferRibbonProps) {
  const { isEnabled: offerRibbonEnabled } = useFlag('OFFER_RIBBON_ENABLED');
  const { isEnabled: animationsEnabled } = useFlag('OFFER_RIBBON_ANIMATIONS');
  const { isEnabled: soundEnabled } = useFlag('OFFER_RIBBON_SOUND');
  
  const [timeRemaining, setTimeRemaining] = useState(offersService.getTimeRemaining(offer.ends_at));
  const [isVisible, setIsVisible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!offerRibbonEnabled) return;

    // Track view when component mounts
    if (onView) {
      onView(offer.id);
    }

    // Update countdown every second
    const interval = setInterval(() => {
      const remaining = offersService.getTimeRemaining(offer.ends_at);
      setTimeRemaining(remaining);
      
      if (remaining.isExpired) {
        setIsVisible(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [offer.id, offerRibbonEnabled, onView]);

  useEffect(() => {
    // Play sound on mount if enabled and high urgency
    if (soundEnabled && offer.urgency_level >= 8 && !hasInteracted) {
      // Simple beep sound - in production, use actual audio files
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  }, [soundEnabled, offer.urgency_level, hasInteracted]);

  if (!offerRibbonEnabled || !isVisible || timeRemaining.isExpired) {
    return null;
  }

  const handleClaim = () => {
    setHasInteracted(true);
    if (onClaim) {
      onClaim(offer);
    }
    // Track click event
    offersService.trackEvent(offer.id, 'offer_clicked', {
      variant,
      position,
      interactionType: 'claim'
    });
  };

  const handleDismiss = () => {
    setHasInteracted(true);
    setIsVisible(false);
    if (onDismiss) {
      onDismiss(offer.id);
    }
    // Track dismissal
    offersService.trackEvent(offer.id, 'offer_dismissed', {
      variant,
      position
    });
  };

  const getUrgencyColor = () => {
    if (offer.urgency_level >= 8) return '#FF0000'; // Red
    if (offer.urgency_level >= 6) return '#FF6600'; // Orange
    if (offer.urgency_level >= 4) return '#FFB800'; // Yellow
    return '#00AA00'; // Green
  };

  const getUrgencyAnimation = () => {
    if (!animationsEnabled) return {};
    
    if (offer.urgency_level >= 8) {
      return {
        animate: { scale: [1, 1.02, 1], opacity: [1, 0.9, 1] },
        transition: { duration: 1, repeat: Infinity, repeatType: 'loop' as const }
      };
    }
    
    if (offer.urgency_level >= 6) {
      return {
        animate: { scale: [1, 1.01, 1] },
        transition: { duration: 2, repeat: Infinity, repeatType: 'loop' as const }
      };
    }
    
    return {};
  };

  const formatTimeRemaining = () => {
    if (timeRemaining.days > 0) {
      return `${timeRemaining.days}d ${timeRemaining.hours}h`;
    }
    if (timeRemaining.hours > 0) {
      return `${timeRemaining.hours}h ${timeRemaining.minutes}m`;
    }
    if (timeRemaining.minutes > 0) {
      return `${timeRemaining.minutes}m ${timeRemaining.seconds}s`;
    }
    return `${timeRemaining.seconds}s`;
  };

  const getDiscountText = () => {
    if (offer.discount_percentage) {
      return `${offer.discount_percentage}% OFF`;
    }
    if (offer.original_price_cents && offer.discounted_price_cents) {
      const saved = offer.original_price_cents - offer.discounted_price_cents;
      return `SAVE ${offersService.formatPrice(saved)}`;
    }
    return 'SPECIAL OFFER';
  };

  // Banner variant (full-width ribbon)
  if (variant === 'banner') {
    return (
      <AnimatePresence>
        <motion.div
          initial={animationsEnabled ? { y: position === 'top' ? -100 : 100, opacity: 0 } : {}}
          animate={animationsEnabled ? { y: 0, opacity: 1 } : {}}
          exit={animationsEnabled ? { y: position === 'top' ? -100 : 100, opacity: 0 } : {}}
          className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50 ${className}`}
        >
          <motion.div
            style={{ backgroundColor: offer.ribbon_color_hex || getUrgencyColor() }}
            className="relative overflow-hidden text-white shadow-lg"
            {...getUrgencyAnimation()}
          >
            {/* Animated background pattern for high urgency */}
            {animationsEnabled && offer.urgency_level >= 8 && (
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                }}
              />
            )}

            <div className="relative px-4 py-3">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center space-x-4">
                  {/* Icon based on urgency */}
                  <div className="flex items-center">
                    {offer.urgency_level >= 8 ? (
                      <motion.div
                        animate={animationsEnabled ? { rotate: [0, 360] } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="w-5 h-5" />
                      </motion.div>
                    ) : offer.urgency_level >= 6 ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <Gift className="w-5 h-5" />
                    )}
                  </div>

                  {/* Offer content */}
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="font-bold text-lg">{offer.ribbon_text || offer.title}</span>
                      {offer.description && (
                        <span className="ml-2 opacity-90">{offer.description}</span>
                      )}
                    </div>
                    
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {getDiscountText()}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Countdown */}
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono">{formatTimeRemaining()}</span>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={handleClaim}
                    variant="secondary"
                    size="sm"
                    className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                  >
                    Claim Now
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>

                  {/* Dismiss button */}
                  {showDismiss && (
                    <Button
                      onClick={handleDismiss}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Card variant
  if (variant === 'card') {
    return (
      <AnimatePresence>
        <motion.div
          initial={animationsEnabled ? { scale: 0.9, opacity: 0 } : {}}
          animate={animationsEnabled ? { scale: 1, opacity: 1 } : {}}
          exit={animationsEnabled ? { scale: 0.9, opacity: 0 } : {}}
          className={className}
        >
          <Card className="overflow-hidden border-2" style={{ borderColor: offer.ribbon_color_hex || getUrgencyColor() }}>
            <motion.div
              style={{ backgroundColor: offer.ribbon_color_hex || getUrgencyColor() }}
              className="p-2 text-white text-center relative"
              {...getUrgencyAnimation()}
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                  {getDiscountText()}
                </Badge>
                <div className="flex items-center text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTimeRemaining()}
                </div>
                {showDismiss && (
                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-0.5 h-auto"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </motion.div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{offer.title}</h3>
              {offer.description && (
                <p className="text-sm text-gray-600 mb-3">{offer.description}</p>
              )}
              
              <Button
                onClick={handleClaim}
                className="w-full"
                style={{ backgroundColor: offer.ribbon_color_hex || getUrgencyColor() }}
              >
                Claim Offer
                <Gift className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Floating variant
  if (variant === 'floating') {
    return (
      <AnimatePresence>
        <motion.div
          initial={animationsEnabled ? { scale: 0, rotate: -180 } : {}}
          animate={animationsEnabled ? { scale: 1, rotate: 0 } : {}}
          exit={animationsEnabled ? { scale: 0, rotate: 180 } : {}}
          className={`fixed bottom-4 right-4 z-50 max-w-sm ${className}`}
        >
          <motion.div
            style={{ backgroundColor: offer.ribbon_color_hex || getUrgencyColor() }}
            className="rounded-lg shadow-xl text-white p-4 relative overflow-hidden"
            {...getUrgencyAnimation()}
          >
            {/* Dismiss button */}
            {showDismiss && (
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-white hover:bg-white/20 p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            )}

            <div className="pr-8">
              <div className="flex items-center mb-2">
                <Zap className="w-5 h-5 mr-2" />
                <span className="font-bold">{offer.ribbon_text || offer.title}</span>
              </div>
              
              {offer.description && (
                <p className="text-sm opacity-90 mb-3">{offer.description}</p>
              )}

              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {getDiscountText()}
                </Badge>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTimeRemaining()}
                </div>
              </div>

              <Button
                onClick={handleClaim}
                variant="secondary"
                size="sm"
                className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold"
              >
                Claim Now
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}