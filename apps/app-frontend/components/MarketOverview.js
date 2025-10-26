import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Star, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'

const mockMarketData = [
  {
    symbol: 'EUR/USD',
    price: 1.0847,
    change: 0.0024,
    changePercent: 0.22,
    volume: '125.3K',
    high: 1.0872,
    low: 1.0821,
    trend: 'up'
  },
  {
    symbol: 'GBP/USD',
    price: 1.2734,
    change: -0.0031,
    changePercent: -0.24,
    volume: '89.7K',
    high: 1.2789,
    low: 1.2712,
    trend: 'down'
  },
  {
    symbol: 'USD/JPY',
    price: 157.82,
    change: 0.15,
    changePercent: 0.09,
    volume: '203.1K',
    high: 158.05,
    low: 157.45,
    trend: 'up'
  },
  {
    symbol: 'AUD/USD',
    price: 0.6578,
    change: -0.0012,
    changePercent: -0.18,
    volume: '67.4K',
    high: 0.6601,
    low: 0.6567,
    trend: 'down'
  },
  {
    symbol: 'USD/CHF',
    price: 0.9134,
    change: 0.0008,
    changePercent: 0.09,
    volume: '45.2K',
    high: 0.9147,
    low: 0.9118,
    trend: 'up'
  },
  {
    symbol: 'USD/CAD',
    price: 1.3521,
    change: 0.0045,
    changePercent: 0.33,
    volume: '78.9K',
    high: 1.3542,
    low: 1.3489,
    trend: 'up'
  }
]

export default function MarketOverview() {
  const [marketData, setMarketData] = useState(mockMarketData)
  const [watchlist, setWatchlist] = useState(['EUR/USD', 'GBP/USD'])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData =>
        prevData.map(item => ({
          ...item,
          price: item.price + (Math.random() - 0.5) * 0.001,
          change: item.change + (Math.random() - 0.5) * 0.0005,
          changePercent: item.changePercent + (Math.random() - 0.5) * 0.05
        }))
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const toggleWatchlist = (symbol) => {
    setWatchlist(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    )
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Market Overview</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All Markets →
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                High/Low
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {marketData.map((item, index) => (
              <motion.tr
                key={item.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{item.symbol}</span>
                      {watchlist.includes(item.symbol) && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {item.price.toFixed(4)}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center space-x-1 ${getChangeColor(item.change)}`}>
                    {getTrendIcon(item.trend)}
                    <span className="text-sm font-medium">
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(4)}
                    </span>
                    <span className="text-xs">
                      ({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.volume}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-500">
                    <div>H: {item.high.toFixed(4)}</div>
                    <div>L: {item.low.toFixed(4)}</div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleWatchlist(item.symbol)}
                      className={`p-1 rounded ${
                        watchlist.includes(item.symbol)
                          ? 'text-yellow-500 hover:text-yellow-600'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${watchlist.includes(item.symbol) ? 'fill-current' : ''}`} />
                    </button>
                    <button className="text-primary-600 hover:text-primary-700">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Market Summary */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">4</div>
            <div className="text-xs text-gray-500">Gainers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">2</div>
            <div className="text-xs text-gray-500">Decliners</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-600">0</div>
            <div className="text-xs text-gray-500">Unchanged</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-primary-600">485.6K</div>
            <div className="text-xs text-gray-500">Total Volume</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}