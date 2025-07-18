import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Apple, Loader2 } from "lucide-react";

export function AppleSignIn() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to sign in with Apple. Please try again.",
          variant: "destructive",
        });
        console.error('Apple OAuth error:', error);
      }
    } catch (error) {
      console.error('Apple sign-in error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full bg-black hover:bg-gray-900 text-white border border-white/10 hover:border-white/20 hover:scale-105 transition-all"
      onClick={handleAppleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Apple className="mr-2 h-5 w-5" />
      )}
      Continue with Apple
    </Button>
  );
}