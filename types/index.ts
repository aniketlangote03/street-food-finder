export interface Stall {
  id: string
  name: string
  description: string | null
  image_url: string | null
  cuisine_type: string | null
  location_lat: number
  location_lng: number
  address: string
  opening_time: string | null
  closing_time: string | null
  average_rating: number | null
  review_count: number | null
  is_approved: boolean
  owner_id: string
  created_at: string
  updated_at: string | null
  current_queue_length?: number | null
  // Additional fields that exist in your database
  cuisine_tags?: string[]
  is_open?: boolean
  queue_length?: number
  estimated_wait?: number
  busy_level?: string
  approval_status?: string
  menu_items?: Array<{
    id: string
    name: string
    description: string | null
    price: number
    image_url: string | null
  }>
  reviews?: Array<{
    id: string
    rating: number
    comment: string | null
    created_at: string
    user_display_name?: string | null
  }>
}

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: "customer" | "stall_owner" | "admin"
  created_at?: string
  updated_at?: string
}

export interface Review {
  id: string
  stall_id: string
  user_id: string
  rating: number
  comment?: string
  created_at?: string
  updated_at?: string
}

export interface MenuItem {
  id: string
  stall_id: string
  name: string
  description?: string
  price: number
  category?: string
  image_url?: string
  is_available: boolean
  created_at?: string
  updated_at?: string
}
