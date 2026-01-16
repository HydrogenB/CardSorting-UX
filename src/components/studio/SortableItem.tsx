import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { GripVertical, Trash2 } from 'lucide-react';
import { ImageUploader } from '@/components/ui/image-uploader';

export interface SortableItemProps {
  /** Unique identifier for the item */
  id: string;
  /** Display label */
  label: string;
  /** Optional description */
  description?: string;
  /** Optional image (base64) */
  image?: string;
  /** Callback when label changes */
  onLabelChange: (value: string) => void;
  /** Callback when description changes */
  onDescriptionChange: (value: string) => void;
  /** Callback when image changes */
  onImageChange: (value: string | undefined) => void;
  /** Callback when item is removed */
  onRemove: () => void;
  /** Placeholder text for inputs */
  placeholder?: { label: string; description: string };
  /** Whether the item is disabled */
  disabled?: boolean;
}

/**
 * A sortable item with editable label, description, and image
 * Used in the configuration panel for managing cards and categories
 * 
 * @example
 * ```tsx
 * <SortableItem
 *   id={card.id}
 *   label={card.label}
 *   onLabelChange={(value) => updateCard(card.id, { label: value })}
 *   onRemove={() => removeCard(card.id)}
 * />
 * ```
 */
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
  disabled = false,
}: SortableItemProps) {
  const labelInputRef = React.useRef<HTMLInputElement>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Focus label input when becoming visible (e.g., after creation)
  React.useEffect(() => {
    if (label === '' && labelInputRef.current) {
      labelInputRef.current.focus();
    }
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="listitem"
      aria-label={label || 'New item'}
      className={cn(
        'rounded-xl border bg-card overflow-hidden',
        'transition-all duration-200',
        isDragging && 'opacity-50 shadow-xl border-primary z-50 scale-[1.02]',
        !isDragging && 'border-border hover:border-primary/30 hover:shadow-md',
        disabled && 'opacity-50 pointer-events-none'
      )}
    >
      <div className="relative">
        {/* Image Section */}
        {image && (
          <div className="relative group">
            <img
              src={image}
              alt=""
              aria-hidden="true"
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <ImageUploader
                value={image}
                onChange={onImageChange}
                size="md"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={disabled}
              />
            </div>
          </div>
        )}

        {/* Controls Row */}
        <div
          className={cn(
            'flex items-center justify-between px-2 py-1.5',
            image ? 'absolute top-0 inset-x-0 z-10' : 'bg-muted/30 border-b border-border/50'
          )}
        >
          <div className="flex items-center gap-1">
            {/* Drag Handle */}
            <button
              type="button"
              aria-label="Drag to reorder"
              disabled={disabled}
              className={cn(
                'p-1.5 rounded-lg cursor-grab active:cursor-grabbing touch-none transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                image
                  ? 'bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm'
                  : 'hover:bg-muted text-muted-foreground'
              )}
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Image Upload (when no image) */}
            {!image && (
              <ImageUploader
                value={image}
                onChange={onImageChange}
                size="xs"
                variant="icon"
                aria-label="Add image"
                disabled={disabled}
              />
            )}
          </div>

          {/* Delete Button */}
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label="Remove item"
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2',
              'hover:bg-destructive hover:text-destructive-foreground',
              image
                ? 'bg-background/80 backdrop-blur-sm shadow-sm'
                : 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
            )}
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Content Inputs */}
      <div className="p-3 space-y-1.5">
        <input
          ref={labelInputRef}
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          disabled={disabled}
          aria-label="Item label"
          className={cn(
            'w-full px-2.5 py-1.5 text-sm font-semibold border border-input rounded-lg bg-background',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'transition-colors'
          )}
          placeholder={placeholder.label}
        />
        <input
          type="text"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          disabled={disabled}
          aria-label="Item description"
          className={cn(
            'w-full px-2.5 py-1 text-xs border border-input rounded-lg bg-background',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'text-muted-foreground transition-colors'
          )}
          placeholder={placeholder.description}
        />
      </div>
    </div>
  );
}
