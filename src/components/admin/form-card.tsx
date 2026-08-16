"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FormCardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormCard({ title, description, children, className }: FormCardProps) {
  return (
    <Card className={cn("border-0 shadow-premium p-6", className)}>
      {(title || description) && (
        <div className="mb-5 pb-4 border-b">
          {title && <h3 className="font-display text-lg font-semibold">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
      {children}
    </Card>
  )
}
