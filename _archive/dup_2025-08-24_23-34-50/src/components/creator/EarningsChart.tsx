import React from 'react';
import { CreatorEarnings } from '@/lib/stripe-connect';
import { useCurrencyFormatter } from '@/hooks/useStripeConnect';

interface EarningsChartProps {
  earnings: CreatorEarnings[];
}

export const EarningsChart: React.FC<EarningsChartProps> = ({ earnings }) => {
  const { formatCurrency } = useCurrencyFormatter();

  if (!earnings || earnings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No earnings data available</p>
      </div>
    );
  }

  // Sort earnings by date
  const sortedEarnings = [...earnings].sort((a, b) => 
    new Date(a.period_start).getTime() - new Date(b.period_start).getTime()
  );

  const maxEarnings = Math.max(...sortedEarnings.map(e => e.gross_earnings));
  const maxNet = Math.max(...sortedEarnings.map(e => e.net_earnings));

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="h-64 flex items-end justify-between gap-2 p-4 bg-gradient-to-t from-muted/20 to-transparent rounded-lg">
        {sortedEarnings.map((earning, index) => {
          const grossHeight = (earning.gross_earnings / maxEarnings) * 200;
          const netHeight = (earning.net_earnings / maxEarnings) * 200;
          
          return (
            <div key={earning.id} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full max-w-12 flex items-end gap-1">
                {/* Gross earnings bar */}
                <div
                  className="bg-primary/60 rounded-t-sm flex-1 min-h-[4px] relative group"
                  style={{ height: `${grossHeight}px` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Gross: {formatCurrency(earning.gross_earnings)}
                  </div>
                </div>
                
                {/* Net earnings bar */}
                <div
                  className="bg-primary rounded-t-sm flex-1 min-h-[4px] relative group"
                  style={{ height: `${netHeight}px` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Net: {formatCurrency(earning.net_earnings)}
                  </div>
                </div>
              </div>
              
              {/* Date label */}
              <div className="text-xs text-muted-foreground text-center">
                {new Date(earning.period_start).toLocaleDateString('en-US', { 
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary/60 rounded"></div>
          <span>Gross Earnings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span>Net Earnings</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total Gross</p>
          <p className="font-medium">
            {formatCurrency(sortedEarnings.reduce((sum, e) => sum + e.gross_earnings, 0))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total Net</p>
          <p className="font-medium">
            {formatCurrency(sortedEarnings.reduce((sum, e) => sum + e.net_earnings, 0))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total Fees</p>
          <p className="font-medium">
            {formatCurrency(sortedEarnings.reduce((sum, e) => sum + e.commission_amount + e.management_fee, 0))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Average Monthly</p>
          <p className="font-medium">
            {formatCurrency(sortedEarnings.reduce((sum, e) => sum + e.net_earnings, 0) / Math.max(sortedEarnings.length, 1))}
          </p>
        </div>
      </div>
    </div>
  );
};