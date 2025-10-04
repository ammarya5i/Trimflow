export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">TrimFlow</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional barber appointment management made simple
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🚀 Deployment Ready!
          </h2>
          <p className="text-gray-600 mb-6">
            Your TrimFlow application is ready for Netlify deployment.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">✅ Optimized</h3>
              <p className="text-green-600 text-sm">Minimal dependencies for fast builds</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">⚡ Fast</h3>
              <p className="text-blue-600 text-sm">Static export configured for Netlify</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800">🎯 Ready</h3>
              <p className="text-purple-600 text-sm">All configurations in place</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Next Steps:</h3>
          <ol className="text-left max-w-md mx-auto space-y-2 text-gray-600">
            <li>1. Build: <code className="bg-gray-100 px-2 py-1 rounded">npm run build</code></li>
            <li>2. Deploy: Drag <code className="bg-gray-100 px-2 py-1 rounded">out/</code> folder to Netlify</li>
            <li>3. Configure: Add environment variables in Netlify dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  )
}