import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-[#262634] bg-[#0E0E13] px-3 py-2 text-sm text-[#F7F5F0] placeholder:text-[#666560] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C] focus-visible:border-[#C9A84C] disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
