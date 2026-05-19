import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-xl border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary/15 text-primary hover:bg-primary/20",
        secondary:
          "border-border/60 bg-white/5 text-muted-foreground hover:bg-white/8",
        destructive:
          "border-destructive/30 bg-destructive/15 text-destructive hover:bg-destructive/20",
        outline:
          "border-border/50 text-muted-foreground bg-transparent",
        success:
          "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
