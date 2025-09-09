import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-lg",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-primary/30",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground text-gray-900 dark:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        german:
          "bg-gradient-to-r from-german-red to-german-dark-red text-white shadow-lg hover:from-german-dark-red hover:to-german-red hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] dark:from-dark-theme-purple dark:to-dark-theme-pink dark:hover:from-dark-theme-pink dark:hover:to-dark-theme-purple",
        "german-gold":
          "bg-gradient-to-r from-german-gold to-german-light-gold text-german-black shadow-lg hover:from-german-light-gold hover:to-german-gold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] dark:from-dark-theme-purple dark:to-dark-theme-bright-pink dark:text-white dark:hover:from-dark-theme-bright-pink dark:hover:to-dark-theme-purple",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
export { Button, buttonVariants };
