"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Clock, Star, Utensils, Heart, Zap, LogIn, UserPlus, Shield, Store } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection3D() {
  const scrollToStalls = () => {
    console.log("[v0] Scrolling to stalls section")
    const stallsSection = document.querySelector("section:nth-of-type(2)")
    if (stallsSection) {
      stallsSection.scrollIntoView({ behavior: "smooth" })
    } else {
      window.location.href = "/stalls"
    }
  }

  const handleSmartDiscovery = () => {
    console.log("[v0] Smart Discovery clicked")
    scrollToStalls()
  }

  const handleLiveQueue = () => {
    console.log("[v0] Live Queue clicked")
    window.location.href = "/map"
  }

  const handleFoodMap = () => {
    console.log("[v0] Food Map clicked")
    window.location.href = "/map"
  }

  const handleInstantReviews = () => {
    console.log("[v0] Instant Reviews clicked")
    window.location.href = "/reviews"
  }

  return (
    <section className="relative min-h-screen vibrant-gradient-bg overflow-hidden">
      {/* Street Art Pattern Background */}
      <div className="absolute inset-0 street-art-pattern"></div>

      <div className="absolute top-6 right-6 z-20">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-3"
        >
          <Button
            variant="outline"
            size="sm"
            className="glass-morphism-vibrant border-orange-300 text-orange-700 hover:bg-orange-50 font-semibold bg-transparent"
            asChild
          >
            <Link href="/login">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Link>
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold shadow-lg"
            asChild
          >
            <Link href="/signup">
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Heading with vibrant gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-heading font-bold text-gray-900 mb-6 leading-tight"
          >
            Savor the Streets:
            <span className="text-vibrant-gradient block mt-2">Discover Your Next Favorite Bite!</span>
          </motion.h1>

          {/* Enhanced Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl font-body text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Explore vibrant flavors and hidden gems in your city with real-time queues and a community of fellow food
            adventurers!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <button
              onClick={handleSmartDiscovery}
              className="flex items-center gap-3 glass-morphism-vibrant px-8 py-4 rounded-full shadow-xl hover-lift-vibrant cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <Search className="w-6 h-6 text-orange-600" />
              <span className="text-base font-semibold font-body text-gray-800">Smart Discovery</span>
            </button>
            <button
              onClick={handleLiveQueue}
              className="flex items-center gap-3 glass-morphism-vibrant px-8 py-4 rounded-full shadow-xl hover-lift-vibrant cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <Clock className="w-6 h-6 text-green-600" />
              <span className="text-base font-semibold font-body text-gray-800">Live Queue Times</span>
            </button>
            <button
              onClick={handleFoodMap}
              className="flex items-center gap-3 glass-morphism-vibrant px-8 py-4 rounded-full shadow-xl hover-lift-vibrant cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <MapPin className="w-6 h-6 text-pink-600" />
              <span className="text-base font-semibold font-body text-gray-800">Food Map</span>
            </button>
            <button
              onClick={handleInstantReviews}
              className="flex items-center gap-3 glass-morphism-vibrant px-8 py-4 rounded-full shadow-xl hover-lift-vibrant cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <Zap className="w-6 h-6 text-yellow-600" />
              <span className="text-base font-semibold font-body text-gray-800">Instant Reviews</span>
            </button>
          </motion.div>

          {/* Enhanced CTA Buttons with vibrant styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16"
          >
            <Button
              size="lg"
              onClick={scrollToStalls}
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-green-500 hover:from-orange-600 hover:via-pink-600 hover:to-green-600 text-white px-12 py-6 text-xl font-heading font-bold shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 rounded-2xl glow-vibrant"
            >
              <Search className="w-7 h-7 mr-4" />
              Find Food Near You
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-3 border-orange-500 text-orange-700 hover:bg-orange-50 px-12 py-6 text-xl font-heading font-bold shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 glass-morphism-vibrant rounded-2xl bg-transparent hover-glow-food"
              asChild
            >
              <Link href="/community">
                <Heart className="w-7 h-7 mr-4" />
                Join the Foodie Community
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-heading font-bold text-gray-800 mb-6">Join Our Community</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="outline"
                size="lg"
                className="glass-morphism-vibrant border-2 border-blue-400 text-blue-700 hover:bg-blue-50 px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent"
                asChild
              >
                <Link href="/admin/login">
                  <Shield className="w-5 h-5 mr-3" />
                  Admin Portal
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="glass-morphism-vibrant border-2 border-purple-400 text-purple-700 hover:bg-purple-50 px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent"
                asChild
              >
                <Link href="/owner/login">
                  <Store className="w-5 h-5 mr-3" />
                  Stall Owner Login
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="glass-morphism-vibrant border-2 border-green-400 text-green-700 hover:bg-green-50 px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent"
                asChild
              >
                <Link href="/login">
                  <LogIn className="w-5 h-5 mr-3" />
                  Customer Login
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Enhanced Stats Grid with vibrant colors - removed floating animations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t-2 border-orange-200/50"
          >
            <div className="text-center glass-morphism-vibrant p-8 rounded-2xl shadow-2xl hover-lift-vibrant">
              <div className="text-5xl font-heading font-bold text-orange-600 mb-3">500+</div>
              <div className="text-base font-body font-semibold text-gray-700">Amazing Stalls</div>
              <Utensils className="w-8 h-8 text-orange-500 mx-auto mt-3" />
            </div>
            <div className="text-center glass-morphism-vibrant p-8 rounded-2xl shadow-2xl hover-lift-vibrant">
              <div className="text-5xl font-heading font-bold text-pink-600 mb-3">50K+</div>
              <div className="text-base font-body font-semibold text-gray-700">Happy Foodies</div>
              <Heart className="w-8 h-8 text-pink-500 mx-auto mt-3" />
            </div>
            <div className="text-center glass-morphism-vibrant p-8 rounded-2xl shadow-2xl hover-light-vibrant">
              <div className="text-5xl font-heading font-bold text-green-600 mb-3">25+</div>
              <div className="text-base font-body font-semibold text-gray-700">Food Cities</div>
              <MapPin className="w-8 h-8 text-green-500 mx-auto mt-3" />
            </div>
            <div className="text-center glass-morphism-vibrant p-8 rounded-2xl shadow-2xl hover-lift-vibrant">
              <div className="text-5xl font-heading font-bold text-yellow-600 mb-3">4.8★</div>
              <div className="text-base font-body font-semibold text-gray-700">Taste Score</div>
              <Star className="w-8 h-8 text-yellow-500 mx-auto mt-3" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
