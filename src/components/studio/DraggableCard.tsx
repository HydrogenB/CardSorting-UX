import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card } from '@/domain/model';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DraggableCardProps {
  /** The card data to display */
  card: Card;
  /** Whether the drag handle should be visible */
  showHandle?: boolean;
  /** Index for stagger animation */
  index?: number;
}

/**
 * A draggable card component for the card sorting interface
 * Features enhanced micro-interactions: hover lift, grab animation, drag feedback
 */
export function DraggableCard({ card, showHandle = true, index = 0 }: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({
    id: card.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
    touchAction: 'none',
    animationDelay: `${index * 50}ms`,
  };

  const hasImage = !!card.image;

  // Dragging placeholder with pulse animation
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'border-2 border-dashed border-primary/40 rounded-xl bg-primary/5 h-[80px]',
          'animate-pulse'
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      role="listitem"
      aria-label={`Card: ${card.label}`}
      aria-describedby={card.description ? `card-desc-${card.id}` : undefined}
      className={cn(
        // Base styles
        'group relative bg-card border rounded-xl p-3',
        'flex items-start gap-3',
        'border-border/60 shadow-sm',
        
        // Cursor states
        'cursor-grab active:cursor-grabbing select-none',
        
        // Micro-interactions: hover lift effect
        'transition-all duration-300 ease-out',
        'hover:border-primary/50',
        'hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.12)]',
        'hover:-translate-y-0.5',
        
        // Active/grabbing state
        'active:scale-[0.98] active:shadow-lg',
        
        // Focus state
        'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
        
        // Sorting state
        isSorting && 'cursor-grabbing transition-none',
        
        // Entry animation
        'animate-slide-up-fade'
      )}
    >
      {/* Drag Handle with hover animation */}
      {showHandle && (
        <div
          className={cn(
            'mt-1 transition-all duration-200',
            'text-muted-foreground/40',
            'group-hover:text-primary/60 group-hover:scale-110',
            'group-active:scale-90'
          )}
          aria-hidden="true"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {/* Card Content */}
      <div className="flex-1 min-w-0 flex justify-between gap-3">
        <div className="space-y-1.5 pt-0.5">
          <p className="text-sm font-medium leading-snug break-words text-foreground/90 transition-colors group-hover:text-foreground">
            {card.label}
          </p>
          {card.description && (
            <p
              id={`card-desc-${card.id}`}
              className="text-xs text-muted-foreground leading-relaxed break-words line-clamp-2"
            >
              {card.description}
            </p>
          )}
        </div>

        {/* Card Image with zoom on hover */}
        {hasImage && (
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border/50 shadow-sm">
            <img
              src={card.image}
              alt=""
              aria-hidden="true"
              className={cn(
                'w-full h-full object-cover',
                'transition-transform duration-500 ease-out',
                'group-hover:scale-110'
              )}
            />
          </div>
        )}
      </div>

      {/* Subtle gradient overlay on hover */}
      <div
        className={cn(
          'absolute inset-0 rounded-xl pointer-events-none',
          'bg-gradient-to-br from-primary/0 to-primary/0',
          'transition-all duration-300',
          'group-hover:from-primary/[0.02] group-hover:to-primary/[0.05]'
        )}
        aria-hidden="true"
      />
    </div>
  );
}
