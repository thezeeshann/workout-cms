"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"

import { buttonVariants, type ButtonVariantProps } from "@/components/ui/button-variants"
import { triggerNudge } from "@/lib/haptics"
import { cn } from "@/lib/utils"

type ButtonProps = ButtonPrimitive.Props &
  ButtonVariantProps & {
    haptic?: boolean
  }

function Button({
  className,
  variant = "default",
  size = "default",
  haptic = true,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={(event) => {
        if (haptic) triggerNudge()
        onClick?.(event)
      }}
      {...props}
    />
  )
}

export { Button }
