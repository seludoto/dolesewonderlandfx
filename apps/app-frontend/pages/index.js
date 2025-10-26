import Head from 'next/head'
import { useState, useEffect } from 'react'
import Chart from '../components/Chart'

export default function Dashboard() {
  const [insight, setInsight] = useState("Loading...")

  useEffect(() => {
    fetch('http://localhost:8000/daily-insight')
      .then(res => res.json())
      .then(data => setInsight(data.summary))
      .catch(() => setInsight("AI-generated summary: EUR/USD expected to rise due to economic data. Suggested trade: Buy at 1.0850, stop at 1.0800."))
  }, [])

  const generateInsight = async () => {
    const res = await fetch('http://localhost:8000/generate-insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: "Analyze EUR/USD for today" })
    })
    const data = await res.json()
    setInsight(data.insight)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard - dolesewonderlandfx</title>
        <meta name="description" content="Your personalized forex trading dashboard." />
      </Head>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">dolesewonderlandfx Dashboard</h1>
          <div>
            <a href="/login" className="text-blue-600 mr-4">Login</a>
            <a href="/backtest" className="text-blue-600 mr-4">Backtest</a>
            <a href="/journal" className="text-blue-600 mr-4">Journal</a>
            <a href="/paper-trading" className="text-blue-600">Paper Trading</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Daily Insight Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Daily Market Insight</h2>
            <p>{insight}</p>
            <button onClick={generateInsight} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Generate New Insight</button>
          </div>

          {/* Watchlist */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Watchlist</h2>
            <ul>
              <li>EUR/USD: 1.0850 (+0.5%)</li>
              <li>GBP/USD: 1.2750 (-0.2%)</li>
            </ul>
          </div>

          {/* Courses */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">My Courses</h2>
            <p>Beginner Forex Basics - 50% complete</p>
            <a href="/courses" className="text-blue-600">Continue Learning</a>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">EUR/USD Chart</h2>
          <Chart />
        </div>
      </main>
    </div>
  )
}