import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentVerifierProps {
  onPaymentVerified?: (status: string, mode: string) => void;
}

export function PaymentVerifier({ onPaymentVerified }: PaymentVerifierProps) {
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, [verifyPayment]);

  const verifyPayment = useCallback(async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { session_id: sessionId }
      });

      if (error) throw error;

      const { status, mode } = data;
      
      if (status === 'paid') {
        toast({
          title: "Payment Successful!",
          description: mode === 'subscription' 
            ? "Your subscription is now active." 
            : "Thank you for your tip!",
        });
      }

      onPaymentVerified?.(status, mode);
      
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Payment Verification Failed",
        description: "Please contact support if you were charged.",
        variant: "destructive",
      });
    }
  }, [onPaymentVerified, toast]);

  return null; // This is a utility component, no UI
}