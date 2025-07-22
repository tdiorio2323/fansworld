import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreditCard, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function TestPayment() {
  const { user, loading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [testAmount, setTestAmount] = useState('1.00');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleTestPayment = async () => {
    try {
      setIsProcessing(true);
      
      // Convert amount to cents
      const amountInCents = Math.round(parseFloat(testAmount) * 100);
      
      // Create a test tip checkout session
      const { data, error } = await supabase.functions.invoke('create-tip-checkout', {
        body: {
          amount: amountInCents,
          creatorId: user.id, // Tip yourself for testing
          message: 'Test payment'
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to create test payment');
    } finally {
      setIsProcessing(false);
    }
  };

  // Stripe test card numbers
  const testCards = [
    { number: '4242 4242 4242 4242', description: 'Successful payment' },
    { number: '4000 0000 0000 9995', description: 'Payment declined' },
    { number: '4000 0025 0000 3155', description: 'Requires authentication' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Test Payment</h1>
            <p className="text-muted-foreground">
              Test Stripe integration with a small charge
            </p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Test Mode</AlertTitle>
            <AlertDescription>
              This is using Stripe test mode. No real charges will be made.
              Use the test card numbers below for testing.
            </AlertDescription>
          </Alert>

          {paymentSuccess && (
            <Alert className="border-green-500/50">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Payment Successful!</AlertTitle>
              <AlertDescription>
                Your test payment was processed successfully.
              </AlertDescription>
            </Alert>
          )}

          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Create Test Charge</CardTitle>
              <CardDescription>
                Enter an amount and click pay to test the payment flow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Test Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.50"
                    max="999.99"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    className="pl-8"
                    placeholder="1.00"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum: $0.50 (Stripe minimum)
                </p>
              </div>

              <Button
                onClick={handleTestPayment}
                disabled={isProcessing || parseFloat(testAmount) < 0.50}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay ${testAmount}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Test Card Numbers</CardTitle>
              <CardDescription>
                Use these Stripe test cards to simulate different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testCards.map((card) => (
                  <div
                    key={card.number}
                    className="p-3 rounded-lg bg-background/50 border border-border/50"
                  >
                    <code className="font-mono text-sm font-bold">{card.number}</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      {card.description}
                    </p>
                  </div>
                ))}
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Use any future expiry date (e.g., 12/34)</p>
                  <p>• Use any 3-digit CVC</p>
                  <p>• Use any 5-digit ZIP code</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>How to Set Up Stripe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">1. Create a Stripe Account</h4>
                <p className="text-sm text-muted-foreground">
                  Go to <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">stripe.com</a> and sign up for a test account
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">2. Get Your API Keys</h4>
                <p className="text-sm text-muted-foreground">
                  In Stripe Dashboard → Developers → API keys, copy your test keys
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">3. Add to Supabase</h4>
                <p className="text-sm text-muted-foreground">
                  In Supabase Dashboard → Settings → Edge Functions, add:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside ml-4">
                  <li>STRIPE_SECRET_KEY (your test secret key)</li>
                  <li>STRIPE_WEBHOOK_SECRET (from webhooks setup)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">4. Current Status</h4>
                <Alert className="border-yellow-500/50">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription>
                    If you're seeing an error, you need to configure your Stripe keys in Supabase first.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}