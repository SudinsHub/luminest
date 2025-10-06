"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api/axios"
import type { Coupon } from "@/lib/types"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AdminCouponsPage() {
  const { toast } = useToast()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    max_discount: "",
    min_order_amount: "",
    is_active: true,
  })

  const fetchCoupons = async () => {
    try {
      const response = await api.get("/admin/coupons")
      setCoupons(response.data)
    } catch (error) {
      console.error("Failed to fetch coupons:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const handleOpenDialog = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon)
      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value.toString(),
        max_discount: coupon.max_discount?.toString() || "",
        min_order_amount: coupon.min_order_amount.toString(),
        is_active: coupon.is_active,
      })
    } else {
      setEditingCoupon(null)
      setFormData({
        code: "",
        type: "percentage",
        value: "",
        max_discount: "",
        min_order_amount: "",
        is_active: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        code: formData.code,
        type: formData.type,
        value: Number.parseFloat(formData.value),
        max_discount: formData.max_discount ? Number.parseFloat(formData.max_discount) : null,
        min_order_amount: Number.parseFloat(formData.min_order_amount),
        is_active: formData.is_active,
      }

      if (editingCoupon) {
        await api.put(`/admin/coupons/${editingCoupon.id}`, payload)
        toast({ title: "Success", description: "Coupon updated successfully" })
      } else {
        await api.post("/admin/coupons/create", payload)
        toast({ title: "Success", description: "Coupon created successfully" })
      }
      setIsDialogOpen(false)
      fetchCoupons()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save coupon",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await api.delete(`/admin/coupons/${deleteId}`)
      toast({ title: "Success", description: "Coupon deleted successfully" })
      fetchCoupons()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCoupon ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="value">{formData.type === "percentage" ? "Percentage (%)" : "Amount ($)"}</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
                  required
                />
              </div>
              {formData.type === "percentage" && (
                <div>
                  <Label htmlFor="max_discount">Max Discount ($)</Label>
                  <Input
                    id="max_discount"
                    type="number"
                    step="0.01"
                    value={formData.max_discount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, max_discount: e.target.value }))}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="min_order_amount">Min Order Amount ($)</Label>
                <Input
                  id="min_order_amount"
                  type="number"
                  step="0.01"
                  value={formData.min_order_amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, min_order_amount: e.target.value }))}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingCoupon ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
      ) : (
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <Card key={coupon.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-xl font-bold">{coupon.code}</h3>
                      {coupon.is_active ? (
                        <span className="rounded-full bg-green-500 px-2 py-1 text-xs text-white">Active</span>
                      ) : (
                        <span className="rounded-full bg-gray-500 px-2 py-1 text-xs text-white">Inactive</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {coupon.type === "percentage" ? `${coupon.value}% off` : `$${coupon.value} off`}
                      {coupon.max_discount && ` (max $${coupon.max_discount})`}
                    </p>
                    <p className="text-sm text-muted-foreground">Min order: ${coupon.min_order_amount}</p>
                    <p className="text-sm text-muted-foreground">
                      Used: {coupon.used_count}
                      {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="bg-transparent" onClick={() => handleOpenDialog(coupon)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="text-destructive bg-transparent"
                      onClick={() => setDeleteId(coupon.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the coupon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
