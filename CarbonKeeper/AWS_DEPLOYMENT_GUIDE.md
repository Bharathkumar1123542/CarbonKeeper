# AWS Lambda Deployment Guide for CarbonKeeper

This guide walks you through deploying the CarbonKeeper Next.js application to AWS Lambda using OpenNext.

## 📦 What's Been Prepared

✅ **Step 1-4 Complete**: The application has been built and packaged for AWS Lambda
- `@opennextjs/aws` adapter installed
- `open-next.config.ts` created with default Lambda configuration
- Next.js build completed successfully
- Lambda deployment package created: `.open-next/function.zip` (4.08 MB)

## 🚀 Remaining Deployment Steps

### Step 5: Create Lambda Function

You can deploy using either the AWS Console (easier) or AWS CLI (more automated).

#### Option A: AWS Console (Recommended for First Time)

1. **Sign in to AWS Console**
   - Go to https://console.aws.amazon.com/lambda/
   - Select your preferred region (e.g., us-east-1)

2. **Create Lambda Function**
   - Click "Create function"
   - Choose "Author from scratch"
   - Function name: `carbonkeeper-app` (or your preferred name)
   - Runtime: **Node.js 20.x**
   - Architecture: x86_64 (default)
   - Click "Create function"

3. **Upload Function Code**
   - In the "Code" tab, click "Upload from" → ".zip file"
   - Select `.open-next/function.zip` from your project
   - Click "Save"
   - **IMPORTANT**: Wait for the upload to complete (4MB may take 30-60 seconds)

4. **Configure Function Settings**
   - Go to "Configuration" → "General configuration" → "Edit"
   - Set **Memory**: 1024 MB (minimum recommended for Next.js SSR)
   - Set **Timeout**: 30 seconds (or higher for complex pages)
   - Set **Handler**: `index.handler` (should be default)
   - Click "Save"

5. **Set Environment Variables**
   - Go to "Configuration" → "Environment variables" → "Edit"
   - Add required variables:
     ```
     GEMINI_API_KEY=your-actual-gemini-api-key
     ```
   - Click "Save"

6. **Configure IAM Role**
   - The function should have basic Lambda execution permissions (created automatically)
   - If you need to add permissions later (e.g., for S3, DynamoDB):
     - Go to "Configuration" → "Permissions"
     - Click on the role name
     - Attach additional policies as needed

#### Option B: AWS CLI Deployment

Use the included deployment script (see below) or run these commands:

```bash
# Create IAM role (one-time setup)
aws iam create-role \
  --role-name carbonkeeper-lambda-role \
  --assume-role-policy-document file://lambda-trust-policy.json

# Attach basic execution policy
aws iam attach-role-policy \
  --role-name carbonkeeper-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Create Lambda function
aws lambda create-function \
  --function-name carbonkeeper-app \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/carbonkeeper-lambda-role \
  --handler index.handler \
  --zip-file fileb://.open-next/function.zip \
  --timeout 30 \
  --memory-size 1024 \
  --environment Variables={GEMINI_API_KEY=your-actual-key}
```

### Step 6: Create Lambda Function URL

The simplest way to expose your Lambda function is via a Function URL (no API Gateway needed).

#### Using AWS Console:

1. In your Lambda function, go to "Configuration" → "Function URL"
2. Click "Create function URL"
3. **Auth type**: 
   - Choose **NONE** for public access (recommended for testing)
   - Choose **AWS_IAM** for authenticated access only
4. **Configure CORS** (recommended for public access):
   - Check "Configure cross-origin resource sharing (CORS)"
   - Allow origins: `*` (or specific domain for production)
   - Allow methods: GET, POST, PUT, DELETE, OPTIONS
   - Allow headers: content-type, x-amz-date, authorization, x-api-key
5. Click "Save"
6. **Copy the Function URL** - this is your application's public endpoint!

#### Using AWS CLI:

