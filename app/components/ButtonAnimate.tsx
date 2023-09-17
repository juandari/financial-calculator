import React from "react";

import { Button, buttonVariants } from "./ui/button";
import type { ButtonProps } from "./ui/button";
import { cn } from "~/lib/utils";

export const ButtonAnimate = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <Button
        className={cn(
          `${buttonVariants({
            variant,
            size,
            className,
          })} active:scale-90 transition-all`
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
ButtonAnimate.displayName = "Button";
