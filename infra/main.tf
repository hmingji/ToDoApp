data "google_client_config" "default" {
}

provider "kubernetes" {
  host                   = "https://${module.gke.endpoint}"
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(module.gke.ca_certificate)
}

module "gke" {
  source                     = "terraform-google-modules/kubernetes-engine/google//modules/private-cluster"
  version                    = "27.0.0"
  project_id                 = var.project_id
  name                       = "${var.cluster_name}-${var.env_name}"
  regional                   = true
  region                     = var.region
  zones                      = var.zones
  network                    = module.gcp-network.network_name
  subnetwork                 = module.gcp-network.subnets_names[0]
  ip_range_pods              = var.ip_range_pods_name
  ip_range_services          = var.ip_range_services_name
  http_load_balancing        = true
  network_policy             = false
  horizontal_pod_autoscaling = false
  filestore_csi_driver       = false
  create_service_account     = true
  logging_service            = "logging.googleapis.com/kubernetes"

  node_pools = [
    {
      name            = "node-pool"
      machine_type    = "e2-micro"
      node_locations  = "asia-southeast1-a,asia-southeast1-b"
      min_count       = 3
      max_count       = 3
      disk_size_gb    = 30
      spot            = true
      auto_upgrade    = true
      auto_repair     = true
      autoscaling     = true
      service_account = "gke-terraform@${var.project_id}.iam.gserviceaccount.com"
    },
  ]

  node_pools_oauth_scopes = {
    all = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/trace.append",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/servicecontrol",
    ]
  }

  node_pools_labels = {
    all = {}

    default-node-pool = {
      default-node-pool = true
    }
  }

  node_pools_metadata = {
    all = {}
    node-pool = {
      shutdown-script                 = "kubectl --kubeconfig=/var/lib/kubelet/kubeconfig drain --force=true --ignore-daemonsets=true --delete-local-data \"$HOSTNAME\""
      node-pool-metadata-custom-value = "node-pool"
    }
  }

  node_pools_taints = {
    all = []

    node-pool = [
      {
        key    = "node-pool"
        value  = true
        effect = "PREFER_NO_SCHEDULE"
      },
    ]
  }

  node_pools_tags = {
    all = []
    node-pool = [
      "node-pool",
    ]
  }
  depends_on = [
    module.gcp-network
  ]
}

resource "google_compute_global_address" "reserved-ip-for-gke-cluster" {
  name    = "todoapps-ip"
  project = var.project_id
}

resource "google_artifact_registry_repository" "my-repo" {
  location      = var.region
  repository_id = "todoapps"
  description   = "repo to store microservice images"
  format        = "DOCKER"
}

#add cloud sql
resource "google_sql_database_instance" "sql-db-instance" {
  name             = "todoapps-db"
  region           = var.region
  database_version = "POSTGRES_15"
  settings {
    tier = "db-f1-micro"
    ip_configuration {
      authorized_networks {
        name  = "allow all"
        value = "0.0.0.0/0"
      }
    }
  }
  deletion_protection = "false"
}

resource "google_sql_database" "db" {
  name     = "todoapps"
  instance = google_sql_database_instance.sql-db-instance.name
}

resource "google_sql_user" "db-user" {
  instance = google_sql_database_instance.sql-db-instance.name
  name     = var.DB_USERNAME
  password = var.DB_PASSWORD
}
