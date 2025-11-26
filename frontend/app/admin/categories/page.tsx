"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api/axios"
import type { Category } from "@/lib/types"
import { Plus, Pencil, Trash2, UploadIcon } from "lucide-react"
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
import Image from "next/image"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/dropzone';


export default function AdminCategoriesPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    images: null as unknown as File[],
  })

  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/categories")
      setCategories(response.data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleOpenDialog = async(category?: Category) => {
    if (category) {
      setEditingCategory(category)
      const imageFile = await fetch(`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${category.image_url}`).then((res) => res.blob())
      const file = new File([imageFile], "category-image", { type: imageFile.type })
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        images: [file],
      })
    } else {
      setEditingCategory(null)
      setFormData({ name: "", slug: "", description: "", images: null as unknown as File[] })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name)
      formDataToSend.append("slug", formData.slug)
      formDataToSend.append("description", formData.description)
      if (formData.images && formData.images.length > 0) {
        formDataToSend.append("images", formData.images[0]) // Assuming single image upload
      }
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, formDataToSend)
        toast({ title: "Success", description: "Category updated successfully" })
      } else {
        await api.post("/admin/categories/create", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        }
        )
        toast({ title: "Success", description: "Category created successfully" })
      }
      setIsDialogOpen(false)
      fetchCategories()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save category",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await api.delete(`/admin/categories/${deleteId}`)
      toast({ title: "Success", description: "Category deleted successfully" })
      fetchCategories()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const handleDrop = (files: File[]) => {
    setFormData((prev) => ({ ...prev, images: files }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Create Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="link_url">Upload Category Image</Label>
                <Dropzone onDrop={handleDrop} onError={console.error} src={formData.images} >
                  <DropzoneEmptyState>
                    <div className="flex w-full items-center gap-4 p-8">
                      <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <UploadIcon size={24} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">Upload a file</p>
                        <p className="text-muted-foreground text-xs">
                          Drag and drop or click to upload
                        </p>
                      </div>
                    </div>
                  </DropzoneEmptyState>
                  <DropzoneContent />
                </Dropzone>
              </div>
              <Button type="submit" className="w-full">
                {editingCategory ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-48 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-4">
                <div className="relative mb-4 h-48 overflow-hidden rounded-lg">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${category.image_url}`}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="mb-2 font-semibold text-balance">{category.name}</h3>
                <p className="mb-4 text-sm text-muted-foreground text-pretty">{category.description}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleOpenDialog(category)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive bg-transparent"
                    onClick={() => setDeleteId(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
              This action cannot be undone. This will permanently delete the category.
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
