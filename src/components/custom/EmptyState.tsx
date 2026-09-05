import type { LucideIcon } from 'lucide-react';
import { SearchX } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Props {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon: Icon = SearchX,
  title,
  description,
  actionLabel,
  onAction,
}: Props) => {
  return (
    <div className='flex flex-col items-center justify-center text-center py-16 px-4'>
      <div className='bg-muted rounded-full p-6 mb-4'>
        <Icon className='h-10 w-10 text-muted-foreground' />
      </div>
      <h3 className='text-xl font-semibold mb-2'>{title}</h3>
      {description && (
        <p className='text-muted-foreground max-w-md mb-6'>{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant='default' onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};