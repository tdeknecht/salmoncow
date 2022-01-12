# ------------------------------------------------------------------------------
# data, variables, locals, etc.
# ------------------------------------------------------------------------------

data "aws_caller_identity" "current" {}

data "aws_iam_account_alias" "current" {}

locals {
  s3_origin_id = "S3-salmoncow.com"

  tags = {
    "terraform" = true
    "region"    = var.region
    "ou"        = var.ou
    "use_case"  = var.use_case
    "tenant"    = var.tenant
  }
}

output "foo" { value = var.foo }


# ------------------------------------------------------------------------------
# Route 53
# ------------------------------------------------------------------------------

# salmoncow.com
module "route53_zone_salmoncow_com" {
  source = "git::https://github.com/tdeknecht/aws-terraform//modules/network/route53_zone/"

  name    = "salmoncow.com"
  comment = "salmoncow public zone"
  tags    = local.tags
}

resource "aws_route53_record" "salmoncow_com" {
  zone_id = module.route53_zone_salmoncow_com.zone_id
  name    = "salmoncow.com"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.salmoncow_s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.salmoncow_s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_salmoncow_com" {
  zone_id = module.route53_zone_salmoncow_com.zone_id
  name    = "www.salmoncow.com"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.salmoncow_s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.salmoncow_s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# ------------------------------------------------------------------------------
# ACM
# ------------------------------------------------------------------------------

# salmoncow.com certificate
module "acm_cert_salmoncow_com" {
  source = "git::https://github.com/tdeknecht/aws-terraform//modules/network/acm_certificate/"

  ou                        = var.ou
  certificate_domain_name   = "salmoncow.com"
  validation_domain_name    = "salmoncow.com"
  validation_method         = "DNS"
  subject_alternative_names = ["www.salmoncow.com"]
  tags                      = local.tags
}
output "certificate_arn_salmoncow_com" { value = module.acm_cert_salmoncow_com.certificate_arn }

# ------------------------------------------------------------------------------
# CloudFront
# ------------------------------------------------------------------------------

resource "aws_cloudfront_distribution" "salmoncow_s3_distribution" {
  aliases             = ["www.salmoncow.com", "salmoncow.com"]
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "salmoncow distribution"
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  tags                = local.tags

  origin {
    domain_name = module.s3_bucket_salmoncow_com.bucket_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.salmoncow_com_oai.cloudfront_access_identity_path
    }
  }

  viewer_certificate {
    acm_certificate_arn      = module.acm_cert_salmoncow_com.certificate_arn
    minimum_protocol_version = "TLSv1.2_2018"
    ssl_support_method       = "sni-only"
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.s3_origin_id
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  # required for React SPA because /paths don't exist as objects in S3, thus a custom error
  # response is required to redirect a 403 to /index.html as a 200
  custom_error_response {
    error_caching_min_ttl = 10
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_cloudfront_origin_access_identity" "salmoncow_com_oai" {
  comment = "salmoncow.com origin access identity"
}

# ------------------------------------------------------------------------------
# API Gateway
# ------------------------------------------------------------------------------

# salmoncow
# module "salmoncow_api_lambda" {
#   source = "git::https://github.com/tdeknecht/aws-terraform//modules/hello_world/rest_api_lambda/"
#   # source = "../../../terraform/modules/hello_world/rest_api_lambda"

#   ou   = local.ou
#   name = "salmoncow"
#   tags = local.tags
# }

# ------------------------------------------------------------------------------
# S3: Buckets
# ------------------------------------------------------------------------------

# salmoncow.com (website host)
module "s3_bucket_salmoncow_com" {
  source = "git::https://github.com/tdeknecht/aws-terraform//modules/storage/s3_bucket/"

  ou                  = var.ou
  use_case            = var.use_case
  bucket              = "salmoncow.com"
  versioning          = true
  base_lifecycle_rule = true
  policy              = data.aws_iam_policy_document.s3_bucket_policy_salmoncow_com.json
  tags                = local.tags

  # website config
  index_document = "index.html"
  error_document = "error.html"
}

output "s3_salmoncow_com_id" { value = module.s3_bucket_salmoncow_com.id }
output "s3_salmoncow_com_arn" { value = module.s3_bucket_salmoncow_com.arn }
output "s3_salmoncow_com_bucket_domain_name" { value = module.s3_bucket_salmoncow_com.bucket_domain_name }

data "aws_iam_policy_document" "s3_bucket_policy_salmoncow_com" {
  statement {
    sid       = "OaiGetObject"
    actions   = ["s3:GetObject"]
    resources = ["arn:aws:s3:::salmoncow.com/*"]
    effect    = "Allow"
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.salmoncow_com_oai.iam_arn]
    }
  }
}

# www.salmoncow.com (website redirect)
module "s3_bucket_www_salmoncow_com" {
  source = "git::https://github.com/tdeknecht/aws-terraform//modules/storage/s3_bucket/"

  ou                  = var.ou
  use_case            = var.use_case
  bucket              = "www.salmoncow.com"
  versioning          = false
  base_lifecycle_rule = false
  tags                = local.tags

  # website config
  redirect_all_requests_to = "https://salmoncow.com"
}

# salmoncow (data)
module "s3_bucket_salmoncow" {
  source = "git::https://github.com/tdeknecht/aws-terraform//modules/storage/s3_bucket/"

  ou                  = var.ou
  use_case            = var.use_case
  bucket              = "salmoncow"
  versioning          = true
  base_lifecycle_rule = true
  policy              = data.aws_iam_policy_document.s3_bucket_policy_salmoncow.json
  tags                = local.tags
}

data "aws_iam_policy_document" "s3_bucket_policy_salmoncow" {
  statement {
    sid       = "salmoncow"
    actions   = ["s3:*"]
    resources = ["arn:aws:s3:::salmoncow/*"]
    principals {
      type        = "AWS"
      identifiers = [data.aws_caller_identity.current.account_id]
    }
  }
}

# ------------------------------------------------------------------------------
# User Federation
# ------------------------------------------------------------------------------

module "federation" {
  source = "./federation"

  ou        = var.ou
  use_case  = var.use_case
  tenant    = var.tenant
  recaptcha = { # https://www.google.com/recaptcha/admin
    site_key   = var.recaptcha_site_key,
    secret_key = var.recaptcha_secret_key,
  }

  tags = local.tags
}

output "cognito_user_pool_id" { value = module.federation.user_pool_id }
output "cognito_client_id" { value = module.federation.client_id }
output "cognito_identity_pool_id" { value = module.federation.identity_pool_id }
