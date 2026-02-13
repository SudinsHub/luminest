"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import  Banner  from "@/components/banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import api from "@/lib/api/axios"
import type { Product } from "@/lib/types"
import { Star, ShoppingCart, Minus, Plus } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user, userRole } = useAuth()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${params.id}`)
        setProduct(response.data)
      } catch (error) {
        console.error("Failed to fetch product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, toast])

  const handleAddToCart = async () => {
    if (!user || userRole !== "customer") {
      router.push("/login")
      return
    }

    try {
      await addToCart(product!.id, quantity)
      toast({
        title: "Success",
        description: "Product added to cart",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      })
    }
  }

  const handleSubmitReview = async () => {
    if (!user || userRole !== "customer") {
      router.push("/login")
      return
    }

    try {
      setIsSubmittingReview(true)
      await api.post("/customer/reviews/create", {
        productId: product!.id,
        rating,
        comment,
      })

      toast({
        title: "Success",
        description: "Review submitted successfully",
      })

      setComment("")
      setRating(5)

      // Refresh product data
      const response = await api.get(`/products/${params.id}`)
      setProduct(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingReview(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Banner />
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-96 rounded-lg bg-muted" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Banner />
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-center text-muted-foreground">Product not found</p>
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
          {/* Product Details */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Images */}
            <div>
              <div className="mb-4 overflow-hidden rounded-lg">
                <Image
                  src={product.images[selectedImage] || `/placeholder.svg?height=600&width=600&query=${product.title}`}
                  alt={product.title}
                  width={600}
                  height={600}
                  className="h-auto w-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`overflow-hidden rounded-lg border-2 ${
                        selectedImage === index ? "border-secondary" : "border-transparent"
                      }`}
                    >
                      <Image
                        src={image || `/placeholder.svg?height=150&width=150&query=${product.title}`}
                        alt={`${product.title} ${index + 1}`}
                        width={150}
                        height={150}
                        className="h-auto w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="mb-4 text-4xl font-bold text-balance">{product.title}</h1>

              <div className="mb-4 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(product.average_rating) ? "fill-secondary text-secondary" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {Number(product.average_rating).toFixed(1)} ({product.total_reviews} reviews)
                </span>
              </div>

              <p className="mb-6 text-3xl font-bold">${product.price}</p>

              <p className="mb-6 leading-relaxed text-muted-foreground text-pretty">{product.description}</p>

              {product.stock_quantity > 0 ? (
                <>
                  <div className="mb-6 flex items-center gap-4">
                    <span className="font-semibold">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                        disabled={quantity >= product.stock_quantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">{product.stock_quantity} available</span>
                  </div>

                  <Button size="lg" className="w-full" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </>
              ) : (
                <div className="rounded-lg bg-destructive/10 p-4 text-center">
                  <p className="font-semibold text-destructive">Out of Stock</p>
                </div>
              )}

              {product.categories.length > 0 && (
                <div className="mt-6">
                  <span className="font-semibold">Categories: </span>
                  <span className="text-muted-foreground">{product.categories.join(", ")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>

            {user && userRole === "customer" && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="mb-4 font-semibold">Write a Review</h3>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">Rating</label>
                    <Select value={rating.toString()} onValueChange={(value) => setRating(Number.parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 4, 3, 2, 1].map((value) => (
                          <SelectItem key={value} value={value.toString()}>
                            {value} Star{value !== 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">Comment</label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this product..."
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleSubmitReview} disabled={isSubmittingReview || !comment.trim()}>
                    Submit Review
                  </Button>
                </CardContent>
              </Card>
            )}

            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-semibold">{review.customer_name}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mb-2 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-secondary text-secondary" : "text-muted"}`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground text-pretty">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
