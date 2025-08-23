import { useState, useEffect } from "react";
import { ROICalculator } from "./ROICalculator";
import { ExitIntentPopup } from "./ExitIntentPopup";
import { useExitIntent } from "@/hooks/useExitIntent";
import { supabase } from "@/integrations/supabase/supabase";
import { toast } from "@/hooks/use-toast";

interface ConversionOptimizationProps {
  showROICalculator?: boolean;
  enableExitIntent?: boolean;
  exitIntentDelay?: number;
}

export const ConversionOptimization = ({
  showROICalculator = true,
  enableExitIntent = true,
  exitIntentDelay = 5000 // 5 seconds
}: ConversionOptimizationProps) => {
  const [showExitPopup, setShowExitPopup] = useState(false);
  
  // Exit intent detection
  const exitIntent = useExitIntent({
    enabled: enableExitIntent,
    delay: exitIntentDelay,
    maxTriggers: 2, // Show max 2 times per session
    sessionOnly: true
  });

  // Show exit popup when exit intent is triggered
  useEffect(() => {
    if (exitIntent.hasTriggered && !showExitPopup) {
      setShowExitPopup(true);
    }
  }, [exitIntent.hasTriggered, showExitPopup]);

  // Handle email capture from exit intent popup
  const handleEmailCapture = async (email: string) => {
    try {
      // Add to waitlist
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            email: email,
            source: 'exit_intent_popup',
            metadata: {
              offer: 'vip_access_50_off',
              timestamp: new Date().toISOString()
            }
          }
        ]);

      if (error) {
        console.error('Waitlist signup error:', error);
        toast({
          title: "Almost there!",
          description: "There was an issue, but we'll still send you VIP access details.",
          variant: "default"
        });
      } else {
        toast({
          title: "VIP Access Granted! 🎉",
          description: "Check your email for exclusive access code and setup instructions.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Email capture error:', error);
    }
  };

  return (
    <>
      {/* ROI Calculator */}
      {showROICalculator && (
        <div className="py-12">
          <ROICalculator />
        </div>
      )}

      {/* Exit Intent Popup */}
      <ExitIntentPopup
        enabled={enableExitIntent}
        onEmailCapture={handleEmailCapture}
        onClose={() => setShowExitPopup(false)}
      />
    </>
  );
};