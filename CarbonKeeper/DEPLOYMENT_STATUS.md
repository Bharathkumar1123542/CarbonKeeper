# 🚀 CarbonKeeper AWS Lambda Deployment Status

## ✅ Completed Steps

### Step 1: Install OpenNext Adapter ✓
- **Status**: Complete
- **Package**: `@opennextjs/aws` v4.1.2
- **Installed with**: `--legacy-peer-deps` (due to Next.js version compatibility)

### Step 2: Create Configuration ✓
- **Status**: Complete
- **File**: `open-next.config.ts`
- **Configuration**: Default Lambda + S3 setup

### Step 3: Build Application ✓
- **Status**: Complete
- **Next.js Build**: Successful (Turbopack)
- **Routes**: 13 routes compiled
  - 7 static pages
  - 4 API routes
  - Middleware function included

### Step 4: Package for Lambda ✓
- **Status**: Complete
- **OpenNext Build**: Successful
- **Output Directory**: `.open-next/`
- **Lambda Package**: `function.zip` (4.08 MB)
- **Package Location**: `.open-next/function.zip`

**Generated Components**:
- ✓ Server function (default)
- ✓ Middleware function
- ✓ Static assets
- ✓ Cache assets
- ✓ Revalidation function
- ✓ Warmer function
- ⚠ Image optimization function (partial - Windows path issue, non-critical)

## 📋 Pending Steps (User Action Required)

### Step 5: Create Lambda Function ⏳
**Status**: Ready to deploy

**Quick Deploy Options**:

**Option A: Automated PowerShell Script** (Recommended)
```powershell
.\deploy-lambda.ps1 -CreateRole -GeminiApiKey "your-actual-gemini-key"
```

**Option B: AWS Console**
- Upload: `.open-next/function.zip`
- Runtime: Node.js 20.x
- Handler: `index.handler`
- Memory: 1024 MB
- Timeout: 30 seconds

**Option C: NPM Script**
```bash
npm run deploy:prepare  # Build and package
npm run deploy:lambda   # Deploy to AWS
```

### Step 6: Create Function URL ⏳
**Status**: Pending Lambda function creation

**After creating Lambda function**:
```bash
aws lambda create-function-url-config \
  --function-name carbonkeeper-app \
  --auth-type NONE \
  --cors '{"AllowOrigins":["*"],"AllowMethods":["*"],"AllowHeaders":["*"]}'
```

Or via AWS Console:
- Configuration → Function URL → Create
- Auth type: NONE
- Enable CORS

### Step 7: Deploy Static Assets ⏳
**Status**: Optional but recommended for production

**Assets Location**: `.open-next/assets/`

**Quick Deploy**:
```powershell
.\deploy-static-assets.ps1 -BucketName "carbonkeeper-static-assets" -CreateBucket
```

**What's Included**:
- Next.js static files
- CSS bundles
- JavaScript bundles
- Public assets
- Generated HTML files

### Step 8: Configure Environment Variables ⏳
**Status**: Required before first request

**Required Variables**:
```
GEMINI_API_KEY=your-actual-gemini-api-key
```

**Optional Variables**:
```
NEXT_PUBLIC_ASSET_PREFIX=https://your-cloudfront-domain.cloudfront.net
NEXT_PUBLIC_APP_URL=https://your-custom-domain.com
NODE_ENV=production
```

## 📦 Build Artifacts

### Lambda Function Package
```
.open-next/function.zip
├── index.mjs              (Lambda handler)
├── middleware.mjs         (Next.js middleware)
├── cache.cjs              (Cache implementation)
├── .next/                 (Next.js build output)
│   ├── server/
│   ├── static/
│   └── routes-manifest.json
├── node_modules/          (Bundled dependencies)
└── assets/                (Static assets)
```

**Size**: 4.08 MB
**Handler**: index.handler
**Runtime**: Node.js 20.x

### Static Assets
```
.open-next/assets/
├── _next/
│   └── static/           (JS, CSS, fonts)
├── favicon.ico
└── [other public files]
```

## 🛠 Available NPM Scripts

### Build & Package
```bash
npm run build              # Build Next.js app
npm run build:lambda       # Build + OpenNext packaging
npm run package:lambda     # Create function.zip
npm run deploy:prepare     # Build + Package (complete)
```

### Deploy
```bash
npm run deploy:lambda      # Deploy Lambda function (requires AWS CLI)
npm run deploy:assets      # Deploy static assets to S3
```

### Development
```bash
npm run dev                # Local development server
npm run start              # Production server (local)
npm run typecheck          # TypeScript checking
npm run lint               # ESLint
npm test                   # Run tests
```

## 📊 Application Routes

