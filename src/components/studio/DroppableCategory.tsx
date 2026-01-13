import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Inbox, FolderOpen, HelpCircle } from 'lucide-react';

interface DroppableCategoryProps {
  id: string;
  title: string;
  count: number;
  image?: string;
  variant?: 'default' | 'unsorted' | 'unsure';
  hideHeader?: boolean;
  className?: string;
  children: React.ReactNode;
}

const icons = {
  default: FolderOpen,
  unsorted: Inbox,
  unsure: HelpCircle,
};

export function DroppableCategory({ 
  id, 
  title, 
  count,
  image,
  variant = 'default',
  hideHeader = false,
  className,
  children 
}: DroppableCategoryProps) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const Icon = icons[variant];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col rounded-xl border transition-all duration-300 min-h-[180px] overflow-hidden',
        'shadow-[0_2px_4px_rgba(0,0,0,0.02)]',
        variant === 'unsorted' && 'border-transparent bg-transparent',
        variant === 'unsure' && 'border-amber-200/50 bg-amber-50/30',
        variant === 'default' && 'border-border/60 bg-card/50 hover:bg-card',
        isOver && 'border-primary/50 bg-primary/5 ring-4 ring-primary/5 shadow-lg scale-[1.01]',
        className
      )}
    >
      {/* Category Header */}
      {!hideHeader && (image ? (
        <div className="relative aspect-video flex-shrink-0">
          <img 
            src={image} 
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between gap-2">
            <span className="font-bold text-white text-sm drop-shadow-md truncate">{title}</span>
            <span className={cn(
              'text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center flex-shrink-0',
              'bg-white/90 text-gray-800',
              isOver && 'bg-primary text-primary-foreground'
            )}>
              {count}
            </span>
          </div>
        </div>
      ) : (
        <div className={cn(
          'px-4 py-3 border-b flex items-center justify-between flex-shrink-0 backdrop-blur-sm',
          variant === 'unsure' && 'border-amber-100 bg-amber-50/50',
          variant === 'unsorted' && 'border-transparent',
          variant === 'default' && 'border-border/40 bg-muted/20',
        )}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
              'bg-background border shadow-sm',
              variant === 'unsure' && 'text-amber-600',
              variant === 'unsorted' && 'text-muted-foreground',
              variant === 'default' && 'text-primary',
              isOver && 'text-primary bg-primary/10 border-primary/20'
            )}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="font-semibold text-foreground/80 truncate text-sm">{title}</span>
          </div>
          <span className={cn(
            'text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center flex-shrink-0 transition-colors',
            'bg-muted text-muted-foreground',
            isOver && 'bg-primary text-primary-foreground'
          )}>
            {count}
          </span>
        </div>
      ))}
      
      {/* Cards Container */}
      <div className={cn(
        'flex-1 p-3 space-y-2 overflow-y-auto min-h-0',
        count === 0 && 'flex items-center justify-center',
      )}
      style={{ position: 'relative', zIndex: 0 }}
      >
        {children}
        
        {count === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 opacity-0 hover:opacity-100 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
            <div className={cn(
              "p-3 rounded-full bg-muted/50 mb-2 transition-transform duration-300",
              isOver && "scale-110 bg-primary/10"
            )}>
              <Icon className={cn(
                'w-5 h-5',
                variant === 'unsure' && 'text-amber-400',
                variant === 'unsorted' && 'text-muted-foreground',
                variant === 'default' && 'text-muted-foreground/60',
                isOver && 'text-primary'
              )} />
            </div>
            <p className={cn(
              'text-xs font-medium text-muted-foreground/60',
              isOver && 'text-primary'
            )}>
              {isOver ? 'Drop here' : 'Empty'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
