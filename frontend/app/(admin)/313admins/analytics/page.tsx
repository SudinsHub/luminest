"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/api/axios"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SalesData {
  month: string
  sales: number
}

interface OrdersByStatus {
  order_status: string
  count: number
}

interface TopProduct {
  title: string
  total_quantity_sold: string
}

export default function AnalyticsPage() {
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [ordersByStatus, setOrdersByStatus] = useState<OrdersByStatus[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [salesResponse, ordersResponse] = await Promise.all([
          api.get("/admin/sales/analytics"),
          api.get("/admin/orders/analytics"),
        ])

        setSalesData(salesResponse.data)
        setOrdersByStatus(ordersResponse.data.ordersByStatus || [])
        setTopProducts(ordersResponse.data.topSellingProducts || [])
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-64 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales by Month</CardTitle>
        </CardHeader>
        <CardContent>
          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#c48e3b" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground">No sales data available</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersByStatus.length > 0 ? (
              <div className="space-y-4">
                {ordersByStatus.map((item) => (
                  <div key={item.order_status} className="flex items-center justify-between">
                    <span className="capitalize">{item.order_status}</span>
                    <span className="font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No order data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-balance">{product.title}</span>
                    <span className="font-bold">{product.total_quantity_sold} sold</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No product data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
