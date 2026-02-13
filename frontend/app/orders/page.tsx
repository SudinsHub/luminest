"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import  Banner  from "@/components/banner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/api/axios"
import type { Order } from "@/lib/types"

export default function OrdersPage() {
  const router = useRouter()
  const { user, userRole } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || userRole !== "customer") {
      router.push("/login")
      return
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get("/customer/orders")
        setOrders(response.data)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user, userRole, router])

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
          <h1 className="mb-8 text-4xl font-bold">My Orders</h1>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-24 animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="mb-4 text-muted-foreground">You haven't placed any orders yet</p>
                <Link href="/products">
                  <button className="rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90">
                    Start Shopping
                  </button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order.id} href={`/orders/${order.id}`}>
                  <Card className="transition-shadow hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <h3 className="font-semibold">Order #{order.order_number}</h3>
                            <Badge className={getStatusColor(order.order_status)}>{order.order_status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">Payment: {order.payment_method}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">৳{Number(order.total_amount).toFixed(2)}</p>
                        </div>
                      </div>
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
