# Terraform Variables for dolesewonderlandfx on Digital Ocean

variable "do_token" {
  description = "Digital Ocean API token"
  type        = string
  sensitive   = true
}

variable "do_region" {
  description = "Digital Ocean region for resources"
  type        = string
  default     = "nyc1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# Kubernetes Variables
variable "kubernetes_version" {
  description = "Kubernetes version for DOKS cluster"
  type        = string
  default     = "1.31.9-do.5"
}

variable "node_size" {
  description = "Droplet size for Kubernetes nodes"
  type        = string
  default     = "s-2vcpu-4gb"
}

variable "node_count" {
  description = "Number of nodes in the Kubernetes cluster"
  type        = number
  default     = 3
}

# Container Registry Variables
variable "registry_tier" {
  description = "Container registry subscription tier"
  type        = string
  default     = "basic"
}

# Database Variables
variable "postgres_version" {
  description = "PostgreSQL version for managed database"
  type        = string
  default     = "15"
}

variable "database_size" {
  description = "Size of the database cluster"
  type        = string
  default     = "db-s-1vcpu-1gb"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "dolesewonderlandfx"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "dolesefx"
}

# Application Variables
variable "app_name" {
  description = "Application name"
  type        = string
  default     = "dolesewonderlandfx"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "dolesewonderlandfx.com"
}

# Container Variables
variable "api_cpu" {
  description = "CPU units for API service"
  type        = number
  default     = 256
}

variable "api_memory" {
  description = "Memory for API service (MB)"
  type        = number
  default     = 512
}

variable "backtester_cpu" {
  description = "CPU units for backtester service"
  type        = number
  default     = 512
}

variable "backtester_memory" {
  description = "Memory for backtester service (MB)"
  type        = number
  default     = 1024
}

# Monitoring Variables
variable "enable_monitoring" {
  description = "Enable monitoring"
  type        = bool
  default     = true
}

# Security Variables
variable "enable_deletion_protection" {
  description = "Enable deletion protection for critical resources"
  type        = bool
  default     = false
}

# Tagging
variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Project     = "dolesewonderlandfx"
    ManagedBy   = "terraform"
    Owner       = "platform-team"
  }
}