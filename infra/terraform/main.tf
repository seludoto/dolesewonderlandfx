# Terraform Configuration for dolesewonderlandfx on Digital Ocean
# This file defines the infrastructure resources for the platform

terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }

  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "digitalocean" {
  token = var.do_token
}

# Digital Ocean Kubernetes Cluster
resource "digitalocean_kubernetes_cluster" "main" {
  name    = "dolesewonderlandfx-${var.environment}"
  region  = var.do_region
  version = var.kubernetes_version

  node_pool {
    name       = "worker-pool"
    size       = var.node_size
    node_count = 1  # Reduced from 3 to fit within droplet limit

    labels = {
      environment = var.environment
      project     = "dolesewonderlandfx"
    }
  }

  tags = [
    "environment:${var.environment}",
    "project:dolesewonderlandfx"
  ]
}

# Digital Ocean Container Registry
resource "digitalocean_container_registry" "main" {
  name                   = "dolesewonderlandfx-dev"
  subscription_tier_slug = var.registry_tier
  region                 = "nyc3"  # Container registry uses different region codes
}

# Digital Ocean Managed PostgreSQL Database
resource "digitalocean_database_cluster" "main" {
  name       = "dolesewonderlandfx-${var.environment}"
  engine     = "pg"
  version    = var.postgres_version
  size       = var.database_size
  region     = var.do_region
  node_count = 1

  maintenance_window {
    day  = "sunday"
    hour = "02:00:00"
  }

  tags = [
    "environment:${var.environment}",
    "project:dolesewonderlandfx"
  ]
}

resource "digitalocean_database_db" "main" {
  cluster_id = digitalocean_database_cluster.main.id
  name       = var.db_name
}

resource "digitalocean_database_user" "main" {
  cluster_id = digitalocean_database_cluster.main.id
  name       = var.db_username
}

# Digital Ocean Spaces for Static Assets
# Temporarily commented out - requires Spaces access keys setup
# resource "digitalocean_spaces_bucket" "web" {
#   name   = "dolesewonderlandfx-web-${var.environment}"
#   region = "nyc3"  # Spaces uses different region codes than other DO services
#   acl    = "private"

#   versioning {
#     enabled = false
#   }
# }

# Digital Ocean Load Balancer
resource "digitalocean_loadbalancer" "main" {
  name   = "dolesewonderlandfx-${var.environment}"
  region = var.do_region

  forwarding_rule {
    entry_port     = 80
    entry_protocol = "http"

    target_port     = 80
    target_protocol = "http"
  }

  # HTTPS forwarding rule commented out until certificate is available
  # forwarding_rule {
  #   entry_port     = 443
  #   entry_protocol = "https"

  #   target_port     = 80
  #   target_protocol = "http"

  #   certificate_name = digitalocean_certificate.main.name
  # }

  healthcheck {
    port     = 80
    protocol = "http"
    path     = "/health"
  }

  droplet_tag = "dolesewonderlandfx-${var.environment}"

  depends_on = [digitalocean_kubernetes_cluster.main]
}

# SSL Certificate for Load Balancer
# Temporarily commented out - requires domain setup in Digital Ocean DNS
# resource "digitalocean_certificate" "main" {
#   name    = "dolesewonderlandfx-${var.environment}"
#   type    = "lets_encrypt"
#   domains = [
#     var.domain_name,
#     "*.${var.domain_name}"
#   ]
# }

# Digital Ocean CDN for Static Assets
# Temporarily commented out - requires Spaces bucket
# resource "digitalocean_cdn" "web" {
#   origin = digitalocean_spaces_bucket.web.bucket_domain_name

#   custom_domain = "cdn.${var.domain_name}"
#   certificate_name = digitalocean_certificate.main.name
# }

# Digital Ocean Firewall
resource "digitalocean_firewall" "kubernetes" {
  name = "dolesewonderlandfx-k8s-${var.environment}"

  droplet_ids = digitalocean_kubernetes_cluster.main.node_pool[0].nodes[*].droplet_id

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}