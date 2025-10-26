import Head from 'next/head'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>dolesewonderlandfx - Forex Education & AI Insights</title>
        <meta name="description" content="Learn forex trading with AI-powered daily market insights, structured courses, and hands-on practice." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to dolesewonderlandfx</h1>
          <p className="text-xl md:text-2xl mb-8">Master Forex Trading with AI-Powered Insights & Structured Courses</p>
          <a href="#features" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">Get Started</a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Daily AI Market Insights</h3>
              <p>Get automated daily summaries of major pairs, key events, and trade ideas powered by AI.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Structured Courses</h3>
              <p>From beginner to advanced: learn forex basics, technical analysis, risk management, and more.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Hands-On Practice</h3>
              <p>Paper trading simulator, backtesting lab, and trade journal to practice and track performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 dolesewonderlandfx. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}