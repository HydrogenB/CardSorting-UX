import * as React from 'react';
import { compressImage, isValidImageType } from '@/lib/imageUtils';
import { cn } from '@/lib/utils';
import { ImagePlus, X, Loader2, AlertCircle } from 'lucide-react';

export interface ImageUploaderProps {
  /** Current image value (base64 string) */
  value?: string;
  /** Callback when image changes */
  onChange: (base64: string | undefined) => void;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'default' | 'icon';
  /** Whether the uploader is disabled */
  disabled?: boolean;
  /** Accessible label for the upload button */
  'aria-label'?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Image uploader component with compression and validation
 * 
 * @example
 * ```tsx
 * <ImageUploader
 *   value={image}
 *   onChange={setImage}
 *   size="md"
 * />
 * ```
 */
export function ImageUploader({
  value,
  onChange,
  className,
  size = 'md',
  variant = 'default',
  disabled = false,
  'aria-label': ariaLabel = 'Upload image',
}: ImageUploaderProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputId = React.useId();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!isValidImageType(file)) {
      setError('Please select a valid image (JPEG, PNG, GIF, WebP)');
      return;
    }

    setIsLoading(true);
    try {
      const result = await compressImage(file);
      onChange(result.base64);
    } catch (err) {
      setError('Failed to process image');
      console.error(err);
    } finally {
      setIsLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setError(null);
  };

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || isLoading}
        className="sr-only"
        aria-describedby={error ? `${inputId}-error` : undefined}
      />

      {value ? (
        <div className={cn('relative group', sizeClasses[size])}>
          <img
            src={value}
            alt="Uploaded image"
            className="w-full h-full object-cover rounded-lg border border-border"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className={cn(
                'absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full',
                'flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity',
                'focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2',
                'shadow-sm hover:bg-destructive/90',
                size === 'xs' ? 'w-4 h-4' : 'w-5 h-5'
              )}
              aria-label="Remove image"
            >
              <X className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} aria-hidden="true" />
            </button>
          )}
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={cn(
            'flex items-center justify-center transition-all cursor-pointer',
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 rounded-lg',
            disabled && 'opacity-50 cursor-not-allowed',
            variant === 'default' && [
              'rounded-lg border-2 border-dashed border-border',
              'hover:border-primary hover:bg-primary/5',
              'text-muted-foreground hover:text-primary',
            ],
            variant === 'icon' && [
              'text-muted-foreground hover:text-foreground hover:bg-muted',
              'p-1 rounded-md',
            ],
            sizeClasses[size]
          )}
        >
          {isLoading ? (
            <Loader2
              className={cn('text-muted-foreground animate-spin', iconSizes[size])}
              aria-hidden="true"
            />
          ) : (
            <ImagePlus className={cn(iconSizes[size])} aria-hidden="true" />
          )}
          <span className="sr-only">{ariaLabel}</span>
        </label>
      )}

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-xs text-destructive mt-1 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
