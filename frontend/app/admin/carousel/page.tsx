"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api/axios"
import type { CarouselImage } from "@/lib/types"
import { Plus, Pencil, Trash2, GripVertical, UploadIcon } from "lucide-react"
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
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/dropzone';
import Image from "next/image"

export default function AdminCarouselPage() {
  const { toast } = useToast()
  const [images, setImages] = useState<CarouselImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<CarouselImage | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    images: null as unknown as File[],
    link_url: "",
    alt_text: "",
    display_order: "",
    is_active: true,
  })

  const fetchImages = async () => {
    try {
      const response = await api.get("/admin/carousel")
      setImages(response.data)
    } catch (error) {
      console.error("Failed to fetch carousel images:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleOpenDialog = async(image?: CarouselImage) => {
    if (image) {
      setEditingImage(image)
      // get image (file) from image.image_url
      console.log(`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${image.image_url}`);
      
      const imageFile = await fetch(`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${image.image_url}`).then((res) => res.blob())
      const file = new File([imageFile], image.alt_text || "carousel-image", { type: imageFile.type })
      setFormData({
        images: [file],
        alt_text: image.alt_text || "carousel-image",
        display_order: image.display_order.toString(),
        link_url: image.link_url || "",
        is_active: image.is_active || true,
      })
    } else {
      setEditingImage(null)
      setFormData({
        images: null as unknown as File[],
        alt_text: "",
        link_url: "",
        display_order: (images.length + 1).toString(),
        is_active: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        images: formData.images,
        altText: formData.alt_text,
        displayOrder: Number.parseInt(formData.display_order),
        isActive: formData.is_active,
      }

      if (editingImage) {
        await api.put(`/admin/carousel/${editingImage.id}`, payload)
        toast({ title: "Success", description: "Carousel image updated successfully" })
      } else {
        await api.post("/admin/carousel/create", payload)
        toast({ title: "Success", description: "Carousel image created successfully" })
      }
      setIsDialogOpen(false)
      fetchImages()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save carousel image",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await api.delete(`/admin/carousel/${deleteId}`)
      toast({ title: "Success", description: "Carousel image deleted successfully" })
      fetchImages()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete carousel image",
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
        <h1 className="text-3xl font-bold">Carousel</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingImage ? "Edit Carousel Image" : "Add Carousel Image"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="link_url">Link URL</Label>
                <Input
                  id="link_url"
                  value={formData.link_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, link_url: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="alt_text">Alt Text</Label>
                <Input
                  id="alt_text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData((prev) => ({ ...prev, alt_text: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="link_url">Upload Carousel Image</Label>
                <Dropzone onDrop={handleDrop} onError={console.error} src={formData.images}>
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
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, display_order: e.target.value }))}
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
                {editingImage ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-48 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {images.map((image) => (
            <Card key={image.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <GripVertical className="h-6 w-6 flex-shrink-0 text-muted-foreground" />
                  <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${image.image_url}`}
                      alt={image.alt_text || "Carousel image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="font-semibold">Order: {image.display_order}</p>
                      {image.alt_text && <p className="text-sm text-muted-foreground">{image.alt_text}</p>}
                      {image.is_active ? (
                        <span className="mt-2 inline-block rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                          Active
                        </span>
                      ) : (
                        <span className="mt-2 inline-block rounded-full bg-gray-500 px-2 py-1 text-xs text-white">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => handleOpenDialog(image)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive bg-transparent"
                        onClick={() => setDeleteId(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
              This action cannot be undone. This will permanently delete the carousel image.
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
