"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api/axios"
import type { Category, Tag } from "@/lib/types"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useRef as useDndRef } from "react"
import { X, Upload, GripVertical } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { v4 as uuidv4 } from "uuid"

export interface ImageItem {
  id: string
  type: "existing" | "new"
  url?: string
  file?: File
  preview?: string
}

export interface SortableImageItemProps {
  item: ImageItem
  onRemove: (id: string) => void
}

function SortableImageItem({ item, onRemove }: SortableImageItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const imageUrl = item.type === "existing" ? item.url : item.preview

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg border-2 border-gray-200 overflow-hidden"
    >
      <div className="relative w-full aspect-square bg-gray-100">
        <img
          src={imageUrl}
          alt={`Product ${item.id}`}
          className="w-full h-full object-cover"
        />
        {item.type === "new" && (
          <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-lg" />
        )}
      </div>

      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 bg-gray-800/80 text-white p-2 rounded cursor-grab active:cursor-grabbing hover:bg-gray-900 transition"
        title="Drag to reorder"
      >
        <GripVertical size={16} />
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
        title="Remove image"
      >
        <X size={16} />
      </button>

      {/* New Badge */}
      {item.type === "new" && (
        <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          New
        </div>
      )}
    </div>
  )
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [images, setImages] = useState<ImageItem[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock_quantity: "",
    categoryIds: [] as string[],
    tags: [] as string[],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Drag and Drop Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, categoriesResponse, tagsResponse] = await Promise.all([
          api.get(`/admin/products/${params.id}`),
          api.get("/admin/categories"),
          api.get("/admin/tags"),
        ])

        const product = productResponse.data
        setFormData({
          title: product.title,
          description: product.description,
          price: product.price.toString(),
          stock_quantity: product.stock_quantity.toString(),
          categoryIds: product.category_ids || [],
          tags: product.tags || [],
        })

        // Convert existing images to ImageItem format
        const existingImages: ImageItem[] = (product.images || []).map(
          (url: string, index: number) => ({
            id: `existing-${index}`,
            type: "existing" as const,
            url,
          })
        )
        setImages(existingImages)

        setCategories(categoriesResponse.data)
        setTags(tagsResponse.data)
      } catch (error) {
        console.error("Failed to fetch product:", error)
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files) return

    const newImages: ImageItem[] = []
    Array.from(files).forEach((file) => {
      const preview = URL.createObjectURL(file)
      newImages.push({
        id: uuidv4(),
        type: "new",
        file,
        preview,
      })
    })

    setImages((prev) => [...prev, ...newImages])

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveImage = async (id: string) => {
    const imageItem = images.find((img) => img.id === id)
    if (!imageItem) return

    if (imageItem.type === "new") {
      // For new images, just remove from state
      if (imageItem.preview) {
        URL.revokeObjectURL(imageItem.preview)
      }
      setImages((prev) => prev.filter((img) => img.id !== id))
    } else if (imageItem.type === "existing") {
      // For existing images, call delete API and then remove from state
      try {
        await api.delete(`/admin/products/${params.id}/images`, {
          data: { imageUrl: imageItem.url },
        })
        setImages((prev) => prev.filter((img) => img.id !== id))
        toast({
          title: "Success",
          description: "Image removed successfully",
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to remove image",
          variant: "destructive",
        })
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    setImages((prev) => {
      const oldIndex = prev.findIndex((img) => img.id === active.id)
      const newIndex = prev.findIndex((img) => img.id === over.id)

      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }))
  }

  const handleTagToggle = (tagName: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter((name) => name !== tagName)
        : [...prev.tags, tagName],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setUploadProgress(0)

    try {
      // Build FormData
      const formDataObj = new FormData()

      // Add product data
      formDataObj.append("title", formData.title)
      formDataObj.append("description", formData.description)
      formDataObj.append("price", formData.price)
      formDataObj.append("stock_quantity", formData.stock_quantity)
      formDataObj.append("categoryIds", JSON.stringify(formData.categoryIds))
      formDataObj.append("tags", JSON.stringify(formData.tags))

      // Build image order with "existing:" and "new:" prefixes
      const imageOrder: string[] = []
      let newImageIndex = 0

      images.forEach((img) => {
        if (img.type === "existing") {
          imageOrder.push(`existing:${img.url}`)
        } else if (img.type === "new") {
          imageOrder.push(`new:${newImageIndex}`)
          if (img.file) {
            formDataObj.append("newImages", img.file)
          }
          newImageIndex++
        }
      })

      formDataObj.append("imageOrder", JSON.stringify(imageOrder))

      // Send request with progress tracking
      await api.put(`/admin/products/${params.id}`, formDataObj, {
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded / progressEvent.total) * 100)
            : 0
          setUploadProgress(progress)
        },
      })

      toast({
        title: "Success",
        description: "Product updated successfully",
      })

      router.push("/313admins/products")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
      setUploadProgress(0)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-12 w-64 animate-pulse rounded bg-muted" />
        <Card>
          <CardContent className="p-6">
            <div className="h-96 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="mt-2 space-y-2">
                {tags.map((tag) => (
                  <div key={tag.tag_name} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag.tag_name}
                      checked={formData.tags.includes(tag.tag_name)}
                      onCheckedChange={() => handleTagToggle(tag.tag_name)}
                    />
                    <label
                      htmlFor={tag.tag_name}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tag.tag_name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Categories</Label>
              <div className="mt-2 space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={formData.categoryIds.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                    <label htmlFor={category.id} className="text-sm font-medium leading-none">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </form>

      {/* Images Card */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image Gallery with Drag and Drop */}
          <div>
            <Label className="mb-4 block">Images</Label>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={images.map((img) => img.id)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {images.length > 0 ? (
                    images.map((item) => <SortableImageItem key={item.id} item={item} onRemove={handleRemoveImage} />)
                  ) : (
                    <div className="col-span-full py-12 text-center text-gray-500">
                      <p>No images. Add images to get started.</p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Add Images Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleAddImages}
              className="hidden"
              id="file-input"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload size={16} className="mr-2" />
              Add Images
            </Button>
          </div>

          {/* Upload Progress */}
          {isSaving && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Upload Progress</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
