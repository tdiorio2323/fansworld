/**
 * VIP Code Redemption Component - User interface for redeeming VIP codes
 * FansWorld Creator Platform
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Gift, Check, AlertCircle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useFlag } from '@/hooks/useFlag';
import { vipV2Service, type VipCode, type RedeemCodeData } from '../services/vipService';
import { useAuth } from '@/hooks/useAuth';

const redeemSchema = z.object({
  code: z.string()
    .min(3, 'Code must be at least 3 characters')
    .max(50, 'Code is too long')
    .transform(val => val.toUpperCase()),
});

type RedeemFormData = z.infer<typeof redeemSchema>;

interface VipCodeRedemptionProps {
  onRedeemSuccess?: (redemption: any) => void;
  prefilledCode?: string;
}

export function VipCodeRedemption({ onRedeemSuccess, prefilledCode }: VipCodeRedemptionProps) {
  const { isEnabled: vipV2Enabled } = useFlag('VIP_V2_ENABLED');
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [foundCode, setFoundCode] = useState<VipCode | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [redemptionSuccess, setRedemptionSuccess] = useState(false);

  const form = useForm<RedeemFormData>({
    resolver: zodResolver(redeemSchema),
    defaultValues: {
      code: prefilledCode || '',
    },
  });

  if (!vipV2Enabled) {
    return null;
  }

  const lookupCode = async (code: string) => {
    if (!code || code.length < 3) return;

    setIsLoading(true);
    try {
      const vipCode = await vipV2Service.getCodeByString(code);
      setFoundCode(vipCode);
      
      if (vipCode) {
        toast.success('VIP code found!');
        if (vipCode.price_cents > 0) {
          setShowPayment(true);
        }
      } else {
        toast.error('VIP code not found or inactive');
      }
    } catch (error) {
      toast.error('Error looking up VIP code');
    } finally {
      setIsLoading(false);
    }
  };

  const redeemCode = async () => {
    if (!user?.id || !foundCode) return;

    setIsLoading(true);
    try {
      const redemptionData: RedeemCodeData = {
        code: foundCode.code,
        userAgent: navigator.userAgent,
        referrerUrl: document.referrer,
        // TODO: Extract UTM parameters from URL
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };

      // If code has a price, handle payment first
      if (foundCode.price_cents > 0) {
        // TODO: Integrate with Stripe payment
        redemptionData.paymentIntentId = 'mock-payment-intent';
        redemptionData.amountPaidCents = foundCode.price_cents;
      }

      const redemption = await vipV2Service.redeemCode(
        user.id, 
        redemptionData,
        // Get user IP (in real app, this would be handled server-side)
        undefined
      );
      
      setRedemptionSuccess(true);
      toast.success('VIP code redeemed successfully!');
      
      if (onRedeemSuccess) {
        onRedeemSuccess(redemption);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to redeem VIP code');
    } finally {
      setIsLoading(false);
      setShowPayment(false);
    }
  };

  const onSubmit = async (data: RedeemFormData) => {
    await lookupCode(data.code);
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const isCodeExpired = (code: VipCode) => {
    return code.expires_at && new Date(code.expires_at) < new Date();
  };

  const isCodeAtLimit = (code: VipCode) => {
    return code.current_uses >= code.max_uses;
  };

  if (redemptionSuccess && foundCode) {
    return (
      <Card className="max-w-md mx-auto bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-green-800">VIP Code Redeemed!</CardTitle>
          <CardDescription>
            Congratulations! You've successfully redeemed the VIP code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="font-semibold text-lg">{foundCode.title}</p>
            <p className="text-gray-600">{foundCode.description}</p>
          </div>
          
          {foundCode.benefits && foundCode.benefits.length > 0 && (
            <div>
              <p className="font-medium text-sm text-gray-700 mb-2">Your Benefits:</p>
              <div className="space-y-1">
                {foundCode.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={() => {
              setRedemptionSuccess(false);
              setFoundCode(null);
              form.reset();
            }}
            variant="outline"
            className="w-full"
          >
            Redeem Another Code
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle>Redeem VIP Code</CardTitle>
          <CardDescription>
            Enter your exclusive VIP code to unlock special benefits and content.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIP Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your VIP code"
                        className="uppercase font-mono text-center text-lg tracking-wider"
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormDescription>
                      VIP codes are case-insensitive and usually 6-12 characters long.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isLoading || !user}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Looking up code...
                  </>
                ) : (
                  'Lookup VIP Code'
                )}
              </Button>

              {!user && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You must be logged in to redeem VIP codes.
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Code Details Dialog */}
      <Dialog open={!!foundCode && !redemptionSuccess} onOpenChange={() => setFoundCode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>VIP Code Found</DialogTitle>
            <DialogDescription>
              Review the details below and confirm your redemption.
            </DialogDescription>
          </DialogHeader>

          {foundCode && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold">{foundCode.title}</h3>
                <p className="text-gray-600">{foundCode.description}</p>
              </div>

              <div className="flex justify-between items-center py-2 border-t border-b">
                <span className="font-medium">Code:</span>
                <Badge variant="outline" className="font-mono">{foundCode.code}</Badge>
              </div>

              {foundCode.price_cents > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Price:</span>
                  <Badge variant="secondary">{formatPrice(foundCode.price_cents)}</Badge>
                </div>
              )}

              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Uses Remaining:</span>
                <span>{foundCode.max_uses - foundCode.current_uses} / {foundCode.max_uses}</span>
              </div>

              {foundCode.expires_at && (
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Expires:</span>
                  <span>{new Date(foundCode.expires_at).toLocaleDateString()}</span>
                </div>
              )}

              {foundCode.benefits && foundCode.benefits.length > 0 && (
                <div>
                  <p className="font-medium text-sm mb-2">Benefits Included:</p>
                  <div className="space-y-1">
                    {foundCode.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation Checks */}
              {isCodeExpired(foundCode) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This VIP code has expired and cannot be redeemed.
                  </AlertDescription>
                </Alert>
              )}

              {isCodeAtLimit(foundCode) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This VIP code has reached its maximum number of uses.
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Button */}
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setFoundCode(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={redeemCode}
                  disabled={isLoading || isCodeExpired(foundCode) || isCodeAtLimit(foundCode)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redeeming...
                    </>
                  ) : foundCode.price_cents > 0 ? (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay & Redeem
                    </>
                  ) : (
                    'Redeem Free'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}