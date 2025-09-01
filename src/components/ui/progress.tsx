import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-muted",
  {
    variants: {
      variant: {
        default: "",
        strength: "",
        agility: "",
        endurance: "",
        spirit: "",
        intelligence: "",
        health: "",
        fire: "",
      },
      size: {
        default: "h-2",
        sm: "h-1.5",
        lg: "h-3",
        xl: "h-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        strength: "gradient-strength glow-fire",
        agility: "gradient-agility",
        endurance: "gradient-endurance", 
        spirit: "gradient-spirit glow-purple",
        intelligence: "gradient-intelligence glow-purple",
        health: "gradient-health",
        fire: "gradient-fire glow-fire",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  indicatorVariant?: VariantProps<typeof progressIndicatorVariants>["variant"]
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, variant, size, indicatorVariant, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ variant, size, className }))}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(progressIndicatorVariants({ variant: indicatorVariant || variant }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress, progressVariants }
