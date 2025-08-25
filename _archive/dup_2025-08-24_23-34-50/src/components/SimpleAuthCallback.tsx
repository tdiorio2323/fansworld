import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function SimpleAuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Since we're using placeholder Supabase credentials, 
    // just redirect to home after a short delay
    const timer = setTimeout(() => {
      toast({
        title: "Demo Mode",
        description: "Authentication callback - redirecting to home",
      });
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
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
          Demo Mode - Processing...
        </h2>
        <p className="text-gray-400">
          Redirecting to home page
        </p>
      </div>
    </div>
  );
}
