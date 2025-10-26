import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function Journal() {
  const [trades, setTrades] = useState([])
  const [newTrade, setNewTrade] = useState({ pair: '', entry: '', exit: '', profit: '' })

  useEffect(() => {
    fetch('http://localhost:8000/trades')
      .then(res => res.json())
      .then(data => setTrades(data))
      .catch(() => setTrades([]))
  }, [])

  const addTrade = async () => {
    await fetch('http://localhost:8000/trades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrade)
    })
    setTrades([...trades, { ...newTrade, id: trades.length + 1 }])
    setNewTrade({ pair: '', entry: '', exit: '', profit: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Trade Journal - dolesewonderlandfx</title>
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Trade Journal</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Trade</h2>
          <input placeholder="Pair" value={newTrade.pair} onChange={(e) => setNewTrade({...newTrade, pair: e.target.value})} className="mr-2 p-2 border" />
          <input placeholder="Entry" value={newTrade.entry} onChange={(e) => setNewTrade({...newTrade, entry: e.target.value})} className="mr-2 p-2 border" />
          <input placeholder="Exit" value={newTrade.exit} onChange={(e) => setNewTrade({...newTrade, exit: e.target.value})} className="mr-2 p-2 border" />
          <input placeholder="Profit" value={newTrade.profit} onChange={(e) => setNewTrade({...newTrade, profit: e.target.value})} className="mr-2 p-2 border" />
          <button onClick={addTrade} className="bg-blue-600 text-white px-4 py-2 rounded">Add Trade</button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Trade History</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Pair</th>
                <th className="text-left">Entry</th>
                <th className="text-left">Exit</th>
                <th className="text-left">Profit</th>
              </tr>
            </thead>
            <tbody>
              {trades.map(trade => (
                <tr key={trade.id}>
                  <td>{trade.pair}</td>
                  <td>{trade.entry}</td>
                  <td>{trade.exit}</td>
                  <td className={trade.profit > 0 ? 'text-green-600' : 'text-red-600'}>{trade.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}