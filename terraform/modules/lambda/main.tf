# ------------------------------------------------------------------------------
# Data
# ------------------------------------------------------------------------------

data "aws_caller_identity" "current" {}

data "aws_iam_account_alias" "current" {}

# ------------------------------------------------------------------------------
# Lambda: salmoncow
# ------------------------------------------------------------------------------

data "archive_file" "lambda_function" {
  type        = "zip"
  source_file = "${path.module}/salmoncow.py"
  output_path = "${path.module}/salmoncow.zip"
}

# hello_world_go
resource "aws_lambda_function" "salmoncow" {
  filename         = "${path.module}/salmoncow.zip"
  function_name    = "${var.ou}-${data.aws_iam_account_alias.current.account_alias}-salmoncow"
  description      = "A silly lambda"
  role             = aws_iam_role.salmoncow.arn
  handler          = "salmoncow.lambda_handler"
  source_code_hash = data.archive_file.lambda_function.output_base64sha256
  runtime          = "python3.8"
  timeout          = "10"
  tags             = var.tags
}

resource "aws_lambda_alias" "salmoncow" {
  name             = "${var.ou}_v1"
  function_name    = aws_lambda_function.salmoncow.arn
  function_version = aws_lambda_function.salmoncow.version
}

# ------------------------------------------------------------------------------
# IAM: Policy document, policy, attachment, role
# ------------------------------------------------------------------------------

# assumerole policy doc
data "aws_iam_policy_document" "salmoncow_assumerole" {
  statement {
    sid     = "salmoncowLambdaAssumeRolePolicy"
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# lambda role
resource "aws_iam_role" "salmoncow" {
  name               = "${var.ou}-${data.aws_iam_account_alias.current.account_alias}-salmoncow-role"
  assume_role_policy = data.aws_iam_policy_document.salmoncow_assumerole.json
}

# lambdaBasicsExecutionRole policy attachment (allows writing to CloudWatch Logs)
resource "aws_iam_role_policy_attachment" "lambda_basic_execution_policy" {
  role       = aws_iam_role.salmoncow.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# ------------------------------------------------------------------------------
# CloudWatch: log group
# ------------------------------------------------------------------------------

resource "aws_cloudwatch_log_group" "hello_world_go" {
  name              = "/aws/lambda/${var.ou}-${data.aws_iam_account_alias.current.account_alias}-salmoncow"
  retention_in_days = 7
  tags              = var.tags
}

# ------------------------------------------------------------------------------
# API Gateway: salmoncow REST API
# ------------------------------------------------------------------------------

resource "aws_api_gateway_rest_api" "salmoncow" {
  name        = "${var.ou}-${data.aws_iam_account_alias.current.account_alias}-salmoncow"
  description = "A fun API"
  tags        = var.tags

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "salmoncow" {
  rest_api_id = aws_api_gateway_rest_api.salmoncow.id
  parent_id   = aws_api_gateway_rest_api.salmoncow.root_resource_id
  path_part   = "salmoncow"
}

resource "aws_api_gateway_method" "salmoncow" {
  rest_api_id   = aws_api_gateway_rest_api.salmoncow.id
  resource_id   = aws_api_gateway_resource.salmoncow.id
  http_method   = "GET"
  authorization = "NONE"
}