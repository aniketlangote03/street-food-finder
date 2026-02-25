import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export async function uploadImage(file: File, bucket = "stall_images", path = "public"): Promise<string | null> {
  const fileName = `${path}/${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("Error uploading image:", error)
    return null
  }

  // Construct the public URL
  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return publicUrlData.publicUrl
}

export async function deleteImage(url: string, bucket = "stall_images"): Promise<boolean> {
  // Extract the path from the URL
  const pathSegments = url.split("/")
  const fileName = pathSegments[pathSegments.length - 1]
  const folderName = pathSegments[pathSegments.length - 2] // Assuming 'public' or similar

  const filePath = `${folderName}/${fileName}`

  const { error } = await supabase.storage.from(bucket).remove([filePath])

  if (error) {
    console.error("Error deleting image:", error)
    return false
  }
  return true
}
