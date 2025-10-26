# Insight Generator Service

Generates trading insights, market analysis, and educational content for the DoleSe Wonderland FX platform.

## Features

- Market analysis insights (technical, fundamental, sentiment)
- Educational content generation (lessons, quizzes, articles)
- Trading performance analysis
- Strategy comparison tools
- Trending topics identification

## API Endpoints

### Market Analysis

#### POST `/api/v1/insights/market-analysis`
Generate market analysis insights.

**Request:**
```json
{
  "symbol": "EUR/USD",
  "timeframe": "1h",
  "analysis_type": "technical",
  "data_points": [
    {"timestamp": "2024-01-15T10:00:00Z", "price": 1.0850, "volume": 1000}
  ]
}
```

**Response:**
```json
{
  "symbol": "EUR/USD",
  "timeframe": "1h",
  "analysis_type": "technical",
  "title": "Technical Analysis: EUR/USD",
  "summary": "Current technical setup...",
  "key_levels": {"support": [1.0800], "resistance": [1.0900]},
  "recommendation": "Buy on dips",
  "confidence": 0.82
}
```

### Educational Content

#### POST `/api/v1/insights/educational-content`
Generate educational content.

**Request:**
```json
{
  "topic": "Support and Resistance",
  "difficulty": "beginner",
  "content_type": "lesson",
  "user_level": 1
}
```

### Performance Analysis

#### POST `/api/v1/insights/performance-analysis`
Analyze trading performance.

**Request:**
```json
{
  "user_id": 1,
  "period": "month",
  "include_recommendations": true
}
```

### Strategy Comparison

#### POST `/api/v1/insights/strategy-comparison`
Compare multiple trading strategies.

**Request:**
```json
{
  "strategy_ids": [1, 2, 3],
  "comparison_metrics": ["win_rate", "profit_factor", "max_drawdown"],
  "benchmark_symbol": "SPY"
}
```

### Trending Topics

#### GET `/api/v1/insights/trending-topics`
Get trending topics and insights.

## Analysis Types

### Technical Analysis
- Key support/resistance levels
- Indicator signals (RSI, MACD, moving averages)
- Chart pattern recognition
- Trend analysis

### Fundamental Analysis
- Economic data interpretation
- Interest rate impact assessment
- GDP and inflation analysis
- Currency strength evaluation

### Sentiment Analysis
- Social media sentiment tracking
- News coverage analysis
- Retail vs institutional positioning
- Market psychology indicators

## Educational Content Types

### Lessons
- Structured learning modules
- Progressive difficulty levels
- Interactive examples
- Knowledge assessments

### Quizzes
- Multiple choice questions
- Immediate feedback
- Progress tracking
- Certification preparation

### Articles
- In-depth analysis pieces
- Market commentary
- Strategy explanations
- Educational resources

## Performance Metrics

- Win rate and profit factor
- Risk-adjusted returns (Sharpe ratio)
- Maximum drawdown analysis
- Trade timing statistics
- Portfolio optimization suggestions

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
docker build -t dolesewonderlandfx/insight-generator .
docker run -p 8004:8004 dolesewonderlandfx/insight-generator
```

## Data Sources

- Real-time market data feeds
- Historical price databases
- Economic indicators
- Social media sentiment
- News aggregators

## Machine Learning Integration

- Natural language processing for news analysis
- Pattern recognition for chart analysis
- Sentiment analysis algorithms
- Predictive modeling for market forecasting

## Caching Strategy

- Redis for frequently accessed insights
- Database caching for historical analysis
- CDN for static educational content
- In-memory caching for real-time data

## Personalization

- User skill level adaptation
- Trading style preferences
- Risk tolerance assessment
- Learning progress tracking

## Quality Assurance

- Insight accuracy validation
- Content peer review system
- User feedback integration
- Continuous improvement algorithms

## Future Enhancements

- Video content generation
- Interactive trading simulations
- Personalized learning paths
- Advanced AI tutoring
- Multi-language support