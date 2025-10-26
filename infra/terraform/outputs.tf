# Terraform Outputs for dolesewonderlandfx on Digital Ocean

output "kubernetes_cluster_id" {
  description = "ID of the DOKS cluster"
  value       = digitalocean_kubernetes_cluster.main.id
}

output "kubernetes_cluster_name" {
  description = "Name of the DOKS cluster"
  value       = digitalocean_kubernetes_cluster.main.name
}

output "kubernetes_endpoint" {
  description = "Endpoint of the DOKS cluster"
  value       = digitalocean_kubernetes_cluster.main.endpoint
  sensitive   = true
}

output "kubernetes_kubeconfig" {
  description = "Kubeconfig for the DOKS cluster"
  value       = digitalocean_kubernetes_cluster.main.kube_config
  sensitive   = true
}

output "database_cluster_id" {
  description = "ID of the database cluster"
  value       = digitalocean_database_cluster.main.id
}

output "database_host" {
  description = "Database cluster host"
  value       = digitalocean_database_cluster.main.host
  sensitive   = true
}

output "database_port" {
  description = "Database cluster port"
  value       = digitalocean_database_cluster.main.port
}

output "database_uri" {
  description = "Database connection URI"
  value       = digitalocean_database_cluster.main.uri
  sensitive   = true
}

output "database_user" {
  description = "Database user"
  value       = digitalocean_database_user.main.name
}

output "container_registry_endpoint" {
  description = "Container registry endpoint"
  value       = digitalocean_container_registry.main.endpoint
}

output "container_registry_server_url" {
  description = "Container registry server URL"
  value       = digitalocean_container_registry.main.server_url
}

output "loadbalancer_ip" {
  description = "IP address of the load balancer"
  value       = digitalocean_loadbalancer.main.ip
}

output "spaces_bucket_domain_name" {
  description = "Domain name of the Spaces bucket"
  value       = "Temporarily disabled - requires Spaces setup"
}

output "spaces_bucket_name" {
  description = "Name of the Spaces bucket"
  value       = "Temporarily disabled - requires Spaces setup"
}

output "cdn_endpoint" {
  description = "CDN endpoint"
  value       = "Temporarily disabled - requires Spaces setup"
}

output "certificate_id" {
  description = "SSL certificate ID"
  value       = "Temporarily disabled - requires domain setup"
}

# Useful commands output
output "terraform_docs" {
  description = "Commands to generate Terraform documentation"
  value       = "terraform-docs markdown . > README.md"
}

output "deploy_commands" {
  description = "Commands to deploy infrastructure"
  value = {
    plan  = "terraform plan -var-file=terraform.tfvars"
    apply = "terraform apply -var-file=terraform.tfvars"
    destroy = "terraform destroy -var-file=terraform.tfvars"
  }
}

output "kubernetes_commands" {
  description = "Commands to configure Kubernetes access"
  value = {
    save_kubeconfig = "terraform output -raw kubernetes_kubeconfig > kubeconfig.yaml"
    set_context     = "export KUBECONFIG=kubeconfig.yaml"
    get_nodes       = "kubectl get nodes"
  }
}

output "docker_commands" {
  description = "Commands to authenticate with container registry"
  value = {
    login = "doctl registry login"
    push  = "docker tag <image> ${digitalocean_container_registry.main.server_url}/<image> && docker push ${digitalocean_container_registry.main.server_url}/<image>"
  }
}