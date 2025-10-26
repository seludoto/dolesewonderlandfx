# Data Schemas

This directory contains data schemas and validation rules for the dolesewonderlandfx platform.

## Trade Data Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "description": "Unique trade identifier"
    },
    "user_id": {
      "type": "string",
      "description": "User identifier"
    },
    "symbol": {
      "type": "string",
      "description": "Trading symbol (e.g., EUR/USD, AAPL, BTC/USD, XAU/USD, SPY)"
    },
    "asset_type": {
      "type": "string",
      "enum": ["forex", "stock", "crypto", "commodity", "index"],
      "description": "Type of asset being traded"
    },
    "entry_price": {
      "type": "number",
      "minimum": 0,
      "description": "Entry price"
    },
    "exit_price": {
      "type": "number",
      "minimum": 0,
      "description": "Exit price"
    },
    "quantity": {
      "type": "number",
      "minimum": 0,
      "description": "Trade quantity"
    },
    "contract_size": {
      "type": "number",
      "minimum": 0,
      "description": "Contract size multiplier (1 for stocks/crypto, 100000 for forex, varies for commodities/indices)"
    },
    "leverage_used": {
      "type": "integer",
      "minimum": 1,
      "maximum": 500,
      "description": "Leverage used for the trade"
    },
    "profit_loss": {
      "type": "number",
      "description": "Profit or loss amount"
    },
    "entry_time": {
      "type": "string",
      "format": "date-time",
      "description": "Trade entry timestamp"
    },
    "exit_time": {
      "type": "string",
      "format": "date-time",
      "description": "Trade exit timestamp"
    },
    "strategy": {
      "type": "string",
      "description": "Trading strategy used"
    },
    "notes": {
      "type": "string",
      "description": "Trade notes"
    },
    "stop_loss": {
      "type": "number",
      "minimum": 0,
      "description": "Stop loss price level"
    },
    "take_profit": {
      "type": "number",
      "minimum": 0,
      "description": "Take profit price level"
    }
  },
  "required": ["user_id", "symbol", "asset_type", "entry_price", "quantity", "entry_time"]
}
```

## User Data Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique user identifier"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "User email address"
    },
    "username": {
      "type": "string",
      "minLength": 3,
      "maxLength": 50,
      "description": "Username"
    },
    "first_name": {
      "type": "string",
      "description": "First name"
    },
    "last_name": {
      "type": "string",
      "description": "Last name"
    },
    "subscription_tier": {
      "type": "string",
      "enum": ["free", "premium", "pro"],
      "description": "Subscription level"
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "description": "Account creation timestamp"
    },
    "last_login": {
      "type": "string",
      "format": "date-time",
      "description": "Last login timestamp"
    },
    "is_active": {
      "type": "boolean",
      "description": "Account active status"
    },
    "trading_stats": {
      "type": "object",
      "properties": {
        "total_trades": {
          "type": "integer",
          "minimum": 0,
          "description": "Total number of trades executed"
        },
        "winning_trades": {
          "type": "integer",
          "minimum": 0,
          "description": "Number of profitable trades"
        },
        "losing_trades": {
          "type": "integer",
          "minimum": 0,
          "description": "Number of losing trades"
        },
        "win_rate": {
          "type": "number",
          "minimum": 0,
          "maximum": 100,
          "description": "Win rate percentage"
        },
        "avg_win": {
          "type": "number",
          "description": "Average winning trade amount"
        },
        "avg_loss": {
          "type": "number",
          "description": "Average losing trade amount"
        },
        "largest_win": {
          "type": "number",
          "description": "Largest winning trade amount"
        },
        "largest_loss": {
          "type": "number",
          "description": "Largest losing trade amount"
        },
        "total_pnl": {
          "type": "number",
          "description": "Total profit and loss"
        }
      },
      "description": "User trading statistics"
    },
    "social_stats": {
      "type": "object",
      "properties": {
        "followers_count": {
          "type": "integer",
          "minimum": 0,
          "description": "Number of followers"
        },
        "following_count": {
          "type": "integer",
          "minimum": 0,
          "description": "Number of users following"
        },
        "copy_traders_count": {
          "type": "integer",
          "minimum": 0,
          "description": "Number of users copying trades"
        },
        "leaderboard_rank": {
          "type": "integer",
          "minimum": 1,
          "description": "Current leaderboard position"
        }
      },
      "description": "User social trading statistics"
    }
  },
  "required": ["id", "email", "username", "created_at", "is_active"]
}
```

