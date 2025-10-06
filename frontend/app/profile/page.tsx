"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import  Banner  from "@/components/banner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, userRole, updateProfile } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_no: "",
    address: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user || userRole !== "customer") {
      router.push("/login")
      return
    }

    setFormData({
      name: (user as any).name || "",
      email: (user as any).email || "",
      contact_no: (user as any).contact_no || "",
      address: (user as any).address || "",
    })
  }, [user, userRole, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateProfile(formData)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Banner />
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-4xl font-bold">My Profile</h1>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Name</label>
                  <Input name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Contact Number</label>
                  <Input name="contact_no" value={formData.contact_no} onChange={handleChange} required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Address</label>
                  <Textarea name="address" value={formData.address} onChange={handleChange} required rows={3} />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
