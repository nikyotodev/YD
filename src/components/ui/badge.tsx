import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        "german-red":
          "border-transparent bg-german-red/10 text-german-red shadow hover:bg-german-red/20",
        "german-gold":
          "border-transparent bg-german-gold/20 text-german-black shadow hover:bg-german-gold/30",
        "german-black":
          "border-transparent bg-german-black/10 text-german-black shadow hover:bg-german-black/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
export { Badge, badgeVariants };
