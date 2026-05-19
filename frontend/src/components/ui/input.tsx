import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-border/60 px-4 py-2.5 text-sm text-foreground",
          "bg-white/3 backdrop-blur-sm",
          "placeholder:text-muted-foreground/50",
          "ring-offset-background transition-all duration-300",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "focus-visible:outline-none focus-visible:border-primary/50",
          "focus-visible:shadow-[0_0_0_3px_rgba(124,58,237,0.12),0_0_20px_rgba(124,58,237,0.1)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
