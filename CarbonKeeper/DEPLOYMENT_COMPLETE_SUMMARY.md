# ✅ AWS Lambda Deployment Setup - Complete

## 🎉 Summary

Your CarbonKeeper application has been successfully prepared for AWS Lambda deployment! All build steps (1-4) are complete, and your application is ready to be deployed to AWS.

## ✨ What Has Been Done

### 1. ✅ OpenNext Adapter Installed
- **Package**: `@opennextjs/aws` v4.1.2
- **Installation**: Successful with `--legacy-peer-deps`
- **Status**: Ready

### 2. ✅ Configuration Created
- **File**: `open-next.config.ts`
- **Type**: Default Lambda + S3 configuration
- **Status**: Configured

### 3. ✅ Application Built
- **Build Tool**: Next.js with Turbopack
- **Build Status**: Successful
- **Routes**: 13 total (7 static, 4 API, 1 middleware)
- **Build Time**: ~30 seconds

### 4. ✅ Lambda Package Created
- **Package File**: `.open-next/function.zip`
- **Size**: 4.08 MB
- **Format**: Ready for direct Lambda upload
- **Contents**: Complete Next.js app + runtime
- **Status**: ✅ Ready to deploy

## 📦 Deployment Package Details

### Structure
```
.open-next/
├── function.zip (4.08 MB)          ← Upload this to Lambda
│   ├── index.mjs                   ← Handler entry point
│   ├── middleware.mjs              ← Next.js middleware
│   ├── cache.cjs                   ← Cache layer
│   ├── .next/                      ← Build output
│   ├── node_modules/               ← Dependencies
│   └── assets/                     ← Static files
│
└── assets/                         ← Upload to S3 (optional)
    └── _next/static/               ← CSS, JS, images
```

### Lambda Configuration Requirements
- **Runtime**: Node.js 20.x
- **Handler**: `index.handler`
- **Memory**: 1024 MB (minimum)
- **Timeout**: 30 seconds (minimum)
- **Package**: `.open-next/function.zip`

## 📚 Documentation Created

### Primary Guides (Choose One Based on Your Preference)

1. **[README_DEPLOYMENT.md](./README_DEPLOYMENT.md)**
   - 🎯 **Best for**: Overview and getting started
   - Contains: Quick start, file reference, common tasks
   - Length: Comprehensive overview

2. **[DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)**
   - ⚡ **Best for**: Fast deployment with commands
   - Contains: Copy-paste commands for all methods
   - Length: Quick reference card

3. **[AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)**
   - 📖 **Best for**: Complete step-by-step instructions
   - Contains: Detailed explanations, troubleshooting, optimization
   - Length: Full deployment manual

### Supporting Documents

4. **[DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)**
   - Status tracking and checklist
   - Build artifacts details
   - Cost estimates

## 🛠️ Automation Tools Created

### PowerShell Scripts

1. **`deploy-lambda.ps1`** - Main deployment script
   ```powershell
   # Create role and deploy
   .\deploy-lambda.ps1 -CreateRole -GeminiApiKey "your-key"
   
   # Update existing
   .\deploy-lambda.ps1 -Update
   ```

2. **`deploy-static-assets.ps1`** - S3 asset deployment
   ```powershell
   .\deploy-static-assets.ps1 -BucketName "name" -CreateBucket
   ```

3. **`verify-deployment.ps1`** - Test your deployment
   ```powershell
   .\verify-deployment.ps1
   ```

### NPM Scripts Added

```json
{
  "build:lambda": "Build with OpenNext",
  "package:lambda": "Create function.zip",
  "deploy:prepare": "Build + package (one command)",
  "deploy:lambda": "Deploy to AWS",
  "deploy:assets": "Deploy to S3"
}
```

### Configuration Files

- `lambda-trust-policy.json` - IAM role configuration
- `open-next.config.ts` - OpenNext settings
- `.gitignore` - Updated to exclude build artifacts

## 🚀 Next Steps (What You Need to Do)

### Step 5: Deploy to AWS Lambda

**Choose Your Method:**

#### Option A: Automated PowerShell (Easiest) ⭐
```powershell
.\deploy-lambda.ps1 -CreateRole -GeminiApiKey "your-actual-gemini-api-key"
```
**Time**: ~2 minutes
**Result**: Function deployed with URL

#### Option B: AWS Console (Most Visual)
1. Go to AWS Lambda Console
2. Create function (Node.js 20.x)
3. Upload `.open-next/function.zip`
4. Set handler: `index.handler`, memory: 1024 MB, timeout: 30s
5. Add env var: `GEMINI_API_KEY`
6. Create Function URL

**Time**: ~5 minutes

#### Option C: AWS CLI (Most Control)
See [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md#method-2-aws-cli-commands)
**Time**: ~3 minutes

### Step 6: Verify Deployment

```powershell
# Automated verification
.\verify-deployment.ps1

# Or manually test
curl https://your-function-url.lambda-url.region.on.aws/
```

### Optional: Deploy Static Assets

```powershell
.\deploy-static-assets.ps1 -BucketName "carbonkeeper-static" -CreateBucket
```

**Benefits**:
- Faster page loads
- Lower Lambda costs
- Better caching
- CDN distribution

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [x] Application built and packaged ✅
- [x] `function.zip` ready (4.08 MB) ✅
- [x] Deployment scripts created ✅
- [x] Documentation prepared ✅
- [ ] AWS account with permissions
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] Gemini API key from https://aistudio.google.com/
- [ ] Chosen deployment method

## 🎯 Recommended Deployment Flow

### For First-Time Deployment:

1. **Get Gemini API Key**
   - Visit: https://aistudio.google.com/
   - Create or sign in to your account
   - Generate API key

