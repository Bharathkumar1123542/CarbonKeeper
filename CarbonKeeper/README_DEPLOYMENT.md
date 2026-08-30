# 🚀 CarbonKeeper AWS Lambda Deployment

Complete guide for deploying the CarbonKeeper Next.js application to AWS Lambda using OpenNext.

## 📚 Documentation Overview

This deployment package includes comprehensive documentation and automation scripts:

| Document | Purpose |
|----------|---------|
| **[DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)** | 🎯 Quick commands and common scenarios |
| **[AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)** | 📖 Complete step-by-step guide with troubleshooting |
| **[DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)** | 📊 Current build status and checklist |

## 🛠 Deployment Scripts

### PowerShell Scripts (Windows)

| Script | Purpose | Usage |
|--------|---------|-------|
| `deploy-lambda.ps1` | Deploy Lambda function | `.\deploy-lambda.ps1 -CreateRole -GeminiApiKey "key"` |
| `deploy-static-assets.ps1` | Upload assets to S3 | `.\deploy-static-assets.ps1 -BucketName "name" -CreateBucket` |
| `verify-deployment.ps1` | Test deployment | `.\verify-deployment.ps1` |

### NPM Scripts

```bash
# Build and package for Lambda
npm run deploy:prepare

# Individual steps
npm run build:lambda    # Build with OpenNext
npm run package:lambda  # Create function.zip
```

## ⚡ Quick Start

### Option 1: Automated Deployment (Recommended)

```powershell
# One-command deployment
.\deploy-lambda.ps1 -CreateRole -GeminiApiKey "your-actual-gemini-key"

# Verify deployment
.\verify-deployment.ps1

# (Optional) Deploy static assets
.\deploy-static-assets.ps1 -BucketName "carbonkeeper-assets" -CreateBucket
```

### Option 2: Manual AWS Console

1. **Prepare package**: `npm run deploy:prepare`
2. **Upload to Lambda**:
   - Go to AWS Lambda Console
   - Create function (Node.js 20.x)
   - Upload `.open-next/function.zip`
   - Set handler: `index.handler`
   - Configure: 1024 MB memory, 30s timeout
3. **Add environment variable**: `GEMINI_API_KEY=your-key`
4. **Create Function URL** (Configuration → Function URL)
5. **Test your deployment**

## 📦 What's Included

### Build Artifacts

```
.open-next/
├── function.zip              # 4.08 MB - Ready to upload to Lambda
├── assets/                   # Static files for S3/CloudFront
├── server-functions/default/ # Lambda function source
└── [other OpenNext outputs]
```

### Documentation

- ✅ Complete deployment guide
- ✅ Quick start reference
- ✅ Troubleshooting guide
- ✅ Cost estimates
- ✅ Security considerations
- ✅ Update procedures

### Automation

- ✅ PowerShell deployment scripts
- ✅ IAM role configuration
- ✅ Function URL setup
- ✅ S3 asset deployment
- ✅ Deployment verification
- ✅ NPM task automation

## 🎯 Deployment Steps Summary

| Step | Status | Description |
|------|--------|-------------|
| 1. Install adapter | ✅ Complete | `@opennextjs/aws` installed |
| 2. Create config | ✅ Complete | `open-next.config.ts` created |
| 3. Build app | ✅ Complete | Next.js build successful |
| 4. Package Lambda | ✅ Complete | `function.zip` ready (4.08 MB) |
| 5. Create Lambda | ⏳ **Action needed** | Deploy using scripts or console |
| 6. Create Function URL | ⏳ **Action needed** | Enable public access |
| 7. Deploy assets | 🔵 Optional | For production performance |
| 8. Configure env vars | ⏳ **Action needed** | Add `GEMINI_API_KEY` |

**You are here**: Steps 1-4 complete, ready for steps 5-8 →

## 🚀 Next Actions

### Immediate (Required)

1. **Get Gemini API Key**: https://aistudio.google.com/
2. **Configure AWS CLI**: `aws configure`
3. **Deploy Lambda**:
   ```powershell
   .\deploy-lambda.ps1 -CreateRole -GeminiApiKey "your-key"
   ```
4. **Test deployment**:
   ```powershell
   .\verify-deployment.ps1
   ```

### Optional (Recommended for Production)

1. **Deploy static assets**:
   ```powershell
   .\deploy-static-assets.ps1 -BucketName "carbonkeeper-static" -CreateBucket
   ```

