import Banner from "@/components/banner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroCarousel } from "@/components/home/hero-carousel"
import { FeaturedSection } from "@/components/home/featured-section"
import { CategoriesSection } from "@/components/home/categories-section"
import api from "@/lib/api/axios"
import type { Tag } from "@/lib/types"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [tags, setTags] =  useState<Tag[]>([])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/tags")
        setTags(response.data)
      } catch (error) {
        console.error("Failed to fetch tags:", error)
      }
    }

    fetchTags()
  }, [])
  return (
    <div className="flex min-h-screen flex-col">
      <Banner />
      <Navbar />
      <main className="flex-1">
        <HeroCarousel />
        {tags.map((tag) => (
          <FeaturedSection key={tag.tag_name} title={tag.tag_name} />
        ))}
        <CategoriesSection />
      </main>
      <Footer />
    </div>
  )
}
