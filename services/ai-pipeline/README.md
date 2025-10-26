# AI Pipeline Service

AI-powered trading insights and analysis service for the DoleSe Wonderland FX platform.

## Features

- Trading strategy analysis and optimization
- Market prediction and forecasting
- Personalized trading insights
- Real-time risk assessment
- Machine learning model integration

## API Endpoints

### Strategy Analysis

#### POST `/api/v1/ai/analyze-strategy`

Analyze a trading strategy's performance and risk.

**Request:**

```json
{
  "strategy_id": 1,
  "historical_data": [
    {"date": "2024-01-01", "price": 1.0850, "volume": 1000}
  ],
  "parameters": {"stop_loss": 0.02, "take_profit": 0.04}
}
```

**Response:**

```json
{
  "strategy_id": 1,
  "performance_score": 0.85,
  "risk_level": "medium",
  "recommendations": ["Consider adjusting stop loss..."],
  "confidence": 0.78,
  "analyzed_at": "2024-01-15T10:30:00Z"
}
```

### Market Prediction

#### POST `/api/v1/ai/predict-market`

Generate market movement predictions.

**Request:**

```json
{
  "symbol": "EUR/USD",
  "timeframe": "1h",
  "indicators": ["RSI", "MACD", "Bollinger Bands"],
  "historical_data": [
    {"timestamp": "2024-01-15T10:00:00Z", "price": 1.0850}
  ]
}
```

### Trading Insights

#### POST `/api/v1/ai/generate-insights`

Generate personalized trading insights.

**Request:**

```json
{
  "user_id": 1,
  "portfolio_data": [
    {"symbol": "EUR/USD", "position": "long", "size": 1000}
  ],
  "market_conditions": {"volatility": 0.15, "trend": "bullish"}
}
```

### Risk Assessment

#### POST `/api/v1/ai/assess-risk`

Assess trading risk in real-time.

**Request:**

```json
{
  "strategy_id": 1,
  "position_size": 1000,
  "stop_loss": 0.02,
  "take_profit": 0.04,
  "market_volatility": 0.12
}
```

### Model Information

#### GET `/api/v1/ai/models`

List available AI models and capabilities.

## Configuration

Environment variables:

- `OPENAI_API_KEY`: OpenAI API key for advanced AI features

## AI Models

### Strategy Analyzer

- **Purpose**: Evaluate trading strategy performance
- **Input**: Historical trading data, strategy parameters
- **Output**: Performance metrics, risk assessment, optimization suggestions

### Market Predictor

- **Purpose**: Forecast market movements
- **Input**: Price data, technical indicators, market conditions
- **Output**: Price predictions, confidence levels, key factors

### Insight Generator

- **Purpose**: Create personalized trading recommendations
- **Input**: User portfolio, trading history, market data
- **Output**: Actionable insights, opportunities, warnings

### Risk Assessor

- **Purpose**: Evaluate position and portfolio risk
- **Input**: Position details, market conditions
- **Output**: Risk scores, position sizing recommendations

## Development

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Set up environment variables:

```bash
export OPENAI_API_KEY="your-api-key-here"
```

3. Run the service:

```bash
python main.py
```

## Docker

Build and run with Docker:

```bash
docker build -t dolesewonderlandfx/ai-pipeline .
docker run -p 8003:8003 -e OPENAI_API_KEY="your-key" dolesewonderlandfx/ai-pipeline
```

## Machine Learning Models

The service supports integration with various ML models:

- **Traditional ML**: Scikit-learn models for pattern recognition
- **Deep Learning**: TensorFlow/Keras for complex predictions
- **LLM Integration**: OpenAI GPT for natural language insights
- **Time Series**: Specialized models for financial time series

## Data Processing

- Real-time data ingestion from market feeds
- Historical data analysis and backtesting
- Feature engineering for ML models
- Model training and validation pipelines

## Performance Optimization

- Asynchronous processing for heavy computations
- Model caching and warm-up
- Batch processing for multiple predictions
- Resource monitoring and auto-scaling

## Security Considerations

- API key encryption and secure storage
- Input validation and sanitization
- Rate limiting for AI requests
- Audit logging for model predictions
- Data privacy compliance (GDPR, CCPA)

## Monitoring

- Model performance metrics
- Prediction accuracy tracking
- API response times
- Resource utilization
- Error rates and anomaly detection

## Future Enhancements

- Custom model training pipelines
- Advanced NLP for news analysis
- Multi-asset portfolio optimization
- Real-time sentiment analysis
- Automated strategy generation
