import Head from 'next/head'
import InstructorLayout from '../components/InstructorLayout'

const strategies = [
  {
    id: 1,
    name: 'Moving Average Crossover',
    description: 'Buy when fast MA crosses above slow MA, sell when below',
    performance: '+15.2%',
    winRate: '68%',
    trades: 245,
    status: 'completed'
  },
  {
    id: 2,
    name: 'RSI Divergence Strategy',
    description: 'Trade divergences between price and RSI indicator',
    performance: '+8.7%',
    winRate: '72%',
    trades: 189,
    status: 'running'
  },
  {
    id: 3,
    name: 'Bollinger Band Squeeze',
    description: 'Enter trades when bands squeeze and price breaks out',
    performance: '+22.1%',
    winRate: '65%',
    trades: 156,
    status: 'completed'
  }
]

const backtestResults = {
  totalReturn: '+18.5%',
  maxDrawdown: '-12.3%',
  sharpeRatio: '1.45',
  winRate: '71%',
  profitFactor: '1.89',
  totalTrades: 590,
  avgTrade: '+$127',
  bestTrade: '+$2,450',
  worstTrade: '-$890'
}

export default function BacktestingLabPage() {
  return (
    <InstructorLayout>
      <Head>
        <title>Backtesting Lab - Instructor Portal</title>
        <meta name="description" content="Advanced backtesting tools for trading strategies" />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <span className="text-3xl mr-3">🖥️</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Backtesting Lab</h1>
              <p className="mt-1 text-sm text-gray-600">
                Test and optimize your trading strategies with historical data
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-3xl mb-2">📄</span>
                <span className="text-sm font-medium text-gray-900">New Strategy</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-3xl mb-2">▶️</span>
                <span className="text-sm font-medium text-gray-900">Run Backtest</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-3xl mb-2">📊</span>
                <span className="text-sm font-medium text-gray-900">View Results</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-3xl mb-2">⚙️</span>
                <span className="text-sm font-medium text-gray-900">Optimize</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Strategy List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Your Strategies
                </h3>
                <div className="space-y-4">
                  {strategies.map((strategy) => (
                    <div key={strategy.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{strategy.name}</h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          strategy.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {strategy.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Performance:</span>
                          <span className={`ml-1 font-medium ${strategy.performance.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {strategy.performance}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Win Rate:</span>
                          <span className="ml-1 font-medium text-gray-900">{strategy.winRate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Trades:</span>
                          <span className="ml-1 font-medium text-gray-900">{strategy.trades}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                          View Details
                        </button>
                        <button className="text-sm text-gray-600 hover:text-gray-500 font-medium">
                          Edit
                        </button>
                        {strategy.status === 'running' ? (
                          <button className="text-sm text-red-600 hover:text-red-500 font-medium">
                            Stop
                          </button>
                        ) : (
                          <button className="text-sm text-green-600 hover:text-green-500 font-medium">
                            Run Again
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Backtest Results Summary */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Latest Results
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Return</span>
                    <span className="text-sm font-medium text-green-600">{backtestResults.totalReturn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Max Drawdown</span>
                    <span className="text-sm font-medium text-red-600">{backtestResults.maxDrawdown}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sharpe Ratio</span>
                    <span className="text-sm font-medium text-gray-900">{backtestResults.sharpeRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Win Rate</span>
                    <span className="text-sm font-medium text-gray-900">{backtestResults.winRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Profit Factor</span>
                    <span className="text-sm font-medium text-gray-900">{backtestResults.profitFactor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Trade Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Trades</span>
                    <span className="text-sm font-medium text-gray-900">{backtestResults.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Trade</span>
                    <span className="text-sm font-medium text-green-600">{backtestResults.avgTrade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Best Trade</span>
                    <span className="text-sm font-medium text-green-600">{backtestResults.bestTrade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Worst Trade</span>
                    <span className="text-sm font-medium text-red-600">{backtestResults.worstTrade}</span>
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
                <li>• Walk-forward optimization</li>
                <li>• Monte Carlo simulation</li>
                <li>• Risk management tools</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </InstructorLayout>
  )
}