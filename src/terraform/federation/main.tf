# ------------------------------------------------------------------------------
# cognito user pool, client
# Using configuration options as stated in the AWS tutorial
# (https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)
# ------------------------------------------------------------------------------

resource "aws_cognito_user_pool" "pool" {
  name = "${var.tenant}-pool"
  tags = var.tags

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  verification_message_template {
    email_subject = "Verification code for Salmoncow"
    email_message = "Your confirmation code is {####}. Welcome to Salmoncow!"
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  username_configuration {
    case_sensitive = false
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name = "${var.tenant}-client"

  user_pool_id = aws_cognito_user_pool.pool.id

  prevent_user_existence_errors = "ENABLED"
  generate_secret               = false
  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH", # required
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_USER_SRP_AUTH",
  ]

  access_token_validity  = 1
  id_token_validity      = 1
  refresh_token_validity = 30

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }
}

# ------------------------------------------------------------------------------
# cognito identity pool, role, role attachment to pool
# ------------------------------------------------------------------------------

resource "aws_cognito_identity_pool" "pool" {
  identity_pool_name               = "${var.tenant}-pool"
  allow_unauthenticated_identities = false
  allow_classic_flow               = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.client.id
    provider_name           = aws_cognito_user_pool.pool.endpoint
    server_side_token_check = false
  }

  tags = var.tags
}

resource "aws_iam_role" "authenticated" {
  name               = "${var.use_case}-${var.ou}-authenticated-role"
  assume_role_policy = data.aws_iam_policy_document.authenticated_role.json
  tags               = var.tags
}

data "aws_iam_policy_document" "authenticated_role" {
  statement {
    sid     = "authenciatedAssumeRolePolicy"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    condition {
      test     = "StringEquals"
      variable = "cognito-identity.amazonaws.com:aud"
      values = [
        aws_cognito_identity_pool.pool.id
      ]
    }
    condition {
      test     = "ForAnyValue:StringLike"
      variable = "cognito-identity.amazonaws.com:amr"
      values = [
        "authenticated"
      ]
    }

    principals {
      type        = "Federated"
      identifiers = ["cognito-identity.amazonaws.com"]
    }
  }
}

# TODO: Create a policy for the role to perform some action (e.g. access an S3 bucket object for the SPA?)

resource "aws_cognito_identity_pool_roles_attachment" "main" {
  identity_pool_id = aws_cognito_identity_pool.pool.id

  # role_mapping {
  #   identity_provider         = aws_cognito_user_pool.pool.endpoint
  #   ambiguous_role_resolution = "AuthenticatedRole"
  #   type                      = "Rules"

  #   mapping_rule {
  #     claim      = "isAdmin"
  #     match_type = "Equals"
  #     role_arn   = aws_iam_role.authenticated.arn
  #     value      = "paid"
  #   }
  # }

  roles = {
    "authenticated" = aws_iam_role.authenticated.arn
  }
}

# ------------------------------------------------------------------------------
# generate file for spa constants
# ------------------------------------------------------------------------------

data "http" "cognito_jwks" {
  url             = "https://cognito-idp.${var.tags.region}.amazonaws.com/${aws_cognito_user_pool.pool.id}/.well-known/jwks.json"
  request_headers = {
    Accept = "application/json"
  }
}

resource "local_file" "spa" {
  depends_on = [data.http.cognito_jwks]

  filename = "../spa/src/constants/cognito.js"
  content  = <<EOF
export const AWS_REGION = '${var.tags.region}';

export const COGNITO_USER_POOL_ID = '${aws_cognito_user_pool.pool.id}';
export const COGNITO_CLIENT_ID = '${aws_cognito_user_pool_client.client.id}';
export const COGNITO_IDENTITY_POOL_ID = '${aws_cognito_identity_pool.pool.id}';

// https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
export const COGNITO_PUB_JWKS = ${data.http.cognito_jwks.body};

export const COGNITO_ID_TOKEN = 'cognito_id_token';
export const COGNITO_ACCESS_TOKEN = 'cognito_access_token';
EOF
}
