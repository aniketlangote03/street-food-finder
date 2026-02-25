import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Controller, type ControllerProps, type FieldValues, FormProvider, useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

const FormField = Controller as unknown as <TFieldValues extends FieldValues, TName extends ControllerProps<TFieldValues>["name"]>(
  props: ControllerProps<TFieldValues, TName>,
) => React.ReactElement

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("space-y-2", className)} {...props} />
  },
)
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<React.ElementRef<typeof Label>, React.ComponentPropsWithoutRef<typeof Label>>(
  ({ className, ...props }, ref) => {
    return <Label ref={ref} className={className} {...props} />
  },
)
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    return <Slot ref={ref} {...props} />
  },
)
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-[0.8rem] text-muted-foreground", className)} {...props} />
  },
)
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    if (!children) {
      return null
    }

    return (
      <p ref={ref} className={cn("text-[0.8rem] font-medium text-destructive", className)} {...props}>
        {children}
      </p>
    )
  },
)
FormMessage.displayName = "FormMessage"

export { useFormContext, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form }
