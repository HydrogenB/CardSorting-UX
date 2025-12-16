import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card } from '@/domain/model';
import { GripVertical, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableCardProps {
  card: Card;
  variant?: 'default' | 'compact';
}

export function SortableCard({ card, variant = 'default' }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-2 bg-background border rounded-lg',
        'cursor-grab active:cursor-grabbing select-none',
        'hover:border-primary/50 hover:shadow-md hover:scale-[1.02]',
        'transition-all duration-200 ease-out',
        variant === 'default' ? 'p-3' : 'p-2',
        isDragging && 'opacity-60 shadow-xl border-primary scale-105 rotate-2 z-50',
        isSorting && !isDragging && 'transition-transform duration-200',
        !isDragging && 'border-border'
      )}
      {...attributes}
      {...listeners}
    >
      <div className={cn(
        'flex items-center justify-center rounded-md transition-colors',
        variant === 'default' ? 'w-8 h-8' : 'w-6 h-6',
        'bg-muted group-hover:bg-primary/10'
      )}>
        <GripVertical className={cn(
          'text-muted-foreground group-hover:text-primary transition-colors',
          variant === 'default' ? 'w-4 h-4' : 'w-3 h-3'
        )} />
      </div>
      
      <div className="flex-1 min-w-0">
        <span className={cn(
          'block truncate font-medium',
          variant === 'default' ? 'text-sm' : 'text-xs'
        )}>
          {card.label}
        </span>
        {card.description && variant === 'default' && (
          <span className="text-xs text-muted-foreground truncate block mt-0.5">
            {card.description}
          </span>
        )}
      </div>
      
      {variant === 'default' && (
        <FileText className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
      )}
    </div>
  );
}
