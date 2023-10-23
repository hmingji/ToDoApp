module "gcp-network" {
  source       = "terraform-google-modules/network/google"
  version      = "7.0.0"
  project_id   = var.project_id
  network_name = "${var.network}-${var.env_name}"

  subnets = [
    {
      subnet_name           = "${var.subnetwork}-${var.env_name}"
      subnet_ip             = "10.10.0.0/16"
      subnet_region         = var.region
      subnet_private_access = true
    }
  ]

  secondary_ranges = {
    "${var.subnetwork}-${var.env_name}" = [
      {
        range_name    = var.ip_range_pods_name
        ip_cidr_range = "10.30.0.0/16"
      },
      {
        range_name    = var.ip_range_services_name
        ip_cidr_range = "10.70.0.0/16"
      }
    ]
  }
}
