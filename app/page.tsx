export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🚀 TrimFlow
        </h1>
        <p className="text-gray-600 mb-6">
          Barber Appointment SaaS Platform
        </p>
        <div className="space-y-4">
          <a 
            href="/auth/signin?signup=1" 
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
          <p className="text-sm text-gray-500">
            Built with Next.js 14, Neon PostgreSQL, and NextAuth.js
          </p>
        </div>
      </div>
    </div>
  )
}
