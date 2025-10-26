# DoleSe Wonderland FX - Production Deployment Guide

This guide covers deploying the complete DoleSe Wonderland FX trading platform to production on Digital Ocean.

## Architecture Overview

The platform consists of:
- **Frontend Applications**: Next.js apps (landing page, main app, admin panel, instructor portal)
- **Backend Services**: FastAPI microservices (API, auth, AI pipeline, backtester, etc.)
- **Database**: PostgreSQL (managed Digital Ocean database)
- **Infrastructure**: Digital Ocean Kubernetes Service (DOKS) with nginx ingress
- **Monitoring**: Prometheus + Grafana
- **SSL**: Let's Encrypt certificates via cert-manager

## Prerequisites

### Required Tools
- `doctl` - Digital Ocean CLI
- `kubectl` - Kubernetes CLI
- `terraform` - Infrastructure as Code
- `docker` - Container building
- `kustomize` - Kubernetes configuration management

### Digital Ocean Account Setup
1. Create a Digital Ocean account
2. Generate an API token with read/write permissions
3. Set up domain DNS pointing to Digital Ocean (or use Digital Ocean DNS)

### Environment Variables
Set the following environment variables:
```bash
export DO_TOKEN="your-digital-ocean-api-token"
export DO_REGION="nyc1"  # or your preferred region
export DO_KUBERNETES_VERSION="1.29.1-do.0"
export DO_NODE_SIZE="s-2vcpu-4gb"
```

## Quick Deployment (Automated)

The easiest way to deploy is using the automated deployment script:

```bash
# Make the script executable
chmod +x deploy-do.sh

# Run the deployment
./deploy-do.sh
```

This script will:
1. Check prerequisites
2. Provision Digital Ocean infrastructure (DOKS cluster, managed database, container registry)
3. Build and push Docker images
4. Deploy cert-manager and nginx ingress
5. Deploy all applications to Kubernetes
6. Set up monitoring

## Manual Deployment Steps

If you prefer manual deployment or need to customize:

### 1. Infrastructure Provisioning

```bash
cd infra/terraform

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan -var="do_token=$DO_TOKEN" -var="do_region=$DO_REGION"

# Apply the infrastructure
terraform apply -var="do_token=$DO_TOKEN" -var="do_region=$DO_REGION"
```

### 2. Configure Kubernetes Access

```bash
# Get cluster name from Terraform output
CLUSTER_NAME=$(terraform output -raw kubernetes_cluster_name)

# Configure kubectl
doctl kubernetes cluster kubeconfig save "$CLUSTER_NAME"
```

### 3. Build and Push Images

```bash
# Login to Digital Ocean Container Registry
doctl registry login

# Build and push all service images
# (This is handled by the deployment script - see build_and_push_images function)
```

### 4. Deploy Kubernetes Resources

```bash
# Deploy cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.yaml

# Deploy nginx ingress controller
kubectl apply -f infra/kubernetes/base/nginx-ingress.yaml

# Deploy applications
cd infra/kubernetes/overlays/production
kustomize build . | kubectl apply -f -
```

## Domain Configuration

### DNS Setup
Point your domains to the Digital Ocean Load Balancer:

1. Get the Load Balancer IP:
```bash
kubectl get service ingress-nginx-controller -n ingress-nginx
```

2. Create DNS A records for:
- `dolesewonderlandfx.com` → Load Balancer IP
- `app.dolesewonderlandfx.com` → Load Balancer IP
- `admin.dolesewonderlandfx.com` → Load Balancer IP
- `instructor.dolesewonderlandfx.com` → Load Balancer IP
- `api.dolesewonderlandfx.com` → Load Balancer IP
- `auth.dolesewonderlandfx.com` → Load Balancer IP
- `ai.dolesewonderlandfx.com` → Load Balancer IP
- `insights.dolesewonderlandfx.com` → Load Balancer IP
- `backtester.dolesewonderlandfx.com` → Load Balancer IP
- `paper.dolesewonderlandfx.com` → Load Balancer IP
- `email.dolesewonderlandfx.com` → Load Balancer IP
- `social.dolesewonderlandfx.com` → Load Balancer IP
- `monitoring.dolesewonderlandfx.com` → Load Balancer IP

### SSL Certificates
SSL certificates are automatically provisioned via Let's Encrypt and cert-manager. The ClusterIssuer is configured for production.

## Application URLs

After successful deployment, your application will be available at:

