import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { X, DollarSign, AlertCircle, Info } from 'lucide-react';
import { CreatorEarnings } from '@/lib/stripe-connect';
import { useCurrencyFormatter } from '@/hooks/useStripeConnect';

interface PayoutRequestFormProps {
  earnings: CreatorEarnings[];
  onSubmit: (data: {
    earningsId: string;
    requestedAmount: number;
    requestType: 'automatic' | 'manual' | 'emergency';
    notes?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export const PayoutRequestForm: React.FC<PayoutRequestFormProps> = ({
  earnings,
  onSubmit,
  onCancel
}) => {
  const [selectedEarningsId, setSelectedEarningsId] = useState<string>('');
  const [requestType, setRequestType] = useState<'manual' | 'emergency'>('manual');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { formatCurrency } = useCurrencyFormatter();

  const selectedEarnings = earnings.find(e => e.id === selectedEarningsId);
  const totalAvailable = earnings.reduce((sum, e) => sum + e.net_earnings, 0);

  const calculateProcessingFee = (amount: number): number => {
    // Standard processing fee: 2.9% + $0.30
    return Math.round(amount * 0.029 + 30);
  };

  const getNetAmount = (amount: number): number => {
    const processingFee = calculateProcessingFee(amount);
    return amount - processingFee;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedEarningsId) {
      newErrors.earnings = 'Please select an earnings period';
    }

    if (!customAmount || parseFloat(customAmount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else {
      const amount = parseFloat(customAmount) * 100; // Convert to cents
      const maxAmount = selectedEarnings?.net_earnings || 0;
      
      if (amount > maxAmount) {
        newErrors.amount = `Amount cannot exceed ${formatCurrency(maxAmount)}`;
      }
      
      if (amount < 1000) { // $10 minimum
        newErrors.amount = 'Minimum payout amount is $10.00';
      }
    }

    if (requestType === 'emergency' && !notes.trim()) {
      newErrors.notes = 'Please provide a reason for the emergency payout';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const amount = parseFloat(customAmount) * 100; // Convert to cents
      await onSubmit({
        earningsId: selectedEarningsId,
        requestedAmount: amount,
        requestType,
        notes: notes.trim() || undefined
      });
    } catch (error) {
      console.error('Error submitting payout request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestedAmount = customAmount ? parseFloat(customAmount) * 100 : 0;
  const processingFee = requestedAmount > 0 ? calculateProcessingFee(requestedAmount) : 0;
  const netAmount = requestedAmount > 0 ? getNetAmount(requestedAmount) : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Request Payout
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Earnings Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Earnings Period</h3>
              
              {earnings.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No pending earnings available for payout.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {earnings.map((earning) => (
                    <div
                      key={earning.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedEarningsId === earning.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedEarningsId(earning.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {new Date(earning.period_start).toLocaleDateString()} - {new Date(earning.period_end).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Gross: {formatCurrency(earning.gross_earnings)} | 
                            Net: {formatCurrency(earning.net_earnings)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={earning.payout_status === 'pending' ? 'secondary' : 'outline'}>
                            {earning.payout_status}
                          </Badge>
                        </div>
                      </div>
                      
                      {earning.earnings_breakdown && (
                        <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                          Revenue breakdown: 
                          {earning.earnings_breakdown.subscription_revenue > 0 && (
                            <span className="ml-2">
                              Subscriptions: {formatCurrency(earning.earnings_breakdown.subscription_revenue)}
                            </span>
                          )}
                          {earning.earnings_breakdown.tip_revenue > 0 && (
                            <span className="ml-2">
                              Tips: {formatCurrency(earning.earnings_breakdown.tip_revenue)}
                            </span>
                          )}
                          {earning.earnings_breakdown.ppv_revenue > 0 && (
                            <span className="ml-2">
                              PPV: {formatCurrency(earning.earnings_breakdown.ppv_revenue)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {errors.earnings && (
                <p className="text-sm text-red-500">{errors.earnings}</p>
              )}
            </div>

            {/* Amount Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payout Amount</h3>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="10"
                    max={selectedEarnings ? selectedEarnings.net_earnings / 100 : undefined}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="0.00"
                    className={`pl-8 ${errors.amount ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
                
                {selectedEarnings && (
                  <p className="text-sm text-muted-foreground">
                    Maximum available: {formatCurrency(selectedEarnings.net_earnings)}
                  </p>
                )}
              </div>

              {/* Quick Amount Buttons */}
              {selectedEarnings && (
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomAmount((selectedEarnings.net_earnings / 100 * 0.25).toFixed(2))}
                  >
                    25%
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomAmount((selectedEarnings.net_earnings / 100 * 0.5).toFixed(2))}
                  >
                    50%
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomAmount((selectedEarnings.net_earnings / 100 * 0.75).toFixed(2))}
                  >
                    75%
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomAmount((selectedEarnings.net_earnings / 100).toFixed(2))}
                  >
                    100%
                  </Button>
                </div>
              )}

              {/* Fee Breakdown */}
              {requestedAmount > 0 && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h4 className="font-medium">Payout Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Requested Amount:</span>
                      <span>{formatCurrency(requestedAmount)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Processing Fee (2.9% + $0.30):</span>
                      <span>-{formatCurrency(processingFee)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1">
                      <span>You'll Receive:</span>
                      <span>{formatCurrency(netAmount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Request Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Request Type</h3>
              
              <Select value={requestType} onValueChange={(value: 'manual' | 'emergency') => setRequestType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Request</SelectItem>
                  <SelectItem value="emergency">Emergency Request</SelectItem>
                </SelectContent>
              </Select>

              {requestType === 'emergency' && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Emergency requests are processed faster but may incur additional fees. 
                    Please provide a reason below.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">
                Notes {requestType === 'emergency' && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  requestType === 'emergency' 
                    ? 'Please explain why you need an emergency payout...'
                    : 'Optional notes for this payout request...'
                }
                rows={3}
                className={errors.notes ? 'border-red-500' : ''}
              />
              {errors.notes && (
                <p className="text-sm text-red-500">{errors.notes}</p>
              )}
            </div>

            {/* Processing Time Info */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {requestType === 'manual' 
                  ? 'Manual requests typically take 1-2 business days to process after approval.'
                  : 'Emergency requests are processed within 24 hours after approval but may incur additional fees.'
                }
              </AlertDescription>
            </Alert>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || earnings.length === 0}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};