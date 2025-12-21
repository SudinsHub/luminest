// app/(protected)/layout.tsx
// a basic layout that shows only the children without any providers or extra components
"use client"
import type React from "react"
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
