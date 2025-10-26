from fastapi import FastAPI

app = FastAPI(title="Backtester API")

@app.post("/backtest")
async def backtest(strategy: dict):
    # Mock backtest result
    return {
        "total_return": 15.5,
        "sharpe_ratio": 1.2,
        "max_drawdown": -5.0,
        "win_rate": 60.0
    }