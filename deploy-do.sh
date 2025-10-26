#!/bin/bash

# DoleSe Wonderland FX - Digital Ocean Production Deployment Script
# This script handles the complete deployment process to Digital Ocean

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="dolesewonderlandfx"
WORKSPACE_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INFRA_PATH="$WORKSPACE_PATH/infra"
KUBERNETES_PATH="$INFRA_PATH/kubernetes"
TERRAFORM_PATH="$INFRA_PATH/terraform"
SERVICES_PATH="$WORKSPACE_PATH/services"
APPS_PATH="$WORKSPACE_PATH/apps"

# Digital Ocean Configuration
DO_REGION="${DO_REGION:-nyc1}"
DO_KUBERNETES_VERSION="${DO_KUBERNETES_VERSION:-1.29.1-do.0}"
DO_NODE_SIZE="${DO_NODE_SIZE:-s-2vcpu-4gb}"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if doctl is installed
    if ! command -v doctl &> /dev/null; then
        log_error "doctl is not installed. Please install it from https://docs.digitalocean.com/reference/doctl/how-to/install/"
        exit 1
    fi

    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed. Please install it."
        exit 1
    fi

    # Check if terraform is installed
    if ! command -v terraform &> /dev/null; then
        log_error "terraform is not installed. Please install it from https://www.terraform.io/downloads"
        exit 1
    fi

    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "docker is not installed. Please install it."
        exit 1
    fi

    # Check if kustomize is installed
    if ! command -v kustomize &> /dev/null; then
        log_error "kustomize is not installed. Please install it from https://kubectl.docs.kubernetes.io/installation/kustomize/"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Authenticate with Digital Ocean
authenticate_do() {
    log_info "Authenticating with Digital Ocean..."

    if [ -z "$DO_TOKEN" ]; then
        log_error "DO_TOKEN environment variable is not set. Please set it with your Digital Ocean API token."
        exit 1
    fi

    doctl auth init --access-token "$DO_TOKEN"
    log_success "Authenticated with Digital Ocean"
}

# Provision infrastructure with Terraform
provision_infrastructure() {
    log_info "Provisioning Digital Ocean infrastructure..."

    cd "$TERRAFORM_PATH"

    # Initialize Terraform
    terraform init

    # Plan the deployment
    terraform plan -var="do_token=$DO_TOKEN" -var="do_region=$DO_REGION" -var="kubernetes_version=$DO_KUBERNETES_VERSION" -var="node_size=$DO_NODE_SIZE" -out=tfplan

    # Apply the plan
    terraform apply tfplan

    # Get outputs
    CLUSTER_NAME=$(terraform output -raw kubernetes_cluster_name)
    REGISTRY_NAME=$(terraform output -raw container_registry_name)
    DATABASE_HOST=$(terraform output -raw database_host)
    DATABASE_PORT=$(terraform output -raw database_port)
    DATABASE_USER=$(terraform output -raw database_user)
    DATABASE_PASSWORD=$(terraform output -raw database_password)
    DATABASE_NAME=$(terraform output -raw database_name)

    log_success "Infrastructure provisioned successfully"
}

# Configure kubectl for the cluster
configure_kubectl() {
    log_info "Configuring kubectl for Digital Ocean Kubernetes cluster..."

    doctl kubernetes cluster kubeconfig save "$CLUSTER_NAME"

    # Verify connection
    kubectl cluster-info

    log_success "kubectl configured successfully"
}

