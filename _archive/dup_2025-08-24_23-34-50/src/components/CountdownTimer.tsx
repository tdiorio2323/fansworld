import { useState, useEffect } from 'react';
import { Clock, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  duration?: number; // in minutes
  title?: string;
  subtitle?: string;
  onComplete?: () => void;
  showIcon?: boolean;
  variant?: 'default' | 'urgent' | 'minimal';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  duration = 30,
  title = "Limited Time Offer",
  subtitle = "Don't miss out on this exclusive deal",
  onComplete,
  showIcon = true,
  variant = 'default'
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          onComplete?.();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    // Set urgent state when less than 5 minutes remain
    setIsUrgent(timeLeft <= 300);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return {
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: secs.toString().padStart(2, '0')
      };
    }
    
    return {
      hours: null,
      minutes: minutes.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const time = formatTime(timeLeft);

  if (timeLeft <= 0) {
    return (
      <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-400 font-semibold">Offer Expired</p>
        <p className="text-sm text-muted-foreground">This limited time offer has ended</p>
      </div>
    );
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'urgent':
        return {
          container: `bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30 ${
            isUrgent ? 'animate-pulse' : ''
          }`,
          title: 'text-red-400',
          timer: 'text-red-400',
          icon: 'text-red-400'
        };
      case 'minimal':
        return {
          container: 'bg-card/30 border-border/30',
          title: 'text-foreground',
          timer: 'text-primary',
          icon: 'text-primary'
        };
      default:
        return {
          container: `bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 ${
            isUrgent ? 'border-red-500/30' : ''
          }`,
          title: isUrgent ? 'text-red-400' : 'text-purple-400',
          timer: isUrgent ? 'text-red-400' : 'text-foreground',
          icon: isUrgent ? 'text-red-400' : 'text-purple-400'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-lg border backdrop-blur-sm ${styles.container}`}
    >
      <div className="text-center">
        {/* Title and Icon */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {showIcon && (
            <motion.div
              animate={isUrgent ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
            >
              {isUrgent ? (
                <Flame className={`w-5 h-5 ${styles.icon}`} />
              ) : (
                <Clock className={`w-5 h-5 ${styles.icon}`} />
              )}
            </motion.div>
          )}
          <h3 className={`font-semibold ${styles.title}`}>
            {isUrgent ? 'Hurry! Time Running Out' : title}
          </h3>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-muted-foreground mb-4">
          {isUrgent ? 'Only minutes left to claim this offer!' : subtitle}
        </p>

        {/* Timer Display */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {time.hours && (
            <>
              <div className="text-center">
                <div className={`text-2xl font-bold ${styles.timer}`}>
                  {time.hours}
                </div>
                <div className="text-xs text-muted-foreground">HOURS</div>
              </div>
              <div className={`text-xl ${styles.timer}`}>:</div>
            </>
          )}
          
          <div className="text-center">
            <motion.div
              animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isUrgent ? Infinity : 0 }}
              className={`text-2xl font-bold ${styles.timer}`}
            >
              {time.minutes}
            </motion.div>
            <div className="text-xs text-muted-foreground">MINUTES</div>
          </div>
          
          <div className={`text-xl ${styles.timer}`}>:</div>
          
          <div className="text-center">
            <motion.div
              animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isUrgent ? Infinity : 0 }}
              className={`text-2xl font-bold ${styles.timer}`}
            >
              {time.seconds}
            </motion.div>
            <div className="text-xs text-muted-foreground">SECONDS</div>
          </div>
        </div>

        {/* Urgency Message */}
        {isUrgent && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-400 font-medium mt-2"
          >
            ⚡ Act fast! This deal expires soon
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};