import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'olive' | 'ochre' | 'navy';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-stone-100 text-stone-700',
      success: 'bg-success-50 text-success-700',
      warning: 'bg-warning-50 text-warning-700',
      error: 'bg-error-50 text-error-700',
      olive: 'bg-olive-100 text-olive-700',
      ochre: 'bg-ochre-100 text-ochre-700',
      navy: 'bg-navy-100 text-navy-700',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

