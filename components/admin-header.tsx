"use client"

import { useMemo } from "react"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function AdminHeader({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  // Time-based greeting logic
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }, [])

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Greeting */}
      <div className="text-lg font-medium text-muted-foreground hidden sm:block mr-4">
        {greeting}, Admin
      </div>

      {/* Search Bar */}
      <div className="flex flex-1 justify-center sm:justify-start items-center gap-4 max-w-md px-4 sm:px-0">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9" />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* User Avatar */}
        <Avatar>
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>

        {/* Sidebar Toggle (Right-Aligned on small screens only) */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-gray-700 hover:text-black focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}
