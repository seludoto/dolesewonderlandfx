"""
Paper Trading service for DoleSe Wonderland FX platform.
Provides risk-free trading simulation and strategy testing.
"""

from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import json
import asyncio
import uuid
from pydantic import BaseModel
import sqlite3
from contextlib import contextmanager

app = FastAPI(
    title="DoleSe Wonderland FX - Paper Trading Service",
    description="Risk-free trading simulation and strategy testing",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class CreateAccountRequest(BaseModel):
    user_id: int
    initial_balance: float = 10000.0
    account_currency: str = "USD"
    leverage: Optional[int] = None  # Will be set based on asset type if not provided
    allowed_asset_types: List[str] = ["forex", "stock", "crypto", "commodity", "index"]

class PlaceOrderRequest(BaseModel):
    account_id: str
    symbol: str
    order_type: str  # 'market', 'limit', 'stop'
    side: str  # 'buy', 'sell'
    quantity: float
    price: Optional[float] = None
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None

class ClosePositionRequest(BaseModel):
    position_id: str
    quantity: Optional[float] = None  # Partial close support

class AccountSummaryRequest(BaseModel):
    account_id: str
    include_positions: bool = True
    include_history: bool = False

# Database connection
@contextmanager
def get_db():
    """Database connection context manager."""
    db_path = os.path.join(os.path.dirname(__file__), "../../data/app.db")
    conn = sqlite3.connect(db_path)
    try:
        yield conn
    finally:
        conn.close()

# Mock market data (in production, integrate with real market data feeds)
# Forex pairs
FOREX_PRICES = {
    "EUR/USD": 1.0850,
    "GBP/USD": 1.2750,
    "USD/JPY": 147.50,
    "USD/CHF": 0.9150,
    "AUD/USD": 0.6650,
    "USD/CAD": 1.3450,
    "NZD/USD": 0.6150
}

# Stock prices
STOCK_PRICES = {
    "AAPL": 175.50,
    "MSFT": 335.20,
    "GOOGL": 142.80,
    "AMZN": 155.30,
    "TSLA": 248.90,
    "NVDA": 875.20,
    "META": 325.60,
    "NFLX": 485.70
}

# Crypto prices
CRYPTO_PRICES = {
    "BTC/USD": 45120.50,
    "ETH/USD": 2450.80,
    "BNB/USD": 315.20,
    "ADA/USD": 0.52,
    "SOL/USD": 98.75,
    "DOT/USD": 7.85,
    "DOGE/USD": 0.085,
    "AVAX/USD": 38.90
}

# Commodity prices
COMMODITY_PRICES = {
    "XAU/USD": 2050.80,  # Gold
    "XAG/USD": 23.45,    # Silver
    "WTI/USD": 78.90,    # Oil
    "BRENT/USD": 82.15,  # Brent Oil
    "COFFEE/USD": 185.20 # Coffee
}

# Index prices
INDEX_PRICES = {
    "SPX": 4512.50,      # S&P 500
    "NDX": 15875.30,     # Nasdaq 100
    "DJI": 35245.80,     # Dow Jones
    "FTSE": 7654.20,     # FTSE 100
    "DAX": 16543.70      # DAX 30
}

# Asset type mappings
ASSET_TYPES = {
    "forex": FOREX_PRICES,
    "stock": STOCK_PRICES,
    "crypto": CRYPTO_PRICES,
    "commodity": COMMODITY_PRICES,
    "index": INDEX_PRICES
}

# Spreads by asset type
SPREADS = {
    "forex": {
        "EUR/USD": 0.0002,
        "GBP/USD": 0.0003,
        "USD/JPY": 0.02,
        "USD/CHF": 0.0002,
        "AUD/USD": 0.0002,
        "USD/CAD": 0.0003,
        "NZD/USD": 0.0003
    },
    "stock": {symbol: price * 0.0002 for symbol, price in STOCK_PRICES.items()},  # 0.02% spread
    "crypto": {symbol: price * 0.001 for symbol, price in CRYPTO_PRICES.items()}, # 0.1% spread
    "commodity": {
        "XAU/USD": 0.50,
        "XAG/USD": 0.05,
        "WTI/USD": 0.10,
        "BRENT/USD": 0.12,
        "COFFEE/USD": 0.80
    },
    "index": {symbol: price * 0.0001 for symbol, price in INDEX_PRICES.items()}   # 0.01% spread
}

# Leverage by asset type
DEFAULT_LEVERAGE = {
    "forex": 100,
    "stock": 5,
    "crypto": 10,
    "commodity": 20,
    "index": 10
}

# Contract sizes (how many units per lot)
CONTRACT_SIZES = {
    "forex": 100000,     # Standard lot = 100,000 units
    "stock": 1,          # 1 share
    "crypto": 1,         # 1 coin/token
    "commodity": {
        "XAU/USD": 100,  # 100 oz gold
        "XAG/USD": 5000, # 5000 oz silver
        "WTI/USD": 1000, # 1000 barrels oil
        "BRENT/USD": 1000,
        "COFFEE/USD": 37500  # 37,500 lbs coffee
    },
    "index": {
        "SPX": 100,      # $100 multiplier
        "NDX": 100,
        "DJI": 100,
        "FTSE": 10,      # £10 multiplier
        "DAX": 25        # €25 multiplier
    }
}

# In-memory storage for demo (use database in production)
paper_accounts = {}
paper_positions = {}
paper_orders = {}
trade_history = {}

async def get_current_price(symbol: str) -> Dict[str, float]:
    """Get current market price for a symbol."""
    # Determine asset type
    asset_type = None
    base_price = None

    for type_name, price_dict in ASSET_TYPES.items():
        if symbol in price_dict:
            asset_type = type_name
            base_price = price_dict[symbol]
            break

    if base_price is None:
        raise HTTPException(status_code=400, detail=f"Symbol {symbol} not found")

    # Get spread for this asset
    spread = SPREADS.get(asset_type, {}).get(symbol, base_price * 0.0002)

    # Add some random movement for realism
    import random
    variation = random.uniform(-0.001, 0.001)
    current_price = base_price * (1 + variation)

    return {
        "bid": current_price - spread/2,
        "ask": current_price + spread/2,
        "spread": spread,
        "timestamp": datetime.utcnow().isoformat(),
        "asset_type": asset_type
    }

async def get_contract_size(symbol: str) -> float:
    """Get contract size for a symbol."""
    for type_name, price_dict in ASSET_TYPES.items():
        if symbol in price_dict:
            if type_name == "commodity":
                return CONTRACT_SIZES[type_name].get(symbol, 1)
            elif type_name == "index":
                return CONTRACT_SIZES[type_name].get(symbol, 1)
            else:
                return CONTRACT_SIZES[type_name]
    return 1

async def get_asset_type(symbol: str) -> str:
    """Get asset type for a symbol."""
    for type_name, price_dict in ASSET_TYPES.items():
        if symbol in price_dict:
            return type_name
    return "unknown"

async def get_default_leverage(asset_type: str) -> int:
    """Get default leverage for asset type."""
    return DEFAULT_LEVERAGE.get(asset_type, 10)

async def calculate_pnl(position: Dict[str, Any], current_price: float) -> Dict[str, float]:
    """Calculate profit/loss for a position."""
    entry_price = position["entry_price"]
    quantity = position["quantity"]
    side = position["side"]
    symbol = position["symbol"]

    # Get contract size for proper calculation
    contract_size = await get_contract_size(symbol)

    # Calculate P&L based on asset type
    asset_type = await get_asset_type(symbol)

    if asset_type == "forex":
        # Forex: P&L = (current - entry) * quantity * contract_size
        if side == "buy":
            pnl = (current_price - entry_price) * quantity * contract_size
        else:  # sell
            pnl = (entry_price - current_price) * quantity * contract_size
    elif asset_type in ["stock", "crypto"]:
        # Stocks/Crypto: P&L = (current - entry) * quantity
        if side == "buy":
            pnl = (current_price - entry_price) * quantity
        else:  # sell (short selling)
            pnl = (entry_price - current_price) * quantity
    elif asset_type == "commodity":
        # Commodities: P&L = (current - entry) * quantity * contract_size
        if side == "buy":
            pnl = (current_price - entry_price) * quantity * contract_size
        else:
            pnl = (entry_price - current_price) * quantity * contract_size
    elif asset_type == "index":
        # Indices: P&L = (current - entry) * quantity * contract_size
        if side == "buy":
            pnl = (current_price - entry_price) * quantity * contract_size
        else:
            pnl = (entry_price - current_price) * quantity * contract_size
    else:
        # Default calculation
        if side == "buy":
            pnl = (current_price - entry_price) * quantity
        else:
            pnl = (entry_price - current_price) * quantity

    return {
        "unrealized_pnl": pnl,
        "current_price": current_price,
        "pnl_percentage": (pnl / position["margin_used"]) * 100 if position["margin_used"] > 0 else 0
    }

# API endpoints
@app.post("/api/v1/paper-trading/accounts")
async def create_paper_account(request: CreateAccountRequest):
    """Create a new paper trading account."""
    account_id = str(uuid.uuid4())

    # Set default leverage if not provided
    leverage = request.leverage
    if leverage is None:
        # Use forex leverage as default, but can be overridden per trade
        leverage = DEFAULT_LEVERAGE["forex"]

    account = {
        "id": account_id,
        "user_id": request.user_id,
        "balance": request.initial_balance,
        "initial_balance": request.initial_balance,
        "account_currency": request.account_currency,
        "leverage": leverage,
        "margin_used": 0.0,
        "equity": request.initial_balance,
        "free_margin": request.initial_balance,
        "total_pnl": 0.0,
        "created_at": datetime.utcnow().isoformat(),
        "status": "active",
        "allowed_asset_types": request.allowed_asset_types,
        "trading_stats": {
            "total_trades": 0,
            "winning_trades": 0,
            "losing_trades": 0,
            "win_rate": 0.0,
            "avg_win": 0.0,
            "avg_loss": 0.0,
            "largest_win": 0.0,
            "largest_loss": 0.0
        }
    }

    paper_accounts[account_id] = account

    return {
        "account_id": account_id,
        "message": "Paper trading account created successfully",
        "account": account
    }

@app.post("/api/v1/paper-trading/orders")
async def place_order(request: PlaceOrderRequest, background_tasks: BackgroundTasks):
    """Place a trading order."""
    if request.account_id not in paper_accounts:
        raise HTTPException(status_code=404, detail="Paper trading account not found")

    account = paper_accounts[request.account_id]
    if account["status"] != "active":
        raise HTTPException(status_code=400, detail="Account is not active")

    # Validate asset type
    asset_type = await get_asset_type(request.symbol)
    if asset_type not in account["allowed_asset_types"]:
        raise HTTPException(status_code=400, detail=f"Asset type '{asset_type}' not allowed for this account")

    # Get current market price
    price_data = await get_current_price(request.symbol)
    execution_price = price_data["ask"] if request.side == "buy" else price_data["bid"]

    if request.order_type == "limit" and request.price:
        execution_price = request.price
    elif request.order_type == "stop" and request.price:
        execution_price = request.price

    # Get contract size and leverage for this asset type
    contract_size = await get_contract_size(request.symbol)
    asset_leverage = await get_default_leverage(asset_type)

    # Calculate required margin based on asset type
    if asset_type == "forex":
        notional_value = execution_price * request.quantity * contract_size
    elif asset_type == "stock":
        notional_value = execution_price * request.quantity
    elif asset_type == "crypto":
        notional_value = execution_price * request.quantity
    elif asset_type == "commodity":
        notional_value = execution_price * request.quantity * contract_size
    elif asset_type == "index":
        notional_value = execution_price * request.quantity * contract_size
    else:
        notional_value = execution_price * request.quantity

    required_margin = notional_value / asset_leverage

    if required_margin > account["free_margin"]:
        raise HTTPException(status_code=400, detail="Insufficient margin")

    # Create order
    order_id = str(uuid.uuid4())
    order = {
        "id": order_id,
        "account_id": request.account_id,
        "symbol": request.symbol,
        "asset_type": asset_type,
        "order_type": request.order_type,
        "side": request.side,
        "quantity": request.quantity,
        "price": execution_price,
        "stop_loss": request.stop_loss,
        "take_profit": request.take_profit,
        "status": "filled",
        "filled_at": datetime.utcnow().isoformat(),
        "required_margin": required_margin,
        "contract_size": contract_size,
        "leverage_used": asset_leverage
    }

    paper_orders[order_id] = order

    # Create position
    position_id = str(uuid.uuid4())
    position = {
        "id": position_id,
        "account_id": request.account_id,
        "order_id": order_id,
        "symbol": request.symbol,
        "asset_type": asset_type,
        "side": request.side,
        "quantity": request.quantity,
        "entry_price": execution_price,
        "current_price": execution_price,
        "stop_loss": request.stop_loss,
        "take_profit": request.take_profit,
        "margin_used": required_margin,
        "unrealized_pnl": 0.0,
        "contract_size": contract_size,
        "leverage_used": asset_leverage,
        "opened_at": datetime.utcnow().isoformat(),
        "status": "open"
    }

    paper_positions[position_id] = position

    # Update account
    account["margin_used"] += required_margin
    account["free_margin"] = account["equity"] - account["margin_used"]

    # Store trade in history
    trade_record = {
        "id": str(uuid.uuid4()),
        "account_id": request.account_id,
        "order_id": order_id,
        "position_id": position_id,
        "symbol": request.symbol,
        "asset_type": asset_type,
        "side": request.side,
        "quantity": request.quantity,
        "price": execution_price,
        "timestamp": datetime.utcnow().isoformat(),
        "type": "open"
    }

    if request.account_id not in trade_history:
        trade_history[request.account_id] = []
    trade_history[request.account_id].append(trade_record)

    # Background task to update positions
    background_tasks.add_task(update_positions, request.account_id)

    return {
        "order_id": order_id,
        "position_id": position_id,
        "execution_price": execution_price,
        "required_margin": required_margin,
        "asset_type": asset_type,
        "leverage_used": asset_leverage,
        "message": "Order placed successfully"
    }

@app.post("/api/v1/paper-trading/positions/{position_id}/close")
async def close_position(position_id: str, request: ClosePositionRequest, background_tasks: BackgroundTasks):
    """Close a trading position."""
    if position_id not in paper_positions:
        raise HTTPException(status_code=404, detail="Position not found")

    position = paper_positions[position_id]
    account = paper_accounts[position["account_id"]]

    if position["status"] != "open":
        raise HTTPException(status_code=400, detail="Position is not open")

    # Get current price
    price_data = await get_current_price(position["symbol"])
    close_price = price_data["bid"] if position["side"] == "buy" else price_data["ask"]

    close_quantity = request.quantity or position["quantity"]

    # Calculate P&L using the proper calculation function
    pnl_data = await calculate_pnl(position, close_price)
    pnl = pnl_data["unrealized_pnl"] * (close_quantity / position["quantity"])

    # Update position
    position["status"] = "closed"
    position["close_price"] = close_price
    position["closed_at"] = datetime.utcnow().isoformat()
    position["realized_pnl"] = pnl

    # Update account
    account["balance"] += pnl
    account["equity"] = account["balance"]
    account["margin_used"] -= position["margin_used"] * (close_quantity / position["quantity"])
    account["free_margin"] = account["equity"] - account["margin_used"]
    account["total_pnl"] += pnl

    # Update trading statistics
    account["trading_stats"]["total_trades"] += 1
    if pnl > 0:
        account["trading_stats"]["winning_trades"] += 1
        account["trading_stats"]["avg_win"] = (
            (account["trading_stats"]["avg_win"] * (account["trading_stats"]["winning_trades"] - 1) + pnl) /
            account["trading_stats"]["winning_trades"]
        )
        account["trading_stats"]["largest_win"] = max(account["trading_stats"]["largest_win"], pnl)
    else:
        account["trading_stats"]["losing_trades"] += 1
        account["trading_stats"]["avg_loss"] = (
            (account["trading_stats"]["avg_loss"] * (account["trading_stats"]["losing_trades"] - 1) + abs(pnl)) /
            account["trading_stats"]["losing_trades"]
        )
        account["trading_stats"]["largest_loss"] = max(account["trading_stats"]["largest_loss"], abs(pnl))

    # Calculate win rate
    total_trades = account["trading_stats"]["total_trades"]
    winning_trades = account["trading_stats"]["winning_trades"]
    account["trading_stats"]["win_rate"] = (winning_trades / total_trades) * 100 if total_trades > 0 else 0

    # Store trade in history
    trade_record = {
        "id": str(uuid.uuid4()),
        "account_id": position["account_id"],
        "order_id": position["order_id"],
        "position_id": position_id,
        "symbol": position["symbol"],
        "asset_type": position["asset_type"],
        "side": position["side"],
        "quantity": close_quantity,
        "price": close_price,
        "pnl": pnl,
        "timestamp": datetime.utcnow().isoformat(),
        "type": "close"
    }

    if position["account_id"] not in trade_history:
        trade_history[position["account_id"]] = []
    trade_history[position["account_id"]].append(trade_record)

    # Background task to update remaining positions
    background_tasks.add_task(update_positions, position["account_id"])

    return {
        "position_id": position_id,
        "close_price": close_price,
        "realized_pnl": pnl,
        "asset_type": position["asset_type"],
        "message": "Position closed successfully"
    }

@app.get("/api/v1/paper-trading/accounts/{account_id}")
async def get_account_summary(account_id: str, include_positions: bool = True, include_history: bool = False):
    """Get paper trading account summary."""
    if account_id not in paper_accounts:
        raise HTTPException(status_code=404, detail="Paper trading account not found")

    account = paper_accounts[account_id]

    response = {
        "account": account,
        "positions": [],
        "recent_trades": []
    }

    if include_positions:
        # Get open positions
        account_positions = [
            pos for pos in paper_positions.values()
            if pos["account_id"] == account_id and pos["status"] == "open"
        ]

        # Update P&L for positions
        for position in account_positions:
            price_data = await get_current_price(position["symbol"])
            current_price = price_data["bid"] if position["side"] == "buy" else price_data["ask"]
            pnl_data = await calculate_pnl(position, current_price)
            position.update(pnl_data)

        response["positions"] = account_positions

    if include_history:
        response["recent_trades"] = trade_history.get(account_id, [])[-10:]  # Last 10 trades

    return response

@app.get("/api/v1/paper-trading/market/prices")
async def get_market_prices(symbols: Optional[str] = None):
    """Get current market prices."""
    if symbols:
        symbol_list = symbols.split(",")
    else:
        # Get all available symbols from all asset types
        symbol_list = []
        for price_dict in ASSET_TYPES.values():
            symbol_list.extend(price_dict.keys())

    prices = {}
    for symbol in symbol_list:
        try:
            prices[symbol] = await get_current_price(symbol)
        except HTTPException:
            # Skip symbols that can't be found
            continue

    return {"prices": prices}

@app.get("/api/v1/paper-trading/market/symbols")
async def get_available_symbols(asset_type: Optional[str] = None):
    """Get available trading symbols, optionally filtered by asset type."""
    if asset_type:
        if asset_type not in ASSET_TYPES:
            raise HTTPException(status_code=400, detail=f"Invalid asset type: {asset_type}")

        symbols = list(ASSET_TYPES[asset_type].keys())
        return {
            "asset_type": asset_type,
            "symbols": symbols,
            "count": len(symbols)
        }
    else:
        # Return all symbols grouped by asset type
        result = {}
        for type_name, price_dict in ASSET_TYPES.items():
            result[type_name] = {
                "symbols": list(price_dict.keys()),
                "count": len(price_dict)
            }
        return result

@app.get("/api/v1/paper-trading/market/asset-types")
async def get_asset_types():
    """Get information about supported asset types."""
    asset_info = {}
    for asset_type in ASSET_TYPES.keys():
        asset_info[asset_type] = {
            "default_leverage": DEFAULT_LEVERAGE.get(asset_type, 10),
            "contract_size": CONTRACT_SIZES.get(asset_type, 1),
            "spread_info": f"Variable spreads based on asset volatility"
        }

    return {
        "asset_types": list(ASSET_TYPES.keys()),
        "details": asset_info
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "paper-trading"}

# Background tasks
async def update_positions(account_id: str):
    """Update all positions for an account."""
    if account_id not in paper_accounts:
        return

    account = paper_accounts[account_id]
    total_unrealized_pnl = 0

    # Update all open positions
    for position in paper_positions.values():
        if position["account_id"] == account_id and position["status"] == "open":
            price_data = await get_current_price(position["symbol"])
            current_price = price_data["bid"] if position["side"] == "buy" else price_data["ask"]
            pnl_data = await calculate_pnl(position, current_price)
            position.update(pnl_data)
            total_unrealized_pnl += pnl_data["unrealized_pnl"]

    # Update account equity
    account["equity"] = account["balance"] + total_unrealized_pnl
    account["free_margin"] = account["equity"] - account["margin_used"]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8005)