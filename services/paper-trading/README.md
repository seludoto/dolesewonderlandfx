# Paper Trading Service

Risk-free trading simulation service for the DoleSe Wonderland FX platform.

## Features

- Virtual trading accounts with realistic balances
- Real-time market price simulation
- Order execution (market, limit, stop orders)
- Position management and P&L tracking
- Margin and leverage calculations
- Trade history and performance analytics

## API Endpoints

### Account Management

#### POST `/api/v1/paper-trading/accounts`

Create a new paper trading account.

**Request:**

```json
{
  "user_id": 1,
  "initial_balance": 10000.0,
  "account_currency": "USD",
  "leverage": 100
}
```

**Response:**

```json
{
  "account_id": "uuid-here",
  "message": "Paper trading account created successfully",
  "account": {
    "id": "uuid-here",
    "balance": 10000.0,
    "leverage": 100,
    "status": "active"
  }
}
```

### Order Execution

#### POST `/api/v1/paper-trading/orders`

Place a trading order.

**Request:**

```json
{
  "account_id": "account-uuid",
  "symbol": "EUR/USD",
  "order_type": "market",
  "side": "buy",
  "quantity": 0.1,
  "stop_loss": 1.0800,
  "take_profit": 1.1000
}
```

### Position Management

#### POST `/api/v1/paper-trading/positions/{position_id}/close`

Close a trading position.

**Request:**

```json
{
  "quantity": 0.05  // Optional: partial close
}
```

### Account Information

#### GET `/api/v1/paper-trading/accounts/{account_id}`

Get account summary with positions and history.

**Query Parameters:**

- `include_positions`: Include open positions (default: true)
- `include_history`: Include recent trade history (default: false)

### Market Data

#### GET `/api/v1/paper-trading/market/prices`

Get current market prices.

**Query Parameters:**

- `symbols`: Comma-separated list of symbols (optional)

## Trading Features

### Order Types

- **Market Orders**: Execute immediately at current market price
- **Limit Orders**: Execute only at specified price or better
- **Stop Orders**: Execute when price reaches stop level

### Position Management

- **Full Close**: Close entire position
- **Partial Close**: Close portion of position
- **Stop Loss/Take Profit**: Automatic position closure

### Risk Management

- **Margin Requirements**: Realistic margin calculations
- **Leverage Limits**: Configurable leverage ratios
- **Free Margin Tracking**: Available margin monitoring

## Market Simulation

### Price Feeds

- Real-time price updates with bid/ask spreads
- Realistic price movements and volatility
- Multiple currency pairs support

### Trading Hours

- 24/5 forex market simulation
- Weekend market closure
- Holiday schedule support

## Performance Tracking

### Account Metrics

- Balance and equity tracking
- Unrealized and realized P&L
- Margin utilization
- Win/loss statistics

### Trade Analytics

- Entry/exit prices and times
- P&L per trade
- Holding periods
- Risk-reward ratios

## Development

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Run the service:

```bash
python main.py
```

## Docker

Build and run with Docker:

```bash
docker build -t dolesewonderlandfx/paper-trading .
docker run -p 8005:8005 dolesewonderlandfx/paper-trading
```

## Data Storage

Currently uses in-memory storage for demonstration. For production:

- Database integration for persistent accounts
- Redis for session management
- Time-series database for trade history
- Message queue for order processing

## Integration Points

- **Auth Service**: User authentication and account ownership
- **Market Data Service**: Real-time price feeds (future)
- **Risk Service**: Position risk assessment
- **Analytics Service**: Performance reporting

## Security Considerations

- Account isolation and access control
- Order validation and fraud prevention
- Rate limiting for API calls
- Audit logging for all trades

## Scalability Features

- Asynchronous order processing
- Horizontal scaling support
- Database connection pooling
- Caching for market data

## Future Enhancements

- Advanced order types (trailing stops, OCO orders)
- Multi-asset support (stocks, crypto, commodities)
- Social trading features
- Strategy backtesting integration
- Mobile app synchronization
