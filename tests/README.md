# Testing Suite

Comprehensive testing suite for the DoleSe Wonderland FX platform.

## Test Structure

```
tests/
├── test_api.py              # Existing API tests
├── test_services.py         # Unit tests for all services
└── test_integration.py      # Integration and E2E tests
```

## Test Categories

### Unit Tests (`test_services.py`)

- **API Service**: User registration, course access, health checks
- **Auth Service**: Login, JWT tokens, password reset
- **AI Pipeline**: Data ingestion, embeddings, strategy analysis
- **Insight Generator**: Market insights, analysis reporting
- **Paper Trading**: Order execution, portfolio tracking
- **Email Service**: Single/bulk emails, templates, newsletters
- **Backtester**: Strategy backtesting, performance metrics
- **Shared UI**: Component rendering and functionality
- **Monitoring**: Prometheus metrics, Grafana dashboards
- **Scripts**: Database seeding, migrations, code generation

### Integration Tests (`test_integration.py`)

- **Docker Compose**: Service orchestration and discovery
- **Service Dependencies**: Inter-service communication
- **User Lifecycle**: Complete user workflows
- **Trading Workflow**: Paper trading end-to-end
- **AI Pipeline**: Data processing to insights
- **Auth-Email**: Registration and password reset flows
- **Monitoring**: Metrics collection and dashboards

## Running Tests

### Prerequisites

1. All services running via Docker Compose:

   ```bash
   docker-compose up -d
   ```

2. Wait for services to be healthy:

   ```bash
   docker-compose ps
   ```

### Run All Tests

```bash
python -m pytest tests/ -v
```

### Run Specific Test Categories

```bash
# Unit tests only
python -m pytest tests/test_services.py -v

# Integration tests only
python -m pytest tests/test_integration.py -v

# API tests only
python -m pytest tests/test_api.py -v
```

### Run with Coverage

```bash
python -m pytest tests/ --cov=services --cov-report=html
```

## Test Environment

### Local Development

- Uses Docker Compose for service orchestration
- SQLite database for data persistence
- Mock external APIs (OpenAI, SMTP, etc.)

### CI/CD Environment

- GitHub Actions workflow runs tests on every PR
- Uses test-specific docker-compose override
- Parallel test execution for faster feedback

## Test Data

### Database Seeding

Test data is seeded using the database seeding script:

```bash
python scripts/seed_database.py --environment=test
```

### Mock Data

- User accounts with different roles
- Sample trading courses and content
- Historical market data
- Email templates and test recipients

## Continuous Integration

### GitHub Actions

Tests run automatically on:

- Pull requests to main branch
- Pushes to main branch
- Manual workflow dispatch

### Test Results

- JUnit XML output for CI integration
- Coverage reports uploaded to Codecov
- Test failure notifications via Slack/email

## Writing New Tests

### Unit Test Template

```python
def test_feature_name(self):
    """Test description."""
    # Arrange
    setup_test_data()

    # Act
    result = call_function_under_test()

    # Assert
    assert expected_condition
```

### Integration Test Template

```python
def test_service_integration(self):
    """Test service interaction."""
    # Start dependent services
    # Make API calls between services
    # Verify data consistency
    # Assert expected behavior
```

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage for all services
- **Integration Tests**: All critical user workflows
- **E2E Tests**: Complete user journeys
- **Performance Tests**: Response times under load

## Debugging Failed Tests

### Common Issues

1. **Service Not Running**: Check `docker-compose ps`
2. **Port Conflicts**: Verify no other services using test ports
3. **Database State**: Reset test database between runs
4. **Network Issues**: Check service networking in Docker

### Debug Commands

```bash
# Check service logs
docker-compose logs service_name

# Restart specific service
docker-compose restart service_name

# Rebuild and restart
docker-compose up -d --build service_name
```

## Performance Testing

### Load Testing

```bash
# Install locust for load testing
pip install locust

# Run load tests
locust -f tests/load_tests.py
```

### Stress Testing

- Concurrent user simulation
- Memory and CPU monitoring
- Database connection pooling tests

## Security Testing

### Authentication Tests

- JWT token validation
- Password strength requirements
- Rate limiting on auth endpoints

### Authorization Tests

- Role-based access control
- API permission validation
- Data isolation between users

## Contributing

1. Write tests for new features before implementation
2. Follow existing test patterns and naming conventions
3. Include both positive and negative test cases
4. Update tests when changing existing functionality
5. Run full test suite before submitting PR

## Test Reports

### Local Reports

- HTML coverage reports in `htmlcov/`
- JUnit XML reports for CI integration
- Performance metrics in test logs

### CI Reports

- Coverage badges on README
- Test result history in GitHub Actions
- Automated alerts for test failures
