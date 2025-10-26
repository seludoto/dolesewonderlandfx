"""
Social Trading Service for DoleSe Wonderland FX
Provides trader following, trade copying, and leaderboards functionality.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
import asyncio
import httpx

app = FastAPI(title="Social Trading Service", version="1.0.0")

# In-memory storage (replace with database in production)
trader_follows = {}  # follower_id -> [followed_trader_ids]
trade_copies = {}    # trader_id -> copy_settings
leaderboards = {}    # period -> leaderboard_data
social_stats = {}    # trader_id -> social_stats

# External service URLs
PAPER_TRADING_URL = "http://localhost:8005"
AI_PIPELINE_URL = "http://localhost:8001"
API_GATEWAY_URL = "http://localhost:8000"

class FollowTraderRequest(BaseModel):
    follower_id: str = Field(..., description="ID of the user who wants to follow")
    trader_id: str = Field(..., description="ID of the trader to follow")
    copy_trades: bool = Field(default=False, description="Whether to automatically copy trades")
    copy_percentage: Optional[float] = Field(default=100.0, ge=1.0, le=100.0, description="Percentage of trades to copy")

class UnfollowTraderRequest(BaseModel):
    follower_id: str = Field(..., description="ID of the user who wants to unfollow")
    trader_id: str = Field(..., description="ID of the trader to unfollow")

class UpdateCopySettingsRequest(BaseModel):
    trader_id: str = Field(..., description="ID of the trader whose settings to update")
    copy_percentage: float = Field(..., ge=1.0, le=100.0, description="New copy percentage")
    enabled: bool = Field(default=True, description="Whether copying is enabled")

class GetLeaderboardRequest(BaseModel):
    period: str = Field(..., description="Time period: daily, weekly, monthly, all_time")
    asset_type: Optional[str] = Field(default=None, description="Filter by asset type")
    metric: str = Field(default="total_pnl", description="Metric to rank by: total_pnl, win_rate, total_trades")

class TraderProfile(BaseModel):
    trader_id: str
    username: str
    total_followers: int
    total_pnl: float
    win_rate: float
    total_trades: int
    avg_trade_size: float
    risk_score: float
    last_active: str
    is_verified: bool
    specialties: List[str]  # Asset types they trade

class LeaderboardEntry(BaseModel):
    rank: int
    trader: TraderProfile
    score: float
    period_return: float

async def get_trader_performance(trader_id: str) -> Dict[str, Any]:
    """Get trader performance data from paper trading service."""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{PAPER_TRADING_URL}/api/v1/paper-trading/accounts/{trader_id}",
                params={"include_positions": True, "include_history": True}
            )
            if response.status_code == 200:
                return response.json()
            else:
                return None
        except Exception as e:
            print(f"Error fetching trader performance: {e}")
            return None

async def get_ai_insights(trader_id: str) -> Dict[str, Any]:
    """Get AI insights for trader performance."""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{AI_PIPELINE_URL}/api/v1/ai/analyze-performance",
                json={"trader_id": trader_id}
            )
            if response.status_code == 200:
                return response.json()
            else:
                return {"risk_score": 5.0, "insights": []}
        except Exception as e:
            print(f"Error fetching AI insights: {e}")
            return {"risk_score": 5.0, "insights": []}

async def update_leaderboards():
    """Update leaderboards with latest trader performance data."""
    periods = ["daily", "weekly", "monthly", "all_time"]

    for period in periods:
        leaderboard = []

        # Get all trader IDs (this would come from a database in production)
        trader_ids = list(social_stats.keys())

        for trader_id in trader_ids:
            performance = await get_trader_performance(trader_id)
            if not performance:
                continue

            account = performance["account"]
            trades = performance.get("recent_trades", [])

            # Calculate metrics based on period
            period_trades = filter_trades_by_period(trades, period)

            if not period_trades:
                continue

            total_pnl = sum(trade.get("pnl", 0) for trade in period_trades)
            winning_trades = sum(1 for trade in period_trades if trade.get("pnl", 0) > 0)
            win_rate = (winning_trades / len(period_trades)) * 100 if period_trades else 0

            # Get AI insights
            ai_data = await get_ai_insights(trader_id)

            trader_profile = TraderProfile(
                trader_id=trader_id,
                username=f"Trader_{trader_id[:8]}",  # Placeholder
                total_followers=len(trader_follows.get(trader_id, [])),
                total_pnl=total_pnl,
                win_rate=win_rate,
                total_trades=len(period_trades),
                avg_trade_size=sum(trade.get("quantity", 0) for trade in period_trades) / len(period_trades) if period_trades else 0,
                risk_score=ai_data.get("risk_score", 5.0),
                last_active=datetime.utcnow().isoformat(),
                is_verified=account.get("trading_stats", {}).get("total_trades", 0) > 100,
                specialties=["forex", "stocks", "crypto"]  # Placeholder
            )

            leaderboard.append({
                "trader": trader_profile,
                "score": total_pnl,  # Primary scoring metric
                "period_return": total_pnl
            })

        # Sort by score (descending)
        leaderboard.sort(key=lambda x: x["score"], reverse=True)

        # Add ranks
        for i, entry in enumerate(leaderboard):
            entry["rank"] = i + 1

        leaderboards[period] = leaderboard

def filter_trades_by_period(trades: List[Dict], period: str) -> List[Dict]:
    """Filter trades by time period."""
    now = datetime.utcnow()
    filtered_trades = []

    for trade in trades:
        trade_time = datetime.fromisoformat(trade["timestamp"].replace('Z', '+00:00'))

        if period == "daily" and (now - trade_time).days <= 1:
            filtered_trades.append(trade)
        elif period == "weekly" and (now - trade_time).days <= 7:
            filtered_trades.append(trade)
        elif period == "monthly" and (now - trade_time).days <= 30:
            filtered_trades.append(trade)
        elif period == "all_time":
            filtered_trades.append(trade)

    return filtered_trades

async def copy_trade_to_followers(trader_id: str, trade_data: Dict[str, Any]):
    """Copy a trade to all followers who have copy trading enabled."""
    if trader_id not in trader_follows:
        return

    followers = trader_follows[trader_id]

    for follower_id in followers:
        copy_settings = trade_copies.get(follower_id, {})
        if not copy_settings.get("enabled", False):
            continue

        copy_percentage = copy_settings.get("copy_percentage", 100.0)
        adjusted_quantity = trade_data["quantity"] * (copy_percentage / 100.0)

        # Execute copy trade via paper trading service
        async with httpx.AsyncClient() as client:
            try:
                copy_trade_request = {
                    "account_id": follower_id,  # Assuming follower has a paper trading account
                    "symbol": trade_data["symbol"],
                    "order_type": "market",
                    "side": trade_data["side"],
                    "quantity": adjusted_quantity,
                    "stop_loss": trade_data.get("stop_loss"),
                    "take_profit": trade_data.get("take_profit")
                }

                response = await client.post(
                    f"{PAPER_TRADING_URL}/api/v1/paper-trading/orders",
                    json=copy_trade_request
                )

                if response.status_code == 200:
                    print(f"Successfully copied trade for follower {follower_id}")
                else:
                    print(f"Failed to copy trade for follower {follower_id}: {response.text}")

            except Exception as e:
                print(f"Error copying trade to follower {follower_id}: {e}")

# API Endpoints

@app.post("/api/v1/social/follow")
async def follow_trader(request: FollowTraderRequest, background_tasks: BackgroundTasks):
    """Follow a trader and optionally enable trade copying."""
    if request.follower_id == request.trader_id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")

    # Initialize follower list if not exists
    if request.follower_id not in trader_follows:
        trader_follows[request.follower_id] = []

    # Check if already following
    if request.trader_id in trader_follows[request.follower_id]:
        raise HTTPException(status_code=400, detail="Already following this trader")

    # Add to followers
    trader_follows[request.follower_id].append(request.trader_id)

    # Set up copy trading if requested
    if request.copy_trades:
        trade_copies[request.follower_id] = {
            "trader_id": request.trader_id,
            "copy_percentage": request.copy_percentage or 100.0,
            "enabled": True
        }

    # Initialize social stats for both users
    if request.follower_id not in social_stats:
        social_stats[request.follower_id] = {"followers": 0, "following": 0}
    if request.trader_id not in social_stats:
        social_stats[request.trader_id] = {"followers": 0, "following": 0}

    social_stats[request.trader_id]["followers"] += 1
    social_stats[request.follower_id]["following"] += 1

    # Background task to update leaderboards
    background_tasks.add_task(update_leaderboards)

    return {
        "message": "Successfully followed trader",
        "copy_trades_enabled": request.copy_trades,
        "copy_percentage": request.copy_percentage
    }

@app.post("/api/v1/social/unfollow")
async def unfollow_trader(request: UnfollowTraderRequest, background_tasks: BackgroundTasks):
    """Unfollow a trader and disable trade copying."""
    if request.follower_id not in trader_follows:
        raise HTTPException(status_code=400, detail="Not following any traders")

    if request.trader_id not in trader_follows[request.follower_id]:
        raise HTTPException(status_code=400, detail="Not following this trader")

    # Remove from followers
    trader_follows[request.follower_id].remove(request.trader_id)

    # Remove copy trading settings
    if request.follower_id in trade_copies:
        del trade_copies[request.follower_id]

    # Update social stats
    if request.trader_id in social_stats:
        social_stats[request.trader_id]["followers"] -= 1
    if request.follower_id in social_stats:
        social_stats[request.follower_id]["following"] -= 1

    # Background task to update leaderboards
    background_tasks.add_task(update_leaderboards)

    return {"message": "Successfully unfollowed trader"}

@app.get("/api/v1/social/followers/{trader_id}")
async def get_followers(trader_id: str):
    """Get list of followers for a trader."""
    followers = trader_follows.get(trader_id, [])
    return {
        "trader_id": trader_id,
        "followers_count": len(followers),
        "followers": followers
    }

@app.get("/api/v1/social/following/{user_id}")
async def get_following(user_id: str):
    """Get list of traders a user is following."""
    following = trader_follows.get(user_id, [])
    return {
        "user_id": user_id,
        "following_count": len(following),
        "following": following
    }

@app.post("/api/v1/social/copy-settings")
async def update_copy_settings(request: UpdateCopySettingsRequest):
    """Update trade copying settings."""
    if request.trader_id not in trade_copies:
        raise HTTPException(status_code=404, detail="No copy settings found for this trader")

    trade_copies[request.trader_id].update({
        "copy_percentage": request.copy_percentage,
        "enabled": request.enabled
    })

    return {
        "message": "Copy settings updated successfully",
        "settings": trade_copies[request.trader_id]
    }

@app.get("/api/v1/social/copy-settings/{trader_id}")
async def get_copy_settings(trader_id: str):
    """Get trade copying settings for a trader."""
    if trader_id not in trade_copies:
        return {"enabled": False, "copy_percentage": 100.0}

    return trade_copies[trader_id]

@app.get("/api/v1/social/leaderboard")
async def get_leaderboard(request: GetLeaderboardRequest):
    """Get trader leaderboard for specified period and criteria."""
    if request.period not in leaderboards:
        # Trigger leaderboard update if not available
        await update_leaderboards()

    if request.period not in leaderboards:
        raise HTTPException(status_code=404, detail="Leaderboard not available")

    leaderboard = leaderboards[request.period]

    # Filter by asset type if specified
    if request.asset_type:
        leaderboard = [
            entry for entry in leaderboard
            if request.asset_type in entry["trader"].specialties
        ]

    # Sort by requested metric
    if request.metric == "win_rate":
        leaderboard.sort(key=lambda x: x["trader"].win_rate, reverse=True)
    elif request.metric == "total_trades":
        leaderboard.sort(key=lambda x: x["trader"].total_trades, reverse=True)
    else:  # default to total_pnl
        leaderboard.sort(key=lambda x: x["score"], reverse=True)

    # Re-assign ranks after sorting
    for i, entry in enumerate(leaderboard):
        entry["rank"] = i + 1

    return {
        "period": request.period,
        "metric": request.metric,
        "asset_type_filter": request.asset_type,
        "leaderboard": leaderboard[:50],  # Top 50 traders
        "total_count": len(leaderboard)
    }

@app.get("/api/v1/social/trader/{trader_id}/profile")
async def get_trader_profile(trader_id: str):
    """Get detailed trader profile with performance metrics."""
    performance = await get_trader_performance(trader_id)
    ai_insights = await get_ai_insights(trader_id)

    if not performance:
        raise HTTPException(status_code=404, detail="Trader profile not found")

    account = performance["account"]
    trades = performance.get("recent_trades", [])

    # Calculate comprehensive stats
    total_trades = len(trades)
    winning_trades = sum(1 for trade in trades if trade.get("pnl", 0) > 0)
    win_rate = (winning_trades / total_trades) * 100 if total_trades > 0 else 0

    total_pnl = sum(trade.get("pnl", 0) for trade in trades)
    avg_trade_pnl = total_pnl / total_trades if total_trades > 0 else 0

    # Get social stats
    social = social_stats.get(trader_id, {"followers": 0, "following": 0})

    profile = {
        "trader_id": trader_id,
        "username": f"Trader_{trader_id[:8]}",  # Placeholder
        "performance": {
            "total_pnl": total_pnl,
            "win_rate": win_rate,
            "total_trades": total_trades,
            "avg_trade_pnl": avg_trade_pnl,
            "current_balance": account["balance"],
            "total_equity": account["equity"]
        },
        "social": {
            "followers": social["followers"],
            "following": social["following"]
        },
        "ai_insights": ai_insights,
        "last_active": datetime.utcnow().isoformat(),
        "is_verified": account.get("trading_stats", {}).get("total_trades", 0) > 100,
        "specialties": ["forex", "stocks", "crypto"]  # Placeholder
    }

    return profile

@app.post("/api/v1/social/trade-notification")
async def handle_trade_notification(trade_data: Dict[str, Any], background_tasks: BackgroundTasks):
    """Handle trade notifications from paper trading service for copy trading."""
    trader_id = trade_data.get("account_id")
    if not trader_id:
        raise HTTPException(status_code=400, detail="Missing trader_id in trade data")

    # Copy trade to followers if copy trading is enabled
    background_tasks.add_task(copy_trade_to_followers, trader_id, trade_data)

    # Update leaderboards
    background_tasks.add_task(update_leaderboards)

    return {"message": "Trade notification processed"}

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "social-trading"}

# Background task to periodically update leaderboards
@app.on_event("startup")
async def startup_event():
    """Initialize service on startup."""
    # Initial leaderboard update
    await update_leaderboards()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007)