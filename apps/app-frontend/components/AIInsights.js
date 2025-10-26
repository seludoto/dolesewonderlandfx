import { motion } from 'framer-motion'
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

const mockInsights = [
  {
    id: 1,
    type: 'signal',
    title: 'Strong Buy Signal',
    symbol: 'EUR/USD',
    content: 'AI detected bullish momentum with 78% confidence. Key support at 1.0820 holding strong.',
    confidence: 78,
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    action: 'BUY',
    price: 1.0847,
    target: 1.0920,
    stopLoss: 1.0800
  },
  {
    id: 2,
    type: 'analysis',
    title: 'Market Sentiment Analysis',
    symbol: 'GBP/USD',
    content: 'Bearish sentiment increasing due to UK economic data. Consider reducing long positions.',
    confidence: 65,
    timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
    sentiment: 'bearish'
  },
  {
    id: 3,
    type: 'alert',
    title: 'Volatility Alert',
    symbol: 'USD/JPY',
    content: 'High volatility expected around 14:00 GMT due to FOMC minutes release.',
    confidence: 82,
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    severity: 'high'
  },
  {
    id: 4,
    type: 'opportunity',
    title: 'Scalping Opportunity',
    symbol: 'AUD/USD',
    content: 'Short-term scalping opportunity identified. Quick 5-10 pip moves expected.',
    confidence: 71,
    timestamp: new Date(Date.now() - 38 * 60 * 1000), // 38 minutes ago
    timeframe: '5m',
    potential: '8-12 pips'
  }
]

export default function AIInsights() {
  const [insights, setInsights] = useState(mockInsights)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshInsights = async () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setInsights(prev => [
        {
          id: Date.now(),
          type: 'signal',
          title: 'New AI Signal',
          symbol: 'USD/CHF',
          content: 'Fresh bullish signal detected with strong momentum indicators.',
          confidence: Math.floor(Math.random() * 30) + 70,
          timestamp: new Date(),
          action: 'BUY',
          price: 0.9134,
          target: 0.9180,
          stopLoss: 0.9100
        },
        ...prev.slice(0, 3)
      ])
      setIsRefreshing(false)
    }, 1500)
  }

  const getInsightIcon = (type) => {
    switch (type) {
      case 'signal':
        return <TrendingUp className="w-5 h-5 text-blue-500" />
      case 'analysis':
        return <Brain className="w-5 h-5 text-purple-500" />
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case 'opportunity':
        return <Lightbulb className="w-5 h-5 text-green-500" />
      default:
        return <Brain className="w-5 h-5 text-gray-500" />
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50'
    if (confidence >= 70) return 'text-blue-600 bg-blue-50'
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Trading Insights</h2>
              <p className="text-sm text-gray-600">Real-time market analysis & signals</p>
            </div>
          </div>

          <button
            onClick={refreshInsights}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getInsightIcon(insight.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">{insight.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {insight.symbol}
                    </span>
                  </div>

                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                    {insight.confidence}% confidence
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{insight.content}</p>

                {/* Additional details based on insight type */}
                {insight.type === 'signal' && (
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Entry</div>
                      <div className="font-semibold text-gray-900">{insight.price}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Target</div>
                      <div className="font-semibold text-green-600">{insight.target}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Stop Loss</div>
                      <div className="font-semibold text-red-600">{insight.stopLoss}</div>
                    </div>
                  </div>
                )}

                {insight.type === 'opportunity' && (
                  <div className="flex items-center space-x-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-600">Timeframe:</span>
                      <span className="ml-1 font-medium">{insight.timeframe}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Potential:</span>
                      <span className="ml-1 font-medium text-green-600">{insight.potential}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {formatTime(insight.timestamp)}
                  </div>

                  {insight.action && (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      insight.action === 'BUY'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {insight.action}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <button className="w-full text-center text-primary-600 hover:text-primary-700 font-medium">
          Load More Insights →
        </button>
      </div>
    </motion.div>
  )
}