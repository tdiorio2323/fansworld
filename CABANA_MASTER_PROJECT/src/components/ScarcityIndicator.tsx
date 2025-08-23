import { useState, useEffect } from 'react';
import { AlertTriangle, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScarcityIndicatorProps {
  type: 'spots' | 'stock' | 'beta' | 'vip';
  initialCount?: number;
  threshold?: number; // When to show urgency (e.g., when < 10 spots left)
  title?: string;
  className?: string;
}

export const ScarcityIndicator: React.FC<ScarcityIndicatorProps> = ({
  type,
  initialCount,
  threshold = 10,
  title,
  className = ''
}) => {
  const [count, setCount] = useState<number>(initialCount || getDefaultCount(type));
  const [isUrgent, setIsUrgent] = useState(false);

  function getDefaultCount(type: string): number {
    switch (type) {
      case 'spots': return Math.floor(Math.random() * 50) + 5;
      case 'stock': return Math.floor(Math.random() * 100) + 10;
      case 'beta': return Math.floor(Math.random() * 200) + 50;
      case 'vip': return Math.floor(Math.random() * 20) + 3;
      default: return 25;
    }
  }

  function getConfig(type: string) {
    switch (type) {
      case 'spots':
        return {
          icon: Users,
          title: title || 'Creator Spots Available',
          label: 'spots remaining',
          urgentMessage: 'Almost full! Secure your spot now',
          color: 'purple'
        };
      case 'stock':
        return {
          icon: Zap,
          title: title || 'Limited Licenses Available',
          label: 'licenses left',
          urgentMessage: 'Stock running low!',
          color: 'blue'
        };
      case 'beta':
        return {
          icon: Users,
          title: title || 'Beta Access Available',
          label: 'beta spots left',
          urgentMessage: 'Beta program filling up fast!',
          color: 'green'
        };
      case 'vip':
        return {
          icon: AlertTriangle,
          title: title || 'VIP Invites Remaining',
          label: 'VIP codes left',
          urgentMessage: 'Exclusive access almost gone!',
          color: 'red'
        };
      default:
        return {
          icon: Users,
          title: title || 'Available',
          label: 'remaining',
          urgentMessage: 'Limited availability!',
          color: 'purple'
        };
    }
  }

  const config = getConfig(type);
  const IconComponent = config.icon;

  useEffect(() => {
    setIsUrgent(count <= threshold);
  }, [count, threshold]);

  useEffect(() => {
    // Simulate real-time decreases
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) return prev; // Don't go below 1
        
        // Randomly decrease by 1 every 30-120 seconds
        if (Math.random() < 0.02) { // 2% chance per second
          return prev - 1;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getColorClasses = (color: string, isUrgent: boolean) => {
    const baseColors = {
      purple: {
        normal: 'from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-400',
        urgent: 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400'
      },
      blue: {
        normal: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-400',
        urgent: 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400'
      },
      green: {
        normal: 'from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-400',
        urgent: 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400'
      },
      red: {
        normal: 'from-red-500/10 to-pink-500/10 border-red-500/20 text-red-400',
        urgent: 'from-red-600/30 to-orange-600/30 border-red-600/40 text-red-300'
      }
    };

    return baseColors[color as keyof typeof baseColors]?.[isUrgent ? 'urgent' : 'normal'] || 
           baseColors.purple[isUrgent ? 'urgent' : 'normal'];
  };

  const colorClasses = getColorClasses(config.color, isUrgent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-lg border backdrop-blur-sm bg-gradient-to-r ${colorClasses} ${
        isUrgent ? 'animate-pulse' : ''
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={isUrgent ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
          className="flex-shrink-0"
        >
          <IconComponent className="w-5 h-5" />
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-sm">
              {config.title}
            </h4>
            <motion.span
              animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isUrgent ? Infinity : 0 }}
              className="font-bold text-lg"
            >
              {count}
            </motion.span>
          </div>
          
          <p className="text-xs opacity-80">
            {config.label}
          </p>
          
          {isUrgent && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-medium mt-1"
            >
              ⚡ {config.urgentMessage}
            </motion.p>
          )}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-2 w-full bg-black/20 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${
            isUrgent 
              ? 'bg-gradient-to-r from-red-500 to-orange-500' 
              : 'bg-gradient-to-r from-green-500 to-blue-500'
          }`}
          style={{ width: `${Math.min((count / (initialCount || 100)) * 100, 100)}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((count / (initialCount || 100)) * 100, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
};