"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import api from "@/lib/api/axios"
import type { Order } from "@/lib/types"
import { Search } from "lucide-react"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/admin/orders")
        setOrders(response.data)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

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

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by order number or customer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-24 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Link key={order.id} href={`/313admins/orders/${order.id}`}>
              <Card className="transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="font-semibold">Order #{order.order_number}</h3>
                        <Badge className={getStatusColor(order.order_status)}>{order.order_status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Customer: {order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">Email: {order.customer_email}</p>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${Number(order.total_amount).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{order.payment_method}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
