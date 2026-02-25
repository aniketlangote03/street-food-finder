export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8 text-center">About Street Food Finder</h1>

        <div className="prose prose-lg mx-auto">
          <p className="text-xl text-gray-600 mb-6">
            Street Food Finder is your ultimate companion for discovering the best street food in your city. We connect
            food lovers with amazing local vendors, providing real-time information about queues, menus, and locations.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            To celebrate and support street food culture by making it easier for people to discover, enjoy, and share
            their favorite food experiences while helping vendors grow their businesses.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Features</h2>
          <ul className="text-gray-600 space-y-2">
            <li>• Real-time queue information</li>
            <li>• Interactive food maps</li>
            <li>• Authentic reviews and ratings</li>
            <li>• Smart discovery algorithms</li>
            <li>• Vendor management tools</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
