export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8 text-center">Help Center</h1>

        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-3">How to Find Stalls</h2>
            <p className="text-gray-600">
              Use our map view or browse stalls page to discover food vendors near you. Filter by cuisine type,
              location, or queue time to find exactly what you're craving.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-3">For Stall Owners</h2>
            <p className="text-gray-600">
              Register as a stall owner to manage your business profile, update menu items, and track customer
              engagement. Access your dashboard to view analytics and manage operations.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Account & Privacy</h2>
            <p className="text-gray-600">
              Learn about managing your account settings, privacy preferences, and data security. We're committed to
              protecting your information and providing a safe platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
