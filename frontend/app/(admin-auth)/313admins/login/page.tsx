"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()

  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)



  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(adminEmail, adminPassword, "admin")
      toast({
        title: "Success",
        description: "Logged in successfully",
      })
      router.push("/313admins")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-card px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/FF9600 Solution-06.png" alt="Luminest Logo" width={200} height={20} className="object-cover " />
          </Link>
        </div>
        <Card>
            <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Sign in to the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <Input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    placeholder="admin@luminest.com"
                    className="placeholder:opacity-50"
                />
                </div>
                <div>
                <label className="mb-2 block text-sm font-medium">Password</label>
                <Input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="placeholder:opacity-50"
                />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
                </Button>
            </form>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
