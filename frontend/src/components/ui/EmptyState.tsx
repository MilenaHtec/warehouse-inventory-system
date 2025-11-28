import { type ReactNode } from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12 px-4', className)}>
      <div className="flex justify-center mb-4">
        {icon || (
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
            <Package className="w-8 h-8 text-stone-400" />
          </div>
        )}
      </div>
      <h3 className="text-lg font-medium text-stone-900 mb-2">{title}</h3>
      {description && (
        <p className="text-stone-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

