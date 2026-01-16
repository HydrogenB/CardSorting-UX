import * as React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { Inbox, FolderOpen, HelpCircle, ChevronDown } from 'lucide-react';

export interface DroppableCategoryProps {
  /** Unique identifier for the drop zone */
  id: string;
  /** Display title for the category */
  title: string;
  /** Number of cards in this category */
  count: number;
  /** Optional image for the category header */
  image?: string;
  /** Visual variant for the category */
  variant?: 'default' | 'unsorted' | 'unsure';
  /** Whether to hide the header */
  hideHeader?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** List of item IDs for sortable context */
  items: string[];
  /** Card components to render */
  children: React.ReactNode;
}

const icons = {
  default: FolderOpen,
  unsorted: Inbox,
  unsure: HelpCircle,
} as const;

const emptyMessages = {
  default: 'Drag cards here',
  unsorted: 'All cards sorted!',
  unsure: 'Drag unsure cards here',
} as const;

/**
 * A droppable category container with enhanced micro-interactions
 * Features: glow on hover, pulse on drag over, smooth transitions
 */
export function DroppableCategory({
  id,
  title,
  count,
  image,
  variant = 'default',
  hideHeader = false,
  className,
  items,
  children,
}: DroppableCategoryProps) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const Icon = icons[variant];

  return (
    <div
      ref={setNodeRef}
      role="list"
      aria-label={`${title} category with ${count} cards`}
      aria-dropeffect={isOver ? 'move' : 'none'}
      className={cn(
        // Base styles
        'flex flex-col rounded-xl border min-h-[180px] overflow-hidden',
        'shadow-[0_2px_4px_rgba(0,0,0,0.02)]',
        'bg-background',
        
        // Micro-interaction: smooth transitions
        'transition-all duration-300 ease-out',
        
        // Variant styles
        variant === 'unsorted' && 'border-transparent bg-transparent',
        variant === 'unsure' && 'border-amber-200/50 bg-amber-50/30 dark:border-amber-800/30 dark:bg-amber-950/20',
        variant === 'default' && 'border-border/60 bg-card/50 hover:bg-card hover:border-border',
        
        // Micro-interaction: drop zone highlight with animation
        isOver && [
          'border-primary/60 bg-primary/5',
          'ring-4 ring-primary/10',
          'shadow-[0_0_30px_-5px_rgba(var(--color-primary)/0.3)]',
          'scale-[1.01]',
          // Pulsing glow effect
          'animate-glow-pulse'
        ],
        
        className
      )}
    >
      {/* Category Header with hover effects */}
      {!hideHeader && (
        image ? (
          <div className="relative aspect-video flex-shrink-0 overflow-hidden">
            <img
              src={image}
              alt=""
              aria-hidden="true"
              className={cn(
                'absolute inset-0 w-full h-full object-cover',
                'transition-transform duration-500 ease-out',
                isOver && 'scale-105'
              )}
            />
            <div className={cn(
              'absolute inset-0 bg-gradient-to-t from-black/60 to-transparent',
              'transition-opacity duration-300',
              isOver && 'from-black/70'
            )} />
            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between gap-2">
              <span className="font-bold text-white text-sm drop-shadow-md truncate">
                {title}
              </span>
              <span
                className={cn(
                  'text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center flex-shrink-0',
                  'transition-all duration-200',
                  'bg-white/90 text-gray-800',
                  isOver && 'bg-primary text-primary-foreground scale-110'
                )}
                aria-label={`${count} cards`}
              >
                {count}
              </span>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'px-4 py-3 border-b flex items-center justify-between flex-shrink-0',
              'backdrop-blur-sm transition-all duration-200',
              variant === 'unsure' && 'border-amber-100 bg-amber-50/50 dark:border-amber-800/30 dark:bg-amber-950/30',
              variant === 'unsorted' && 'border-transparent',
              variant === 'default' && 'border-border/40 bg-muted/20 hover:bg-muted/30',
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                  'bg-background border shadow-sm',
                  'transition-all duration-200',
                  variant === 'unsure' && 'text-amber-600 dark:text-amber-400',
                  variant === 'unsorted' && 'text-muted-foreground',
                  variant === 'default' && 'text-primary',
                  // Micro-interaction: icon animation on drop
                  isOver && 'text-primary bg-primary/10 border-primary/20 scale-110 animate-bounce-subtle'
                )}
                aria-hidden="true"
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={cn(
                'font-semibold text-foreground/80 truncate text-sm',
                'transition-colors duration-200',
                isOver && 'text-primary'
              )}>
                {title}
              </span>
            </div>
            <span
              className={cn(
                'text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center flex-shrink-0',
                'bg-muted text-muted-foreground',
                'transition-all duration-200',
                isOver && 'bg-primary text-primary-foreground scale-110'
              )}
              aria-label={`${count} cards`}
            >
              {count}
            </span>
          </div>
        )
      )}

      {/* Cards Container */}
      <div
        className={cn(
          'flex-1 p-3 space-y-2 overflow-y-auto min-h-0',
          count === 0 && 'flex items-center justify-center'
        )}
        style={{ position: 'relative', zIndex: 0 }}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>

        {/* Empty State with enhanced animation */}
        {count === 0 && (
          <div
            className={cn(
              'absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none',
              'transition-opacity duration-300',
              isOver ? 'opacity-100' : 'opacity-50 hover:opacity-70'
            )}
            aria-hidden="true"
          >
            <div
              className={cn(
                'p-3 rounded-full bg-muted/50 mb-2',
                'transition-all duration-300 ease-out',
                isOver && 'scale-125 bg-primary/15 animate-bounce-subtle'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-colors duration-200',
                  variant === 'unsure' && 'text-amber-400 dark:text-amber-500',
                  variant === 'unsorted' && 'text-muted-foreground',
                  variant === 'default' && 'text-muted-foreground/60',
                  isOver && 'text-primary'
                )}
              />
            </div>
            <p
              className={cn(
                'text-xs font-medium transition-all duration-200',
                'text-muted-foreground/60',
                isOver && 'text-primary font-semibold scale-105'
              )}
            >
              {isOver ? 'Drop here!' : emptyMessages[variant]}
            </p>
            {isOver && (
              <ChevronDown className="w-4 h-4 text-primary mt-1 animate-bounce" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
