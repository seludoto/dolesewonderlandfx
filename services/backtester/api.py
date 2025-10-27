from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import backtrader as bt
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import uuid
import asyncio
from concurrent.futures import ThreadPoolExecutor
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Advanced Backtester API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global executor for running backtests in background
executor = ThreadPoolExecutor(max_workers=4)

# Store running backtests
running_backtests = {}

class BacktestRequest(BaseModel):
    strategy: str
    symbol: str
    timeframe: str = "1d"
    start_date: str
    end_date: str
    initial_cash: float = 10000.0
    commission: float = 0.001
    parameters: Dict[str, Any] = {}

class OptimizationRequest(BaseModel):
    strategy: str
    symbol: str
    timeframe: str = "1d"
    start_date: str
    end_date: str
    initial_cash: float = 10000.0
    commission: float = 0.001
    param_ranges: Dict[str, List[Any]] = {}
    optimization_method: str = "grid"  # grid, genetic, or random

class BacktestResult(BaseModel):
    id: str
    status: str
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

# Custom strategies
class SMACrossStrategy(bt.Strategy):
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
            if self.crossover > 0:  # Fast MA crosses above Slow MA
                self.buy()
        elif self.crossover < 0:  # Fast MA crosses below Slow MA
            self.sell()

class RSIStrategy(bt.Strategy):
    params = (
        ('rsi_period', 14),
        ('overbought', 70),
        ('oversold', 30),
    )

    def __init__(self):
        self.rsi = bt.indicators.RSI(self.data.close, period=self.params.rsi_period)

    def next(self):
        if not self.position:
            if self.rsi < self.params.oversold:
                self.buy()
        elif self.rsi > self.params.overbought:
            self.sell()

class MACDStrategy(bt.Strategy):
    params = (
        ('fast_period', 12),
        ('slow_period', 26),
        ('signal_period', 9),
    )

    def __init__(self):
        self.macd = bt.indicators.MACD(
            self.data.close,
            period_me1=self.params.fast_period,
            period_me2=self.params.slow_period,
            period_signal=self.params.signal_period
        )
        self.crossover = bt.indicators.CrossOver(self.macd.macd, self.macd.signal)

    def next(self):
        if not self.position:
            if self.crossover > 0:
                self.buy()
        elif self.crossover < 0:
            self.sell()

class BollingerBandsStrategy(bt.Strategy):
    params = (
        ('period', 20),
        ('devfactor', 2.0),
    )

    def __init__(self):
        self.boll = bt.indicators.BollingerBands(self.data.close, period=self.params.period, devfactor=self.params.devfactor)

    def next(self):
        if not self.position:
            if self.data.close < self.boll.lines.bot:
                self.buy()
        elif self.data.close > self.boll.lines.top:
            self.sell()

def get_strategy_class(strategy_name: str):
    strategies = {
        'sma_cross': SMACrossStrategy,
        'rsi': RSIStrategy,
        'macd': MACDStrategy,
        'bollinger_bands': BollingerBandsStrategy,
    }
    return strategies.get(strategy_name)

