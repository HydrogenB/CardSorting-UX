import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { GripVertical, Trash2 } from 'lucide-react';
import { ImageUploader } from '@/components/ui/image-uploader';

interface SortableItemProps {
  id: string;
  label: string;
  description?: string;
  image?: string;
  onLabelChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImageChange: (value: string | undefined) => void;
  onRemove: () => void;
  placeholder?: { label: string; description: string };
}

export function SortableItem({
  id,
  label,
  description = '',
  image,
  onLabelChange,
  onDescriptionChange,
  onImageChange,
  onRemove,
  placeholder = { label: 'Name', description: 'Description (optional)' },
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-xl border bg-card overflow-hidden',
        'transition-all duration-200',
        isDragging && 'opacity-50 shadow-xl border-primary z-50 scale-[1.02]',
        !isDragging && 'border-border hover:border-primary/30 hover:shadow-md'
      )}
    >
      <div className="relative">
        {image && (
          <div className="relative group">
            <img 
              src={image} 
              alt={label}
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <ImageUploader
                value={image}
                onChange={onImageChange}
                size="md"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        )}
        
        {/* Controls Row - Absolute if image, Relative if no image */}
        <div className={cn(
          "flex items-center justify-between px-2 py-1.5",
          image ? "absolute top-0 inset-x-0 z-10" : "bg-muted/30 border-b border-border/50"
        )}>
           <div className="flex items-center gap-1">
             <button
              type="button"
              className={cn(
                "p-1.5 rounded-lg cursor-grab active:cursor-grabbing touch-none transition-colors",
                image ? "bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm" : "hover:bg-muted text-muted-foreground"
              )}
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-4 h-4" />
            </button>
            {!image && (
              <ImageUploader
                value={image}
                onChange={onImageChange}
                size="xs"
                variant="icon"
              />
            )}
           </div>

          <button
            type="button"
            onClick={onRemove}
            className={cn(
              "p-1.5 rounded-lg transition-colors hover:bg-destructive hover:text-destructive-foreground",
               image ? "bg-background/80 backdrop-blur-sm shadow-sm" : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            )}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content - below image */}
      <div className="p-3 space-y-1.5">
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          className="w-full px-2.5 py-1.5 text-sm font-semibold border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder={placeholder.label}
        />
        <input
          type="text"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full px-2.5 py-1 text-xs border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-muted-foreground"
          placeholder={placeholder.description}
        />
      </div>
    </div>
  );
}
