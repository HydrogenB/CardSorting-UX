import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card } from '@/domain/model';
import { GripVertical, FileText, Image } from 'lucide-react';
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

  const hasImage = !!card.image;

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
      {hasImage ? (
        <div className="relative flex-shrink-0">
          <img
            src={card.image}
            alt={card.label}
            className={cn(
              'rounded object-cover transition-transform duration-200 group-hover:scale-105',
              variant === 'default' ? 'w-10 h-10' : 'w-8 h-8'
            )}
          />
          <div className="absolute inset-0 rounded bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <GripVertical className={cn(
              'text-white drop-shadow-md',
              variant === 'default' ? 'w-4 h-4' : 'w-3 h-3'
            )} />
          </div>
        </div>
      ) : (
        <div className={cn(
          'relative flex-shrink-0 flex items-center justify-center rounded-lg overflow-hidden',
          'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent',
          'border border-border/50',
          variant === 'default' ? 'w-10 h-10' : 'w-8 h-8'
        )}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.primary/10)_0%,transparent_70%)]" />
          <FileText className={cn(
            'text-primary z-10 transition-transform duration-200 group-hover:scale-110',
            variant === 'default' ? 'w-5 h-5' : 'w-4 h-4'
          )} />
          <div className={cn(
            'absolute top-0 left-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            variant === 'default' ? 'w-10 h-10' : 'w-8 h-8'
          )}>
            <GripVertical className={cn(
              'text-muted-foreground',
              variant === 'default' ? 'w-4 h-4' : 'w-3 h-3'
            )} />
          </div>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <span className={cn(
          'block truncate font-medium transition-colors duration-200',
          variant === 'default' ? 'text-sm' : 'text-xs',
          'group-hover:text-primary'
        )}>
          {card.label}
        </span>
        {card.description && variant === 'default' && (
          <span className="text-xs text-muted-foreground truncate block mt-0.5 transition-colors duration-200 group-hover:text-muted-foreground/80">
            {card.description}
          </span>
        )}
      </div>
      
      {variant === 'default' && (
        <div className="flex items-center gap-1">
          {hasImage && (
            <Image className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
          )}
          {!hasImage && (
            <FileText className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
          )}
        </div>
      )}
    </div>
  );
}
