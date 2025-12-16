import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Inbox, FolderOpen, HelpCircle } from 'lucide-react';

interface DroppableCategoryProps {
  id: string;
  title: string;
  count: number;
  image?: string;
  variant?: 'default' | 'unsorted' | 'unsure';
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
  children 
}: DroppableCategoryProps) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const Icon = icons[variant];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col rounded-xl border-2 transition-all duration-300 min-h-[200px] overflow-hidden',
        'shadow-sm hover:shadow-md',
        variant === 'unsorted' && 'border-slate-300 bg-slate-50',
        variant === 'unsure' && 'border-amber-300 bg-amber-50',
        variant === 'default' && 'border-border bg-card',
        isOver && 'border-primary bg-primary/5 scale-[1.02] shadow-lg ring-2 ring-primary/20'
      )}
    >
      {/* Category Header */}
      {image ? (
        <div className="relative aspect-video flex-shrink-0">
          <img 
            src={image} 
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
            <span className="font-bold text-white text-sm drop-shadow-md">{title}</span>
            <span className={cn(
              'text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center',
              'bg-white/90 text-gray-800',
              isOver && 'bg-primary text-primary-foreground'
            )}>
              {count}
            </span>
          </div>
        </div>
      ) : (
        <div className={cn(
          'px-4 py-3 border-b font-medium text-sm flex items-center justify-between flex-shrink-0',
          variant === 'unsure' && 'border-amber-200 bg-amber-100/50',
          variant === 'unsorted' && 'border-slate-200 bg-slate-100/50',
          variant === 'default' && 'border-border/50 bg-muted/30',
          isOver && 'bg-primary/10 border-primary/30'
        )}>
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-6 h-6 rounded-md flex items-center justify-center',
              variant === 'unsure' && 'bg-amber-200 text-amber-700',
              variant === 'unsorted' && 'bg-slate-200 text-slate-600',
              variant === 'default' && 'bg-primary/10 text-primary',
              isOver && 'bg-primary text-primary-foreground'
            )}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold">{title}</span>
          </div>
          <span className={cn(
            'text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center',
            variant === 'unsure' && 'bg-amber-200 text-amber-800',
            variant === 'unsorted' && 'bg-slate-200 text-slate-700',
            variant === 'default' && 'bg-primary/10 text-primary',
            count === 0 && 'opacity-50',
            isOver && 'bg-primary text-primary-foreground'
          )}>
            {count}
          </span>
        </div>
      )}
      
      {/* Cards Container */}
      <div className={cn(
        'flex-1 p-3 space-y-2 overflow-y-auto',
        count === 0 && 'flex items-center justify-center',
        isOver && 'bg-primary/5'
      )}
      style={{ position: 'relative', zIndex: 0 }}
      >
        {count === 0 ? (
          <div className="text-center py-4">
            <Icon className={cn(
              'w-6 h-6 mx-auto mb-2',
              variant === 'unsure' && 'text-amber-400',
              variant === 'unsorted' && 'text-slate-400',
              variant === 'default' && 'text-primary/40',
              isOver && 'text-primary animate-bounce'
            )} />
            <p className={cn(
              'text-xs text-muted-foreground',
              isOver && 'text-primary font-medium'
            )}>
              {isOver ? 'Drop here!' : 'Drop cards here'}
            </p>
          </div>
        ) : children}
      </div>
    </div>
  );
}
