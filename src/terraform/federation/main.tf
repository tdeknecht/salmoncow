# Using configuration options as stated in the AWS tutorial
# (https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)

resource "aws_cognito_user_pool" "pool" {
  name = "${var.owner}-pool"
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
  name = "${var.owner}-client"

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