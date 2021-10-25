# ------------------------------------------------------------------------------
# Lambda: Pre sign-up
# ------------------------------------------------------------------------------
data "archive_file" "lambda_function" {
  type        = "zip"
  source_file = "${path.module}/CognitoPreSignUpLambda.js"
  output_path = "${path.module}/CognitoPreSignUpLambda.zip"
}

resource "aws_lambda_function" "pre_sign_up" {
  function_name    = "${var.ou}-${data.aws_iam_account_alias.current.account_alias}-cognito-pre-sign-up"
  description      = "Pre sign-up Lambda function for AWS Cognito"
  role             = aws_iam_role.pre_sign_up_role.arn # ec2 AssumeRole policy
  handler          = "pre_sign_up.lambda_handler"
  filename         = "${path.module}/CognitoPreSignUpLambda.zip"
  source_code_hash = data.archive_file.lambda_function.output_base64sha256 # if using archive_file approach
  runtime          = "nodejs14.x"
  timeout          = "5"
  tags             = var.tags
}

resource "aws_lambda_alias" "pre_sign_up_alias" {
  name             = "${var.ou}_v1"
  function_name    = aws_lambda_function.pre_sign_up.arn
  function_version = aws_lambda_function.pre_sign_up.version
}

# ------------------------------------------------------------------------------
# IAM: Policy document, policy, attachment, role
# ------------------------------------------------------------------------------

# assumerole policy doc
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

# lambdaBasicsExecutionRole policy attachment (allows writing to CloudWatch Logs)
resource "aws_iam_role_policy_attachment" "lambda_basic_execution_policy_attachment" {
  role       = aws_iam_role.pre_sign_up_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# ------------------------------------------------------------------------------
# CloudWatch: log group
# ------------------------------------------------------------------------------

resource "aws_cloudwatch_log_group" "pre_sign_up" {
  name              = "/aws/lambda/${var.ou}-${data.aws_iam_account_alias.current.account_alias}-cognito-pre-sign-up"
  retention_in_days = 7
  tags              = var.tags
}