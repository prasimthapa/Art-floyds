"use client"

import { signIn } from "next-auth/react"
import { Button } from "./ui/button"
import { type VariantProps, cva } from "class-variance-authority"
import React from "react"
import { cn } from "~/lib/utils"

const buttonVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        outline:
          "border border-input text-primary-background bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const LoginWithGoogleButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
  return <Button
    className={cn(buttonVariants({ variant, size, className }))}
    ref={ref}
    {...props}
    onClick={async () => signIn("google", { redirect: false, callbackUrl: `${window.location.origin}/` })}>
    <ChromeIcon className="w-4 h-4 mr-2" />
    Login with Google
  </Button>
})

LoginWithGoogleButton.displayName = 'login with google'

function ChromeIcon(props: { className: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  )
}
