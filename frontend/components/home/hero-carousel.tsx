"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import api from "@/lib/api/axios"
import type { CarouselImage } from "@/lib/types"

export function HeroCarousel() {
  const [images, setImages] = useState<CarouselImage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const response = await api.get("/carousel")
        setImages(response.data)
      } catch (error) {
        console.error("Failed to fetch carousel:", error)
      }
    }

    fetchCarousel()
  }, [])

  useEffect(() => {
    if (images.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  if (images.length === 0) {
    return (
      <div className="relative h-[400px] w-full bg-card md:h-[600px]">
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex-1 w-full overflow-hidden">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {image.link_url ? (
            <Link href={image.link_url}>
              <Image
                src={image.image_url || `/placeholder.svg?height=600&width=1200&query=ceramic goods`}
                alt={image.alt_text || "Carousel image"}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </Link>
          ) : (
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${image.image_url}`}
              alt={image.alt_text || "Carousel image"}
              fill
              className="object-cover"
              priority={index === 0}
            />
          )}
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white flex flex-col items-center">

          {/* SVG logo */}
          <img
            src="/luminest_hero_new.png"
            alt="Luminest"
            className="w-full max-w-[520px]  mb-6"
          />

          {/* tagline */}
          <p className="w-full max-w-[520px] text-xl md:text-2xl font-medium mb-10">
            Brightening your everyday
          </p>

          <Link href="/products">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 px-8 py-6 text-lg">
              Shop Now
            </Button>
          </Link>

        </div>
      </div>


      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 text-white hover:bg-white/30"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white hover:bg-white/30"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${index === currentIndex ? "w-8 bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
