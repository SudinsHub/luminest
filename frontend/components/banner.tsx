"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api/axios"
import type { Banner } from "@/lib/types"

export default function BannerComponent() {
  const [banner, setBanner] = useState<Banner | null>(null)

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await api.get("/banner")
        if (response.data && response.data.is_active) {
          setBanner(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch banner:", error)
      }
    }

    fetchBanner()
  }, [])

  if (!banner) return null

  return <div className="bg-secondary px-4 py-2 text-center text-sm text-secondary-foreground">{banner.message}</div>
}
