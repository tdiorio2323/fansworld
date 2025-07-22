import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, DollarSign, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionButtonProps {
  creatorId: string;
  creatorName: string;
  subscriptionPrice?: number;
  isSubscribed?: boolean;
  className?: string;
}

export function SubscriptionButton({ 
  creatorId, 
  creatorName, 
  subscriptionPrice = 999, 
  isSubscribed = false,
  className = "" 
}: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
        body: { 
          creator_id: creatorId,
          price_amount: subscriptionPrice 
        }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <Badge className="bg-gradient-primary text-white border-0 px-4 py-2">
        <Heart className="w-4 h-4 mr-2" />
        Subscribed
      </Badge>
    );
  }

  return (
    <Button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={`btn-chrome ${className}`}
    >
      <CreditCard className="w-4 h-4 mr-2" />
      Subscribe ${(subscriptionPrice / 100).toFixed(2)}/month
      {isLoading && " ..."}
    </Button>
  );
}

interface TipButtonProps {
  creatorId: string;
  creatorName: string;
  className?: string;
}

export function TipButton({ creatorId, creatorName, className = "" }: TipButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const presetAmounts = [500, 1000, 2500, 5000]; // $5, $10, $25, $50

  const handleTip = async (amount: number) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-tip-checkout', {
        body: { 
          creator_id: creatorId,
          amount,
          message: message.trim()
        }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      setIsOpen(false);
      setCustomAmount("");
      setMessage("");
    } catch (error) {
      console.error('Tip error:', error);
      toast({
        title: "Error",
        description: "Failed to process tip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomTip = () => {
    const amount = Math.round(parseFloat(customAmount) * 100);
    if (amount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum tip amount is $1.00",
        variant: "destructive",
      });
      return;
    }
    handleTip(amount);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className={`border-chrome text-chrome hover:bg-chrome hover:text-chrome-foreground ${className}`}
      >
        <DollarSign className="w-4 h-4 mr-2" />
        Send Tip
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Tip {creatorName}
        </CardTitle>
        <CardDescription>
          Show your appreciation with a tip
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {presetAmounts.map((amount) => (
            <Button
              key={amount}
              onClick={() => handleTip(amount)}
              disabled={isLoading}
              variant="outline"
              className="h-12"
            >
              ${(amount / 100).toFixed(2)}
            </Button>
          ))}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Amount</label>
          <Input
            type="number"
            placeholder="0.00"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            min="1"
            step="0.01"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Message (Optional)</label>
          <Textarea
            placeholder="Leave a nice message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleCustomTip}
            disabled={isLoading || !customAmount}
            className="flex-1 btn-chrome"
          >
            Send ${customAmount || "0.00"}
            {isLoading && " ..."}
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              setCustomAmount("");
              setMessage("");
            }}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}