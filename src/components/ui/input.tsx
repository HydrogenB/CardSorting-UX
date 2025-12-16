import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & {
  error?: boolean
  success?: boolean
  loading?: boolean
  showPasswordToggle?: boolean
}>(({ className, type, error, success, loading, showPasswordToggle, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const inputType = type === "password" && showPassword ? "text" : type

  return (
    <div className="relative">
      <input
        type={inputType}
        className={cn(
          "flex h-9 w-full rounded-md border px-3 py-1 text-base transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "hover:border-primary/50",
          error && [
            "border-destructive text-destructive focus:ring-destructive",
            "pr-10"
          ],
          success && [
            "border-success text-success focus:ring-success",
            "pr-10"
          ],
          !error && !success && "border-input bg-background",
          loading && "pr-10",
          isFocused && "shadow-sm",
          className
        )}
        ref={ref}
        onFocus={(e) => {
          setIsFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          props.onBlur?.(e)
        }}
        {...props}
      />
      
      {/* Status Icons */}
      {error && (
        <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
      )}
      {success && (
        <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
      )}
      
      {/* Password Toggle */}
      {type === "password" && showPasswordToggle && !error && !success && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      )}
      
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  )
})
Input.displayName = "Input"

export { Input }