```bash
aws lambda create-function-url-config \
  --function-name carbonkeeper-app \
  --auth-type NONE \
  --cors '{"AllowOrigins":["*"],"AllowMethods":["*"],"AllowHeaders":["*"]}'

# Get the Function URL
aws lambda get-function-url-config --function-name carbonkeeper-app
```

### Step 7: Set Up CloudFront + S3 for Static Assets

For optimal performance, static assets (CSS, JS, images) should be served from S3 via CloudFront.

#### 7.1 Create S3 Bucket

```bash
# Create bucket (use your own unique name)
aws s3 mb s3://carbonkeeper-static-assets --region us-east-1

# Upload static assets from OpenNext build
aws s3 sync .open-next/assets/ s3://carbonkeeper-static-assets/ --acl public-read
```

#### 7.2 Create CloudFront Distribution

1. Go to CloudFront console: https://console.aws.amazon.com/cloudfront/
2. Click "Create Distribution"
3. **Origin settings**:
   - Origin domain: Select your S3 bucket
   - Origin access: Origin access control (recommended)
   - Or use "Public" if you set public-read ACL
4. **Default cache behavior**:
   - Viewer protocol policy: Redirect HTTP to HTTPS
   - Allowed HTTP methods: GET, HEAD, OPTIONS
   - Cache policy: CachingOptimized
5. **Settings**:
   - Price class: Use all edge locations (or choose based on your needs)
   - Alternate domain name (CNAME): your-domain.com (if you have one)
   - SSL certificate: Default CloudFront certificate (or request custom)
6. Click "Create Distribution"
7. **Note the Distribution Domain Name** (e.g., d1234abcd.cloudfront.net)

#### 7.3 Update Lambda Environment Variable

Add the CloudFront URL as an environment variable in your Lambda function:

```
NEXT_PUBLIC_ASSET_PREFIX=https://d1234abcd.cloudfront.net
```

Or configure it in your `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
  // ... rest of config
};
```

### Step 8: Test Your Deployment

1. **Test Lambda Function URL**:
   ```bash
   curl https://your-function-url.lambda-url.region.on.aws/
   ```

2. **Check CloudWatch Logs**:
   - Go to AWS CloudWatch console
   - Navigate to Log groups → `/aws/lambda/carbonkeeper-app`
   - Check for any errors during cold start or execution

3. **Open in Browser**:
   - Visit your Lambda Function URL
   - Navigate through the app pages:
     - Home: `/`
     - Dashboard: `/dashboard`
     - Assistant: `/dashboard/assistant`
     - Insights: `/dashboard/insights`
     - Logs: `/dashboard/logs`

4. **Verify Static Assets**:
   - Open browser DevTools → Network tab
   - Refresh the page
   - Check that CSS/JS files load successfully
   - If using CloudFront, verify they're served from the CDN

## 🔧 Advanced Configuration

### Custom Domain with API Gateway

For a custom domain (e.g., `app.carbonkeeper.com`), use API Gateway HTTP API:

1. **Create HTTP API**:
   - Go to API Gateway console
   - Create HTTP API
   - Add integration → Lambda function
   - Select your Lambda function

2. **Configure Routes**:
   - Add route: `ANY /{proxy+}`
   - Integration: Your Lambda function

3. **Set Up Custom Domain**:
   - In API Gateway, go to "Custom domain names"
   - Create custom domain
   - Add API mapping
   - Update your DNS (Route 53 or your provider) with the provided values

### Caching & Performance

For production, consider:

1. **DynamoDB for ISR cache** (Incremental Static Regeneration):
   - Create a DynamoDB table for Next.js cache
   - Update Lambda IAM role to access DynamoDB
   - Configure in `open-next.config.ts`

2. **Lambda@Edge for Better Performance**:
   - Deploy middleware as Lambda@Edge
   - Attach to CloudFront for global distribution

### Monitoring

