"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import  Banner  from "@/components/banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, userRole } = useAuth()
  const { cart, updateCartItem, removeFromCart, cartTotal, isLoading } = useCart()

  if (!user || userRole !== "customer") {
    router.push("/login")
    return null
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      })
    }
  }

  const handleRemove = async (itemId: string) => {
    try {
      await removeFromCart(itemId)
      toast({
        title: "Success",
        description: "Item removed from cart",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Banner />
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-4xl font-bold">Shopping Cart</h1>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 rounded-lg bg-muted" />
              ))}
            </div>
          ) : cart.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="mb-4 text-muted-foreground">Your cart is empty</p>
                <Link href="/products">
                  <Button>Continue Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={item.image || `/placeholder.svg?height=100&width=100&query=${item.title}`}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <Link href={`/products/${item.product_id}`}>
                                <h3 className="font-semibold hover:text-secondary text-balance">{item.title}</h3>
                              </Link>
                              <p className="mt-1 text-lg font-bold">${item.price}</p>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-transparent"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-transparent"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-auto text-destructive hover:text-destructive"
                                onClick={() => handleRemove(item.id)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <Link href="/checkout">
                      <Button className="mt-6 w-full" size="lg">
                        Proceed to Checkout
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
