import { useState, useEffect } from 'react'
import axios from 'axios'
import Select from 'react-select'
import { toast } from 'react-toastify'

const ASSET_TYPES = {
  forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD'],
  stock: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META'],
  crypto: ['BTC/USD', 'ETH/USD', 'BNB/USD', 'ADA/USD', 'SOL/USD', 'DOT/USD'],
  commodity: ['XAU/USD', 'XAG/USD', 'WTI/USD', 'BRENT/USD'],
  index: ['SPY', 'QQQ', 'IWM', 'DIA', 'EFA']
}

export default function MultiAssetTrading({ accountId }) {
  const [selectedAssetType, setSelectedAssetType] = useState('forex')
  const [selectedSymbol, setSelectedSymbol] = useState('EUR/USD')
  const [orderType, setOrderType] = useState('market')
  const [side, setSide] = useState('buy')
  const [quantity, setQuantity] = useState(0.01)
  const [price, setPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [currentPrice, setCurrentPrice] = useState(null)
  const [account, setAccount] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (accountId) {
      fetchAccount()
      fetchCurrentPrice()
    }
  }, [accountId, selectedSymbol])

  const fetchAccount = async () => {
    try {
      const response = await axios.get(`${process.env.PAPER_TRADING_URL}/api/v1/paper-trading/accounts/${accountId}`)
      setAccount(response.data.account)
    } catch (error) {
      toast.error('Failed to fetch account details')
    }
  }

  const fetchCurrentPrice = async () => {
    try {
      const response = await axios.get(`${process.env.PAPER_TRADING_URL}/api/v1/paper-trading/market/prices?symbols=${selectedSymbol}`)
      const priceData = response.data.prices[selectedSymbol]
      if (priceData) {
        setCurrentPrice(priceData)
      }
    } catch (error) {
      console.error('Failed to fetch current price:', error)
    }
  }

  const handlePlaceOrder = async () => {
    if (!accountId) {
      toast.error('No account selected')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        account_id: accountId,
        symbol: selectedSymbol,
        order_type: orderType,
        side: side,
        quantity: quantity,
        stop_loss: stopLoss || null,
        take_profit: takeProfit || null
      }

      if (orderType === 'limit' && price) {
        orderData.price = parseFloat(price)
      }

      const response = await axios.post(`${process.env.PAPER_TRADING_URL}/api/v1/paper-trading/orders`, orderData)
      toast.success('Order placed successfully!')
      fetchAccount() // Refresh account data
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const assetTypeOptions = Object.keys(ASSET_TYPES).map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }))

  const symbolOptions = ASSET_TYPES[selectedAssetType].map(symbol => ({
    value: symbol,
    label: symbol
  }))

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Multi-Asset Trading</h2>

      {/* Account Summary */}
      {account && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Account Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>Balance: ${account.balance?.toFixed(2)}</div>
            <div>Equity: ${account.equity?.toFixed(2)}</div>
            <div>Free Margin: ${account.free_margin?.toFixed(2)}</div>
            <div>Leverage: {account.leverage}x</div>
          </div>
        </div>
      )}

      {/* Trading Form */}
      <div className="space-y-4">
        {/* Asset Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Asset Type</label>
          <Select
            value={assetTypeOptions.find(opt => opt.value === selectedAssetType)}
            onChange={(option) => {
              setSelectedAssetType(option.value)
              setSelectedSymbol(ASSET_TYPES[option.value][0])
            }}
            options={assetTypeOptions}
            className="w-full"
          />
        </div>

        {/* Symbol Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Symbol</label>
          <Select
            value={symbolOptions.find(opt => opt.value === selectedSymbol)}
            onChange={(option) => setSelectedSymbol(option.value)}
            options={symbolOptions}
            className="w-full"
          />
        </div>

        {/* Current Price Display */}
        {currentPrice && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              Current Price: Bid ${currentPrice.bid?.toFixed(5)} | Ask ${currentPrice.ask?.toFixed(5)}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Spread: ${(currentPrice.spread * currentPrice.ask)?.toFixed(5)} | Asset Type: {currentPrice.asset_type}
            </div>
          </div>
        )}

        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="market">Market</option>
            <option value="limit">Limit</option>
            <option value="stop">Stop</option>
          </select>
        </div>

        {/* Price (for limit/stop orders) */}
        {(orderType === 'limit' || orderType === 'stop') && (
          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              step="0.00001"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter price"
            />
          </div>
        )}

        {/* Side */}
        <div>
          <label className="block text-sm font-medium mb-2">Side</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="buy"
                checked={side === 'buy'}
                onChange={(e) => setSide(e.target.value)}
                className="mr-2"
              />
              Buy
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="sell"
                checked={side === 'sell'}
                onChange={(e) => setSide(e.target.value)}
                className="mr-2"
              />
              Sell
            </label>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <input
            type="number"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="Enter quantity"
          />
        </div>

        {/* Stop Loss & Take Profit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Stop Loss</label>
            <input
              type="number"
              step="0.00001"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Take Profit</label>
            <input
              type="number"
              step="0.00001"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading || !accountId}
          className={`w-full p-3 rounded font-semibold ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : side === 'buy'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {loading ? 'Placing Order...' : `Place ${side.toUpperCase()} Order`}
        </button>
      </div>
    </div>
  )
}