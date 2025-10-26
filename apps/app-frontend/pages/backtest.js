import Head from 'next/head'
import { useState } from 'react'

export default function Backtest() {
  const [result, setResult] = useState(null)

  const runBacktest = async () => {
    const res = await fetch('http://localhost:8001/backtest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ strategy: 'mock' })
    })
    const data = await res.json()
    setResult(data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Backtesting - dolesewonderlandfx</title>
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Backtesting Lab</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <button onClick={runBacktest} className="bg-blue-600 text-white px-6 py-3 rounded mb-6">Run Backtest</button>
        {result && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <p>Total Return: {result.total_return}%</p>
            <p>Sharpe Ratio: {result.sharpe_ratio}</p>
            <p>Max Drawdown: {result.max_drawdown}%</p>
            <p>Win Rate: {result.win_rate}%</p>
          </div>
        )}
      </main>
    </div>
  )
}