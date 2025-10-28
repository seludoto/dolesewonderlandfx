import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  Play,
  Settings,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react'
import { toast } from 'react-toastify'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Backtest() {
  const [strategies, setStrategies] = useState([])
  const [symbols, setSymbols] = useState([])
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL')
  const [timeframe, setTimeframe] = useState('1d')
  const [startDate, setStartDate] = useState('2020-01-01')
  const [endDate, setEndDate] = useState('2023-12-31')
  const [initialCash, setInitialCash] = useState(10000)
  const [commission, setCommission] = useState(0.001)
  const [parameters, setParameters] = useState({})
  const [optimizing, setOptimizing] = useState(false)
  const [optimizationResult, setOptimizationResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [customStrategyCode, setCustomStrategyCode] = useState('')
  const [customStrategyName, setCustomStrategyName] = useState('')
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('predefined')

  useEffect(() => {
    fetchStrategies()
    fetchSymbols()
  }, [])

  useEffect(() => {
    if (selectedStrategy) {
      const strategy = strategies.find(s => s.id === selectedStrategy)
      if (strategy) {
        const defaultParams = {}
        Object.keys(strategy.parameters).forEach(key => {
          defaultParams[key] = strategy.parameters[key].default
        })
        setParameters(defaultParams)
      }
    }
  }, [selectedStrategy])

  const handleParameterChange = (key, value) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const fetchStrategies = async () => {
    try {
      const res = await fetch('https://backtester.dolesewonderlandfx.com/strategies')
      const data = await res.json()
      setStrategies(data.strategies)
      if (data.strategies.length > 0) {
        setSelectedStrategy(data.strategies[0].id)
      }
    } catch (err) {
      setError('Failed to fetch strategies')
    }
  }

  const fetchSymbols = async () => {
    try {
      const res = await fetch('https://backtester.dolesewonderlandfx.com/symbols')
      const data = await res.json()
      setSymbols(data.symbols)
    } catch (err) {
      setError('Failed to fetch symbols')
    }
  }

  const optimizeStrategy = async () => {
    setOptimizing(true)
    setError('')
    setOptimizationResult(null)

    try {
      const requestData = {
        strategy: selectedStrategy,
        symbol: selectedSymbol,
        timeframe,
        start_date: startDate,
        end_date: endDate,
        initial_cash: initialCash,
        commission,
        param_ranges: {} // Will be populated based on strategy
      }

      const res = await fetch('https://backtester.dolesewonderlandfx.com/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()

      if (data.status === 'completed') {
        setOptimizationResult(data.result)
        toast.success('Strategy optimization completed!')
      } else {
        setError(data.error || 'Optimization failed')
      }
    } catch (err) {
      setError(err.message || 'Failed to optimize strategy')
    } finally {
      setOptimizing(false)
    }
  }

  const runBacktest = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const requestData = {
        strategy: selectedStrategy,
        symbol: selectedSymbol,
        timeframe,
        start_date: startDate,
        end_date: endDate,
        initial_cash: initialCash,
        commission,
        parameters
      }

      const res = await fetch('https://backtester.dolesewonderlandfx.com/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()

      if (data.status === 'completed') {
        setResult(data.result)
        toast.success('Backtest completed!')
      } else {
        setError(data.error || 'Backtest failed')
      }
    } catch (err) {
      setError(err.message || 'Failed to run backtest')
    } finally {
      setLoading(false)
    }
  }

  const runCustomBacktest = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const requestData = {
        strategy_code: customStrategyCode,
        strategy_name: customStrategyName || 'Custom Strategy',
        symbol: selectedSymbol,
        timeframe,
        start_date: startDate,
        end_date: endDate,
        initial_cash: initialCash,
        commission,
        parameters
      }

      const res = await fetch('https://backtester.dolesewonderlandfx.com/custom-backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()

      if (data.status === 'completed') {
        setResult(data.result)
        toast.success('Custom strategy backtest completed!')
      } else {
        setError(data.error || 'Custom backtest failed')
      }
    } catch (err) {
      setError(err.message || 'Failed to run custom backtest')
    } finally {
      setLoading(false)
    }
  }

  const equityChartData = result?.equity_curve ? {
    labels: result.equity_curve.map((_, i) => `Day ${i + 1}`),
    datasets: [{
      label: 'Portfolio Value',
      data: result.equity_curve.map(value => initialCash * (1 + value)),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.1
    }]
  } : null

  const tradesChartData = result?.trades ? {
    labels: result.trades.map((_, i) => `Trade ${i + 1}`),
    datasets: [{
      label: 'Trade P&L',
      data: result.trades.map(trade => trade.pnl),
      backgroundColor: result.trades.map(trade =>
        trade.pnl >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
      ),
      borderColor: result.trades.map(trade =>
        trade.pnl >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
      ),
      borderWidth: 1
    }]
  } : null

  const selectedStrategyData = strategies.find(s => s.id === selectedStrategy)

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Backtesting Lab - dolesewonderlandfx</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Target className="h-8 w-8 mr-3 text-blue-600" />
            Backtesting Lab
          </h1>
          <p className="mt-2 text-gray-600">
            Test and optimize trading strategies on historical market data
          </p>
        </div>

        {/* Strategy Type Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('predefined')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'predefined'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Predefined Strategies
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'custom'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Custom Strategy
              </button>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            {activeTab === 'predefined' ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Predefined Strategy
                </h2>

                {/* Strategy Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trading Strategy
                  </label>
                  <select
                    value={selectedStrategy}
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {strategies.map(strategy => (
                      <option key={strategy.id} value={strategy.id}>
                        {strategy.name}
                      </option>
                    ))}
                  </select>
                  {selectedStrategyData && (
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedStrategyData.description}
                    </p>
                  )}
                </div>

              {/* Symbol Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trading Symbol
                </label>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {symbols.map(symbol => (
                    <option key={symbol.symbol} value={symbol.symbol}>
                      {symbol.symbol} - {symbol.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timeframe */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeframe
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1d">Daily</option>
                  <option value="1h">Hourly</option>
                  <option value="30m">30 Minutes</option>
                  <option value="15m">15 Minutes</option>
                  <option value="5m">5 Minutes</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Trading Parameters */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Capital ($)
                </label>
                <input
                  type="number"
                  value={initialCash}
                  onChange={(e) => setInitialCash(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="100"
                  step="100"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission (%)
                </label>
                <input
                  type="number"
                  value={commission * 100}
                  onChange={(e) => setCommission(Number(e.target.value) / 100)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Strategy Parameters */}
              {selectedStrategyData && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Strategy Parameters</h3>
                  {Object.entries(selectedStrategyData.parameters).map(([key, config]) => (
                    <div key={key} className="mb-3">
                      <label className="block text-sm text-gray-600 mb-1 capitalize">
                        {key.replace('_', ' ')}
                      </label>
                      <input
                        type={config.type === 'int' ? 'number' : 'number'}
                        value={parameters[key] || config.default}
                        onChange={(e) => handleParameterChange(key, config.type === 'int' ? parseInt(e.target.value) : parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        min={config.min}
                        max={config.max}
                        step={config.type === 'int' ? 1 : 0.1}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Run Button */}
              <button
                onClick={runBacktest}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-3"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Running Backtest...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Run Backtest
                  </>
                )}
              </button>

              {/* Optimize Button */}
              <button
                onClick={optimizeStrategy}
                disabled={optimizing || loading}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {optimizing ? (
                  <>
                    <Zap className="h-5 w-5 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Optimize Strategy
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}
            </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Custom Strategy
                </h2>

                {/* Strategy Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Strategy Name
                  </label>
                  <input
                    type="text"
                    value={customStrategyName}
                    onChange={(e) => setCustomStrategyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="My Custom Strategy"
                  />
                </div>

                {/* Strategy Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Strategy Code (Python/Backtrader)
                  </label>
                  <textarea
                    value={customStrategyCode}
                    onChange={(e) => setCustomStrategyCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    rows="15"
                    placeholder={`import backtrader as bt

class MyStrategy(bt.Strategy):
    params = (
        ('fast_period', 10),
        ('slow_period', 30),
    )

    def __init__(self):
        self.fast_ma = bt.indicators.SimpleMovingAverage(self.data.close, period=self.params.fast_period)
        self.slow_ma = bt.indicators.SimpleMovingAverage(self.data.close, period=self.params.slow_period)
        self.crossover = bt.indicators.CrossOver(self.fast_ma, self.slow_ma)

    def next(self):
        if not self.position:
            if self.crossover > 0:
                self.buy()
        elif self.crossover < 0:
            self.sell()`}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Write a Backtrader strategy class that inherits from bt.Strategy
                  </p>
                </div>

                {/* Symbol Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trading Symbol
                  </label>
                  <select
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {symbols.map(symbol => (
                      <option key={symbol.symbol} value={symbol.symbol}>
                        {symbol.symbol} - {symbol.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Timeframe */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeframe
                  </label>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1d">Daily</option>
                    <option value="1h">Hourly</option>
                    <option value="30m">30 Minutes</option>
                    <option value="15m">15 Minutes</option>
                    <option value="5m">5 Minutes</option>
                  </select>
                </div>

                {/* Date Range */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Trading Parameters */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Capital ($)
                  </label>
                  <input
                    type="number"
                    value={initialCash}
                    onChange={(e) => setInitialCash(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="100"
                    step="100"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission (%)
                  </label>
                  <input
                    type="number"
                    value={commission * 100}
                    onChange={(e) => setCommission(Number(e.target.value) / 100)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Run Custom Backtest Button */}
                <button
                  onClick={runCustomBacktest}
                  disabled={loading || !customStrategyCode.trim()}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Running Custom Backtest...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Run Custom Backtest
                    </>
                  )}
                </button>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {optimizationResult && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-purple-600" />
                  Optimization Results
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-purple-600">{optimizationResult.optimization_score}</div>
                    <div className="text-sm text-gray-600">Best Sharpe Ratio</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">{optimizationResult.total_return}%</div>
                    <div className="text-sm text-gray-600">Optimized Return</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">{optimizationResult.total_combinations_tested}</div>
                    <div className="text-sm text-gray-600">Combinations Tested</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-indigo-600">{optimizationResult.win_rate}%</div>
                    <div className="text-sm text-gray-600">Optimized Win Rate</div>
                  </div>
                </div>

                {optimizationResult.optimized_parameters && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">Optimal Parameters</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(optimizationResult.optimized_parameters).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {result ? (
              <div className="space-y-6">
                {/* Performance Metrics */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Performance Metrics
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{result.total_return}%</div>
                      <div className="text-sm text-gray-600">Total Return</div>
                    </div>

                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{result.sharpe_ratio}</div>
                      <div className="text-sm text-gray-600">Sharpe Ratio</div>
                    </div>

                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <BarChart3 className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-600">{result.max_drawdown}%</div>
                      <div className="text-sm text-gray-600">Max Drawdown</div>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">{result.win_rate}%</div>
                      <div className="text-sm text-gray-600">Win Rate</div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Final Value:</span>
                      <span className="font-semibold ml-2">${result.final_value.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Trades:</span>
                      <span className="font-semibold ml-2">{result.total_trades}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Won/Lost:</span>
                      <span className="font-semibold ml-2">{result.won_trades}/{result.lost_trades}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg Win/Loss:</span>
                      <span className="font-semibold ml-2">${result.avg_win}/${result.avg_loss}</span>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Equity Curve */}
                  {equityChartData && (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold mb-4">Equity Curve</h3>
                      <Line
                        data={equityChartData}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { display: false },
                            title: { display: false }
                          },
                          scales: {
                            y: {
                              beginAtZero: false,
                              ticks: {
                                callback: function(value) {
                                  return '$' + value.toLocaleString()
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  )}

                  {/* Trade P&L */}
                  {tradesChartData && (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold mb-4">Trade P&L Distribution</h3>
                      <Bar
                        data={tradesChartData}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { display: false },
                            title: { display: false }
                          },
                          scales: {
                            y: {
                              ticks: {
                                callback: function(value) {
                                  return '$' + value.toLocaleString()
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Trade History */}
                {result.trades && result.trades.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Symbol
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Size
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              P&L
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.trades.slice(-10).map((trade, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {trade.symbol}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {trade.size}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${trade.price.toFixed(2)}
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                ${trade.pnl.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
                <p className="text-gray-500">
                  Configure your strategy parameters and click &quot;Run Backtest&quot; to see performance results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}