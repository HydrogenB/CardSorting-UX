import { useDraggable } from '@dnd-kit/core';
import type { Card } from '@/domain/model';
import { GripVertical, FileText, Image } from 'lucide-react';
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
        'group bg-background border rounded-xl overflow-hidden',
        'cursor-grab active:cursor-grabbing select-none',
        'hover:border-primary/50 hover:shadow-lg hover:scale-[1.02]',
        'transition-all duration-200 ease-out',
        'before:absolute before:inset-0 before:rounded-xl before:opacity-0',
        'before:transition-opacity before:duration-200',
        'hover:before:opacity-100 before:bg-gradient-to-br before:from-primary/5 before:to-transparent',
        isDragging && [
          'opacity-80 shadow-2xl border-primary scale-105 z-50 rotate-2',
          'animate-pulse'
        ],
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
            className="w-full h-24 object-cover transition-transform duration-200 group-hover:scale-105"
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {/* Drag indicator overlay */}
          <div className="absolute top-1 left-1 p-1 rounded-lg bg-black/30 backdrop-blur-sm transition-all duration-200 group-hover:bg-black/40">
            <GripVertical className="w-3 h-3 text-white transition-transform duration-200 group-hover:scale-110" />
          </div>
          {/* Image indicator */}
          <div className="absolute top-1 right-1 p-1 rounded-lg bg-black/30 backdrop-blur-sm">
            <Image className="w-3 h-3 text-white" />
          </div>
        </div>
      ) : (
        <div className="h-20 relative overflow-hidden">
          {/* Beautiful gradient background for cards without images */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-tr from-muted/50 to-muted/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.primary/10)_0%,transparent_70%)]" />
          
          {/* Icon container with animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-3 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:scale-110">
                <FileText className="w-6 h-6 text-primary transition-colors duration-200" />
              </div>
            </div>
          </div>
          
          {/* Drag indicator */}
          <div className="absolute top-1 left-1 p-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm transition-all duration-200 group-hover:shadow-md">
            <GripVertical className="w-3 h-3 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-full opacity-50" />
          <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-primary/5 to-transparent rounded-br-full opacity-50" />
        </div>
      )}
      
      {/* Text Content */}
      <div className="p-2 relative">
        <p className={cn(
          'font-medium truncate transition-colors duration-200',
          hasImage ? 'text-xs' : 'text-sm',
          'group-hover:text-primary'
        )}>
          {card.label}
        </p>
        {card.description && (
          <p className="text-[10px] text-muted-foreground truncate mt-0.5 transition-colors duration-200 group-hover:text-muted-foreground/80">
            {card.description}
          </p>
        )}
      </div>
    </div>
  );
}
