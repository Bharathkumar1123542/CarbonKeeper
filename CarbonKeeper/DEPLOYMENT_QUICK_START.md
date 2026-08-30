# 🚀 Quick Start Deployment Guide

## Prerequisites Checklist

- [ ] AWS Account with appropriate permissions
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] Node.js 20+ installed
- [ ] Gemini API key from https://aistudio.google.com/

## 📋 Deployment Methods

### Method 1: Automated PowerShell Deployment (Fastest)

```powershell
# 1. Create IAM role and deploy Lambda function
.\deploy-lambda.ps1 -CreateRole -GeminiApiKey "your-actual-key"

# 2. Deploy static assets (optional but recommended)
.\deploy-static-assets.ps1 -BucketName "your-unique-bucket-name" -CreateBucket

# Your app is now live! The script will display the Function URL.
```

### Method 2: AWS CLI Commands

```bash
# 1. Create IAM role
aws iam create-role --role-name carbonkeeper-lambda-role \
  --assume-role-policy-document file://lambda-trust-policy.json

aws iam attach-role-policy --role-name carbonkeeper-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# 2. Get your AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# 3. Create Lambda function
aws lambda create-function \
  --function-name carbonkeeper-app \
  --runtime nodejs20.x \
  --role arn:aws:iam::$ACCOUNT_ID:role/carbonkeeper-lambda-role \
  --handler index.handler \
  --zip-file fileb://.open-next/function.zip \
  --timeout 30 \
  --memory-size 1024 \
  --environment Variables={GEMINI_API_KEY=your-actual-key}

# 4. Create Function URL
aws lambda create-function-url-config \
  --function-name carbonkeeper-app \
  --auth-type NONE \
  --cors '{"AllowOrigins":["*"],"AllowMethods":["*"],"AllowHeaders":["*"]}'

aws lambda add-permission \
  --function-name carbonkeeper-app \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --statement-id FunctionURLAllowPublicAccess

# 5. Get Function URL
aws lambda get-function-url-config --function-name carbonkeeper-app
```

### Method 3: AWS Console (Most Visual)

1. **Upload to Lambda**:
   - Go to: https://console.aws.amazon.com/lambda/
   - Click "Create function"
   - Name: `carbonkeeper-app`, Runtime: Node.js 20.x
   - Upload `.open-next/function.zip`
   - Set handler: `index.handler`
   - Set memory: 1024 MB, timeout: 30s
   - Add environment variable: `GEMINI_API_KEY=your-key`

2. **Create Function URL**:
   - Configuration → Function URL → Create
   - Auth type: NONE
   - Enable CORS
   - Save and copy the URL

## 🔄 Updating After Code Changes

```powershell
# Rebuild and update
npm run build
npx open-next build
cd .open-next\server-functions\default
Compress-Archive -Path ".\*" -DestinationPath "..\..\function.zip" -Force
cd ..\..\..

# Update Lambda (choose one):
# Option A: PowerShell script
.\deploy-lambda.ps1 -Update

# Option B: AWS CLI
aws lambda update-function-code --function-name carbonkeeper-app \
  --zip-file fileb://.open-next/function.zip
```

## 📊 Testing Your Deployment

```bash
# Test with curl
curl https://your-function-url.lambda-url.region.on.aws/

# Test API endpoints
curl https://your-function-url.lambda-url.region.on.aws/api/chat

# Check logs
aws logs tail /aws/lambda/carbonkeeper-app --follow
```

## 🎯 Common PowerShell Script Options

### Deploy Lambda Script

```powershell
# Create new function with role
.\deploy-lambda.ps1 -CreateRole -GeminiApiKey "your-key"

# Update existing function
.\deploy-lambda.ps1 -Update

# Use different region
.\deploy-lambda.ps1 -Region "us-west-2" -CreateRole -GeminiApiKey "your-key"

# Custom function name
.\deploy-lambda.ps1 -FunctionName "my-custom-name" -CreateRole -GeminiApiKey "your-key"
```

### Deploy Static Assets Script

```powershell
# Create bucket and upload assets
.\deploy-static-assets.ps1 -BucketName "my-app-assets" -CreateBucket

# Update existing bucket
.\deploy-static-assets.ps1 -BucketName "my-app-assets"

# With CloudFront invalidation
.\deploy-static-assets.ps1 -BucketName "my-app-assets" -DistributionId "E1234ABCD"

# Different region
.\deploy-static-assets.ps1 -BucketName "my-app-assets" -Region "us-west-2" -CreateBucket
```

## 🔍 Troubleshooting Quick Fixes

### Problem: Function returns 500 error
```bash
# Check logs immediately
aws logs tail /aws/lambda/carbonkeeper-app --follow

# Common fix: Verify environment variables
aws lambda get-function-configuration --function-name carbonkeeper-app
```

### Problem: CSS/JS not loading
```bash
# Upload static assets to S3
aws s3 sync .open-next/assets/ s3://your-bucket/ --acl public-read

# Verify files uploaded
aws s3 ls s3://your-bucket/ --recursive
```

### Problem: Permission denied
```bash
# Check IAM role permissions
aws iam get-role --role-name carbonkeeper-lambda-role

# Reattach execution policy
aws iam attach-role-policy --role-name carbonkeeper-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

## 📍 Important URLs After Deployment

Save these for easy access:

- **Lambda Console**: https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/carbonkeeper-app
- **CloudWatch Logs**: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252Fcarbonkeeper-app
- **S3 Console**: https://s3.console.aws.amazon.com/s3/buckets/your-bucket-name
- **CloudFront Console**: https://console.aws.amazon.com/cloudfront/v3/home

## 💡 Pro Tips

1. **Environment Variables**: Store API keys in AWS Secrets Manager for better security
2. **Monitoring**: Set up CloudWatch alarms for error rates
3. **Performance**: Enable Lambda Provisioned Concurrency to eliminate cold starts
4. **Logging**: Use structured logging for easier debugging
5. **Cost**: Use AWS Cost Explorer to monitor Lambda/S3/CloudFront costs

## 📚 Full Documentation

For detailed explanations, troubleshooting, and advanced configuration, see:
- **[AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)** - Complete deployment guide

## ✅ Post-Deployment Checklist

- [ ] Lambda function deployed and accessible
- [ ] Function URL created and tested
- [ ] Environment variables configured
- [ ] CloudWatch logs accessible
- [ ] Static assets uploaded to S3 (optional)
- [ ] CloudFront distribution created (optional)
- [ ] Custom domain configured (optional)
- [ ] Monitoring/alarms set up
- [ ] Documentation updated with your URLs
- [ ] Team notified of deployment

---

**Quick Reference**: Keep this file handy for deployments and updates!
