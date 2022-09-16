# ------------------------------------------------------------------------------
# S3 remote state backend
# ------------------------------------------------------------------------------

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.30"
    }
  }

  backend "s3" {
    bucket  = "salmoncow-tenant"
    key     = "terraform-state/salmoncow.tfstate"
    region  = "us-east-1"
    profile = "default"
  }
}
