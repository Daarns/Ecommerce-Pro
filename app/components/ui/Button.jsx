'use client'
import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/app/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-text-inverse hover:bg-primary-hover",
        destructive: "bg-error text-text-inverse hover:bg-error/90",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-text-inverse",
        secondary: "bg-background-secondary text-text-primary hover:bg-background-tertiary",
        ghost: "hover:bg-background-secondary",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-accent text-text-inverse hover:bg-accent-hover"
      },
      size: {
        default: "h-10 px-6 py-2 rounded-xl text-sm",
        sm: "h-8 px-4 py-1 rounded-lg text-sm",
        lg: "h-12 px-8 py-3 rounded-xl text-base",
        xl: "h-14 px-10 py-4 rounded-2xl text-lg",
        icon: "h-10 w-10 rounded-xl"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }