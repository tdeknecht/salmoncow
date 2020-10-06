# ------------------------------------------------------------------------------
# Required inputs
# ------------------------------------------------------------------------------

variable "ou" {
  description = "(Required) A logical identifier for the Organizational Unit."
  type        = string
}

variable "tags" {
  description = "(Required) A map of tags to assign to the resource."
  type        = map(string)
}

# ------------------------------------------------------------------------------
# Optional inputs
# ------------------------------------------------------------------------------
