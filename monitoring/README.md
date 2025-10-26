# Monitoring Stack

This directory contains the monitoring infrastructure for the DoleSe Wonderland FX platform using Prometheus and Grafana.

## Components

### Prometheus

- **Purpose**: Metrics collection and storage
- **Port**: 9090
- **Configuration**: `prometheus.yml`
- **Dockerfile**: `Dockerfile.prometheus`

### Grafana

- **Purpose**: Metrics visualization and dashboards
- **Port**: 3001 (to avoid conflict with Next.js apps)
- **Configuration**: `grafana.ini`
- **Dockerfile**: `Dockerfile.grafana`
- **Default Credentials**: admin/admin

## Setup

1. Start the monitoring stack:

```bash
docker-compose up -d
```

2. Access Grafana at <http://localhost:3001>

3. Add Prometheus as a data source in Grafana:
   - URL: <http://prometheus:9090>
   - Access: Server (Docker network)

## Metrics Collection

The Prometheus configuration is set up to scrape metrics from:

- **API Service**: `/metrics` endpoint on port 8000
- **Backtester Service**: `/metrics` endpoint on port 8001
- **Frontend Applications**: Basic availability checks on port 3000

## Adding Custom Metrics

### For Python Services (FastAPI)

Add the following to your `requirements.txt`:

```
prometheus-client
```

Add to your FastAPI app:

```python
from prometheus_client import make_asgi_app, Counter, Histogram
from fastapi import FastAPI

app = FastAPI()

# Add Prometheus metrics middleware
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Define custom metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint'])
REQUEST_LATENCY = Histogram('http_request_duration_seconds', 'HTTP request latency', ['method', 'endpoint'])

# Use in endpoints
@app.get("/api/data")
async def get_data():
    REQUEST_COUNT.labels(method='GET', endpoint='/api/data').inc()
    with REQUEST_LATENCY.labels(method='GET', endpoint='/api/data').time():
        # Your endpoint logic
        return {"data": "example"}
```

### For Next.js Applications

Use the `next-prometheus` package:

```bash
npm install next-prometheus
```

Add to your `pages/_app.js`:

```javascript
import { metricsMiddleware } from 'next-prometheus'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

// Add metrics endpoint
export const getServerSideProps = metricsMiddleware()
```

## Dashboards

### Pre-configured Dashboards

- **API Performance**: Request rates, latency, error rates
- **System Resources**: CPU, memory, disk usage
- **Application Health**: Service availability, response times

### Custom Dashboards

Create custom dashboards for:

- Trading performance metrics
- User engagement analytics
- Backtesting results visualization
- Error tracking and alerting

## Alerting

Configure alerts in Prometheus for:

- Service downtime
- High error rates
- Performance degradation
- Resource exhaustion

Example alert rule:

```yaml
groups:
- name: api_alerts
  rules:
  - alert: APIDown
    expr: up{job="api-service"} == 0
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "API service is down"
      description: "API service has been down for more than 5 minutes"
```

## Integration with Main Application

Update the main `docker-compose.yml` to include the monitoring network:

```yaml
networks:
  monitoring:
    external: true
```

Then add monitoring services to your main compose file or run them separately.

## Security Considerations

- Change default Grafana admin password in production
- Use HTTPS in production
- Restrict network access to monitoring ports
- Implement authentication for Grafana dashboards
- Encrypt sensitive metrics data

## Troubleshooting

### Prometheus not scraping metrics

- Check service names match in `prometheus.yml`
- Verify services are running and accessible
- Check firewall rules

### Grafana not connecting to Prometheus

- Ensure Prometheus is running
- Check network connectivity in Docker
- Verify data source URL

### Missing metrics

- Confirm `/metrics` endpoints are implemented
- Check service logs for errors
- Validate metric names and labels
