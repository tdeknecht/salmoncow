# ------------------------------------------------------------------------------
# data, variables, locals, etc.
# ------------------------------------------------------------------------------

data "aws_caller_identity" "current" {}

data "aws_iam_account_alias" "current" {}

# ------------------------------------------------------------------------------
# cognito user pool, client
# Using configuration options as stated in the AWS tutorial
# (https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)
# ------------------------------------------------------------------------------

resource "aws_cognito_user_pool" "pool" {
  name = "${var.tenant}-pool"
  tags = var.tags

  username_attributes      = ["email"]
  # auto_verified_attributes = ["email"]

  verification_message_template {
    email_subject = "Verification code for Salmoncow"
    email_message = "Your confirmation code is {####}. Welcome to Salmoncow!"
  }

  lambda_config {
    pre_sign_up = aws_lambda_function.pre_sign_up.arn
  }

  account_recovery_setting {
    recovery_mechanism {
      # name     = "verified_email"
      name     = "admin_only"
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
# Lambda: Pre sign-up
# https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html
# ------------------------------------------------------------------------------

locals {
  lambda_file_name = "cognito-pre-sign-up-lambda"
}

data "archive_file" "lambda_function" {
  type        = "zip"
  source_file = "${path.module}/${local.lambda_file_name}.py"
  output_path = "${path.module}/${local.lambda_file_name}.zip"
}

resource "aws_lambda_function" "pre_sign_up" {
  function_name    = "${var.ou}-${data.aws_iam_account_alias.current.account_alias}-cognito-pre-sign-up"
  description      = "Pre sign-up Lambda function for AWS Cognito"
  architectures    = ["arm64"]
  role             = aws_iam_role.pre_sign_up_role.arn # ec2 AssumeRole policy
  handler          = "${local.lambda_file_name}.lambda_handler"
  filename         = "${path.module}/${local.lambda_file_name}.zip"
  source_code_hash = data.archive_file.lambda_function.output_base64sha256 # if using archive_file approach
  runtime          = "python3.12"
  timeout          = "5"
  tags             = var.tags

  environment {
    variables = {
      recaptcha_secret_key = var.recaptcha.secret_key
    }
  }
}

resource "aws_lambda_alias" "pre_sign_up_alias" {
  name             = "${var.ou}_v1"
  function_name    = aws_lambda_function.pre_sign_up.arn
  function_version = aws_lambda_function.pre_sign_up.version
}

data "aws_iam_policy_document" "pre_sign_up_assumerole" {
  statement {
    sid     = "cognitoPreSignUpLambdaAssumeRole"
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# lambda role
resource "aws_iam_role" "pre_sign_up_role" {
  name               = "${var.ou}-${data.aws_iam_account_alias.current.account_alias}-cognito-pre-sign-up-role"
  assume_role_policy = data.aws_iam_policy_document.pre_sign_up_assumerole.json
  tags               = var.tags
}

resource "aws_lambda_permission" "cognito" {
   statement_id   = "allowCognitoInvoke"
   action         = "lambda:InvokeFunction"
   function_name  = aws_lambda_function.pre_sign_up.function_name
   principal      = "cognito-idp.amazonaws.com"
   source_account = data.aws_caller_identity.current.account_id
   source_arn     = aws_cognito_user_pool.pool.arn
}

# lambdaBasicsExecutionRole policy attachment (allows writing to CloudWatch Logs)
resource "aws_iam_role_policy_attachment" "lambda_basic_execution_policy_attachment" {
  role       = aws_iam_role.pre_sign_up_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_cloudwatch_log_group" "pre_sign_up" {
  name              = "/aws/lambda/${var.ou}-${data.aws_iam_account_alias.current.account_alias}-cognito-pre-sign-up"
  retention_in_days = 7
  tags              = var.tags
}
