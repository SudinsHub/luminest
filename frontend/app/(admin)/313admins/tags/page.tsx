"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api/axios"
import { Plus, Pencil, Trash2, Tag as TagIcon } from "lucide-react"
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

import type { Tag, ProductTag } from "@/lib/types"


// Admin Tag Management Page
// Two clear sections: Tags (CRUD) and Products with Tags (assign/remove)

export default function AdminTagManagementPage() {
  const { toast } = useToast()
  
  interface Product {
    id: string;
    title: string;
    stock_quantity: number;
    tags?: string[];
  }

// Then use them:
const [tags, setTags] = useState<Tag[]>([])
const [products, setProducts] = useState<Product[]>([])
const [editingTag, setEditingTag] = useState<Tag | null>(null)
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
const [productTags, setProductTags] = useState<ProductTag[]>([])

  const [tagsLoading, setTagsLoading] = useState(true)
  const [tagDialogOpen, setTagDialogOpen] = useState(false)
  const [tagForm, setTagForm] = useState<Tag>({tag_name : ""})
  const [deleteTagName, setDeleteTagName] = useState<String | null>(null)

  // products state (for product-tag management)

  const [productsLoading, setProductsLoading] = useState(true)

  const [addTagToProductName, setAddTagToProductName] = useState("")
  const [addTagDialogOpen, setAddTagDialogOpen] = useState(false)
  const [deleteProductTagId, setDeleteProductTagId] = useState<String | null>(null)

  // fetch tags
  const fetchTags = async () => {
    setTagsLoading(true)
    try {
      const res = await api.get("/admin/tags")
      setTags(res.data)
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: "Failed to load tags", variant: "destructive" })
    } finally {
      setTagsLoading(false)
    }
  }

  // fetch products
  const fetchProducts = async () => {
    setProductsLoading(true)
    try {
      const res = await api.get("/admin/products")
      setProducts(res.data)
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: "Failed to load products", variant: "destructive" })
    } finally {
      setProductsLoading(false)
    }
  }

  // fetch product tags for selected product
  const fetchProductTags = async (productId : string) => {
    if (!productId) return
    try {
      const res = await api.get(`/admin/products/${productId}/tags`)
      setProductTags(res.data)
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: "Failed to load product tags", variant: "destructive" })
    }
  }

  useEffect(() => {
    fetchTags()
    fetchProducts()
  }, [])

  // tag CRUD handlers
    const openCreateTag = () => {
      setEditingTag(null)
      setTagForm({ tag_name: "" })
      setTagDialogOpen(true)
    }
  
    const openEditTag = (tag : Tag) => {
      setEditingTag(tag)
      setTagForm({ tag_name: tag.tag_name })
      setTagDialogOpen(true)
    }

  const handleTagSubmit = async (e : any) => {
    if(!tagForm.tag_name) return;
    e.preventDefault()
    try {
      if (editingTag) {
        await api.put("/admin/tags", { oldTagName: editingTag.tag_name, newTagName: tagForm.tag_name })
        toast({ title: "Success", description: "Tag updated" })
      } else {
        await api.post("/admin/tags", { tagName: tagForm.tag_name })
        toast({ title: "Success", description: "Tag created" })
      }
      setTagDialogOpen(false)
      fetchTags()
      // if product selected, refresh product tags as names may have changed
      if (selectedProduct) fetchProductTags(selectedProduct.id)
    } catch (err : any) {
      console.error(err)
      toast({ title: "Error", description: err.response?.data?.message || "Failed to save tag", variant: "destructive" })
    }
  }

  const handleDeleteTag = async () => {
    if (!deleteTagName) return
    try {
      await api.delete("/admin/tags", { data: { tagName: deleteTagName } })
      toast({ title: "Success", description: "Tag deleted" })
      fetchTags()
      if (selectedProduct) fetchProductTags(selectedProduct.id)
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: "Failed to delete tag", variant: "destructive" })
    } finally {
      setDeleteTagName('')
    }
  }

  // product tag handlers
  const handleSelectProduct = (product : Product) => {
    setSelectedProduct(product)
    fetchProductTags(product.id)
  }

  const handleAddTagToProduct = async (e : any) => {
    e.preventDefault()
    if (!selectedProduct) return toast({ title: "Error", description: "Select a product first", variant: "destructive" })
    try {
      await api.post(`/admin/products/${selectedProduct.id}/tags`, { tagName: addTagToProductName })
      toast({ title: "Success", description: "Tag assigned to product" })
      setAddTagDialogOpen(false)
      setAddTagToProductName("")
      fetchProductTags(selectedProduct.id)
      fetchTags()
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: "Failed to assign tag", variant: "destructive" })
    }
  }

  const handleDeleteProductTag = async () => {
    if (!deleteProductTagId || !selectedProduct) return
    try {
      await api.delete(`/admin/products/${selectedProduct.id}/tags/${deleteProductTagId}`)
      toast({ title: "Success", description: "Tag removed from product" })
      fetchProductTags(selectedProduct.id)
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: "Failed to remove tag from product", variant: "destructive" })
    } finally {
      setDeleteProductTagId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2"><TagIcon className="h-6 w-6" /> Tag Management</h1>
      </div>

      {/* Layout: two columns on large screens, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tags CRUD - left column (1/3) */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <p className="text-sm text-muted-foreground">Create, edit or delete tags</p>
                <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openCreateTag}><Plus className="mr-2 h-4 w-4" /> New</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingTag ? "Edit Tag" : "Create Tag"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleTagSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="tagName">Tag name</Label>
                        <Input id="tagName" value={tagForm.tag_name} onChange={(e) => setTagForm({ tag_name: e.target.value })} required />
                      </div>
                      <Button type="submit" className="w-full">{editingTag ? "Update" : "Create"}</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {tagsLoading ? (
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => <div key={i} className="h-8 animate-pulse rounded bg-muted" />)}
                </div>
              ) : (
                <div className="space-y-2">
                  {tags.map((t) => (
                    <div key={t.tag_name} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{t.tag_name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => openEditTag(t)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="text-destructive" onClick={() => setDeleteTagName(t.tag_name)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delete confirmation for tag */}
          <AlertDialog open={!!deleteTagName} onOpenChange={() => setDeleteTagName(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete tag?</AlertDialogTitle>
                <AlertDialogDescription>Deleting a tag will remove it from all products.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTag}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Products with tags - right column (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Products & Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-1/3">
                  <Label>Products</Label>
                  <div className="mt-2 space-y-2 max-h-96 overflow-auto">
                    {productsLoading ? (
                      [...Array(6)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded bg-muted" />)
                    ) : (
                      products.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleSelectProduct(p)}
                          className={`w-full text-left p-3 border rounded ${selectedProduct?.id === p.id ? 'border-primary bg-muted/30' : ''}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{p.title}</div>
                              <div className="text-xs text-muted-foreground">Stock: {p.stock_quantity}</div>
                            </div>
                            <div className="text-xs">{Array.isArray(p.tags) ? p.tags.length : 0} tags</div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="w-full lg:w-2/3">
                  <Label>Selected Product</Label>
                  <div className="mt-2 p-4 border rounded min-h-[160px]">
                    {!selectedProduct ? (
                      <div className="text-sm text-muted-foreground">Select a product to manage its tags.</div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold">{selectedProduct.title}</div>
                            <div className="text-xs text-muted-foreground">Stock: {selectedProduct.stock_quantity}</div>
                          </div>
                          <div className="flex gap-2">
                            <Dialog open={addTagDialogOpen} onOpenChange={setAddTagDialogOpen}>
                              <DialogTrigger asChild>
                                <Button onClick={() => setAddTagDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Tag</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Tag to Product</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddTagToProduct} className="space-y-4">
                                  <div>
                                    <Label>Choose tag</Label>
                                    <Select onValueChange={(val) => setAddTagToProductName(val)}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {tags.map((t) => (
                                          <SelectItem key={t.tag_name} value={t.tag_name}>{t.tag_name}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <Button type="submit" className="w-full">Assign</Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-2">Assigned tags</div>
                          <div className="flex flex-wrap gap-2">
                            {productTags.length === 0 ? (
                              <div className="text-sm text-muted-foreground">No tags assigned</div>
                            ) : (
                              productTags.map((pt) => (
                                <div key={pt.id} className="flex items-center gap-2 px-3 py-1 border rounded">
                                  <span className="text-sm">{pt.tag_name}</span>
                                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteProductTagId(pt.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delete confirmation for product tag */}
          <AlertDialog open={!!deleteProductTagId} onOpenChange={() => setDeleteProductTagId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove tag from product?</AlertDialogTitle>
                <AlertDialogDescription>Removing is reversible by adding the tag again.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProductTag}>Remove</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </div>
    </div>
  )
}
