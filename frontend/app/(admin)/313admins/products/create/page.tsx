"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api/axios"
import type { Category, Tag } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { useDropzone } from "react-dropzone"
import { UploadIcon, X } from "lucide-react"

export default function CreateProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock_quantity: "",
    images: [] as File[],
    categoryIds: [] as string[],
    tags: [] as string[],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/admin/categories")
        setCategories(response.data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    const fetchTags = async () => {
      try {
        const response = await api.get("/admin/tags")
        setTags(response.data)
      } catch (error) {
        console.error("Failed to fetch tags:", error)
      }
    }

    fetchCategories()
    fetchTags()
  }, [])

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview))
    }
  }, [previews])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...acceptedFiles]
    }))

    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true
  })

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
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
        ? prev.tags.filter((id) => id !== tagName)
        : [...prev.tags, tagName],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        stock_quantity: Number.parseInt(formData.stock_quantity),
        images: formData.images,
        categoryIds: formData.categoryIds,
        tags: formData.tags
      }

      const fd = new FormData()
      fd.append("title", payload.title)
      fd.append("description", payload.description)
      fd.append("price", payload.price.toString())
      fd.append("stock_quantity", payload.stock_quantity.toString())
      payload.categoryIds.map((cat) => { fd.append("categoryIds", cat) })
      payload.images.map((img) => { fd.append("images", img) })
      payload.tags.map((t) => { fd.append("tags", t) })

      await api.post("/admin/products/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast({
        title: "Success",
        description: "Product created successfully",
      })

      router.push("/313admins/products")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create product",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Product</h1>
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
              <Label>Upload Product Images</Label>
              <div
                {...getRootProps()}
                className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <UploadIcon size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {isDragActive ? 'Drop images here' : 'Upload images'}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Drag and drop or click to upload multiple images
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Previews */}
              {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {formData.images[index]?.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
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
                    <label
                      htmlFor={category.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}