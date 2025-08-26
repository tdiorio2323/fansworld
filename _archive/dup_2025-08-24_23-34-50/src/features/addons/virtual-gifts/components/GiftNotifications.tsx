//  GIFT NOTIFICATIONS - Real-time Gift Alerts

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Gift, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type { GiftReceivedEvent, GiftSentEvent, GiftTransaction } from '../types';
import { GIFT_ANIMATIONS, GIFT_SOUNDS } from '../config';

interface GiftNotificationsProps {
  userId?: string;
  soundEnabled?: boolean;
  showAnimation?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
}

export const GiftNotifications: React.FC<GiftNotificationsProps> = ({
  userId,
  soundEnabled: defaultSoundEnabled = true,
  showAnimation = true,
  position = 'top-right'
}) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<GiftNotification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(defaultSoundEnabled);
  const [animatingGifts, setAnimatingGifts] = useState<AnimatingGift[]>([]);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const channelRef = useRef<any>(null);

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    const setupRealtimeSubscription = async () => {
      // Subscribe to gift notifications
      const channel = supabase.channel('gift-notifications')
        .on('broadcast', { event: 'gift-received' }, (payload) => {
          const event = payload.payload as GiftReceivedEvent;
          if (event.transaction.recipientId === userId) {
            handleGiftReceived(event);
          }
        })
        .on('broadcast', { event: 'gift-sent' }, (payload) => {
          const event = payload.payload as GiftSentEvent;
          if (event.transaction.senderId === userId) {
            handleGiftSent(event);
          }
        })
        .subscribe();

      channelRef.current = channel;
    };

    setupRealtimeSubscription();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [userId]);

  // Preload sound files
  useEffect(() => {
    const loadSounds = () => {
      Object.entries(GIFT_SOUNDS).forEach(([soundKey, soundPath]) => {
        const audio = new Audio(soundPath);
        audio.preload = 'auto';
        audio.volume = 0.3; // Set moderate volume
        audioRefs.current.set(soundKey, audio);
      });
    };

    if (soundEnabled) {
      loadSounds();
    }

    return () => {
      // Cleanup audio elements
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current.clear();
    };
  }, [soundEnabled]);

  const handleGiftReceived = (event: GiftReceivedEvent) => {
    const { transaction } = event;
    
    // Add notification
    const notification: GiftNotification = {
      id: `received-${transaction.id}`,
      type: 'received',
      transaction,
      timestamp: Date.now(),
    };
    
    addNotification(notification);
    
    // Show toast
    toast({
      title: ` Gift Received!`,
      description: `${transaction.quantity}x ${transaction.gift?.name} from ${
        transaction.isAnonymous ? 'Anonymous' : `@${transaction.sender?.username}`
      }`,
      duration: 5000,
    });

    // Play sound
    if (soundEnabled && transaction.gift?.sound) {
      playGiftSound(transaction.gift.sound);
    }

    // Add animation
    if (showAnimation && transaction.gift) {
      addGiftAnimation(transaction.gift, transaction.quantity);
    }
  };

  const handleGiftSent = (event: GiftSentEvent) => {
    const { transaction } = event;
    
    // Add notification
    const notification: GiftNotification = {
      id: `sent-${transaction.id}`,
      type: 'sent',
      transaction,
      timestamp: Date.now(),
    };
    
    addNotification(notification);
    
    // Show toast (lighter feedback for sent gifts)
    toast({
      title: `Gift Sent `,
      description: `${transaction.quantity}x ${transaction.gift?.name} sent successfully`,
      duration: 3000,
    });
  };

  const addNotification = (notification: GiftNotification) => {
    setNotifications(prev => {
      const newNotifications = [notification, ...prev.slice(0, 4)]; // Keep last 5
      
      // Auto-remove after delay
      setTimeout(() => {
        setNotifications(current => 
          current.filter(n => n.id !== notification.id)
        );
      }, 8000);
      
      return newNotifications;
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const playGiftSound = (soundKey: string) => {
    const audio = audioRefs.current.get(soundKey);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(console.warn); // Handle autoplay restrictions gracefully
    }
  };

  const addGiftAnimation = (gift: any, quantity: number) => {
    // Create multiple animation instances for quantity > 1
    const animations = Array.from({ length: Math.min(quantity, 5) }, (_, i) => ({
      id: `anim-${Date.now()}-${i}`,
      emoji: gift.emoji,
      animation: gift.animation || 'float-up',
      delay: i * 200, // Stagger animations
    }));

    setAnimatingGifts(prev => [...prev, ...animations]);

    // Remove animations after completion
    animations.forEach(anim => {
      setTimeout(() => {
        setAnimatingGifts(current => 
          current.filter(a => a.id !== anim.id)
        );
      }, 3000 + anim.delay);
    });
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <>
      {/* Notification Container */}
      <div className={`fixed z-50 ${getPositionStyles()} space-y-3 max-w-sm w-full pointer-events-none`}>
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
        
        {/* Sound Toggle Button */}
        {notifications.length > 0 && (
          <div className=\"flex justify-end pointer-events-auto\">
            <Button
              variant=\"outline\"
              size=\"sm\"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className=\"bg-black/80 border-white/20 text-white hover:bg-black/90\"
            >
              {soundEnabled ? (
                <Volume2 className=\"w-4 h-4\" />
              ) : (
                <VolumeX className=\"w-4 h-4\" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Gift Animations Overlay */}
      {showAnimation && (
        <div className=\"fixed inset-0 pointer-events-none z-40\">
          {animatingGifts.map((gift) => (
            <GiftAnimation
              key={gift.id}
              emoji={gift.emoji}
              animation={gift.animation}
              delay={gift.delay}
            />
          ))}
        </div>
      )}

      {/* Inject Animation Styles */}
      <style>{`
        ${Object.values(GIFT_ANIMATIONS).join('\\n')}
        
        .gift-float-up {
          animation: floatUp 3s ease-out forwards;
        }
        
        .gift-pulse-grow {
          animation: pulseGrow 2s ease-in-out infinite;
        }
        
        .gift-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .gift-shooting-across {
          animation: shootingAcross 2s ease-out forwards;
        }
        
        .gift-sparkle-rotate {
          animation: sparkleRotate 3s linear infinite;
        }
        
        .gift-golden-glow {
          animation: goldenGlow 2s ease-in-out infinite;
        }
        
        .gift-fire-effect {
          animation: fireEffect 1.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// ==================== NOTIFICATION CARD COMPONENT ====================

interface NotificationCardProps {
  notification: GiftNotification;
  onClose: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onClose }) => {
  const { transaction, type } = notification;
  const gift = transaction.gift;
  
  const isReceived = type === 'received';
  const bgColor = isReceived ? 'bg-gradient-to-r from-green-600/90 to-emerald-600/90' : 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90';
  const icon = isReceived ? '' : '';

  return (
    <div className={`${bgColor} backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-lg pointer-events-auto transform transition-all duration-500 ease-out animate-in slide-in-from-right`}>
      <div className=\"flex items-start gap-3\">
        {/* Gift Icon */}
        <div className=\"text-2xl flex-shrink-0\">
          {gift?.emoji || icon}
        </div>

        {/* Content */}
        <div className=\"flex-1 min-w-0\">
          <div className=\"flex items-center justify-between mb-1\">
            <h4 className=\"text-white font-semibold text-sm\">
              {isReceived ? 'Gift Received!' : 'Gift Sent!'}
            </h4>
            <Button
              variant=\"ghost\"
              size=\"sm\"
              onClick={onClose}
              className=\"h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10\"
            >
              <X className=\"w-4 h-4\" />
            </Button>
          </div>
          
          <div className=\"text-white/90 text-sm\">
            <strong>{transaction.quantity}x {gift?.name}</strong>
          </div>
          
          <div className=\"text-white/70 text-xs mt-1\">
            {isReceived ? 'From' : 'To'}: {
              transaction.isAnonymous 
                ? 'Anonymous' 
                : `@${(isReceived ? transaction.sender : transaction.recipient)?.username}`
            }
          </div>
          
          {transaction.message && (
            <div className=\"text-white/80 text-xs mt-2 italic bg-black/20 p-2 rounded\">
              \"{transaction.message}\"
            </div>
          )}
          
          <div className=\"text-white/60 text-xs mt-2\">
            ${(transaction.amount / 100).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== GIFT ANIMATION COMPONENT ====================

interface GiftAnimationProps {
  emoji: string;
  animation: string;
  delay: number;
}

const GiftAnimation: React.FC<GiftAnimationProps> = ({ emoji, animation, delay }) => {
  // Random position for animation
  const randomX = Math.random() * (window.innerWidth - 100);
  const randomY = Math.random() * (window.innerHeight - 100);

  return (
    <div
      className={`absolute text-4xl gift-${animation}`}
      style={{
        left: randomX,
        top: randomY,
        animationDelay: `${delay}ms`,
      }}
    >
      {emoji}
    </div>
  );
};

// ==================== TYPE DEFINITIONS ====================

interface GiftNotification {
  id: string;
  type: 'received' | 'sent';
  transaction: GiftTransaction;
  timestamp: number;
}

interface AnimatingGift {
  id: string;
  emoji: string;
  animation: string;
  delay: number;
}