2. **Configure AWS CLI** (if not done)
   ```bash
   aws configure
   # Enter your AWS Access Key ID
   # Enter your AWS Secret Access Key
   # Enter default region: us-east-1
   # Enter output format: json
   ```

3. **Deploy with One Command**
   ```powershell
   .\deploy-lambda.ps1 -CreateRole -GeminiApiKey "your-key"
   ```

4. **Copy the Function URL** (displayed after deployment)

5. **Test Your Deployment**
   ```powershell
   .\verify-deployment.ps1
   ```

6. **Visit Your App** in a browser using the Function URL

**Total Time**: 5-10 minutes

### For Production Deployment:

Follow the same steps above, then add:

7. **Deploy Static Assets**
   ```powershell
   .\deploy-static-assets.ps1 -BucketName "carbonkeeper-prod" -CreateBucket
   ```

8. **Set Up CloudFront**
   - See [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md#72-create-cloudfront-distribution)

9. **Configure Custom Domain**
   - See guide section 7.3

10. **Set Up Monitoring**
    - CloudWatch alarms
    - Error rate monitoring
    - X-Ray tracing

**Total Time**: 30-60 minutes

## 💡 Important Notes

### Environment Variables

**Required**:
- `GEMINI_API_KEY` - Your Gemini AI API key

**Optional**:
- `NEXT_PUBLIC_ASSET_PREFIX` - CloudFront CDN URL
- `NEXT_PUBLIC_APP_URL` - Your custom domain
- `NODE_ENV` - Set to "production"

### Memory & Timeout

The configured values (1024 MB, 30s) are **minimums** for Next.js SSR:
- ⬆️ **More memory** = Faster execution + Higher cost
- ⬇️ **Less memory** = Slower execution + Potential timeouts
- 🎯 **1024 MB is recommended** for optimal balance

### Cost Expectations

For typical usage (~10,000 requests/month):
- **Lambda**: ~$0.08/month
- **S3**: ~$0.50/month
- **CloudFront**: ~$1.70/month
- **Total**: ~$2.28/month

Most usage falls under **AWS Free Tier**!

## 🔍 Troubleshooting

### Before Deployment

| Issue | Solution |
|-------|----------|
| function.zip missing | Run `npm run deploy:prepare` |
| Scripts won't execute | Run in PowerShell as Administrator |
| AWS CLI not found | Install from https://aws.amazon.com/cli/ |

### After Deployment

| Issue | Solution |
|-------|----------|
| 500 Internal Server Error | Check CloudWatch logs, verify env vars |
| Function URL 404 | Ensure Function URL is created and public |
| CSS/JS not loading | Deploy static assets to S3 |
| Timeout errors | Increase timeout or memory |

Run `.\verify-deployment.ps1` for automated diagnosis!

## 📞 Getting Help

### Documentation

- Start with: [README_DEPLOYMENT.md](./README_DEPLOYMENT.md)
- Quick commands: [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)
- Full guide: [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)

### Resources

- OpenNext: https://opennext.js.org/
- AWS Lambda: https://docs.aws.amazon.com/lambda/
- Next.js: https://nextjs.org/docs/deployment

### Common Commands

```bash
# View logs
aws logs tail /aws/lambda/carbonkeeper-app --follow

# Update deployment
.\deploy-lambda.ps1 -Update

# Verify status
.\verify-deployment.ps1

# Check configuration
aws lambda get-function-configuration --function-name carbonkeeper-app
```

## 🎉 Success Indicators

After successful deployment, you should see:

1. ✅ Function URL displayed (https://xxx.lambda-url.region.on.aws/)
2. ✅ HTTP 200 response from Function URL
3. ✅ Home page loads in browser
4. ✅ CloudWatch logs show successful invocations
5. ✅ No errors in verification script

## 📊 What's Deployed

Your Lambda function includes:

### Routes (13 total)

**Pages**:
- `/` - Home/landing page
- `/dashboard` - Main dashboard
- `/dashboard/assistant` - AI assistant
- `/dashboard/insights` - Carbon insights
- `/dashboard/logs` - Activity logs
- `/dashboard/settings` - User settings
- `/methodology` - Calculation methodology

**API Endpoints**:
- `/api/chat` - Chat with AI assistant
- `/api/insight` - Generate insights
- `/api/parse` - Parse natural language input
- `/api/recommend` - Get recommendations

**Infrastructure**:
- Middleware for request handling
- Static asset serving
- Server-side rendering (SSR)
- API route handling

## 🔐 Security Reminders

1. **API Keys**: Never commit `.env` files to git
2. **Function URL**: Currently public (NONE auth)
   - For private apps, use AWS_IAM auth type
3. **CORS**: Currently allows all origins (`*`)
   - Restrict to your domain in production
4. **Secrets**: Consider AWS Secrets Manager for production

## ✅ Deployment Readiness

**Build Status**: ✅ Complete
**Package Status**: ✅ Ready (4.08 MB)
**Scripts Status**: ✅ All created
**Documentation**: ✅ Complete
**Next Action**: 🚀 Deploy to AWS Lambda

---

## 🚀 Ready to Deploy!

Everything is prepared. To deploy now:

```powershell
# Get your Gemini API key from: https://aistudio.google.com/
# Then run:

.\deploy-lambda.ps1 -CreateRole -GeminiApiKey "YOUR_ACTUAL_KEY"
```

**That's it!** Your app will be live on AWS Lambda in ~2 minutes.

---

**Summary**: Steps 1-4 complete ✅ | Steps 5-8 ready for you 🚀

**Documentation**: All guides created ✅ | All scripts ready ✅

**Status**: 🎯 **READY FOR DEPLOYMENT**

---

*Created: 2026-08-30*  
*Package: CarbonKeeper v1.0.0*  
*Size: 4.08 MB*  
*Runtime: Node.js 20.x*
