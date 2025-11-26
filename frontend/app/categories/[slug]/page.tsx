"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import  Banner  from "@/components/banner"
import { Card, CardContent } from "@/components/ui/card"
import api from "@/lib/api/axios"
import type { Product, Category } from "@/lib/types"
import { Star } from "lucide-react"

export default function CategoryDetailPage() {
  const params = useParams()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all categories to find the one with matching slug
        const categoriesResponse = await api.get("/categories")
        const foundCategory = categoriesResponse.data.find((cat: Category) => cat.slug === params.slug)

        if (foundCategory) {
          setCategory(foundCategory)

          // Fetch products for this category
          const productsResponse = await api.get(`/products/by-category/${foundCategory.id}`)
          setProducts(productsResponse.data)
        }
      } catch (error) {
        console.error("Failed to fetch category data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Banner />
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="mb-8 h-12 w-64 rounded bg-muted" />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-80 rounded-lg bg-muted" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col">
        <Banner />
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-center text-muted-foreground">Category not found</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Banner />
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-balance">{category.name}</h1>
            {category.description && <p className="text-muted-foreground text-pretty">{category.description}</p>}
          </div>

          {products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          ) : (
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
                        <span className="text-sm">{product.average_rating}</span>
                        <span className="text-sm text-muted-foreground">({product.total_reviews})</span>
                      </div>
                      <p className="text-lg font-bold">${product.price}</p>
                      {product.stock_quantity === 0 && <p className="mt-2 text-sm text-destructive">Out of Stock</p>}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
