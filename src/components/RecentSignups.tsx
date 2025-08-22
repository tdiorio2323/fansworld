import { useState, useEffect } from "react";
import { UserCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRealtimeSignups } from "@/hooks/useRealtimeSignups";

interface SignupEvent {
  id: string;
  name: string;
  location: string;
  timestamp: Date;
  verified?: boolean;
}

export const RecentSignups = () => {
  const { signups: realtimeSignups, isLoading } = useRealtimeSignups(10);
  const [currentSignup, setCurrentSignup] = useState<SignupEvent | null>(null);

  useEffect(() => {
    if (realtimeSignups.length > 0) {
      // Show the most recent signup as featured
      setCurrentSignup(realtimeSignups[0]);
    }
  }, [realtimeSignups]);

  if (isLoading) {
    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <UserCheck className="w-5 h-5 text-primary animate-pulse" />
          <span className="font-semibold">Loading Recent Activity...</span>
        </div>
      </div>
    );
  }

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className="space-y-4">
      {/* Live Signup Notification */}
      <AnimatePresence>
        {currentSignup && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            key={currentSignup.id}
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-green-400">{currentSignup.name}</span>
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400 font-medium">just joined!</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentSignup.location} • {getTimeAgo(currentSignup.timestamp)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Signups List */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <UserCheck className="w-5 h-5 text-primary" />
          <span className="font-semibold">Recent Creators</span>
          <div className="ml-auto">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          {realtimeSignups.slice(0, 5).map((signup, index) => (
            <motion.div
              key={signup.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {signup.name.charAt(0)}
                  </div>
                  {signup.verified && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-medium text-sm">{signup.name}</p>
                    {signup.verified && <Sparkles className="w-3 h-3 text-green-400" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{signup.location}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {getTimeAgo(signup.timestamp)}
              </span>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">
            Join {Math.floor(Math.random() * 500) + 1500}+ creators earning more
          </p>
          <p className="text-xs text-green-400 mt-1">
            🔴 Live feed • {realtimeSignups.length} recent joins
          </p>
        </div>
      </div>
    </div>
  );
};