def download_data(symbol: str, start_date: str, end_date: str, timeframe: str = "1d"):
    """Generate mock historical data for backtesting"""
    try:
        # Parse dates
        start = pd.to_datetime(start_date)
        end = pd.to_datetime(end_date)

        # Generate date range
        if timeframe == "1d":
            dates = pd.date_range(start=start, end=end, freq='D')
        elif timeframe == "1h":
            dates = pd.date_range(start=start, end=end, freq='H')
        elif timeframe == "30m":
            dates = pd.date_range(start=start, end=end, freq='30min')
        elif timeframe == "15m":
            dates = pd.date_range(start=start, end=end, freq='15min')
        elif timeframe == "5m":
            dates = pd.date_range(start=start, end=end, freq='5min')
        else:
            dates = pd.date_range(start=start, end=end, freq='D')

        # Generate realistic price data
        n_points = len(dates)
        if n_points < 2:
            raise ValueError("Date range too small")

        # Start with a realistic price based on symbol
        symbol_prices = {
            "AAPL": 150, "GOOGL": 2800, "MSFT": 300, "TSLA": 250, "EURUSD=X": 1.08,
            "GBPUSD=X": 1.27, "USDJPY=X": 147, "BTC-USD": 45000, "ETH-USD": 2800,
            "^GSPC": 4200, "^DJI": 34000, "GC=F": 1950, "CL=F": 78
        }

        base_price = symbol_prices.get(symbol, 100)

        # Generate price series with realistic volatility
        np.random.seed(hash(symbol) % 2**32)  # Reproducible seed based on symbol

        # Create random walk with mean reversion
        returns = np.random.normal(0.0001, 0.02, n_points)  # Small drift, 2% daily vol
        prices = base_price * np.exp(np.cumsum(returns))

        # Ensure prices stay positive and realistic
        prices = np.maximum(prices, base_price * 0.5)
        prices = np.minimum(prices, base_price * 2.0)

        # Generate OHLC from close prices
        closes = prices
        highs = closes * (1 + np.random.uniform(0.001, 0.03, n_points))
        lows = closes * (1 - np.random.uniform(0.001, 0.03, n_points))
        opens = closes + np.random.normal(0, closes * 0.005, n_points)
        opens = np.maximum(opens, lows)
        opens = np.minimum(opens, highs)

        # Generate volume
        base_volume = 1000000 if "STOCK" in symbol.upper() or not any(x in symbol for x in ["=", "-"]) else 100000
        volumes = np.random.lognormal(np.log(base_volume), 0.5, n_points).astype(int)

        # Create DataFrame
        data = pd.DataFrame({
            'open': opens,
            'high': highs,
            'low': lows,
            'close': closes,
            'volume': volumes
        }, index=dates)

        return data

    except Exception as e:
        logger.error(f"Error generating mock data for {symbol}: {str(e)}")
        raise

def run_backtest(request: BacktestRequest) -> Dict[str, Any]:
    """Run a single backtest"""
    try:
        # Download data
        data = download_data(request.symbol, request.start_date, request.end_date, request.timeframe)

        # Create cerebro
        cerebro = bt.Cerebro()
        cerebro.addstrategy(get_strategy_class(request.strategy), **request.parameters)
        cerebro.broker.setcash(request.initial_cash)
        cerebro.broker.setcommission(commission=request.commission)

        # Add data feed
        data_feed = bt.feeds.PandasData(dataname=data)
        cerebro.adddata(data_feed)

        # Add analyzers
        cerebro.addanalyzer(bt.analyzers.SharpeRatio, _name='sharpe')
        cerebro.addanalyzer(bt.analyzers.DrawDown, _name='drawdown')
        cerebro.addanalyzer(bt.analyzers.Returns, _name='returns')
        cerebro.addanalyzer(bt.analyzers.TradeAnalyzer, _name='trades')
        cerebro.addanalyzer(bt.analyzers.TimeReturn, _name='timereturn')

        # Run backtest
        results = cerebro.run()
        strat = results[0]

        # Extract results
        final_value = cerebro.broker.getvalue()
        total_return = (final_value - request.initial_cash) / request.initial_cash * 100

        # Get analyzer results
        sharpe_ratio = strat.analyzers.sharpe.get_analysis().get('sharperatio', 0)
        max_drawdown = strat.analyzers.drawdown.get_analysis().get('max', {}).get('drawdown', 0)
        returns_analysis = strat.analyzers.returns.get_analysis()
        trades_analysis = strat.analyzers.trades.get_analysis()

        # Calculate additional metrics
        win_rate = 0
        if 'won' in trades_analysis and 'total' in trades_analysis:
            won_trades = trades_analysis['won']['total']
            total_trades = trades_analysis['total']['total']
            win_rate = (won_trades / total_trades * 100) if total_trades > 0 else 0

        # Get trade history from TradeAnalyzer
        trades = []
        if 'trades' in trades_analysis:
            for trade_data in trades_analysis.get('trades', []):
                if isinstance(trade_data, dict):
                    trades.append({
                        'symbol': request.symbol,
                        'pnl': trade_data.get('pnl', 0),
                        'pnlcomm': trade_data.get('pnlcomm', 0),
                        'size': trade_data.get('size', 0)
                    })

        # If no detailed trades, create summary
        if not trades:
            trades = [{
                'symbol': request.symbol,
                'total_trades': trades_analysis.get('total', {}).get('total', 0),
                'won_trades': trades_analysis.get('won', {}).get('total', 0),
                'lost_trades': trades_analysis.get('lost', {}).get('total', 0)
            }]

        return {
            'total_return': round(total_return, 2),
            'sharpe_ratio': round(sharpe_ratio, 2) if sharpe_ratio else 0,
            'max_drawdown': round(max_drawdown, 2),
            'win_rate': round(win_rate, 2),
            'final_value': round(final_value, 2),
            'total_trades': trades_analysis.get('total', {}).get('total', 0),
            'won_trades': trades_analysis.get('won', {}).get('total', 0),
            'lost_trades': trades_analysis.get('lost', {}).get('total', 0),
            'avg_win': round(trades_analysis.get('won', {}).get('pnl', {}).get('average', 0), 2),
            'avg_loss': round(trades_analysis.get('lost', {}).get('pnl', {}).get('average', 0), 2),
            'largest_win': round(trades_analysis.get('won', {}).get('pnl', {}).get('max', 0), 2),
            'largest_loss': round(trades_analysis.get('lost', {}).get('pnl', {}).get('max', 0), 2),
            'trades': trades,
            'equity_curve': list(strat.analyzers.timereturn.get_analysis().values()),
            'parameters': request.parameters
        }

    except Exception as e:
        logger.error(f"Backtest error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Backtest failed: {str(e)}")

