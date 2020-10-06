# ------------------------------------------------------------------------------
# data, variables, locals, etc.
# ------------------------------------------------------------------------------

data "aws_caller_identity" "current" {}

data "aws_iam_account_alias" "current" {}

locals {
  region   = "us-east-1"
  ou       = "dev"
  use_case = "td000"

  s3_origin_id = "S3-salmoncow.com"

  tags = {
    "deployment" = "terraform"
    "owner"      = "salmoncow"
    "use_case"   = local.use_case
  }
}
