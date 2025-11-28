import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropdownOption {
  value: string | number;
  label: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'filled';
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  disabled = false,
  className,
  variant = 'default',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find selected option
  const selectedOption = options.find((opt) => opt.value.toString() === value?.toString());

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string | number) => {
    onChange?.(optionValue.toString());
    setIsOpen(false);
  };

  const variants = {
    default: 'bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-600 hover:border-olive-400 dark:hover:border-olive-500',
    filled: 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 hover:border-stone-300 dark:hover:border-stone-600',
  };

  return (
    <div className={cn('w-full', className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2.5 pr-10',
            'flex items-center justify-between',
            'border rounded-lg',
            'text-left text-sm font-medium',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500',
            'disabled:bg-stone-100 dark:disabled:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-60',
            variants[variant],
            isOpen && 'ring-2 ring-olive-500/20 border-olive-500',
            error && 'border-brick-500 focus:ring-brick-500/20 focus:border-brick-500',
            selectedOption ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400 dark:text-stone-500'
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={cn(!selectedOption && 'font-normal')}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown 
            className={cn(
              'w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform duration-200',
              isOpen && 'rotate-180 text-olive-600 dark:text-olive-400'
            )} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div 
            className={cn(
              'absolute z-50 w-full mt-1',
              'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-medium',
              'py-1 max-h-60 overflow-auto',
              'animate-fade-in'
            )}
            role="listbox"
          >
            {options.map((option) => {
              const isSelected = option.value.toString() === value?.toString();
              
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full px-3 py-2.5',
                    'flex items-center justify-between',
                    'text-left text-sm',
                    'transition-colors duration-150',
                    isSelected 
                      ? 'bg-olive-50 dark:bg-olive-900/30 text-olive-900 dark:text-olive-300 font-medium' 
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700',
                    'focus:outline-none focus:bg-olive-50 dark:focus:bg-olive-900/30'
                  )}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-olive-600 dark:text-olive-400" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-brick-600 dark:text-brick-400">{error}</p>
      )}
    </div>
  );
}