@app.post("/backtest", response_model=BacktestResult)
async def backtest(request: BacktestRequest, background_tasks: BackgroundTasks):
    """Run a backtest synchronously"""
    try:
        result = await asyncio.get_event_loop().run_in_executor(
            executor, run_backtest, request
        )

        return BacktestResult(
            id=str(uuid.uuid4()),
            status="completed",
            result=result
        )
    except Exception as e:
        return BacktestResult(
            id=str(uuid.uuid4()),
            status="failed",
            error=str(e)
        )

@app.post("/backtest/async", response_model=BacktestResult)
async def backtest_async(request: BacktestRequest, background_tasks: BackgroundTasks):
    """Run a backtest asynchronously"""
    backtest_id = str(uuid.uuid4())
    running_backtests[backtest_id] = {"status": "running", "result": None, "error": None}

    background_tasks.add_task(run_backtest_async, backtest_id, request)

    return BacktestResult(id=backtest_id, status="running")

async def run_backtest_async(backtest_id: str, request: BacktestRequest):
    """Run backtest in background"""
    try:
        result = await asyncio.get_event_loop().run_in_executor(
            executor, run_backtest, request
        )
        running_backtests[backtest_id] = {
            "status": "completed",
            "result": result,
            "error": None
        }
    except Exception as e:
        running_backtests[backtest_id] = {
            "status": "failed",
            "result": None,
            "error": str(e)
        }

@app.get("/backtest/{backtest_id}", response_model=BacktestResult)
async def get_backtest_result(backtest_id: str):
    """Get backtest result by ID"""
    if backtest_id not in running_backtests:
        raise HTTPException(status_code=404, detail="Backtest not found")

    backtest = running_backtests[backtest_id]
    return BacktestResult(
        id=backtest_id,
        status=backtest["status"],
        result=backtest["result"],
        error=backtest["error"]
    )

