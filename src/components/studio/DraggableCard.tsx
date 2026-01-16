import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card } from '@/domain/model';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableCardProps {
  card: Card;
}

export function DraggableCard({ card }: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none' as const,
  };

  const hasImage = !!card.image;

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 border-2 border-dashed border-primary/40 rounded-xl bg-primary/5 h-[80px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative bg-card border rounded-xl p-3',
        'cursor-grab active:cursor-grabbing select-none',
        'hover:border-primary/50 hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)]',
        'transition-all duration-200 ease-out',
        'border-border/60 shadow-sm flex items-start gap-3'
      )}
      {...attributes}
      {...listeners}
    >
      <div className="mt-1 text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 flex justify-between gap-3">
        <div className="space-y-1.5 pt-0.5">
          <p className="text-sm font-medium leading-snug break-words text-foreground/90">
            {card.label}
          </p>
          {card.description && (
            <p className="text-xs text-muted-foreground leading-relaxed break-words line-clamp-2">
              {card.description}
            </p>
          )}
        </div>

        {hasImage && (
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border/50 shadow-sm">
            <img 
              src={card.image} 
              alt="" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}
      </div>
    </div>
  );
}
