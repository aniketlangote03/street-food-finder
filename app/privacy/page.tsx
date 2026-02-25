export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8 text-center">Privacy Policy</h1>

        <div className="prose prose-lg mx-auto">
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p className="text-gray-600 mb-6">
            We collect information you provide directly to us, such as when you create an account, update your profile,
            or contact us for support.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p className="text-gray-600 mb-6">
            We use the information we collect to provide, maintain, and improve our services, process transactions, and
            communicate with you.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
          <p className="text-gray-600 mb-6">
            We implement appropriate security measures to protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact us through our contact page.
          </p>
        </div>
      </div>
    </div>
  )
}
