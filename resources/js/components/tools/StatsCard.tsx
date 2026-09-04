import type { LucideIcon } from 'lucide-react';
import { TrendingUp, Activity, CreditCard, DollarSign, Users, ShoppingBag } from 'lucide-react';
import * as React from 'react';
import { MetricCard } from '@/components/tools/MetricCard';
import { cn } from '@/lib/utils';

export interface StatSection {
  title: string;
  value: string | number;
  badge?: {
    text: string;
    trend?: 'up' | 'down';
    icon?: React.ReactNode;
    variant?: 'blue' | 'green' | 'emerald' | 'red' | 'amber' | 'purple' | 'gray';
  };
  description?: string;
  icon?: LucideIcon;
  color?: 'primary' | 'info' | 'success' | 'warning' | 'destructive' | 'accent';
}

export interface StatsCardProps {
  sections: StatSection[];
  className?: string;
}

const variantToColorMap: Record<string, 'primary' | 'info' | 'success' | 'warning' | 'destructive' | 'accent'> = {
  blue: 'info',
  green: 'success',
  emerald: 'success',
  red: 'destructive',
  amber: 'warning',
  purple: 'accent',
  gray: 'primary',
};

const defaultIcons: LucideIcon[] = [TrendingUp, DollarSign, Activity, Users, CreditCard, ShoppingBag];

const gridColsClasses: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'sm:grid-cols-2 lg:grid-cols-2',
  3: 'sm:grid-cols-3 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
  5: 'sm:grid-cols-2 lg:grid-cols-5',
  6: 'sm:grid-cols-3 lg:grid-cols-6',
};

export function StatsCard({ sections, className = '' }: StatsCardProps) {
  const hasCustomCols = className.includes('grid-cols-') || className.includes('lg:grid-cols-');
  const colsClass = hasCustomCols ? '' : (gridColsClasses[sections.length] || 'sm:grid-cols-2 lg:grid-cols-4');

  return (
    <div className={cn("mt-6 grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-top-6 duration-1000 ease-in-out md:gap-4", colsClass, className)}>
      {sections.map((section, index) => {
        const color = section.color || (section.badge?.variant ? variantToColorMap[section.badge.variant] : 'primary');
        const trend = section.description || section.badge?.text;
        const Icon = section.icon || defaultIcons[index % defaultIcons.length];

        return (
          <MetricCard
            key={index}
            title={section.title}
            value={section.value}
            icon={Icon}
            trend={trend}
            color={color}
          />
        );
      })}
    </div>
  );
}
