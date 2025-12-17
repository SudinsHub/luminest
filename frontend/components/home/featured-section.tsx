"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import api from "@/lib/api/axios"
import type { Product } from "@/lib/types"
import { Star } from "lucide-react"

interface FeaturedSectionProps {
  title: string
}

export function FeaturedSection({ title}: FeaturedSectionProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/products/tag/${encodeURIComponent(title)}`)
        setProducts(response.data.slice(0, 4))
      } catch (error) {
        console.error(`Failed to fetch ${title} products:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [title])

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold">{title}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-64 animate-pulse bg-muted" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">{title}</h2>
          <Link href={`/products?tag=${encodeURIComponent(title)}`}>
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.images[0] || `/placeholder.svg?height=300&width=300&query=${product.title}`}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 font-semibold text-balance">{product.title}</h3>
                  <div className="mb-2 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <span className="text-sm">{Number(product.average_rating).toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({product.total_reviews})</span>
                  </div>
                  <p className="text-lg font-bold">${product.price}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
