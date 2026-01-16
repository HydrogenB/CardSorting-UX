import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Check, Eye, EyeOff, Loader2 } from 'lucide-react';

export interface InputProps extends React.ComponentProps<'input'> {
  /** Show error state styling */
  error?: boolean;
  /** Show success state styling */
  success?: boolean;
  /** Show loading spinner */
  loading?: boolean;
  /** Show password visibility toggle for password inputs */
  showPasswordToggle?: boolean;
  /** ID of element describing keyboard focus helper text for accessibility */
  'aria-describedby'?: string;
}

/**
 * Input component with validation states, password toggle, and loading indicator
 * 
 * @example
 * ```tsx
 * <Input placeholder="Email" />
 * <Input type="password" showPasswordToggle />
 * <Input error aria-describedby="error-text" />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, loading, showPasswordToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const inputType = type === 'password' && showPassword ? 'text' : type;

    // Determine if we need right padding for icons
    const hasRightIcon = error || success || loading || (type === 'password' && showPasswordToggle);

    return (
      <div className="relative">
        <input
          type={inputType}
          className={cn(
            'flex h-9 w-full rounded-md border px-3 py-1 text-base transition-all duration-200',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
            'placeholder:text-muted-foreground',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'md:text-sm',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'hover:border-primary/50',
            error && 'border-destructive text-destructive focus:ring-destructive',
            success && 'border-green-500 text-green-700 focus:ring-green-500',
            !error && !success && 'border-input bg-background',
            hasRightIcon && 'pr-10',
            isFocused && 'shadow-sm',
            className
          )}
          ref={ref}
          aria-invalid={error || undefined}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {/* Status Icons */}
        {error && (
          <AlertCircle
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive"
            aria-hidden="true"
          />
        )}
        {success && !error && (
          <Check
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500"
            aria-hidden="true"
          />
        )}

        {/* Password Toggle */}
        {type === 'password' && showPasswordToggle && !error && !success && !loading && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}

        {/* Loading Spinner */}
        {loading && !error && !success && (
          <Loader2
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
