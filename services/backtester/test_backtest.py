#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api import run_backtest, BacktestRequest

def test_backtest():
    # Create a test request
    request = BacktestRequest(
        strategy="sma_cross",
        symbol="AAPL",
        start_date="2023-01-01",
        end_date="2023-12-31",
        initial_cash=10000.0,
        parameters={"fast_period": 10, "slow_period": 30}
    )

    try:
        result = run_backtest(request)
        print("Backtest completed successfully!")
        print(f"Total Return: {result['total_return']}%")
        print(f"Sharpe Ratio: {result['sharpe_ratio']}")
        print(f"Max Drawdown: {result['max_drawdown']}%")
        print(f"Win Rate: {result['win_rate']}%")
        print(f"Final Value: ${result['final_value']}")
        print(f"Total Trades: {result['total_trades']}")
        return True
    except Exception as e:
        print(f"Backtest failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_backtest()
    sys.exit(0 if success else 1)