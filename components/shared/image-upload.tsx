"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, UploadCloud, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ImageUploadProps {
  onUpload: (file: File) => Promise<string | null> // Returns URL or null on failure
  onDelete?: (url: string) => Promise<boolean> // Returns true on success
  currentImageUrl?: string | null
  label?: string
  disabled?: boolean
}

export function ImageUpload({
  onUpload,
  onDelete,
  currentImageUrl,
  label = "Upload Image",
  disabled,
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        toast({
          title: "No file selected",
          description: "Please select an image file to upload.",
          variant: "destructive",
        })
        return
      }

      const file = acceptedFiles[0]
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Only image files are allowed.",
          variant: "destructive",
        })
        return
      }

      setIsUploading(true)
      try {
        const url = await onUpload(file)
        if (url) {
          setPreviewUrl(url)
          toast({
            title: "Upload successful",
            description: "Your image has been uploaded.",
            variant: "default",
          })
        } else {
          toast({
            title: "Upload failed",
            description: "Could not upload image. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error: any) {
        console.error("Image upload error:", error)
        toast({
          title: "Upload error",
          description: error.message || "An unexpected error occurred during upload.",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled || isUploading || isDeleting,
  })

  const handleDelete = async () => {
    if (!previewUrl || !onDelete) return

    setIsDeleting(true)
    try {
      const success = await onDelete(previewUrl)
      if (success) {
        setPreviewUrl(null)
        toast({
          title: "Deletion successful",
          description: "Your image has been deleted.",
          variant: "default",
        })
      } else {
        toast({
          title: "Deletion failed",
          description: "Could not delete image. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Image deletion error:", error)
      toast({
        title: "Deletion error",
        description: error.message || "An unexpected error occurred during deletion.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">{label}</Label>
      {previewUrl ? (
        <div className="relative w-full h-48 rounded-md overflow-hidden border border-input">
          <Image src={previewUrl || "/placeholder.svg"} alt="Preview" layout="fill" objectFit="cover" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full h-8 w-8"
            onClick={handleDelete}
            disabled={isDeleting || disabled}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            <span className="sr-only">Remove image</span>
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-md cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-muted" : "border-input bg-background"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Input {...getInputProps()} id="image-upload" />
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            {isDragActive ? "Drop the image here..." : "Drag 'n' drop an image, or click to select"}
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
        </div>
      )}
    </div>
  )
}
