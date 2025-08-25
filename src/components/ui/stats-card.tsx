"use client";

import { ReactNode } from 'react';

interface StatsCardProps {
  /** Heading for the metric (e.g. "Revenue") */
  title: string;
  /** Primary value to display (e.g. "$12.3k") */
  value: string;
  /** Optional percentage change compared to previous period */
  change?: number;
  /** Optional icon to display on the card */
  icon?: ReactNode;
}

/**
 * A lightweight statistic card with optional trend indicator.  The card
 * automatically colours the change value green or red based on whether
 * it's positive or negative.  You can supply your own icon via the
 * `icon` prop to further contextualise the metric.
 */
export default function StatsCard({ title, value, change, icon }: StatsCardProps) {
  return (
    <div className="glass p-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm uppercase tracking-wide text-[var(--ocean-mist)] mb-1">{title}</h4>
          <div className="text-3xl font-bold text-[var(--sunset-gold)]">{value}</div>
          {typeof change === 'number' && (
            <div className={`mt-1 text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}> 
              {change >= 0 ? '+' : ''}{change}% from last period
            </div>
          )}
        </div>
        {icon && (
          <div className="text-4xl text-[var(--sunset-gold)] ml-2">{icon}</div>
        )}
      </div>
    </div>
  );
}