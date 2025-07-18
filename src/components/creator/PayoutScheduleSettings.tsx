import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Calendar, DollarSign, Settings, Info } from 'lucide-react';
import { PayoutSchedule } from '@/lib/stripe-connect';
import { usePayoutSchedule, useCurrencyFormatter } from '@/hooks/useStripeConnect';

interface PayoutScheduleSettingsProps {
  schedule: PayoutSchedule | null;
  onSave: () => void;
  onCancel: () => void;
}

export const PayoutScheduleSettings: React.FC<PayoutScheduleSettingsProps> = ({
  schedule,
  onSave,
  onCancel
}) => {
  const [frequency, setFrequency] = useState(schedule?.frequency || 'monthly');
  const [dayOfWeek, setDayOfWeek] = useState(schedule?.day_of_week || 1);
  const [dayOfMonth, setDayOfMonth] = useState(schedule?.day_of_month || 1);
  const [minimumAmount, setMinimumAmount] = useState(
    schedule?.minimum_payout_amount ? (schedule.minimum_payout_amount / 100).toString() : '100'
  );
  const [autoPayoutEnabled, setAutoPayoutEnabled] = useState(schedule?.auto_payout || false);
  const [requiresApproval, setRequiresApproval] = useState(schedule?.requires_approval ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { updatePayoutSchedule } = usePayoutSchedule();
  const { formatCurrency } = useCurrencyFormatter();

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!frequency) {
      newErrors.frequency = 'Please select a frequency';
    }

    if (!minimumAmount || parseFloat(minimumAmount) <= 0) {
      newErrors.minimumAmount = 'Please enter a valid minimum amount';
    } else {
      const amount = parseFloat(minimumAmount);
      if (amount < 10) {
        newErrors.minimumAmount = 'Minimum amount must be at least $10.00';
      }
      if (amount > 10000) {
        newErrors.minimumAmount = 'Minimum amount cannot exceed $10,000.00';
      }
    }

    if (frequency === 'weekly' || frequency === 'bi_weekly') {
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        newErrors.dayOfWeek = 'Please select a valid day of the week';
      }
    }

    if (frequency === 'monthly') {
      if (dayOfMonth < 1 || dayOfMonth > 31) {
        newErrors.dayOfMonth = 'Please select a valid day of the month';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await updatePayoutSchedule.mutateAsync({
        frequency,
        day_of_week: (frequency === 'weekly' || frequency === 'bi_weekly') ? dayOfWeek : null,
        day_of_month: frequency === 'monthly' ? dayOfMonth : null,
        minimum_payout_amount: parseFloat(minimumAmount) * 100, // Convert to cents
        auto_payout: autoPayoutEnabled,
        requires_approval: requiresApproval,
        active: true
      });
      onSave();
    } catch (error) {
      console.error('Error updating payout schedule:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNextPayoutDate = (): string => {
    const now = new Date();
    let nextDate: Date;

    switch (frequency) {
      case 'weekly':
        nextDate = new Date(now);
        nextDate.setDate(now.getDate() + ((dayOfWeek - now.getDay() + 7) % 7 || 7));
        break;
      case 'bi_weekly':
        nextDate = new Date(now);
        nextDate.setDate(now.getDate() + ((dayOfWeek - now.getDay() + 14) % 14 || 14));
        break;
      case 'monthly':
        nextDate = new Date(now.getFullYear(), now.getMonth() + 1, dayOfMonth);
        if (nextDate <= now) {
          nextDate = new Date(now.getFullYear(), now.getMonth() + 2, dayOfMonth);
        }
        break;
      case 'quarterly':
        nextDate = new Date(now.getFullYear(), now.getMonth() + 3, dayOfMonth || 1);
        if (nextDate <= now) {
          nextDate = new Date(now.getFullYear(), now.getMonth() + 6, dayOfMonth || 1);
        }
        break;
      default:
        return 'Not scheduled';
    }

    return nextDate.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Payout Schedule Settings
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Frequency Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payout Frequency</h3>
              
              <div className="space-y-2">
                <Label htmlFor="frequency">How often would you like to receive payouts?</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className={errors.frequency ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi_weekly">Bi-weekly (Every 2 weeks)</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
                {errors.frequency && (
                  <p className="text-sm text-red-500">{errors.frequency}</p>
                )}
              </div>

              {/* Day Selection */}
              {(frequency === 'weekly' || frequency === 'bi_weekly') && (
                <div className="space-y-2">
                  <Label htmlFor="dayOfWeek">Which day of the week?</Label>
                  <Select value={dayOfWeek.toString()} onValueChange={(value) => setDayOfWeek(parseInt(value))}>
                    <SelectTrigger className={errors.dayOfWeek ? 'border-red-500' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.dayOfWeek && (
                    <p className="text-sm text-red-500">{errors.dayOfWeek}</p>
                  )}
                </div>
              )}

              {frequency === 'monthly' && (
                <div className="space-y-2">
                  <Label htmlFor="dayOfMonth">Which day of the month?</Label>
                  <Select value={dayOfMonth.toString()} onValueChange={(value) => setDayOfMonth(parseInt(value))}>
                    <SelectTrigger className={errors.dayOfMonth ? 'border-red-500' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day === 1 ? '1st' : 
                           day === 2 ? '2nd' : 
                           day === 3 ? '3rd' : 
                           `${day}th`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.dayOfMonth && (
                    <p className="text-sm text-red-500">{errors.dayOfMonth}</p>
                  )}
                </div>
              )}

              {/* Next Payout Preview */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Next Scheduled Payout</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on your settings, your next payout would be on: <strong>{getNextPayoutDate()}</strong>
                </p>
              </div>
            </div>

            {/* Minimum Amount */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Minimum Payout Amount</h3>
              
              <div className="space-y-2">
                <Label htmlFor="minimumAmount">
                  Minimum amount required to trigger a payout
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="minimumAmount"
                    type="number"
                    step="0.01"
                    min="10"
                    max="10000"
                    value={minimumAmount}
                    onChange={(e) => setMinimumAmount(e.target.value)}
                    placeholder="100.00"
                    className={`pl-8 ${errors.minimumAmount ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.minimumAmount && (
                  <p className="text-sm text-red-500">{errors.minimumAmount}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Payouts will only be processed if your available balance meets or exceeds this amount.
                </p>
              </div>
            </div>

            {/* Automation Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Automation Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="autoPayoutEnabled">Enable Automatic Payouts</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically process payouts when conditions are met
                    </p>
                  </div>
                  <Switch
                    id="autoPayoutEnabled"
                    checked={autoPayoutEnabled}
                    onCheckedChange={setAutoPayoutEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="requiresApproval">Require Manual Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      All payouts require approval from platform admin
                    </p>
                  </div>
                  <Switch
                    id="requiresApproval"
                    checked={requiresApproval}
                    onCheckedChange={setRequiresApproval}
                  />
                </div>
              </div>

              {autoPayoutEnabled && !requiresApproval && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    With automatic payouts enabled and no approval required, 
                    payouts will be processed automatically based on your schedule.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Fee Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Fee Information</h3>
              
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing Fee:</span>
                  <span>2.9% + $0.30 per payout</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Emergency Payout Fee:</span>
                  <span>Additional $5.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>International Transfer Fee:</span>
                  <span>Additional $15.00</span>
                </div>
                <div className="pt-2 border-t text-xs text-muted-foreground">
                  Fees are deducted from your payout amount
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-primary/5 rounded-lg">
              <h4 className="font-medium mb-2">Schedule Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Frequency:</span>
                  <span className="capitalize">{frequency.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Amount:</span>
                  <span>{formatCurrency(parseFloat(minimumAmount || '0') * 100)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Automatic Payouts:</span>
                  <span>{autoPayoutEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Requires Approval:</span>
                  <span>{requiresApproval ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Payout:</span>
                  <span>{getNextPayoutDate()}</span>
                </div>
              </div>
            </div>

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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Schedule'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};