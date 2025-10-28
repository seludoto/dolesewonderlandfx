import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function SocialTrading({ userId }) {
  const [leaderboard, setLeaderboard] = useState([])
  const [following, setFollowing] = useState([])
  const [followers, setFollowers] = useState([])
  const [traderSearch, setTraderSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchLeaderboard()
      fetchFollowing()
      fetchFollowers()
    }
  }, [userId])

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${process.env.SOCIAL_TRADING_URL}/api/v1/social/leaderboard?limit=20`)
      setLeaderboard(response.data.leaderboard || [])
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    }
  }

  const fetchFollowing = async () => {
    try {
      const response = await axios.get(`${process.env.SOCIAL_TRADING_URL}/api/v1/social/following/${userId}`)
      setFollowing(response.data.following || [])
    } catch (error) {
      console.error('Failed to fetch following:', error)
    }
  }

  const fetchFollowers = async () => {
    try {
      const response = await axios.get(`${process.env.SOCIAL_TRADING_URL}/api/v1/social/followers/${userId}`)
      setFollowers(response.data.followers || [])
    } catch (error) {
      console.error('Failed to fetch followers:', error)
    }
  }

  const searchTraders = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      // This would be a search endpoint - for now, we'll filter the leaderboard
      const filtered = leaderboard.filter(trader =>
        trader.username?.toLowerCase().includes(query.toLowerCase()) ||
        trader.display_name?.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filtered.slice(0, 10))
    } catch (error) {
      console.error('Failed to search traders:', error)
    }
  }

  const followTrader = async (traderId) => {
    setLoading(true)
    try {
      await axios.post(`${process.env.SOCIAL_TRADING_URL}/api/v1/social/follow`, {
        follower_id: userId,
        trader_id: traderId
      })
      toast.success('Successfully followed trader!')
      fetchFollowing()
      fetchFollowers()
    } catch (error) {
      toast.error('Failed to follow trader')
    } finally {
      setLoading(false)
    }
  }

  const unfollowTrader = async (traderId) => {
    setLoading(true)
    try {
      await axios.post(`${process.env.SOCIAL_TRADING_URL}/api/v1/social/unfollow`, {
        follower_id: userId,
        trader_id: traderId
      })
      toast.success('Successfully unfollowed trader!')
      fetchFollowing()
      fetchFollowers()
    } catch (error) {
      toast.error('Failed to unfollow trader')
    } finally {
      setLoading(false)
    }
  }

  const isFollowing = (traderId) => {
    return following.some(f => f.trader_id === traderId)
  }

  return (
    <div className="space-y-6">
      {/* Leaderboard */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Trader Leaderboard</h2>
        <div className="space-y-2">
          {leaderboard.map((trader, index) => (
            <div key={trader.user_id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-lg w-8">#{index + 1}</span>
                <div>
                  <div className="font-semibold">{trader.display_name || trader.username}</div>
                  <div className="text-sm text-gray-600">
                    Win Rate: {trader.win_rate?.toFixed(1)}% |
                    Total P&L: ${trader.total_pnl?.toFixed(2)} |
                    Followers: {trader.followers_count || 0}
                  </div>
                </div>
              </div>
              {trader.user_id !== userId && (
                <button
                  onClick={() => isFollowing(trader.user_id) ? unfollowTrader(trader.user_id) : followTrader(trader.user_id)}
                  disabled={loading}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    isFollowing(trader.user_id)
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isFollowing(trader.user_id) ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Search Traders */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Find Traders</h2>
        <input
          type="text"
          placeholder="Search traders by name..."
          value={traderSearch}
          onChange={(e) => {
            setTraderSearch(e.target.value)
            searchTraders(e.target.value)
          }}
          className="w-full p-2 border rounded mb-4"
        />
        {searchResults.length > 0 && (
          <div className="space-y-2">
            {searchResults.map((trader) => (
              <div key={trader.user_id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-semibold">{trader.display_name || trader.username}</div>
                  <div className="text-sm text-gray-600">
                    Win Rate: {trader.win_rate?.toFixed(1)}% | P&L: ${trader.total_pnl?.toFixed(2)}
                  </div>
                </div>
                {trader.user_id !== userId && (
                  <button
                    onClick={() => isFollowing(trader.user_id) ? unfollowTrader(trader.user_id) : followTrader(trader.user_id)}
                    disabled={loading}
                    className={`px-4 py-2 rounded text-sm font-medium ${
                      isFollowing(trader.user_id)
                        ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isFollowing(trader.user_id) ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Following & Followers */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Following */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Following ({following.length})</h2>
          <div className="space-y-2">
            {following.map((follow) => (
              <div key={follow.trader_id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-semibold">{follow.trader_display_name || follow.trader_username}</div>
                  <div className="text-sm text-gray-600">
                    Win Rate: {follow.trader_win_rate?.toFixed(1)}%
                  </div>
                </div>
                <button
                  onClick={() => unfollowTrader(follow.trader_id)}
                  disabled={loading}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  Unfollow
                </button>
              </div>
            ))}
            {following.length === 0 && (
              <p className="text-gray-500 text-center py-4">Not following anyone yet</p>
            )}
          </div>
        </div>

        {/* Followers */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Followers ({followers.length})</h2>
          <div className="space-y-2">
            {followers.map((follower) => (
              <div key={follower.follower_id} className="p-3 border rounded">
                <div className="font-semibold">{follower.follower_display_name || follower.follower_username}</div>
                <div className="text-sm text-gray-600">
                  Following since {new Date(follower.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            {followers.length === 0 && (
              <p className="text-gray-500 text-center py-4">No followers yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}