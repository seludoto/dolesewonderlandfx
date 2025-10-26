# DoleSe Wonderland FX

A comprehensive, production-ready trading education and paper trading platform built with modern microservices architecture.

## 🎯 Overview

DoleSe Wonderland FX is a full-stack platform that combines:

- **Interactive Trading Courses**: Learn forex trading with hands-on exercises
- **AI-Powered Insights**: Get personalized market analysis and trading signals
- **Paper Trading Simulator**: Practice trading strategies risk-free
- **Performance Analytics**: Track your trading progress and performance
- **Community Features**: Connect with fellow traders and instructors

## 🏗️ Architecture

### Microservices Architecture

- **Frontend Apps**: Next.js applications for web interfaces
- **Backend Services**: FastAPI microservices for business logic
- **AI Pipeline**: Machine learning services for market analysis
- **Monitoring**: Prometheus + Grafana for observability
- **Infrastructure**: Docker, Kubernetes, Terraform

### Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: FastAPI, Python, SQLite/PostgreSQL
- **AI/ML**: OpenAI API, custom ML pipelines
- **Infrastructure**: Docker, Kubernetes, Terraform, AWS
- **Monitoring**: Prometheus, Grafana
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Python 3.11+
- Node.js 18+ (for frontend development)
- Git

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/dolesewonderlandfx.git
   cd dolesewonderlandfx
   ```

2. **Start all services**

   ```bash
   docker-compose up -d
   ```

3. **Seed the database**

   ```bash
   python scripts/seed_database.py
   ```

4. **Access the applications**
   - **Web Landing**: <http://localhost:3000>
   - **Main App**: <http://localhost:3001>
   - **Instructor Portal**: <http://localhost:3002>
   - **API Gateway**: <http://localhost:8000>
   - **Grafana**: <http://localhost:3000> (admin/admin)

### Development Workflow

1. **Install dependencies**

   ```bash
   # Backend services
   pip install -r requirements.txt

   # Frontend apps
   cd apps/web-landing && npm install
   cd ../app-frontend && npm install
   cd ../instructor-portal && npm install
   ```

2. **Run development servers**

   ```bash
   # Frontend apps
   cd apps/web-landing && npm run dev
   cd ../app-frontend && npm run dev
   cd ../instructor-portal && npm run dev

   # Backend services (in separate terminals)
   cd services/api && python main.py
   cd services/auth && python main.py
   # ... etc for other services
   ```

3. **Run tests**

   ```bash
   python -m pytest tests/ -v
   ```

## 📁 Project Structure

```
dolesewonderlandfx/
├── apps/                          # Frontend applications
│   ├── web-landing/              # Marketing site
│   ├── app-frontend/             # Main trading app
│   └── instructor-portal/        # Instructor dashboard
├── services/                     # Backend microservices
│   ├── api/                      # Main API gateway
│   ├── auth/                     # Authentication service
│   ├── ai-pipeline/              # AI/ML processing
│   ├── insight-generator/        # Market insights
│   ├── backtester/               # Strategy backtesting
│   ├── paper-trading/            # Paper trading simulator
│   └── email/                    # Email notifications
├── shared/                       # Shared components
│   └── ui/                       # Reusable UI library
├── data/                         # Data management
│   ├── raw/                      # Raw market data
│   ├── processed/                # Processed data
│   └── schemas/                  # Data schemas
├── infra/                        # Infrastructure as code
│   ├── terraform/                # AWS infrastructure
│   └── kubernetes/               # Container orchestration
├── monitoring/                   # Observability stack
│   ├── prometheus/               # Metrics collection
│   └── grafana/                  # Visualization
├── scripts/                      # Developer tools
├── tests/                        # Test suites
└── docs/                         # Documentation
```

## 🔧 Services

### Core Services

- **API Gateway** (Port 8000): Main backend API, user management, courses
- **Auth Service** (Port 8002): JWT authentication, user sessions
- **AI Pipeline** (Port 8003): Market data processing, ML models
- **Insight Generator** (Port 8004): Trading insights and analysis
- **Paper Trading** (Port 8005): Risk-free trading simulation
- **Email Service** (Port 8006): Notifications and newsletters

### Supporting Services

- **Backtester** (Port 8001): Historical strategy testing
- **Prometheus** (Port 9090): Metrics collection
- **Grafana** (Port 3000): Monitoring dashboards

## 🎨 Frontend Applications

### Web Landing Page

Marketing site with course previews and registration.

### Main Application

Full-featured trading platform with:

- Interactive courses
- Paper trading interface
- Performance analytics
- Market insights dashboard

### Instructor Portal

Content management system for course authors.

## 🤖 AI Features

### Market Analysis

- Real-time market data processing
- Sentiment analysis from news
- Technical indicator calculations
- Pattern recognition

### Personalized Insights

- Trading signal generation
- Risk assessment
- Performance predictions
- Educational recommendations

### Content Generation

- Dynamic course content
- Market analysis reports
- Trading strategy explanations

## 📊 Monitoring & Analytics

### Application Metrics

- Service health and performance
- User activity tracking
- API response times
- Error rates and logging

### Business Metrics

- User engagement
- Course completion rates
- Trading performance
- Revenue analytics

## 🚀 Deployment

### Development

```bash
docker-compose up -d
```

### Production (AWS)

```bash
# Infrastructure
cd infra/terraform
terraform init
terraform apply

# Deploy to Kubernetes
kubectl apply -f infra/kubernetes/
```

### CI/CD

Automated pipelines for:

- Code quality checks
- Automated testing
- Docker image building
- Kubernetes deployment

## 🧪 Testing

### Test Categories

- **Unit Tests**: Individual service components
- **Integration Tests**: Service interactions
- **E2E Tests**: Complete user workflows
- **Performance Tests**: Load and stress testing

### Running Tests

```bash
# All tests
python -m pytest tests/ -v

# With coverage
python -m pytest tests/ --cov=services --cov-report=html

# Integration tests
python -m pytest tests/test_integration.py -v
```

## 📚 Documentation

### For Users

- [User Guide](docs/onboarding.md)
- [API Documentation](docs/api.md)
- [FAQ](docs/faq.md)

### For Developers

- [Architecture Overview](docs/architecture.md)
- [AI Design](docs/ai_design.md)
- [Security Guidelines](docs/security.md)
- [Deployment Runbooks](docs/runbooks/)

## 🔒 Security

### Authentication

- JWT-based authentication
- Role-based access control
- Secure password policies
- Session management

### Data Protection

- Encrypted data storage
- Secure API communications
- GDPR compliance
- Regular security audits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

### Development Guidelines

- Follow the established code style
- Write comprehensive tests
- Update documentation
- Use conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

- **Documentation**: Check the [docs/](docs/) directory
- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Join community discussions on GitHub
- **Email**: Contact the development team

## 🗺️ Roadmap

### Phase 1 (Current)

- ✅ Microservices architecture
- ✅ AI-powered insights
- ✅ Paper trading simulator
- ✅ Comprehensive monitoring

### Phase 2 (Upcoming)

- Real-money trading integration
- Mobile applications
- Advanced AI features
- Multi-asset support

### Phase 3 (Future)

- Social trading features
- Institutional solutions
- Global market coverage
- Advanced analytics

---

Built with ❤️ for the trading community
