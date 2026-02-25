import {
  Heart,
  Users,
  Star,
  Trophy,
  MessageCircle,
  Camera,
  MapPin,
  Clock,
  Plus,
  ThumbsUp,
  Share2,
  Bookmark,
  Calendar,
  Award,
  TrendingUp,
  Coffee,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-heading font-bold text-gray-900 mb-4">
            Welcome to the <span className="text-vibrant-gradient">Foodie Community</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with fellow food lovers, share your discoveries, and be part of the street food revolution!
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 text-white" asChild>
              <Link href="/signup">
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">
                <Heart className="w-5 h-5 mr-2" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-morphism-vibrant p-6 rounded-xl text-center hover-lift-vibrant">
            <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">50K+</div>
            <div className="text-sm text-gray-600">Active Members</div>
          </div>
          <div className="glass-morphism-vibrant p-6 rounded-xl text-center hover-lift-vibrant">
            <Camera className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">25K+</div>
            <div className="text-sm text-gray-600">Food Photos</div>
          </div>
          <div className="glass-morphism-vibrant p-6 rounded-xl text-center hover-lift-vibrant">
            <Star className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">100K+</div>
            <div className="text-sm text-gray-600">Reviews</div>
          </div>
          <div className="glass-morphism-vibrant p-6 rounded-xl text-center hover-lift-vibrant">
            <MapPin className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">500+</div>
            <div className="text-sm text-gray-600">Stalls Discovered</div>
          </div>
        </div>

        {/* Community Tabs */}
        <Tabs defaultValue="discussions" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="places">Food Places</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-heading font-bold text-gray-900">Community Discussions</h2>
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Start Discussion
              </Button>
            </div>

            <div className="grid gap-6">
              {[
                {
                  title: "Best Late Night Street Food Spots?",
                  author: "FoodieNinja",
                  replies: 23,
                  likes: 45,
                  time: "2 hours ago",
                  category: "Recommendations",
                  trending: true,
                },
                {
                  title: "Vegetarian Street Food Hidden Gems",
                  author: "VeggieLover",
                  replies: 18,
                  likes: 32,
                  time: "4 hours ago",
                  category: "Vegetarian",
                  trending: false,
                },
                {
                  title: "Food Truck Festival This Weekend!",
                  author: "EventMaster",
                  replies: 67,
                  likes: 89,
                  time: "6 hours ago",
                  category: "Events",
                  trending: true,
                },
              ].map((discussion, index) => (
                <div key={index} className="glass-morphism-vibrant p-6 rounded-xl hover-lift-vibrant">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-600 cursor-pointer">
                          {discussion.title}
                        </h3>
                        {discussion.trending && (
                          <Badge className="bg-red-100 text-red-700">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          by <strong>{discussion.author}</strong>
                        </span>
                        <Badge variant="outline">{discussion.category}</Badge>
                        <span>{discussion.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <button className="flex items-center gap-1 hover:text-orange-600">
                      <MessageCircle className="w-4 h-4" />
                      {discussion.replies} replies
                    </button>
                    <button className="flex items-center gap-1 hover:text-pink-600">
                      <ThumbsUp className="w-4 h-4" />
                      {discussion.likes} likes
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-600">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-600">
                      <Bookmark className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-heading font-bold text-gray-900">Food Challenges</h2>
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <Trophy className="w-4 h-4 mr-2" />
                Create Challenge
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "30-Day Street Food Explorer",
                  description: "Try street food from 30 different vendors this month",
                  participants: 234,
                  prize: "Foodie Badge + $50 Gift Card",
                  deadline: "15 days left",
                  difficulty: "Medium",
                },
                {
                  title: "Spicy Food Challenge",
                  description: "Rate the spiciest dishes in your city",
                  participants: 89,
                  prize: "Spice Master Badge",
                  deadline: "7 days left",
                  difficulty: "Hard",
                },
                {
                  title: "Photo Perfect",
                  description: "Share your most Instagram-worthy food photos",
                  participants: 456,
                  prize: "Photography Badge + Feature",
                  deadline: "22 days left",
                  difficulty: "Easy",
                },
              ].map((challenge, index) => (
                <div key={index} className="glass-morphism-vibrant p-6 rounded-xl hover-lift-vibrant">
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                    <Badge
                      variant={
                        challenge.difficulty === "Easy"
                          ? "default"
                          : challenge.difficulty === "Medium"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{challenge.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Participants: <strong>{challenge.participants}</strong>
                      </span>
                      <span className="text-orange-600 font-semibold">{challenge.deadline}</span>
                    </div>
                    <div className="text-sm text-green-600">
                      <Award className="w-4 h-4 inline mr-1" />
                      Prize: {challenge.prize}
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                    Join Challenge
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Food Places Tab */}
          <TabsContent value="places" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-heading font-bold text-gray-900">Discover Food Places</h2>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Share New Place
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Seoul Street Kitchen",
                  location: "Downtown Food District",
                  cuisine: "Korean Street Food",
                  rating: 4.8,
                  reviews: 156,
                  distance: "0.3 miles",
                  specialty: "Korean Corn Dogs",
                  image: "/placeholder.svg?height=200&width=300",
                  sharedBy: "KoreanFoodLover",
                },
                {
                  name: "Taco Libre Cart",
                  location: "Central Park Area",
                  cuisine: "Mexican Street Food",
                  rating: 4.9,
                  reviews: 203,
                  distance: "0.7 miles",
                  specialty: "Authentic Street Tacos",
                  image: "/placeholder.svg?height=200&width=300",
                  sharedBy: "TacoMaster",
                },
                {
                  name: "Bangkok Bites",
                  location: "Night Market Square",
                  cuisine: "Thai Street Food",
                  rating: 4.7,
                  reviews: 89,
                  distance: "1.2 miles",
                  specialty: "Pad Thai & Mango Sticky Rice",
                  image: "/placeholder.svg?height=200&width=300",
                  sharedBy: "ThaiStreetFood",
                },
                {
                  name: "Mumbai Chaat Corner",
                  location: "Spice Street",
                  cuisine: "Indian Street Food",
                  rating: 4.6,
                  reviews: 134,
                  distance: "0.9 miles",
                  specialty: "Pani Puri & Bhel Puri",
                  image: "/placeholder.svg?height=200&width=300",
                  sharedBy: "SpiceLover",
                },
                {
                  name: "Ramen Alley Stand",
                  location: "University District",
                  cuisine: "Japanese Street Food",
                  rating: 4.8,
                  reviews: 167,
                  distance: "1.5 miles",
                  specialty: "Tonkotsu Ramen",
                  image: "/placeholder.svg?height=200&width=300",
                  sharedBy: "RamenHunter",
                },
                {
                  name: "Falafel Express",
                  location: "Market Street",
                  cuisine: "Middle Eastern",
                  rating: 4.5,
                  reviews: 92,
                  distance: "0.6 miles",
                  specialty: "Fresh Falafel Wraps",
                  image: "/placeholder.svg?height=200&width=300",
                  sharedBy: "MediterraneanFan",
                },
              ].map((place, index) => (
                <div key={index} className="glass-morphism-vibrant rounded-xl overflow-hidden hover-lift-vibrant">
                  <img src={place.image || "/placeholder.svg"} alt={place.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{place.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {place.location}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{place.cuisine}</Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{place.rating}</span>
                        <span className="text-gray-500">({place.reviews})</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <p className="font-medium text-orange-600">{place.specialty}</p>
                      <p className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {place.distance} away
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Shared by <strong>{place.sharedBy}</strong>
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MapPin className="w-3 h-3 mr-1" />
                          Directions
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                          Visit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Place Section */}
            <div className="glass-morphism-vibrant p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-500" />
                Found a Hidden Gem?
              </h3>
              <p className="text-gray-600 mb-4">
                Help the community discover amazing street food places! Share your favorite spots and help fellow
                foodies find their next great meal.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                  <MapPin className="w-4 h-4 mr-2" />
                  Add Food Stall
                </Button>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photos
                </Button>
                <Button variant="outline">
                  <Star className="w-4 h-4 mr-2" />
                  Write Review
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-heading font-bold text-gray-900">Upcoming Events</h2>
              <Button className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>

            <div className="grid gap-6">
              {[
                {
                  title: "Downtown Food Truck Festival",
                  date: "March 15, 2024",
                  time: "11:00 AM - 8:00 PM",
                  location: "Central Park",
                  attendees: 234,
                  description: "Join us for the biggest food truck gathering of the year!",
                  type: "Festival",
                },
                {
                  title: "Street Food Photography Workshop",
                  date: "March 20, 2024",
                  time: "2:00 PM - 5:00 PM",
                  location: "Community Center",
                  attendees: 45,
                  description: "Learn to capture the perfect food photos with professional tips.",
                  type: "Workshop",
                },
                {
                  title: "Spicy Food Challenge Meetup",
                  date: "March 25, 2024",
                  time: "6:00 PM - 9:00 PM",
                  location: "Hot Spot Restaurant",
                  attendees: 67,
                  description: "Test your spice tolerance with fellow heat seekers!",
                  type: "Meetup",
                },
              ].map((event, index) => (
                <div key={index} className="glass-morphism-vibrant p-6 rounded-xl hover-lift-vibrant">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <Badge className="bg-blue-100 text-blue-700">{event.type}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      <Users className="w-4 h-4 inline mr-1" />
                      {event.attendees} attending
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4 mr-1" />
                        Interested
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                        Join Event
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Community Guidelines */}
        <div className="mt-12 glass-morphism-vibrant p-8 rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <Coffee className="w-6 h-6 text-orange-500" />
            <h3 className="text-2xl font-heading font-bold text-gray-900">Community Guidelines</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Community Values</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Be respectful and inclusive to all members</li>
                <li>• Share authentic reviews and experiences</li>
                <li>• Support local street food vendors</li>
                <li>• Help others discover amazing food</li>
                <li>• Keep discussions food-focused and positive</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Content Standards</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Use appropriate language and imagery</li>
                <li>• No spam or promotional content</li>
                <li>• Credit original content creators</li>
                <li>• Report inappropriate behavior</li>
                <li>• Follow local laws and regulations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
