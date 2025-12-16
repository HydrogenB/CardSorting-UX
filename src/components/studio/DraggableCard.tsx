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
    ? { 
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: isDragging ? 50 : undefined,
      }
    : undefined;

  const hasImage = !!card.image;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group bg-background border rounded-lg overflow-hidden',
        'cursor-grab active:cursor-grabbing select-none',
        'hover:border-primary/50 hover:shadow-md',
        'transition-all duration-200 ease-out',
        isDragging && 'opacity-80 shadow-xl border-primary scale-105 z-50',
        !isDragging && 'border-border'
      )}
      {...attributes}
      {...listeners}
    >
      {hasImage ? (
        <>
          {/* 16:9 Image */}
          <div className="relative aspect-video">
            <img 
              src={card.image} 
              alt={card.label}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute top-2 left-2 p-1 rounded bg-black/30 backdrop-blur-sm">
              <GripVertical className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="p-2">
            <p className="text-xs font-medium truncate">{card.label}</p>
            {card.description && (
              <p className="text-[10px] text-muted-foreground truncate">{card.description}</p>
            )}
          </div>
        </>
      ) : (
        <div className="p-3 flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{card.label}</p>
            {card.description && (
              <p className="text-xs text-muted-foreground truncate">{card.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
