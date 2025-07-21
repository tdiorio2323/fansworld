import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Apple } from "lucide-react";

export function AppleSignIn() {
  const navigate = useNavigate();

  const handleAppleSignIn = () => {
    // Bypass authentication - just redirect to home
    navigate('/home');
  };

  return (
    <Button
      className="w-full bg-black hover:bg-gray-900 text-white border border-white/10 hover:border-white/20 hover:scale-105 transition-all"
      onClick={handleAppleSignIn}
    >
      <Apple className="mr-2 h-5 w-5" />
      Continue with Apple
    </Button>
  );
}