2. **Set up CloudFront**: See [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md#72-create-cloudfront-distribution)

3. **Configure custom domain**: See guide section 7.3

4. **Set up monitoring**: CloudWatch alarms for errors

## 📊 Application Info

### Routes

**Static Pages** (7):
- `/` - Home
- `/dashboard` - Dashboard
- `/dashboard/assistant` - AI Assistant
- `/dashboard/insights` - Insights
- `/dashboard/logs` - Activity Logs
- `/dashboard/settings` - Settings
- `/methodology` - Methodology

**API Routes** (4):
- `/api/chat` - Chat endpoint
- `/api/insight` - Insights generation
- `/api/parse` - NLP parsing
- `/api/recommend` - Recommendations

### Requirements

- **Runtime**: Node.js 20.x
- **Memory**: 1024 MB minimum
- **Timeout**: 30 seconds minimum
- **Handler**: `index.handler`
- **Package**: 4.08 MB

### Environment Variables

```env
# Required
GEMINI_API_KEY=your-api-key

# Optional
NEXT_PUBLIC_ASSET_PREFIX=https://cdn.example.com
NEXT_PUBLIC_APP_URL=https://example.com
NODE_ENV=production
```

## 💡 Common Tasks

### Update Deployment

```powershell
# After code changes
npm run deploy:prepare
.\deploy-lambda.ps1 -Update
```

### View Logs

```bash
# Real-time logs
aws logs tail /aws/lambda/carbonkeeper-app --follow

# Or use verification script
.\verify-deployment.ps1
```

### Test Function

```powershell
# Automated testing
.\verify-deployment.ps1

# Manual testing
curl https://your-function-url.lambda-url.region.on.aws/
```

## 🔍 Troubleshooting

### Quick Fixes

| Problem | Solution |
|---------|----------|
| Function returns 500 | Check CloudWatch logs, verify env vars |
| CSS/JS not loading | Deploy static assets to S3 |
| Permission denied | Check IAM role permissions |
| Cold starts too slow | Increase memory or use Provisioned Concurrency |

See [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md#-troubleshooting) for detailed troubleshooting.

## 💰 Cost Estimate

For ~10,000 requests/month:
- **Lambda**: ~$0.08
- **S3**: ~$0.50
- **CloudFront**: ~$1.70
- **Total**: ~$2.28/month

Most usage falls under AWS Free Tier!

## 📞 Support

### Resources

- [OpenNext Documentation](https://opennext.js.org/)
- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Issues

1. Check CloudWatch logs first
2. Review troubleshooting guide
3. Verify configuration with `verify-deployment.ps1`
4. Consult OpenNext GitHub issues

## ✅ Pre-Deployment Checklist

- [ ] AWS account with appropriate permissions
- [ ] AWS CLI installed and configured
- [ ] Gemini API key obtained
- [ ] `function.zip` exists (4.08 MB)
- [ ] Deployment scripts executable
- [ ] Documentation reviewed

## 🎉 Post-Deployment

After successful deployment:

1. ✅ Save your Function URL
2. ✅ Test all routes and API endpoints
3. ✅ Set up CloudWatch monitoring
4. ✅ Configure custom domain (optional)
5. ✅ Deploy static assets (recommended)
6. ✅ Document your deployment
7. ✅ Share with your team

## 📝 Files Reference

### Configuration
- `open-next.config.ts` - OpenNext configuration
- `lambda-trust-policy.json` - IAM trust policy
- `next.config.ts` - Next.js configuration

### Build Outputs
- `.open-next/function.zip` - Lambda deployment package
- `.open-next/assets/` - Static assets for S3
- `.open-next/server-functions/` - Lambda source

### Scripts
- `deploy-lambda.ps1` - Lambda deployment
- `deploy-static-assets.ps1` - S3 deployment
- `verify-deployment.ps1` - Deployment testing

### Documentation
- `AWS_DEPLOYMENT_GUIDE.md` - Complete guide
- `DEPLOYMENT_QUICK_START.md` - Quick reference
- `DEPLOYMENT_STATUS.md` - Status and checklist
- `README_DEPLOYMENT.md` - This file

---

## 🚀 Ready to Deploy?

### Three Simple Steps:

1. **Get API Key**: https://aistudio.google.com/

2. **Deploy**:
   ```powershell
   .\deploy-lambda.ps1 -CreateRole -GeminiApiKey "your-key"
   ```

3. **Verify**:
   ```powershell
   .\verify-deployment.ps1
   ```

**That's it! Your app will be live on AWS Lambda.**

---

**Package Version**: 1.0.0  
**Build Date**: 2026-08-30  
**Runtime**: Node.js 20.x  
**Package Size**: 4.08 MB  
**Ready for Deployment**: ✅
