import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session) {
          // Check if user has completed profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            // PGRST116 means no rows found, which is expected for new users
            throw profileError;
          }

          // Create profile if it doesn't exist
          if (!profile) {
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata.full_name || session.user.user_metadata.name,
                avatar_url: session.user.user_metadata.avatar_url || session.user.user_metadata.picture,
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (createError) {
              console.error('Profile creation error:', createError);
            }
          }

          // Check if user needs to complete onboarding
          if (!profile?.username || !profile?.onboarding_completed) {
            navigate('/onboarding');
          } else if (profile.role === 'creator') {
            navigate('/dashboard');
          } else {
            navigate('/home');
          }

          toast({
            title: "Welcome!",
            description: "You've successfully signed in.",
          });
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: "Authentication Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-accent/20" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Loading content */}
      <div className="relative z-10 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-display font-semibold text-white mb-2">
          Completing sign in...
        </h2>
        <p className="text-gray-400">
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );
}