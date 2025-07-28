import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Apple } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function AppleSignIn() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAppleSignIn = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        toast({
          title: "Apple Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        // Fallback: redirect to home anyway for demo purposes
        navigate('/home');
      }
    } catch (error) {
      console.error('Apple sign-in error:', error);
      toast({
        title: "Error",
        description: "Failed to initialize Apple sign-in. Redirecting to main app.",
        variant: "destructive",
      });
      // Fallback: redirect to home anyway for demo purposes
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="w-full bg-black hover:bg-gray-900 text-white border border-white/10 hover:border-white/20 hover:scale-105 transition-all"
      onClick={handleAppleSignIn}
      disabled={loading}
    >
      <Apple className="mr-2 h-5 w-5" />
      {loading ? "Connecting..." : "Continue with Apple"}
    </Button>
  );
}