1. **CloudWatch Logs**: Automatically enabled
2. **CloudWatch Metrics**: 
   - Invocations, Duration, Errors
   - Set up alarms for error rates
3. **X-Ray Tracing**: Enable in Lambda configuration for detailed traces

## 📝 Environment Variables Reference

Required environment variables for your Lambda function:

```env
# Required - Gemini AI API Key
GEMINI_API_KEY=your-actual-gemini-api-key

# Optional - Asset CDN
NEXT_PUBLIC_ASSET_PREFIX=https://your-cloudfront-distribution.cloudfront.net

# Optional - Custom domain
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🔄 Updating Your Deployment

When you make code changes:

1. **Rebuild the application**:
   ```bash
   npm run build
   npx open-next build
   ```

2. **Recreate the ZIP**:
   ```bash
   cd .open-next/server-functions/default
   # Windows PowerShell:
   Compress-Archive -Path ".\*" -DestinationPath "..\..\function.zip" -Force
   ```

3. **Update Lambda function**:
   ```bash
   # Using AWS CLI:
   aws lambda update-function-code \
     --function-name carbonkeeper-app \
     --zip-file fileb://.open-next/function.zip
   
   # Or upload via AWS Console
   ```

4. **Sync static assets**:
   ```bash
   aws s3 sync .open-next/assets/ s3://carbonkeeper-static-assets/ --delete
   ```

5. **Invalidate CloudFront cache** (if using):
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id YOUR_DISTRIBUTION_ID \
     --paths "/*"
   ```

## 🐛 Troubleshooting

### Issue: "Internal Server Error" or blank page

**Solutions**:
1. Check CloudWatch Logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure Lambda has enough memory (1024MB minimum)
4. Check timeout settings (30s minimum)

### Issue: CSS/JS not loading

**Solutions**:
1. Verify S3 bucket permissions (public-read for objects)
2. Check CloudFront distribution is active
3. Verify NEXT_PUBLIC_ASSET_PREFIX matches CloudFront URL
4. Clear CloudFront cache

### Issue: API routes returning 404

**Solutions**:
1. Verify Lambda function has correct handler: `index.handler`
2. Check that function.zip was created correctly (index.mjs at root)
3. Review CloudWatch logs for routing errors

### Issue: Cold start taking too long

**Solutions**:
1. Enable Provisioned Concurrency (costs more but eliminates cold starts)
2. Increase memory allocation (more memory = faster CPU)
3. Use Lambda Warmer function (included in OpenNext build)

### Issue: "ENOENT" or missing file errors

**Solutions**:
1. Ensure all files are included in function.zip
2. Re-run OpenNext build: `npx open-next build`
3. Verify node_modules are properly bundled

## 💰 Cost Estimation

AWS Lambda pricing (as of 2026):
- **Requests**: $0.20 per 1M requests
- **Duration**: $0.0000166667 per GB-second

Example calculation for 10,000 requests/month:
- Requests: 10,000 × $0.20/1M = $0.002
- Duration: 10,000 × 0.5s × 1GB × $0.0000166667 = $0.08
- **Total: ~$0.08/month** (well within free tier!)

CloudFront: ~$0.085 per GB of data transfer
S3: ~$0.023 per GB storage + $0.005 per 10,000 requests

**Note**: AWS Free Tier includes:
- 1M Lambda requests/month
- 400,000 GB-seconds compute time/month
- 50 GB CloudFront data transfer/month

## 📚 Additional Resources

- [OpenNext Documentation](https://opennext.js.org/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)

## 🆘 Need Help?

If you encounter issues:
1. Check CloudWatch Logs first
2. Review this guide's Troubleshooting section
3. Consult OpenNext GitHub issues
4. AWS Support (if you have a support plan)

---

**Created**: $(date)
**Application**: CarbonKeeper v1.0.0
**Runtime**: Node.js 20.x
**Package Size**: 4.08 MB
