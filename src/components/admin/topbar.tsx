"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b h-16 flex items-center gap-4 px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-3 pl-3 border-l">
        <div className="w-9 h-9 rounded-full bg-pmo-violet-gradient flex items-center justify-center text-white font-semibold text-sm">
          A
        </div>
        <div className="hidden sm:block leading-tight">
          <div className="text-sm font-medium">Admin</div>
          <div className="text-xs text-muted-foreground">Super Admin</div>
        </div>
      </div>
    </header>
  )
}
