import * as React from "react"
import { cn } from "../../utils/cn"

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-primary-foreground shadow hover:bg-primary/90": !variant || variant === "default",
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90": variant === "destructive",
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground": variant === "outline",
          "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80": variant === "secondary",
          "h-9 px-4 py-2": !size || size === "default",
          "h-8 rounded-md px-3 text-xs": size === "sm",
          "h-10 rounded-md px-8": size === "lg",
          "h-9 w-9": size === "icon",
        },
        className
      )}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
