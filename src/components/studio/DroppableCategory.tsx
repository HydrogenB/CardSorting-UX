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
        'flex flex-col rounded-xl border-2 transition-all duration-300 min-h-[280px] overflow-hidden',
        'shadow-sm hover:shadow-md',
        variant === 'unsorted' && 'border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100/50',
        variant === 'unsure' && 'border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100/30',
        variant === 'default' && 'border-border bg-gradient-to-b from-card to-muted/20',
        isOver && 'border-primary bg-primary/5 scale-[1.02] shadow-lg ring-2 ring-primary/20'
      )}
    >
      {/* Category Header with Image Banner */}
      {image ? (
        <div className="relative">
          <img 
            src={image} 
            alt={title}
            className="w-full h-20 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
            <span className="font-bold text-white text-sm drop-shadow-md">{title}</span>
            <span className={cn(
              'text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center',
              'bg-white/90 text-gray-800'
            )}>
              {count}
            </span>
          </div>
        </div>
      ) : (
        <div className={cn(
          'px-4 py-3 border-b font-medium text-sm flex items-center justify-between',
          variant === 'unsure' && 'border-amber-200 bg-amber-100/50',
          variant === 'unsorted' && 'border-slate-200 bg-slate-100/50',
          variant === 'default' && 'border-border/50 bg-muted/30'
        )}>
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-6 h-6 rounded-md flex items-center justify-center',
              variant === 'unsure' && 'bg-amber-200 text-amber-700',
              variant === 'unsorted' && 'bg-slate-200 text-slate-600',
              variant === 'default' && 'bg-primary/10 text-primary'
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
            count === 0 && 'opacity-50'
          )}>
            {count}
          </span>
        </div>
      )}
      
      {/* Cards Container */}
      <div className={cn(
        'flex-1 p-3 space-y-2 overflow-y-auto',
        count === 0 && 'flex items-center justify-center'
      )}>
        {count === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            Drop cards here
          </p>
        ) : children}
      </div>
    </div>
  );
}