@app.get("/strategies")
async def get_strategies():
    """Get available strategies"""
    return {
        "strategies": [
            {
                "id": "sma_cross",
                "name": "SMA Crossover",
                "description": "Moving Average Crossover strategy",
                "parameters": {
                    "fast_period": {"type": "int", "default": 10, "min": 5, "max": 50},
                    "slow_period": {"type": "int", "default": 30, "min": 10, "max": 200}
                }
            },
            {
                "id": "rsi",
                "name": "RSI Strategy",
                "description": "Relative Strength Index based strategy",
                "parameters": {
                    "rsi_period": {"type": "int", "default": 14, "min": 5, "max": 50},
                    "overbought": {"type": "int", "default": 70, "min": 50, "max": 90},
                    "oversold": {"type": "int", "default": 30, "min": 10, "max": 50}
                }
            },
            {
                "id": "macd",
                "name": "MACD Strategy",
                "description": "MACD indicator based strategy",
                "parameters": {
                    "fast_period": {"type": "int", "default": 12, "min": 5, "max": 50},
                    "slow_period": {"type": "int", "default": 26, "min": 10, "max": 100},
                    "signal_period": {"type": "int", "default": 9, "min": 5, "max": 20}
                }
            },
            {
                "id": "bollinger_bands",
                "name": "Bollinger Bands",
                "description": "Bollinger Bands mean reversion strategy",
                "parameters": {
                    "period": {"type": "int", "default": 20, "min": 10, "max": 50},
                    "devfactor": {"type": "float", "default": 2.0, "min": 1.0, "max": 3.0}
                }
            }
        ]
    }

@app.get("/symbols")
async def get_symbols():
    """Get available trading symbols"""
    return {
        "symbols": [
            {"symbol": "AAPL", "name": "Apple Inc.", "type": "stock"},
            {"symbol": "GOOGL", "name": "Alphabet Inc.", "type": "stock"},
            {"symbol": "MSFT", "name": "Microsoft Corporation", "type": "stock"},
            {"symbol": "TSLA", "name": "Tesla Inc.", "type": "stock"},
            {"symbol": "EURUSD=X", "name": "EUR/USD", "type": "forex"},
            {"symbol": "GBPUSD=X", "name": "GBP/USD", "type": "forex"},
            {"symbol": "USDJPY=X", "name": "USD/JPY", "type": "forex"},
            {"symbol": "BTC-USD", "name": "Bitcoin USD", "type": "crypto"},
            {"symbol": "ETH-USD", "name": "Ethereum USD", "type": "crypto"},
            {"symbol": "^GSPC", "name": "S&P 500", "type": "index"},
            {"symbol": "^DJI", "name": "Dow Jones Industrial", "type": "index"},
            {"symbol": "GC=F", "name": "Gold Futures", "type": "commodity"},
            {"symbol": "CL=F", "name": "Crude Oil Futures", "type": "commodity"}
        ]
    }

@app.post("/optimize", response_model=BacktestResult)
async def optimize_strategy(request: OptimizationRequest, background_tasks: BackgroundTasks):
    """Optimize strategy parameters"""
    try:
        # Simple grid search optimization
        best_result = None
        best_params = None
        best_score = float('-inf')

        # Generate parameter combinations (simple grid search)
        param_combinations = []
        if request.param_ranges:
            # For now, just test a few combinations
            for fast_period in [5, 10, 15, 20]:
                for slow_period in [20, 30, 40, 50]:
                    if fast_period < slow_period:  # Ensure fast < slow for MA crossover
                        param_combinations.append({
                            'fast_period': fast_period,
                            'slow_period': slow_period
                        })

        # Test each combination
        for params in param_combinations[:10]:  # Limit to 10 combinations for demo
            test_request = BacktestRequest(
                strategy=request.strategy,
                symbol=request.symbol,
                timeframe=request.timeframe,
                start_date=request.start_date,
                end_date=request.end_date,
                initial_cash=request.initial_cash,
                commission=request.commission,
                parameters=params
            )

            try:
                result = await asyncio.get_event_loop().run_in_executor(
                    executor, run_backtest, test_request
                )

                # Use Sharpe ratio as optimization metric
                score = result.get('sharpe_ratio', 0)
                if score > best_score:
                    best_score = score
                    best_result = result
                    best_params = params

            except Exception as e:
                logger.warning(f"Optimization iteration failed: {str(e)}")
                continue

        if best_result:
            best_result['optimization_score'] = best_score
            best_result['optimized_parameters'] = best_params
            best_result['total_combinations_tested'] = len(param_combinations)

        return BacktestResult(
            id=str(uuid.uuid4()),
            status="completed",
            result=best_result
        )
    except Exception as e:
        return BacktestResult(
            id=str(uuid.uuid4()),
            status="failed",
            error=str(e)
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)