- **Landing Page**: https://dolesewonderlandfx.com
- **Main Application**: https://app.dolesewonderlandfx.com
- **Admin Panel**: https://admin.dolesewonderlandfx.com
- **Instructor Portal**: https://instructor.dolesewonderlandfx.com
- **API Gateway**: https://api.dolesewonderlandfx.com
- **Authentication**: https://auth.dolesewonderlandfx.com
- **AI Pipeline**: https://ai.dolesewonderlandfx.com
- **Insights**: https://insights.dolesewonderlandfx.com
- **Backtester**: https://backtester.dolesewonderlandfx.com
- **Paper Trading**: https://paper.dolesewonderlandfx.com
- **Email Service**: https://email.dolesewonderlandfx.com
- **Social Trading**: https://social.dolesewonderlandfx.com
- **Monitoring**: https://monitoring.dolesewonderlandfx.com

## Monitoring and Observability

### Accessing Grafana
```bash
# Get Grafana admin password from Kubernetes secret
kubectl get secret grafana-secret -n dolesewonderlandfx -o jsonpath='{.data.admin_password}' | base64 -d
```

Navigate to https://monitoring.dolesewonderlandfx.com and login with:
- Username: `admin`
- Password: (from above command)

### Prometheus Metrics
Access Prometheus at: https://monitoring.dolesewonderlandfx.com/prometheus

## Database Management

### Connection Details
Database connection information is available in Terraform outputs:
```bash
cd infra/terraform
terraform output database_host
terraform output database_port
terraform output database_user
terraform output database_name
```

### Migrations
Database migrations are handled automatically by the application services on startup.

## Scaling

### Horizontal Pod Autoscaling
To enable HPA for services:
```bash
kubectl autoscale deployment dolesewonderlandfx-api -n dolesewonderlandfx --cpu-percent=70 --min=2 --max=10
```

### Node Scaling
Scale the DOKS cluster:
```bash
doctl kubernetes cluster node-pool update $CLUSTER_NAME $NODE_POOL_ID --count 3
```

## Troubleshooting

### Check Pod Status
```bash
kubectl get pods -n dolesewonderlandfx
kubectl describe pod <pod-name> -n dolesewonderlandfx
```

### Check Logs
```bash
kubectl logs -f deployment/dolesewonderlandfx-api -n dolesewonderlandfx
```

### Restart Deployments
```bash
kubectl rollout restart deployment/dolesewonderlandfx-api -n dolesewonderlandfx
```

### SSL Certificate Issues
```bash
kubectl get certificate -n dolesewonderlandfx
kubectl describe certificate dolesewonderlandfx-tls -n dolesewonderlandfx
```

## Cost Optimization

### Digital Ocean Resources
- **DOKS Cluster**: ~$40/month (2 nodes × $20/month)
- **Managed Database**: ~$25/month (Basic plan)
- **Container Registry**: ~$5/month
- **Load Balancer**: ~$12/month
- **SSL Certificates**: Free (Let's Encrypt)

Total estimated monthly cost: ~$82/month

### Cost Saving Tips
1. Use spot instances for non-critical workloads
2. Scale down during off-peak hours
3. Monitor resource usage and adjust node sizes
4. Use Digital Ocean's monitoring to identify bottlenecks

## Backup and Recovery

### Database Backups
Digital Ocean managed databases include automatic daily backups.

### Manual Backup
```bash
# Create database dump
kubectl exec -it deployment/dolesewonderlandfx-api -n dolesewonderlandfx -- pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > backup.sql
```

### Application Backups
Use Digital Ocean Spaces for application data backups.

## Security Considerations

1. **Network Security**: All traffic goes through nginx ingress with SSL/TLS
2. **API Security**: JWT authentication and API key validation
3. **Database Security**: Managed database with encryption at rest
4. **Container Security**: Regular image updates and vulnerability scanning
5. **Access Control**: RBAC configured for Kubernetes resources

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Kubernetes logs and events
3. Check Digital Ocean status page
4. Contact the development team

## Local Development

For local development with Docker Compose:

```bash
# Start all services
docker-compose up --build

# Access local services
# Landing: http://localhost:3000
# App: http://localhost:3001
# API: http://localhost:8000
# Backtester: http://localhost:8001
```

## Updating Deployments

To update the application:

1. Make code changes
2. Build new images: `./deploy-do.sh` (or manually build/push)
3. Update deployments: `kubectl apply -f infra/kubernetes/overlays/production/`
4. Verify rollout: `kubectl rollout status deployment/dolesewonderlandfx-api -n dolesewonderlandfx`
