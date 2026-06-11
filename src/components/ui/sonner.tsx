"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-zinc-950 group-[.toaster]:text-zinc-50 group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-2xl font-medium",
          description: "group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-400",
          error: "group-[.toaster]:bg-zinc-950",
          success: "group-[.toaster]:bg-zinc-950",
          warning: "group-[.toaster]:bg-zinc-950",
          info: "group-[.toaster]:bg-zinc-950",
          icon: "group-data-[type=error]:text-red-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
