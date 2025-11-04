import Head from 'next/head'
import InstructorLayout from '../components/InstructorLayout'

const indicators = [
  { name: 'Moving Average (MA)', enabled: true, period: 20 },
  { name: 'Relative Strength Index (RSI)', enabled: true, period: 14 },
  { name: 'MACD', enabled: false, period: '12,26,9' },
  { name: 'Bollinger Bands', enabled: true, period: 20 },
  { name: 'Stochastic Oscillator', enabled: false, period: '14,3,3' },
  { name: 'Fibonacci Retracement', enabled: true, period: '0.236,0.382,0.618' }
]

const timeframes = [
  { label: '1m', active: false },
  { label: '5m', active: false },
  { label: '15m', active: false },
  { label: '1H', active: true },
  { label: '4H', active: false },
  { label: '1D', active: false },
  { label: '1W', active: false }
]

const analysisTools = [
  {
    name: 'Trend Analysis',
    description: 'Identify market trends and momentum',
    icon: '📈',
    status: 'active'
  },
  {
    name: 'Support & Resistance',
    description: 'Key price levels and breakout points',
    icon: '📚',
    status: 'active'
  },
  {
    name: 'Volume Analysis',
    description: 'Trading volume patterns and insights',
    icon: '📊',
    status: 'inactive'
  },
  {
    name: 'Pattern Recognition',
    description: 'Chart patterns and formations',
    icon: '👁️',
    status: 'active'
  }
]

export default function TechnicalAnalysisPage() {
  return (
    <InstructorLayout>
      <Head>
        <title>Technical Analysis - Instructor Portal</title>
        <meta name="description" content="Advanced technical analysis tools and indicators" />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <span className="text-3xl mr-3">🥧</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Technical Analysis</h1>
              <p className="mt-1 text-sm text-gray-600">
                Advanced charting tools and technical indicators for market analysis
              </p>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="mb-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                EUR/USD Chart
              </h3>
              <div className="flex items-center space-x-2">
                {/* Timeframe Selector */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {timeframes.map((tf) => (
                    <button
                      key={tf.label}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        tf.active
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <span className="text-lg">🔄</span>
                </button>
              </div>
            </div>

            {/* Placeholder for Chart */}
            <div className="h-96 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl">🥧</span>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Interactive Chart</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Advanced charting interface with real-time data
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Indicators Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Technical Indicators
                </h3>
                <div className="space-y-4">
                  {indicators.map((indicator, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${indicator.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{indicator.name}</h4>
                          <p className="text-xs text-gray-500">Period: {indicator.period}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                          Configure
                        </button>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={indicator.enabled}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                    + Add Custom Indicator
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Tools */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Analysis Tools
                </h3>
                <div className="space-y-4">
                  {analysisTools.map((tool, index) => (
                    <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <div className={`p-2 rounded-lg mr-3 ${tool.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <span className="text-lg">{tool.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{tool.name}</h4>
                        <p className="text-xs text-gray-500">{tool.description}</p>
                      </div>
                      <button className={`text-sm font-medium ${
                        tool.status === 'active'
                          ? 'text-blue-600 hover:text-blue-500'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}>
                        {tool.status === 'active' ? 'Active' : 'Enable'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Market Insights */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Market Insights
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Trend Strength</span>
                    <div className="flex items-center">
                      <span className="text-sm mr-1">📈</span>
                      <span className="text-sm font-medium text-green-600">Strong Bullish</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Support Level</span>
                    <span className="text-sm font-medium text-gray-900">1.0850</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Resistance Level</span>
                    <span className="text-sm font-medium text-gray-900">1.0950</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Volume</span>
                    <span className="text-sm font-medium text-gray-900">High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Features */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white mr-2">
                  PRO
                </span>
                <h4 className="text-sm font-medium text-gray-900">Advanced Features</h4>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Multi-timeframe analysis</li>
                <li>• Custom indicators</li>
                <li>• Automated pattern recognition</li>
                <li>• Real-time alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </InstructorLayout>
  )
}