# Example Terraform configuration for AWS S3 bucket (user media)

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "user_media" {
  bucket = "datingapp-user-media"
  acl    = "private"

  tags = {
    Name        = "UserMediaBucket"
    Environment = "dev"
  }
}
