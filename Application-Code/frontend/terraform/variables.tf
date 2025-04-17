variable vpc_cidr {}
# variable project_name {}
variable aws_region {}

variable "public_subnet_cidrs" {
  type = list(string)
  description = "Public Subnet CIDR values"
  default = [ "10.0.10.0/24", "10.0.20.0/24"]
  
}

variable "private_subnet_cidrs" {
  type = list(string)
  description = "Prvivate Subnet CIDR values"
  default = [ "10.0.40.0/24", "10.0.50.0/24"]
}

variable "azs" {
  type = list(string)
  description = "Availablility Zones"
  default = [ "us-east-1a", "us-east-1b","us-east-1c"]
  
}