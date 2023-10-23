# terraform {
#   cloud {
#     organization = "Personal-123"

#     workspaces {
#       name = "myworkspace-123"
#     }
#   }
# }

terraform {
  backend "gcs" {
    bucket = "state_bucket-32"
    prefix = "terraform/state"
  }
}
