"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api/axios"
import type { Order } from "@/lib/types"

export default function AdminOrderDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/admin/orders/${params.id}`)
      setOrder(response.data)
    } catch (error) {
      console.error("Failed to fetch order:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await api.put(`/admin/orders/${params.id}/status`, { status: newStatus })
      toast({
        title: "Success",
        description: "Order status updated successfully",
      })
      fetchOrder()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleGenerateBill = async () => {
    try {
      await api.post(`/admin/orders/${params.id}/generate-bill-pdf`)
      toast({
        title: "Success",
        description: "Bill PDF generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate bill PDF",
        variant: "destructive",
      })
    }
  }

  const handleGenerateShippingLabel = async () => {
    try {
      await api.post(`/admin/orders/${params.id}/generate-shipping-label`)
      toast({
        title: "Success",
        description: "Shipping label generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate shipping label",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 w-64 animate-pulse rounded bg-muted" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="h-96 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <p className="text-center text-muted-foreground">Order not found</p>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
          <Badge className={getStatusColor(order.order_status)}>{order.order_status}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateBill}>
            Generate Bill
          </Button>
          <Button variant="outline" onClick={handleGenerateShippingLabel}>
            Shipping Label
          </Button>
        </div>
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
                        <p className="text-sm text-muted-foreground">
                          ${item.unit_price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">৳{Number(item.total_price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={order.order_status} onValueChange={handleStatusUpdate} disabled={isUpdating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placed">Placed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>৳{Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Charge</span>
                <span>৳{Number(order.delivery_charge).toFixed(2)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>Discount</span>
                  <span>-${Number(order.discount_amount).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>৳{Number(order.total_amount).toFixed(2)}</span>
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
  )
}
