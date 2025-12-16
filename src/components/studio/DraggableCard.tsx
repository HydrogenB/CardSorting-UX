import { useDraggable } from '@dnd-kit/core';
import type { Card } from '@/domain/model';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableCardProps {
  card: Card;
}

export function DraggableCard({ card }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const hasImage = !!card.image;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group bg-background border rounded-xl overflow-hidden',
        'cursor-grab active:cursor-grabbing select-none',
        'hover:border-primary/50 hover:shadow-lg hover:scale-[1.02]',
        'transition-all duration-200 ease-out',
        isDragging && 'opacity-60 shadow-xl border-primary scale-105 z-50 rotate-2',
        !isDragging && 'border-border'
      )}
      {...attributes}
      {...listeners}
    >
      {/* Image Banner */}
      {hasImage ? (
        <div className="relative">
          <img 
            src={card.image} 
            alt={card.label}
            className="w-full h-24 object-cover"
          />
          {/* Drag indicator overlay */}
          <div className="absolute top-1 left-1 p-1 rounded bg-black/30 backdrop-blur-sm">
            <GripVertical className="w-3 h-3 text-white" />
          </div>
        </div>
      ) : (
        <div className="h-16 bg-gradient-to-br from-muted to-muted/30 flex items-center justify-center">
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
      
      {/* Text Content */}
      <div className="p-2">
        <p className={cn(
          'font-medium truncate',
          hasImage ? 'text-xs' : 'text-sm'
        )}>
          {card.label}
        </p>
        {card.description && (
          <p className="text-[10px] text-muted-foreground truncate mt-0.5">
            {card.description}
          </p>
        )}
      </div>
    </div>
  );
}
