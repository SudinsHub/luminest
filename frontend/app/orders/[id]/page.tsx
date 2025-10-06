"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import  Banner  from "@/components/banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api/axios"
import type { Order } from "@/lib/types"

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, userRole } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || userRole !== "customer") {
      router.push("/login")
      return
    }

    const fetchOrder = async () => {
      try {
        const response = await api.get(`/customer/orders/${params.id}`)
        setOrder(response.data)
      } catch (error) {
        console.error("Failed to fetch order:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, user, userRole, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Banner />
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-4">
              <div className="h-12 w-64 rounded bg-muted" />
              <div className="h-96 rounded-lg bg-muted" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col">
        <Banner />
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-center text-muted-foreground">Order not found</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "placed":
        return "bg-blue-500"
      case "processing":
        return "bg-yellow-500"
      case "shipped":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Banner />
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold">Order #{order.order_number}</h1>
            <Badge className={getStatusColor(order.order_status)}>{order.order_status}</Badge>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={item.image || `/placeholder.svg?height=80&width=80&query=${item.title}`}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 justify-between">
                          <div>
                            <h3 className="font-semibold text-balance">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">${item.total_price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-semibold">Name: </span>
                    <span>{order.customer_name}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Email: </span>
                    <span>{order.customer_email}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Contact: </span>
                    <span>{order.customer_contact}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Address: </span>
                    <span className="text-pretty">{order.delivery_address}</span>
                  </div>
                  {order.notes && (
                    <div>
                      <span className="font-semibold">Notes: </span>
                      <span className="text-pretty">{order.notes}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Charge</span>
                    <span>${order.delivery_charge.toFixed(2)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>Discount</span>
                      <span>-${order.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${order.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span>{order.payment_method}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment Status</span>
                      <span>{order.payment_status}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Order Date</span>
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
