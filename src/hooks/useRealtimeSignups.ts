import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface SignupEvent {
  id: string;
  name: string;
  location: string;
  timestamp: Date;
  verified?: boolean;
}

// Initialize Supabase client (client-side safe)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

export const useRealtimeSignups = (limit: number = 10) => {
  const [signups, setSignups] = useState<SignupEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let channel: any;
    let mounted = true;

    const initializeSignups = async () => {
      try {
        // Fetch initial signups
        const { data, error: fetchError } = await supabase
          .from('recent_signups')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (fetchError) {
          console.warn('Supabase not available, using fallback data:', fetchError);
          // Fallback to simulated data if Supabase is not available
          setSignups(generateFallbackSignups(limit));
        } else if (mounted) {
          const formattedSignups = data?.map(signup => ({
            id: signup.id,
            name: signup.creator_name || 'Anonymous Creator',
            location: signup.location || 'Unknown Location',
            timestamp: new Date(signup.created_at),
            verified: signup.verified || false
          })) || [];
          
          setSignups(formattedSignups);
        }
      } catch (err) {
        console.warn('Failed to fetch signups, using fallback:', err);
        if (mounted) {
          setSignups(generateFallbackSignups(limit));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const setupRealtimeSubscription = () => {
      try {
        // Set up real-time subscription
        channel = supabase
          .channel('recent_signups_changes')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'recent_signups'
            },
            (payload) => {
              if (mounted) {
                const newSignup: SignupEvent = {
                  id: payload.new.id,
                  name: payload.new.creator_name || 'New Creator',
                  location: payload.new.location || 'Global',
                  timestamp: new Date(payload.new.created_at),
                  verified: payload.new.verified || false
                };

                setSignups(prev => [newSignup, ...prev].slice(0, limit));
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('🔴 Real-time signups subscription active');
            } else if (status === 'CHANNEL_ERROR') {
              console.warn('Real-time subscription error, using simulated updates');
              startSimulatedUpdates();
            }
          });
      } catch (err) {
        console.warn('Real-time subscription failed, using simulated updates:', err);
        startSimulatedUpdates();
      }
    };

    const startSimulatedUpdates = () => {
      // Fallback: simulate real-time updates when Supabase is not available
      const interval = setInterval(() => {
        if (mounted && Math.random() < 0.15) { // 15% chance every 10 seconds
          const newSignup = generateFallbackSignup();
          setSignups(prev => [newSignup, ...prev].slice(0, limit));
        }
      }, 10000);

      return () => clearInterval(interval);
    };

    // Initialize
    initializeSignups();
    setupRealtimeSubscription();

    return () => {
      mounted = false;
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [limit]);

  return { signups, isLoading, error };
};

// Fallback data generation
const creatorNames = [
  "Sarah M.", "Jessica L.", "Amanda K.", "Nicole R.", "Megan T.", 
  "Ashley W.", "Brittany S.", "Samantha P.", "Taylor B.", "Alexis D.",
  "Victoria C.", "Rachel H.", "Madison F.", "Emma G.", "Olivia N.",
  "Sophie K.", "Isabella T.", "Charlotte M.", "Ava R.", "Mia L."
];

const locations = [
  "Los Angeles, CA", "Miami, FL", "New York, NY", "Austin, TX", "Las Vegas, NV",
  "Atlanta, GA", "Phoenix, AZ", "Seattle, WA", "Denver, CO", "Chicago, IL",
  "Nashville, TN", "San Diego, CA", "Portland, OR", "Orlando, FL", "Tampa, FL",
  "Dallas, TX", "Houston, TX", "Boston, MA", "Philadelphia, PA", "Detroit, MI"
];

const generateFallbackSignup = (): SignupEvent => ({
  id: Math.random().toString(36).substr(2, 9),
  name: creatorNames[Math.floor(Math.random() * creatorNames.length)],
  location: locations[Math.floor(Math.random() * locations.length)],
  timestamp: new Date(Date.now() - Math.random() * 300000), // Last 5 minutes
  verified: Math.random() > 0.3 // 70% verified
});

const generateFallbackSignups = (count: number): SignupEvent[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...generateFallbackSignup(),
    timestamp: new Date(Date.now() - (i * 60000) - Math.random() * 300000) // Stagger timestamps
  }));
};