"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api/axios"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [bannerData, setBannerData] = useState({
    message: "",
    is_active: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await api.get("/admin/banner")
        setBannerData({
          message: response.data.message || "",
          is_active: response.data.is_active || false,
        })
      } catch (error) {
        console.error("Failed to fetch banner:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBanner()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await api.put("/admin/banner", bannerData)
      toast({
        title: "Success",
        description: "Settings updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Card>
          <CardContent className="p-6">
            <div className="h-48 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Banner Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="banner_message">Banner Message</Label>
            <Input
              id="banner_message"
              value={bannerData.message}
              onChange={(e) => setBannerData((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="Enter banner message..."
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="banner_active">Show Banner</Label>
            <Switch
              id="banner_active"
              checked={bannerData.is_active}
              onCheckedChange={(checked) => setBannerData((prev) => ({ ...prev, is_active: checked }))}
            />
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Charge</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Delivery charge is currently set to $5.00. This is configured in the backend.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
