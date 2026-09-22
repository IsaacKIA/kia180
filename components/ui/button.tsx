import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-[#C9A84C] text-[#0A0A0C] font-semibold hover:bg-[#DFBF65] shadow-sm shadow-amber-950/20',
        secondary:
          'bg-[#181820] text-[#F7F5F0] border border-[#282834] hover:bg-[#20202C] hover:border-[#383848]',
        outline:
          'border border-[#282834] bg-transparent text-[#F7F5F0] hover:bg-[#181820] hover:border-[#C9A84C]/50 hover:text-[#C9A84C]',
        ghost:
          'text-[#A3A099] hover:bg-[#181820] hover:text-[#F7F5F0]',
        destructive:
          'bg-red-950/40 text-red-400 border border-red-900/60 hover:bg-red-900/50 hover:border-red-700',
        goldGlow:
          'bg-gradient-to-r from-[#C9A84C] via-[#E2C368] to-[#C9A84C] text-[#0A0A0C] font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 border border-amber-300/30',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
