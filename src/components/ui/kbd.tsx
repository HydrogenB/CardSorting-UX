import { cn } from '@/lib/utils';

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Kbd({ children, className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-mono font-medium',
        'bg-muted border border-border rounded shadow-sm',
        'text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
