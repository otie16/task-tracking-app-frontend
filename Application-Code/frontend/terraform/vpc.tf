# Virtual private cloud
resource "aws_vpc" "myapp-vpc" {
    cidr_block = var.vpc_cidr

    tags = {
      Name = "Project VPC"
    }
}


# Public subnet
resource "aws_subnet" "public_subnets" {
  count = length(var.public_subnet_cidrs)
  vpc_id = aws_vpc.myapp-vpc.id
  cidr_block = element(var.public_subnet_cidrs, count.index)
  availability_zone = element(var.azs, count.index)
  map_public_ip_on_launch = true

  tags = {
    Name: "my-three-tier-app-public-subnet  ${count.index + 1}"
  }
}

# private subnet
resource "aws_subnet" "private_subnets" {
  count = length(var.private_subnet_cidrs)
  vpc_id = aws_vpc.myapp-vpc.id
  cidr_block = element(var.private_subnet_cidrs, count.index)
  availability_zone = element(var.azs, count.index)

  tags = {
    Name: "my-three-tier-app-private-subnet-${count.index + 1}"
  }
  
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.myapp-vpc.id

  tags = {
    Name = "my-three-tier-app VPC IG"
  }
}

# Route Table for public subnet
resource "aws_route_table" "public-rtb"{
  vpc_id = aws_vpc.myapp-vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "public-rtb"
  }
}
  
# Associating the public subnet with the route table that has IGW
resource "aws_route_table_association" "public-subnet-association" {
  count = length(var.public_subnet_cidrs)
  subnet_id = element(aws_subnet.public_subnets[*].id, count.index)
  route_table_id = aws_route_table.public-rtb.id
}



# Elastic IP for NAT Gateway
resource "aws_eip" "nat" {
  tags = {
    Name = "nat-eip"
  }
}

#  NAT Gateway in Public Subnet 1
resource "aws_nat_gateway" "nat" {
  count = 1
  allocation_id = aws_eip.nat.id
  subnet_id  = element(aws_subnet.public_subnets[*].id, count.index)
  tags = {
    Name = "main-nat-${count.index + 1}"
  }
  depends_on = [aws_internet_gateway.igw]
}


# Private Route Table
resource "aws_route_table" "private-rtb" {
  count = length(aws_nat_gateway.nat)
  vpc_id = aws_vpc.myapp-vpc.id
  route  {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = element(aws_nat_gateway.nat[*].id, count.index)
  }

  tags = {
    Name = "private-rtb"
  }
}

# Private Route Table Associations
resource "aws_route_table_association" "private-subnet-association" {
  count = length(var.private_subnet_cidrs)
  subnet_id = element(aws_subnet.private_subnets[*].id, count.index)
  route_table_id = element(aws_route_table.private-rtb[*].id, count.index)
}
