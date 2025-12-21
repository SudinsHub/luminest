// app/(protected)/layout.tsx
// a basic layout that shows only the children without any providers or extra components
"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import type React from "react"
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { user, userRole, isLoading } = useAuth()
  
    useEffect(() => {
      if (!isLoading && (user || userRole == "admin")) {
        router.push("/313admins")
      }
    }, [user, userRole, isLoading, router])
  
    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      )
    }
  


    return <main>{children}</main>
}
