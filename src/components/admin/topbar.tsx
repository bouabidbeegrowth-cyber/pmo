"use client"

import { Menu, Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
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

      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher…"
            className="pl-10 h-9 bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-primary/30"
          />
        </div>
      </div>

      <div className="flex-1 sm:flex-none" />

      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="h-5 w-5" />
      </Button>

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
