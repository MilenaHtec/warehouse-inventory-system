import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'default' | 'filled';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, variant = 'default', id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const variants = {
      default: 'bg-white border-stone-300 hover:border-olive-400',
      filled: 'bg-stone-50 border-stone-200 hover:bg-stone-100 hover:border-stone-300',
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="label">
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              // Base styles
              'w-full px-3 py-2.5 pr-10',
              'appearance-none cursor-pointer',
              'border rounded-lg',
              'text-stone-900 font-medium text-sm',
              // Transition
              'transition-all duration-200',
              // Focus
              'focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500',
              // Disabled
              'disabled:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60',
              // Variant
              variants[variant],
              // Error state
              error && 'border-brick-500 focus:ring-brick-500/20 focus:border-brick-500',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          >
            {placeholder && (
              <option value="" className="text-stone-400">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                className="py-2 text-stone-900"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none',
            'transition-transform duration-200',
            'group-focus-within:text-olive-600'
          )}>
            <ChevronDown className={cn(
              'w-4 h-4 text-stone-400',
              'group-hover:text-stone-600',
              'group-focus-within:text-olive-600'
            )} />
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-brick-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
