import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border border-transparent bg-[#1C1C24] text-[#F7F5F0]',
        gold:
          'border border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#DFBF65]',
        money:
          'border border-amber-500/40 bg-amber-500/10 text-amber-300',
        build:
          'border border-sky-500/40 bg-sky-500/10 text-sky-300',
        grow:
          'border border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
        critical:
          'border border-red-500/50 bg-red-500/15 text-red-300 font-semibold animate-pulse',
        high:
          'border border-orange-500/40 bg-orange-500/10 text-orange-300',
        medium:
          'border border-blue-500/40 bg-blue-500/10 text-blue-300',
        low:
          'border border-slate-600/40 bg-slate-800/40 text-slate-300',
        outline:
          'border border-[#282834] text-[#A3A099]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
