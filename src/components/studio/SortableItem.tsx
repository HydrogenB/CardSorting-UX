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
      {/* Image Banner */}
      <div className="relative">
        {image ? (
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
        ) : (
          <div className="h-24 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <ImageUploader
              value={image}
              onChange={onImageChange}
              size="md"
            />
          </div>
        )}
        
        {/* Drag Handle - top right */}
        <button
          type="button"
          className="absolute top-2 left-2 p-1.5 rounded-lg bg-background/80 backdrop-blur-sm hover:bg-background cursor-grab active:cursor-grabbing touch-none shadow-sm"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Delete - top right */}
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
        </button>
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
