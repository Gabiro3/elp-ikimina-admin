"use client"
import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { useState } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)


  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (hidden on small screens) */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transition-transform transform bg-white shadow-lg 
        lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0 block" : "-translate-x-full hidden"} lg:block`}>
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Admin Header with toggle button */}
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
