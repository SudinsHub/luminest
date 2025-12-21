"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { useIsMobile } from "@/hooks/use-mobile"
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, userRole, isLoading } = useAuth()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!isLoading && (!user || userRole !== "admin")) {
      router.push("/313admins/login")
    }
  }, [user, userRole, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }


  return (
    <div className="flex h-screen">
      {!isMobile && <AdminSidebar />}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-background p-6">{children}</main>
      </div>
    </div>
  )
}
