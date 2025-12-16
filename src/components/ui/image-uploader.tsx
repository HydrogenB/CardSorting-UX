import { useState, useRef } from 'react';
import { compressImage, isValidImageType } from '@/lib/imageUtils';
import { cn } from '@/lib/utils';
import { ImagePlus, X, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  value?: string; // base64 string
  onChange: (base64: string | undefined) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function ImageUploader({ value, onChange, className, size = 'md' }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleRemove = () => {
    onChange(undefined);
    setError(null);
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
  };

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        <div className={cn('relative group', sizeClasses[size])}>
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-lg border border-border"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          className={cn(
            'flex items-center justify-center rounded-lg border-2 border-dashed border-border',
            'hover:border-primary hover:bg-primary/5 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizeClasses[size]
          )}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          ) : (
            <ImagePlus className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      )}

      {error && (
        <p className="text-xs text-destructive mt-1 absolute -bottom-5 left-0 whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
}
