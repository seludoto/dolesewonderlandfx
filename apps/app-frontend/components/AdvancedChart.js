import { useEffect, useRef, useState } from 'react'
import { createChart, LineSeries, CandlestickSeries, AreaSeries } from 'lightweight-charts'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Clock, Settings } from 'lucide-react'

const timeframes = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1H', value: '1H' },
  { label: '4H', value: '4H' },
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' }
]

const chartTypes = [
  { label: 'Candlestick', value: 'candlestick', icon: BarChart3 },
  { label: 'Line', value: 'line', icon: TrendingUp },
  { label: 'Area', value: 'area', icon: TrendingUp }
]

const indicators = [
  { label: 'SMA 20', value: 'sma20', active: false },
  { label: 'SMA 50', value: 'sma50', active: false },
  { label: 'RSI', value: 'rsi', active: false },
  { label: 'MACD', value: 'macd', active: false },
  { label: 'Bollinger Bands', value: 'bb', active: false }
]

export default function AdvancedChart({ symbol = 'EUR/USD' }) {
  const chartContainerRef = useRef()
  const chartRef = useRef()
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H')
  const [selectedChartType, setSelectedChartType] = useState('candlestick')
  const [activeIndicators, setActiveIndicators] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for different timeframes
  const generateMockData = (timeframe) => {
    const baseData = [
      { time: '2024-01-01', open: 1.0800, high: 1.0850, low: 1.0780, close: 1.0820 },
      { time: '2024-01-02', open: 1.0820, high: 1.0870, low: 1.0800, close: 1.0840 },
      { time: '2024-01-03', open: 1.0840, high: 1.0890, low: 1.0820, close: 1.0860 },
      { time: '2024-01-04', open: 1.0860, high: 1.0910, low: 1.0840, close: 1.0880 },
      { time: '2024-01-05', open: 1.0880, high: 1.0930, low: 1.0860, close: 1.0900 },
      { time: '2024-01-06', open: 1.0900, high: 1.0920, low: 1.0880, close: 1.0890 },
      { time: '2024-01-07', open: 1.0890, high: 1.0940, low: 1.0870, close: 1.0910 },
      { time: '2024-01-08', open: 1.0910, high: 1.0960, low: 1.0890, close: 1.0930 },
      { time: '2024-01-09', open: 1.0930, high: 1.0980, low: 1.0910, close: 1.0950 },
      { time: '2024-01-10', open: 1.0950, high: 1.0970, low: 1.0930, close: 1.0940 }
    ]

    // Add some variation based on timeframe
    return baseData.map(item => ({
      ...item,
      close: item.close + (Math.random() - 0.5) * 0.01
    }))
  }

  useEffect(() => {
    if (!chartContainerRef.current) return

    setIsLoading(true)

    // Cleanup previous chart
    if (chartRef.current) {
      chartRef.current.remove()
    }

    try {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 500,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: '#e0e0e0',
        },
        rightPriceScale: {
          borderColor: '#e0e0e0',
        },
        crosshair: {
          mode: 1,
        },
      })

      chartRef.current = chart

      const data = generateMockData(selectedTimeframe)

      let series
      switch (selectedChartType) {
        case 'line':
          series = chart.addSeries(LineSeries, {
            color: '#2563eb',
            lineWidth: 2,
          })
          series.setData(data.map(d => ({ time: d.time, value: d.close })))
          break
        case 'area':
          series = chart.addSeries(AreaSeries, {
            topColor: 'rgba(37, 99, 235, 0.56)',
            bottomColor: 'rgba(37, 99, 235, 0.04)',
            lineColor: '#2563eb',
            lineWidth: 2,
          })
          series.setData(data.map(d => ({ time: d.time, value: d.close })))
          break
        default: // candlestick
          series = chart.addSeries(CandlestickSeries, {
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
          })
          series.setData(data)
      }

      // Add indicators
      activeIndicators.forEach(indicator => {
        if (indicator === 'sma20') {
          const smaSeries = chart.addSeries(LineSeries, {
            color: '#f59e0b',
            lineWidth: 1,
            title: 'SMA 20',
          })
          smaSeries.setData(data.map((d, i) => ({
            time: d.time,
            value: data.slice(Math.max(0, i - 19), i + 1).reduce((sum, item) => sum + item.close, 0) /
                   Math.min(20, i + 1)
          })))
        }
      })

      chart.timeScale().fitContent()
      setIsLoading(false)

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth
          })
        }
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        chart.remove()
      }
    } catch (error) {
      console.error('Error creating chart:', error)
      setIsLoading(false)
    }
  }, [selectedTimeframe, selectedChartType, activeIndicators])

  const toggleIndicator = (indicator) => {
    setActiveIndicators(prev =>
      prev.includes(indicator)
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      {/* Chart Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">{symbol} Chart</h2>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Live Data</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Last: </span>
            <span className="text-lg font-bold text-gray-900">1.0940</span>
            <span className="text-sm text-green-600 font-medium">+0.32%</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Timeframes */}
          <div className="flex items-center space-x-1">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setSelectedTimeframe(tf.value)}
                className={`px-3 py-1 text-sm font-medium rounded ${
                  selectedTimeframe === tf.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Chart Types */}
          <div className="flex items-center space-x-1 border-l border-gray-300 pl-4">
            {chartTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedChartType(type.value)}
                className={`p-2 rounded ${
                  selectedChartType === type.value
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={type.label}
              >
                <type.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex items-center space-x-1 border-l border-gray-300 pl-4">
            <Settings className="w-4 h-4 text-gray-500" />
            {indicators.slice(0, 3).map((indicator) => (
              <button
                key={indicator.value}
                onClick={() => toggleIndicator(indicator.value)}
                className={`px-2 py-1 text-xs font-medium rounded ${
                  activeIndicators.includes(indicator.value)
                    ? 'bg-secondary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {indicator.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}
        <div ref={chartContainerRef} className="w-full" />
      </div>

      {/* Chart Footer - Additional Info */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Open:</span>
            <span className="ml-2 font-medium">1.0950</span>
          </div>
          <div>
            <span className="text-gray-600">High:</span>
            <span className="ml-2 font-medium text-green-600">1.0980</span>
          </div>
          <div>
            <span className="text-gray-600">Low:</span>
            <span className="ml-2 font-medium text-red-600">1.0930</span>
          </div>
          <div>
            <span className="text-gray-600">Volume:</span>
            <span className="ml-2 font-medium">245.8K</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}