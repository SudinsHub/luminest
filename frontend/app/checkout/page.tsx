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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api/axios"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, userRole } = useAuth()
  const { cart, cartTotal, clearCart } = useCart()

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_contact: "",
    delivery_address: "",
    payment_method: "COD",
    notes: "",
    couponCode: "",
  })
  const [deliveryCharge, setDeliveryCharge] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  useEffect(() => {
    if (!user || userRole !== "customer") {
      router.push("/login")
      return
    }

    if (cart.length === 0) {
      router.push("/cart")
      return
    }

    // Pre-fill with user data
    setFormData((prev) => ({
      ...prev,
      customer_name: (user as any).name || "",
      customer_email: (user as any).email || "",
      customer_contact: (user as any).contact_no || "",
      delivery_address: (user as any).address || "",
    }))

    // Fetch delivery charge (you might want to make this dynamic)
    setDeliveryCharge(5.0)
  }, [user, userRole, cart, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleValidateCoupon = async () => {
    if (!formData.couponCode.trim()) return

    setIsValidatingCoupon(true)
    try {
      const response = await api.post("/coupons/validate", { code: formData.couponCode })
      const coupon = response.data.coupon

      // Calculate discount based on coupon type
      let discountAmount = 0
      if (coupon.type === "percentage") {
        discountAmount = (cartTotal * coupon.value) / 100
        if (coupon.max_discount) {
          discountAmount = Math.min(discountAmount, coupon.max_discount)
        }
      } else {
        discountAmount = coupon.value
      }

      setDiscount(discountAmount)
      toast({
        title: "Success",
        description: "Coupon applied successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Invalid coupon code",
        variant: "destructive",
      })
      setDiscount(0)
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.post("/customer/orders/create", formData)

      toast({
        title: "Success",
        description: "Order placed successfully",
      })

      await clearCart()
      router.push(`/orders/${response.data.order.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to place order",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const total = cartTotal + deliveryCharge - discount

  return (
    <div className="flex min-h-screen flex-col">
      <Banner />
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-4xl font-bold">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="customer_name">Full Name</Label>
                      <Input
                        id="customer_name"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customer_email">Email</Label>
                      <Input
                        id="customer_email"
                        name="customer_email"
                        type="email"
                        value={formData.customer_email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customer_contact">Contact Number</Label>
                      <Input
                        id="customer_contact"
                        name="customer_contact"
                        value={formData.customer_contact}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="delivery_address">Delivery Address</Label>
                      <Textarea
                        id="delivery_address"
                        name="delivery_address"
                        value={formData.delivery_address}
                        onChange={handleChange}
                        required
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Any special instructions..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={formData.payment_method}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, payment_method: value }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="COD" id="cod" />
                        <Label htmlFor="cod">Cash on Delivery</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Online" id="online" />
                        <Label htmlFor="online">Online Payment (Mock)</Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>৳{Number(cartTotal).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery Charge</span>
                        <span>৳{Number(deliveryCharge).toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-secondary">
                          <span>Discount</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>৳{Number(total).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="couponCode">Coupon Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="couponCode"
                          name="couponCode"
                          value={formData.couponCode}
                          onChange={handleChange}
                          placeholder="Enter code"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleValidateCoupon}
                          disabled={isValidatingCoupon}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? "Placing Order..." : "Place Order"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
