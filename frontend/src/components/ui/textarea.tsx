import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-border/60 px-4 py-3 text-sm text-foreground",
          "bg-white/3 backdrop-blur-sm",
          "placeholder:text-muted-foreground/50 leading-relaxed",
          "ring-offset-background transition-all duration-300",
          "focus-visible:outline-none focus-visible:border-primary/50",
          "focus-visible:shadow-[0_0_0_3px_rgba(124,58,237,0.12),0_0_20px_rgba(124,58,237,0.1)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
