// components/ui/toaster.tsx

"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex flex-col items-center text-center w-full gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}

      {/* 👇 Center the Toast Viewport */}
      <ToastViewport
        className={cn(
          "fixed top-1/2 left-1/2 z-[100] flex max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col space-y-2 w-full"
        )}
      />
    </ToastProvider>
  )
}