## Course Data Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique course identifier"
    },
    "title": {
      "type": "string",
      "description": "Course title"
    },
    "description": {
      "type": "string",
      "description": "Course description"
    },
    "instructor": {
      "type": "string",
      "description": "Course instructor"
    },
    "price": {
      "type": "number",
      "minimum": 0,
      "description": "Course price in USD"
    },
    "duration_hours": {
      "type": "integer",
      "minimum": 1,
      "description": "Course duration in hours"
    },
    "level": {
      "type": "string",
      "enum": ["beginner", "intermediate", "advanced"],
      "description": "Course difficulty level"
    },
    "modules": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "duration_minutes": {
            "type": "integer",
            "minimum": 1
          },
          "content_url": {
            "type": "string",
            "format": "uri"
          }
        },
        "required": ["title", "duration_minutes"]
      },
      "description": "Course modules"
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "description": "Course creation timestamp"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "description": "Course last update timestamp"
    },
    "is_published": {
      "type": "boolean",
      "description": "Publication status"
    }
  },
  "required": ["id", "title", "description", "price", "level", "created_at", "is_published"]
}
```

## Market Data Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "symbol": {
      "type": "string",
      "description": "Trading symbol (e.g., EUR/USD, AAPL, BTC/USD, XAU/USD, SPY)"
    },
    "asset_type": {
      "type": "string",
      "enum": ["forex", "stock", "crypto", "commodity", "index"],
      "description": "Type of asset"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "Data timestamp"
    },
    "open": {
      "type": "number",
      "minimum": 0,
      "description": "Opening price"
    },
    "high": {
      "type": "number",
      "minimum": 0,
      "description": "Highest price"
    },
    "low": {
      "type": "number",
      "minimum": 0,
      "description": "Lowest price"
    },
    "close": {
      "type": "number",
      "minimum": 0,
      "description": "Closing price"
    },
    "volume": {
      "type": "integer",
      "minimum": 0,
      "description": "Trading volume"
    },
    "timeframe": {
      "type": "string",
      "enum": ["1m", "5m", "15m", "1h", "4h", "1d"],
      "description": "Data timeframe"
    }
  },
  "required": ["symbol", "asset_type", "timestamp", "open", "high", "low", "close", "timeframe"]
}
```