### Static Pages (Prerendered)
- `/` - Landing page
- `/_not-found` - 404 page
- `/dashboard` - Dashboard overview
- `/dashboard/assistant` - AI assistant
- `/dashboard/insights` - Carbon insights
- `/dashboard/logs` - Activity logs
- `/dashboard/settings` - Settings
- `/methodology` - Calculation methodology

### API Routes (Server-rendered)
- `/api/chat` - Chat endpoint
- `/api/insight` - Insights generation
- `/api/parse` - Natural language parsing
- `/api/recommend` - Recommendations engine

### Middleware
- Proxy middleware for request handling

## 🔐 Security Considerations

### Current Setup
- ✓ Content Security Policy configured
- ✓ HTTPS upgrade enforced
- ✓ Frame ancestors blocked
- ⚠ Function URL set to public (auth-type: NONE)
  - Recommended for public applications
  - Use AWS_IAM for private apps

### Environment Variables
- ⚠ API keys should be stored in AWS Secrets Manager for production
- Current: Environment variables in Lambda configuration
- Better: Lambda with Secrets Manager integration

### CORS Configuration
- Current: Allow all origins (`*`)
- Production: Restrict to specific domains
  ```json
  {
    "AllowOrigins": ["https://yourdomain.com"],
    "AllowMethods": ["GET", "POST", "OPTIONS"],
    "AllowHeaders": ["Content-Type", "Authorization"]
  }
  ```

## 💰 Estimated AWS Costs

### Lambda Function
- **Requests**: $0.20 per 1M requests
- **Compute**: $0.0000166667 per GB-second
- **Provisioned Concurrency** (optional): ~$35/month per instance

### S3 Storage
- **Storage**: ~$0.023 per GB/month
- **Requests**: $0.005 per 10,000 GET requests

### CloudFront
- **Data Transfer**: $0.085 per GB (first 10TB/month)
- **Requests**: $0.01 per 10,000 HTTPS requests

### Example Monthly Cost (10,000 requests/month)
- Lambda: ~$0.08
- S3: ~$0.50 (for ~20 GB assets)
- CloudFront: ~$1.70 (for ~20 GB transfer)
- **Total**: ~$2.28/month

**Note**: Most of this falls under AWS Free Tier limits!

## 📈 Next Steps After Deployment

1. **Immediate Testing**:
   - [ ] Test Function URL in browser
   - [ ] Verify all pages load correctly
   - [ ] Test API endpoints with sample data
   - [ ] Check CloudWatch logs for errors

2. **Production Readiness**:
   - [ ] Set up CloudFront distribution
   - [ ] Configure custom domain
   - [ ] Implement CloudWatch alarms
   - [ ] Set up backup/disaster recovery
   - [ ] Document rollback procedures

3. **Optimization**:
   - [ ] Enable Lambda Provisioned Concurrency (if needed)
   - [ ] Implement DynamoDB caching for ISR
   - [ ] Set up Lambda@Edge for global performance
   - [ ] Optimize cold start times

4. **Monitoring**:
   - [ ] Set up CloudWatch dashboards
   - [ ] Configure error rate alarms
   - [ ] Enable X-Ray tracing
   - [ ] Set up log aggregation

## 🆘 Support Resources

### Documentation
- [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md) - Quick reference
- [OpenNext Documentation](https://opennext.js.org/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)

### Deployment Scripts
- `deploy-lambda.ps1` - Automated Lambda deployment
- `deploy-static-assets.ps1` - S3 asset deployment
- `lambda-trust-policy.json` - IAM trust policy

### Logs & Monitoring
```bash
# Tail CloudWatch logs
aws logs tail /aws/lambda/carbonkeeper-app --follow

# Check function configuration
aws lambda get-function-configuration --function-name carbonkeeper-app

# Get function URL
aws lambda get-function-url-config --function-name carbonkeeper-app
```

## 📝 Deployment Checklist

### Pre-Deployment
- [x] Application built successfully
- [x] OpenNext package created
- [x] function.zip ready (4.08 MB)
- [x] Deployment scripts prepared
- [ ] AWS credentials configured
- [ ] Gemini API key obtained

### Deployment
- [ ] IAM role created
- [ ] Lambda function deployed
- [ ] Function URL created
- [ ] Environment variables set
- [ ] Function tested successfully

### Post-Deployment
- [ ] Static assets uploaded to S3
- [ ] CloudFront distribution created
- [ ] Custom domain configured (optional)
- [ ] Monitoring/alarms set up
- [ ] Documentation updated
- [ ] Team notified

---

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Build Status**: Ready for deployment
**Package Size**: 4.08 MB
**Next Action**: Deploy to AWS Lambda
