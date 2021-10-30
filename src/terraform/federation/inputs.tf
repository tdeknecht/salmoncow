variable "ou" {
  type = string
}

variable "use_case" {
  type = string
}

variable "tenant" {
  type = string
}

variable "tags" {
  type = map(any)
}

variable "recaptcha" {
  type = map(string)
}
