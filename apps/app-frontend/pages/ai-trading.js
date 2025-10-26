import Head from 'next/head'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'

export default function AITrading() {
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [symbol, setSymbol] = useState('EUR/USD')
  const [timeframe, setTimeframe] = useState('1h')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const strategies = [
    { id: 'automated_strategy', name: 'Automated Strategy Generation', description: 'AI generates complete trading strategies' },
    { id: 'portfolio_optimization', name: 'Portfolio Optimization', description: 'Optimize portfolio allocation across assets' },
    { id: 'sentiment_analysis', name: 'Sentiment Analysis', description: 'Analyze market sentiment from news and social media' },
    { id: 'pattern_recognition', name: 'Pattern Recognition', description: 'Identify chart patterns and technical signals' },
    { id: 'backtest_optimization', name: 'Backtest Optimization', description: 'Optimize strategy parameters through genetic algorithms' }
  ]

  const symbols = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AAPL', 'MSFT', 'BTC/USD', 'ETH/USD', 'XAU/USD', 'SPY'
  ]

  const timeframes = [
    { value: '5m', label: '5 Minutes' },
    { value: '15m', label: '15 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '1d', label: '1 Day' }
  ]

  const runAnalysis = async () => {
    if (!selectedStrategy) {
      toast.error('Please select a strategy')
      return
    }

    setLoading(true)
    try {
      let endpoint = ''
      let payload = {}

      switch (selectedStrategy) {
        case 'automated_strategy':
          endpoint = 'http://localhost:8003/api/v1/ai/automated-strategy'
          payload = {
            symbol: symbol,
            timeframe: timeframe,
            risk_tolerance: 'medium',
            capital: 10000
          }
          break
        case 'portfolio_optimization':
          endpoint = 'http://localhost:8003/api/v1/ai/portfolio-optimization'
          payload = {
            assets: [symbol, 'EUR/USD', 'AAPL', 'BTC/USD'],
            risk_tolerance: 'medium',
            investment_amount: 10000
          }
          break
        case 'sentiment_analysis':
          endpoint = 'http://localhost:8003/api/v1/ai/sentiment-analysis'
          payload = {
            symbol: symbol,
            sources: ['news', 'social_media'],
            timeframe: '24h'
          }
          break
        case 'pattern_recognition':
          endpoint = 'http://localhost:8003/api/v1/ai/pattern-recognition'
          payload = {
            symbol: symbol,
            timeframe: timeframe,
            lookback_periods: 100
          }
          break
        case 'backtest_optimization':
          endpoint = 'http://localhost:8003/api/v1/ai/backtest-optimization'
          payload = {
            strategy_type: 'moving_average_crossover',
            symbol: symbol,
            timeframe: timeframe,
            optimization_target: 'sharpe_ratio'
          }
          break
      }

      const response = await axios.post(endpoint, payload)
      setAnalysis(response.data)
      toast.success('AI analysis completed!')
    } catch (error) {
      console.error('AI analysis failed:', error)
      toast.error('AI analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderAnalysisResult = () => {
    if (!analysis) return null

    switch (selectedStrategy) {
      case 'automated_strategy':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generated Trading Strategy</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium">{analysis.strategy_name}</p>
              <p className="text-sm text-gray-600 mt-2">{analysis.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Expected Return</p>
                  <p className="text-lg text-green-600">{analysis.expected_return}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Risk Level</p>
                  <p className="text-lg text-yellow-600">{analysis.risk_level}</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'portfolio_optimization':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Optimized Portfolio Allocation</h3>
            <div className="space-y-2">
              {analysis.allocations?.map((allocation, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">{allocation.asset}</span>
                  <span className="text-blue-600 font-semibold">{allocation.percentage}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium">Expected Portfolio Return</p>
              <p className="text-2xl text-green-600 font-bold">{analysis.expected_return}%</p>
            </div>
          </div>
        )

      case 'sentiment_analysis':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Market Sentiment Analysis</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{analysis.sentiment_scores?.positive}%</p>
                <p className="text-sm text-gray-600">Positive</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">{analysis.sentiment_scores?.neutral}%</p>
                <p className="text-sm text-gray-600">Neutral</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{analysis.sentiment_scores?.negative}%</p>
                <p className="text-sm text-gray-600">Negative</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium">Overall Sentiment</p>
              <p className={`text-lg font-bold ${
                analysis.overall_sentiment === 'bullish' ? 'text-green-600' :
                analysis.overall_sentiment === 'bearish' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {analysis.overall_sentiment?.toUpperCase()}
              </p>
            </div>
          </div>
        )

      case 'pattern_recognition':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pattern Recognition Results</h3>
            <div className="space-y-3">
              {analysis.patterns?.map((pattern, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{pattern.name}</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      pattern.confidence > 0.8 ? 'bg-green-100 text-green-800' :
                      pattern.confidence > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {Math.round(pattern.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{pattern.description}</p>
                  <p className="text-sm mt-2">
                    <span className="font-medium">Signal:</span> {pattern.signal}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'backtest_optimization':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Backtest Optimization Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium">Best Sharpe Ratio</p>
                <p className="text-2xl font-bold text-blue-600">{analysis.best_sharpe_ratio?.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium">Best Return</p>
                <p className="text-2xl font-bold text-green-600">{analysis.best_return}%</p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Optimized Parameters</h4>
              <div className="space-y-1 text-sm">
                {analysis.optimized_parameters && Object.entries(analysis.optimized_parameters).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return <p>Analysis results will be displayed here.</p>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>AI Trading Analysis - DoleSe Wonderland FX</title>
        <meta name="description" content="Advanced AI-powered trading analysis and strategy generation" />
      </Head>

      <ToastContainer position="top-right" autoClose={3000} />

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">AI-Powered Trading Analysis</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Advanced AI Trading Tools</h2>
            <p className="text-gray-600">
              Leverage cutting-edge AI for strategy generation, portfolio optimization, and market analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Analysis Configuration */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Analysis Configuration</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">AI Strategy</label>
                  <select
                    value={selectedStrategy}
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Strategy</option>
                    {strategies.map(strategy => (
                      <option key={strategy.id} value={strategy.id}>
                        {strategy.name}
                      </option>
                    ))}
                  </select>
                  {selectedStrategy && (
                    <p className="text-xs text-gray-600 mt-1">
                      {strategies.find(s => s.id === selectedStrategy)?.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Symbol</label>
                  <select
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {symbols.map(sym => (
                      <option key={sym} value={sym}>{sym}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Timeframe</label>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {timeframes.map(tf => (
                      <option key={tf.value} value={tf.value}>{tf.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={runAnalysis}
                  disabled={loading || !selectedStrategy}
                  className={`w-full p-3 rounded font-semibold ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {loading ? 'Running AI Analysis...' : 'Run AI Analysis'}
                </button>
              </div>
            </div>

            {/* Analysis Results */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>

              {analysis ? (
                renderAnalysisResult()
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Select a strategy and run analysis to see results</p>
                </div>
              )}
            </div>
          </div>

          {/* Strategy Explanations */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">AI Strategy Explanations</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Automated Strategy Generation</h4>
                <p className="text-sm text-gray-600">
                  Uses machine learning to analyze historical data and generate complete trading strategies
                  with entry/exit rules, risk management, and performance expectations.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Portfolio Optimization</h4>
                <p className="text-sm text-gray-600">
                  Applies Modern Portfolio Theory and AI to optimize asset allocation for maximum returns
                  at acceptable risk levels.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Sentiment Analysis</h4>
                <p className="text-sm text-gray-600">
                  Analyzes news articles, social media, and market sentiment to gauge market psychology
                  and predict price movements.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Pattern Recognition</h4>
                <p className="text-sm text-gray-600">
                  Uses computer vision and deep learning to identify chart patterns, technical indicators,
                  and trading signals automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}