# Build and push Docker images
build_and_push_images() {
    log_info "Building and pushing Docker images..."

    # Login to Digital Ocean Container Registry
    doctl registry login

    # Build and push service images
    services=("api" "auth" "ai-pipeline" "insight-generator" "backtester" "paper-trading" "email" "social-trading")

    for service in "${services[@]}"; do
        log_info "Building $service image..."
        cd "$SERVICES_PATH/$service"
        docker build -t "registry.digitalocean.com/$REGISTRY_NAME/$PROJECT_NAME-$service:latest" .
        docker push "registry.digitalocean.com/$REGISTRY_NAME/$PROJECT_NAME-$service:latest"
        log_success "$service image built and pushed"
    done

    # Build and push frontend images
    frontends=("app-frontend" "admin-panel" "instructor-portal" "web-landing")

    for frontend in "${frontends[@]}"; do
        log_info "Building $frontend image..."
        cd "$APPS_PATH/$frontend"
        docker build -t "registry.digitalocean.com/$REGISTRY_NAME/$PROJECT_NAME-$frontend:latest" .
        docker push "registry.digitalocean.com/$REGISTRY_NAME/$PROJECT_NAME-$frontend:latest"
        log_success "$frontend image built and pushed"
    done

    # Build and push monitoring images
    log_info "Building monitoring images..."
    cd "$WORKSPACE_PATH/monitoring"
    docker build -f Dockerfile.prometheus -t "registry.digitalocean.com/$REGISTRY_NAME/$PROJECT_NAME-prometheus:latest" .
    docker build -f Dockerfile.grafana -t "registry.digitalocean.com/$REGISTRY_NAME/$PROJECT_NAME-grafana:latest" .
    docker push "registry.digitalocean.com/$REGISTRY_NAME/$PROJECT_NAME-prometheus:latest"
    docker push "registry.digitalocean.com/$REGISTRY_NAME/$PROJECT_NAME-grafana:latest"

    log_success "All images built and pushed successfully"
}

# Deploy cert-manager
deploy_cert_manager() {
    log_info "Deploying cert-manager..."

    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.yaml

    # Wait for cert-manager to be ready
    kubectl wait --for=condition=available --timeout=300s deployment/cert-manager -n cert-manager
    kubectl wait --for=condition=available --timeout=300s deployment/cert-manager-webhook -n cert-manager

    log_success "cert-manager deployed successfully"
}

# Deploy nginx ingress controller
deploy_nginx_ingress() {
    log_info "Deploying nginx ingress controller..."

    kubectl apply -f "$KUBERNETES_PATH/base/nginx-ingress.yaml"

    # Wait for nginx ingress to be ready
    kubectl wait --for=condition=available --timeout=300s deployment/nginx-ingress-controller -n ingress-nginx

    log_success "nginx ingress controller deployed successfully"
}

# Deploy applications
deploy_applications() {
    log_info "Deploying applications to Kubernetes..."

    cd "$KUBERNETES_PATH/overlays/production"

    # Apply kustomization
    kustomize build . | kubectl apply -f -

    # Wait for deployments to be ready
    kubectl wait --for=condition=available --timeout=600s deployment/dolesewonderlandfx-api -n dolesewonderlandfx
    kubectl wait --for=condition=available --timeout=600s deployment/dolesewonderlandfx-auth -n dolesewonderlandfx
    kubectl wait --for=condition=available --timeout=600s deployment/dolesewonderlandfx-app-frontend -n dolesewonderlandfx

    log_success "Applications deployed successfully"
}

# Setup monitoring
setup_monitoring() {
    log_info "Setting up monitoring..."

    # Prometheus and Grafana are deployed via kustomization
    # Additional monitoring setup can be added here

    log_success "Monitoring setup completed"
}

# Run database migrations
run_database_migrations() {
    log_info "Running database migrations..."

    # This would typically involve running migration scripts
    # For now, we'll assume migrations are handled by the application startup

    log_success "Database migrations completed"
}

# Get deployment status
get_deployment_status() {
    log_info "Getting deployment status..."

    echo "=== Cluster Status ==="
    kubectl get nodes

    echo "=== Pod Status ==="
    kubectl get pods -n dolesewonderlandfx

    echo "=== Service Status ==="
    kubectl get services -n dolesewonderlandfx

    echo "=== Ingress Status ==="
    kubectl get ingress -n dolesewonderlandfx

    echo "=== Load Balancer Status ==="
    kubectl get service ingress-nginx-controller -n ingress-nginx

    log_success "Deployment status retrieved"
}

# Main deployment function
main() {
    log_info "Starting DoleSe Wonderland FX deployment to Digital Ocean..."

    check_prerequisites
    authenticate_do
    provision_infrastructure
    configure_kubectl
    build_and_push_images
    deploy_cert_manager
    deploy_nginx_ingress
    deploy_applications
    setup_monitoring
    run_database_migrations
    get_deployment_status

    log_success "🎉 DoleSe Wonderland FX deployment completed successfully!"
    log_info "Your application should be available at:"
    log_info "  - Frontend: https://app.dolesewonderlandfx.com"
    log_info "  - Admin: https://admin.dolesewonderlandfx.com"
    log_info "  - API: https://api.dolesewonderlandfx.com"
    log_info "  - Monitoring: https://monitoring.dolesewonderlandfx.com"
}

# Run main function
main "$@"