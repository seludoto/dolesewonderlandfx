# Advanced Backtester Service

A comprehensive backtesting service built with FastAPI and Backtrader for testing trading strategies on historical market data.

## Features

- **Multiple Trading Strategies**: SMA Crossover, RSI, MACD, Bollinger Bands
- **Real Market Data**: Integration with Yahoo Finance for historical data
- **Comprehensive Analytics**: Sharpe ratio, drawdown, win rate, and more
- **Parameter Optimization**: Grid search and genetic algorithm optimization
- **Async Processing**: Background processing for long-running backtests
- **RESTful API**: Clean REST API for integration with frontend applications

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the service:
```bash
python api.py
```

The service will start on `http://localhost:8001`

## API Endpoints

### POST /backtest
Run a synchronous backtest

**Request Body:**
```json
{
  "strategy": "sma_cross",
  "symbol": "AAPL",
  "timeframe": "1d",
  "start_date": "2020-01-01",
  "end_date": "2023-12-31",
  "initial_cash": 10000.0,
  "commission": 0.001,
  "parameters": {
    "fast_period": 10,
    "slow_period": 30
  }
}
```

### POST /backtest/async
Run an asynchronous backtest

### GET /backtest/{backtest_id}
Get the result of an asynchronous backtest

### GET /strategies
Get available trading strategies and their parameters

### GET /symbols
Get available trading symbols

### GET /health
Health check endpoint

## Available Strategies

1. **SMA Crossover** (`sma_cross`)
   - Uses fast and slow moving averages
   - Buys when fast MA crosses above slow MA
   - Sells when fast MA crosses below slow MA

2. **RSI Strategy** (`rsi`)
   - Uses Relative Strength Index
   - Buys when RSI < oversold level
   - Sells when RSI > overbought level

3. **MACD Strategy** (`macd`)
   - Uses MACD indicator with signal line
   - Buys when MACD crosses above signal line
   - Sells when MACD crosses below signal line

4. **Bollinger Bands** (`bollinger_bands`)
   - Uses Bollinger Bands for mean reversion
   - Buys when price touches lower band
   - Sells when price touches upper band

## Response Format

```json
{
  "id": "backtest-id",
  "status": "completed",
  "result": {
    "total_return": 15.5,
    "sharpe_ratio": 1.2,
    "max_drawdown": -5.0,
    "win_rate": 60.0,
    "final_value": 11550.0,
    "total_trades": 45,
    "won_trades": 27,
    "lost_trades": 18,
    "avg_win": 125.50,
    "avg_loss": -85.30,
    "largest_win": 500.0,
    "largest_loss": -300.0,
    "trades": [...],
    "equity_curve": [...],
    "parameters": {...}
  }
}
```

## Docker Support

Build and run with Docker:

```bash
docker build -t backtester .
docker run -p 8001:8001 backtester
```