## Paper Trading Account Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique paper trading account identifier"
    },
    "user_id": {
      "type": "string",
      "description": "User identifier"
    },
    "balance": {
      "type": "number",
      "minimum": 0,
      "description": "Current account balance"
    },
    "initial_balance": {
      "type": "number",
      "minimum": 0,
      "description": "Initial account balance"
    },
    "account_currency": {
      "type": "string",
      "pattern": "^[A-Z]{3}$",
      "description": "Account currency (e.g., USD)"
    },
    "leverage": {
      "type": "integer",
      "minimum": 1,
      "maximum": 500,
      "description": "Account leverage"
    },
    "margin_used": {
      "type": "number",
      "minimum": 0,
      "description": "Margin currently used"
    },
    "equity": {
      "type": "number",
      "description": "Current account equity (balance + unrealized P&L)"
    },
    "free_margin": {
      "type": "number",
      "description": "Available margin for new trades"
    },
    "total_pnl": {
      "type": "number",
      "description": "Total realized profit and loss"
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "description": "Account creation timestamp"
    },
    "status": {
      "type": "string",
      "enum": ["active", "suspended", "closed"],
      "description": "Account status"
    },
    "allowed_asset_types": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["forex", "stock", "crypto", "commodity", "index"]
      },
      "description": "Asset types allowed for this account"
    },
    "trading_stats": {
      "type": "object",
      "properties": {
        "total_trades": {
          "type": "integer",
          "minimum": 0,
          "description": "Total number of trades"
        },
        "winning_trades": {
          "type": "integer",
          "minimum": 0,
          "description": "Number of winning trades"
        },
        "losing_trades": {
          "type": "integer",
          "minimum": 0,
          "description": "Number of losing trades"
        },
        "win_rate": {
          "type": "number",
          "minimum": 0,
          "maximum": 100,
          "description": "Win rate percentage"
        },
        "avg_win": {
          "type": "number",
          "description": "Average winning trade"
        },
        "avg_loss": {
          "type": "number",
          "description": "Average losing trade"
        },
        "largest_win": {
          "type": "number",
          "description": "Largest winning trade"
        },
        "largest_loss": {
          "type": "number",
          "description": "Largest losing trade"
        }
      },
      "description": "Account trading statistics"
    }
  },
  "required": ["id", "user_id", "balance", "account_currency", "leverage", "created_at", "status", "allowed_asset_types"]
}
```

## Social Trading Relationship Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique relationship identifier"
    },
    "follower_id": {
      "type": "string",
      "description": "User who is following"
    },
    "trader_id": {
      "type": "string",
      "description": "User being followed"
    },
    "relationship_type": {
      "type": "string",
      "enum": ["follow", "copy"],
      "description": "Type of social relationship"
    },
    "copy_settings": {
      "type": "object",
      "properties": {
        "enabled": {
          "type": "boolean",
          "description": "Whether copy trading is enabled"
        },
        "copy_percentage": {
          "type": "number",
          "minimum": 0.1,
          "maximum": 100,
          "description": "Percentage of trader's position to copy"
        },
        "max_position_size": {
          "type": "number",
          "minimum": 0,
          "description": "Maximum position size to copy"
        },
        "asset_types_filter": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["forex", "stock", "crypto", "commodity", "index"]
          },
          "description": "Asset types to copy (empty means all)"
        },
        "risk_multiplier": {
          "type": "number",
          "minimum": 0.1,
          "maximum": 5,
          "description": "Risk multiplier for copied trades"
        }
      },
      "description": "Copy trading settings"
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "description": "Relationship creation timestamp"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "description": "Relationship last update timestamp"
    },
    "is_active": {
      "type": "boolean",
      "description": "Whether the relationship is active"
    }
  },
  "required": ["id", "follower_id", "trader_id", "relationship_type", "created_at", "is_active"]
}
```

## Trader Profile Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "Trader user identifier"
    },
    "display_name": {
      "type": "string",
      "description": "Display name for social features"
    },
    "bio": {
      "type": "string",
      "maxLength": 500,
      "description": "Trader biography"
    },
    "trading_style": {
      "type": "string",
      "enum": ["scalping", "day_trading", "swing_trading", "position_trading", "mixed"],
      "description": "Primary trading style"
    },
    "specializations": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["forex", "stocks", "crypto", "commodities", "indices"]
      },
      "description": "Asset specializations"
    },
    "experience_years": {
      "type": "integer",
      "minimum": 0,
      "description": "Years of trading experience"
    },
    "risk_score": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "AI-calculated risk score (0-100)"
    },
    "performance_score": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "AI-calculated performance score (0-100)"
    },
    "is_public": {
      "type": "boolean",
      "description": "Whether profile is publicly visible"
    },
    "allow_copy_trading": {
      "type": "boolean",
      "description": "Whether others can copy trades"
    },
    "monthly_stats": {
      "type": "object",
      "properties": {
        "return_percentage": {
          "type": "number",
          "description": "Monthly return percentage"
        },
        "volatility": {
          "type": "number",
          "description": "Monthly volatility measure"
        },
        "max_drawdown": {
          "type": "number",
          "description": "Maximum drawdown percentage"
        },
        "sharpe_ratio": {
          "type": "number",
          "description": "Sharpe ratio"
        }
      },
      "description": "Monthly performance statistics"
    },
    "achievements": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["consistency", "profitability", "volume", "streak", "special"]
          },
          "title": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "earned_at": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "description": "Trading achievements and badges"
    }
  },
  "required": ["user_id", "is_public"]
}
 
 