# CarbonKeeper — AWS Console Deployment Guide

A complete, step-by-step walkthrough for deploying CarbonKeeper to AWS using only the AWS Management Console (no CLI required).

---

## Architecture Overview

```
Browser → CloudFront → Lambda Function URL  (HTML / API routes)
                  ↘ S3 Bucket              (CSS / JS / images)
```

| Service | Purpose |
|---|---|
| AWS Lambda | Runs the Next.js SSR server (OpenNext) |
| Lambda Function URL | Public HTTPS endpoint — no API Gateway needed |
| S3 | Hosts compiled static assets (_next/static) |
| CloudFront | CDN in front of both Lambda + S3 |
| IAM | Execution role for the Lambda function |
| CloudWatch | Automatic logs & metrics |

---

## Prerequisites

Before you start, make sure you have:

- [ ] An AWS account (free tier is fine)
- [ ] The project built locally — run this once in your project folder:

```powershell
npm run build
npx open-next build
cd .open-next\server-functions\default
Compress-Archive -Path ".\*" -DestinationPath "..\..\function.zip" -Force
cd ..\..\..
```

This produces `.open-next/function.zip` (≈ 4 MB) — the file you will upload to Lambda.

- [ ] Your Gemini API key ready (already in `.env` as `GEMINI_API_KEY`)

---

## Step 1 — Sign in to the AWS Console

1. Open [https://console.aws.amazon.com](https://console.aws.amazon.com)
2. Sign in with your root account or an IAM user that has **AdministratorAccess** (or at minimum Lambda + IAM + S3 + CloudFront permissions).
3. In the top-right region selector, choose **us-east-1 (N. Virginia)** — this is required later if you want CloudFront with an ACM certificate. You can use any region otherwise.

---

## Step 2 — Create an IAM Role for Lambda

Lambda needs a permission role to write logs to CloudWatch.

1. Open the [IAM Console](https://console.aws.amazon.com/iam/)
2. In the left sidebar click **Roles** → **Create role**
3. **Trusted entity type**: AWS service
4. **Use case**: Lambda → click **Next**
5. In the permissions search box, type `AWSLambdaBasicExecutionRole`
6. Check the checkbox next to **AWSLambdaBasicExecutionRole** → click **Next**
7. **Role name**: `carbonkeeper-lambda-role`
8. Click **Create role**

> You will paste this role ARN into Lambda in Step 3. Keep this tab open or note the ARN (format: `arn:aws:iam::123456789012:role/carbonkeeper-lambda-role`).

---

## Step 3 — Create the Lambda Function

1. Open the [Lambda Console](https://console.aws.amazon.com/lambda/)
2. Click **Create function**
3. Select **Author from scratch**
4. Fill in the form:

   | Field | Value |
   |---|---|
   | Function name | `carbonkeeper-app` |
   | Runtime | **Node.js 20.x** |
   | Architecture | x86_64 |
   | Execution role | Use an existing role → `carbonkeeper-lambda-role` |

5. Click **Create function**

---

## Step 4 — Upload the Function Code

1. On the function page, click the **Code** tab
2. Click **Upload from** → **.zip file**
3. Click **Upload** and select `.open-next/function.zip` from your project folder
4. Click **Save**
5. Wait for the upload to finish (30–60 seconds for 4 MB)

Verify it worked: the Code source panel should show `index.mjs` at the root.

---

## Step 5 — Configure Function Settings

1. Click the **Configuration** tab → **General configuration** → **Edit**
2. Set:

   | Setting | Value |
   |---|---|
   | Memory | **1024 MB** (minimum for Next.js SSR) |
   | Timeout | **30 seconds** |
   | Handler | `index.handler` (leave as-is) |

3. Click **Save**

---

## Step 6 — Add Environment Variables

1. Still in the **Configuration** tab, click **Environment variables** → **Edit**
2. Click **Add environment variable** and add:

   | Key | Value |
   |---|---|
   | `GEMINI_API_KEY` | your Gemini API key |
   | `NODE_ENV` | `production` |

3. Click **Save**

> Never commit real API keys to source control. For production, consider moving secrets to [AWS Secrets Manager](https://console.aws.amazon.com/secretsmanager/) and reading them at runtime.

---

## Step 7 — Create a Lambda Function URL

This gives your Lambda a public HTTPS URL — no API Gateway required.

1. In the **Configuration** tab, click **Function URL** → **Create function URL**
2. Set:

   | Field | Value |
   |---|---|
   | Auth type | **NONE** (public access) |
   | Configure CORS | ✅ Checked |

3. Under CORS settings:

   | Field | Value |
   |---|---|
   | Allow origins | `*` |
   | Allow methods | `*` |
   | Allow headers | `content-type, x-amz-date, authorization, x-api-key` |
   | Expose headers | `*` |
   | Max age | `86400` |

4. Click **Save**
5. A **Function URL** is now shown at the top of the page. **Copy it** — it looks like:
   ```
   https://abcdefgh1234.lambda-url.us-east-1.on.aws/
   ```

6. Allow public invocations — Lambda may prompt you to add a resource-based policy:
   - Click **Add permission** if prompted
   - Or go to **Configuration** → **Permissions** → **Resource-based policy statements** → **Add permissions**
     - Principal: `*`
     - Action: `lambda:InvokeFunctionUrl`
     - Function URL auth type: `NONE`

Test it: open the Function URL in your browser. You should see the CarbonKeeper home page.

---

## Step 8 — Create an S3 Bucket for Static Assets

Static files (CSS, JS, fonts, images) should be served from S3, not Lambda, to reduce cost and improve performance.

1. Open the [S3 Console](https://console.aws.amazon.com/s3/)
2. Click **Create bucket**
3. Fill in:

   | Field | Value |
   |---|---|
   | Bucket name | `carbonkeeper-static-YOURNAME` (must be globally unique) |
   | AWS Region | Same region as your Lambda (e.g., us-east-1) |
   | Block all public access | **Uncheck** (we need public reads for assets) |
   | Confirm the warning | ✅ Check the acknowledgement box |

4. Leave all other settings as defaults
5. Click **Create bucket**

### Upload static assets

1. Open your bucket → click **Upload**
2. Click **Add folder** → select `.open-next/assets` from your project
3. Click **Upload**
4. Wait for all files to finish uploading

### Set a bucket policy for public read

1. In your bucket, click the **Permissions** tab
2. Scroll to **Bucket policy** → **Edit**
3. Paste this policy (replace `carbonkeeper-static-YOURNAME` with your actual bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::carbonkeeper-static-YOURNAME/*"
    }
  ]
}
```

4. Click **Save changes**

---

## Step 9 — Create a CloudFront Distribution

CloudFront sits in front of both Lambda (for SSR) and S3 (for assets), providing:
- Global edge caching
- HTTPS everywhere
- Better performance

1. Open the [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click **Create distribution**

### Origin 1 — Lambda Function URL

3. **Origin domain**: paste your Lambda Function URL hostname (just the domain, e.g. `abcdefgh1234.lambda-url.us-east-1.on.aws`)
4. **Protocol**: HTTPS only
5. **Name**: `lambda-origin` (auto-filled, you can keep it)

### Default cache behavior (Lambda)

6. Scroll to **Default cache behavior**:

   | Field | Value |
   |---|---|
   | Viewer protocol policy | Redirect HTTP to HTTPS |
   | Allowed HTTP methods | GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE |
   | Cache policy | **CachingDisabled** (SSR pages must not be cached by default) |
   | Origin request policy | **AllViewer** |

### Settings

7. Scroll to **Settings**:

   | Field | Value |
   |---|---|
   | Price class | Use only North America and Europe (cheapest) |
   | Default root object | (leave empty) |

8. Click **Create distribution**

> The distribution takes 5–10 minutes to deploy globally. Note the **Distribution domain name** (e.g., `d1a2b3c4d5.cloudfront.net`).

### Add a second origin for S3 static assets

9. Click your distribution → **Origins** tab → **Create origin**

   | Field | Value |
   |---|---|
   | Origin domain | Select your S3 bucket from the dropdown |
   | Origin access | **Origin access control settings (recommended)** |
   | Create control setting | Click **Create new OAC** → keep defaults → Create |

10. Click **Create origin**

11. Go to **Behaviors** tab → **Create behavior**

    | Field | Value |
    |---|---|
    | Path pattern | `/_next/static/*` |
    | Origin | Your S3 bucket origin |
    | Viewer protocol policy | Redirect HTTP to HTTPS |
    | Cache policy | **CachingOptimized** |

12. Create another behavior for other static paths:

    | Field | Value |
    |---|---|
    | Path pattern | `/data/*` |
    | Origin | Your S3 bucket origin |
    | Cache policy | **CachingOptimized** |

13. Click **Save changes**

14. Copy the **S3 bucket policy** shown — CloudFront will display a policy to paste into your S3 bucket so only CloudFront can read it. Go to your S3 bucket → Permissions → Bucket policy and replace the previous public policy with this OAC policy.

---

## Step 10 — Update Lambda Environment Variable with CloudFront URL

Now that CloudFront is in front of your S3 bucket, tell Next.js to load assets from there.

1. Go back to your Lambda function → **Configuration** → **Environment variables** → **Edit**
2. Add:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_ASSET_PREFIX` | `https://d1a2b3c4d5.cloudfront.net` |

3. Click **Save**

> Redeploy the function code after this change so the Next.js build picks up the new asset prefix. Or, if you configured `assetPrefix` in `next.config.ts` before building, the build already has it baked in.

---

## Step 11 — Test Your Deployment

### Browser test

Open your CloudFront domain:

```
https://d1a2b3c4d5.cloudfront.net/
```

Navigate to all routes:
- `/` — Home
- `/dashboard` — Dashboard
- `/dashboard/assistant` — AI Assistant
- `/dashboard/insights` — Insights
- `/dashboard/logs` — Activity Logs
- `/dashboard/settings` — Settings

### Network tab check

Open browser DevTools → **Network** tab → refresh the page.
- HTML pages should come from the CloudFront/Lambda origin
- CSS/JS files (paths starting with `/_next/static/`) should be served from the S3/CloudFront origin with a `Cache-Control` header

### CloudWatch Logs

1. Open [CloudWatch](https://console.aws.amazon.com/cloudwatch/)
2. Navigate to **Log groups** → `/aws/lambda/carbonkeeper-app`
3. Click the latest log stream
4. You should see initialization and request logs — no ERROR messages

---

## Step 12 — (Optional) Set Up a Custom Domain

If you own a domain (e.g., `app.carbonkeeper.com`):

### Request an SSL certificate

1. Open [AWS Certificate Manager](https://console.aws.amazon.com/acm/) — **must be in us-east-1**
2. Click **Request** → Request a public certificate
3. Enter your domain name: `app.carbonkeeper.com`
4. Validation method: **DNS validation**
5. Click **Request**
6. Follow the instructions to add a CNAME record to your DNS provider
7. Wait for status to change to **Issued** (usually 1–5 minutes after DNS validates)

### Attach domain to CloudFront

1. Open your CloudFront distribution → **Edit**
2. Under **Alternate domain name (CNAME)**: add `app.carbonkeeper.com`
3. Under **Custom SSL certificate**: select the certificate you just issued
4. Click **Save changes**

### Update DNS

1. In your DNS provider, create a CNAME record:
   - Name: `app`
   - Value: your CloudFront domain (`d1a2b3c4d5.cloudfront.net`)

Wait for DNS propagation (up to 48 hours, usually under 5 minutes).

---

## Step 13 — Set Up Monitoring & Alarms

### CloudWatch Alarm for Lambda Errors

1. Open [CloudWatch](https://console.aws.amazon.com/cloudwatch/) → **Alarms** → **Create alarm**
2. Click **Select metric** → Lambda → By Function Name → `carbonkeeper-app` → **Errors**
3. Conditions:
   - Threshold type: Static
   - Whenever Errors is **Greater than 5** (over 5 minutes)
4. Notification: create or select an SNS topic with your email
5. Name the alarm: `CarbonKeeper-Lambda-Errors`
6. Click **Create alarm**

### CloudWatch Alarm for Lambda Duration

1. Repeat the process for **Duration** metric
2. Alarm when avg Duration > 25000ms (25 seconds — near the 30s timeout)
3. Name: `CarbonKeeper-Lambda-Duration`

---

## Updating Your Deployment

When you make code changes:

```powershell
# 1. Rebuild
npm run build
npx open-next build

# 2. Repackage
cd .open-next\server-functions\default
Compress-Archive -Path ".\*" -DestinationPath "..\..\function.zip" -Force
cd ..\..\..

# 3. Upload new function.zip via Lambda Console:
#    Code tab → Upload from → .zip file → Upload → Save

# 4. Sync new static assets to S3:
#    S3 Console → your bucket → Upload → Add folder → .open-next/assets

# 5. Invalidate CloudFront cache:
#    CloudFront → your distribution → Invalidations → Create invalidation → Path: /*
```

---

## Quick Reference — Console URLs

| Service | Direct Link |
|---|---|
| Lambda | https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/carbonkeeper-app |
| CloudWatch Logs | https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252Fcarbonkeeper-app |
| S3 | https://s3.console.aws.amazon.com/s3/buckets/ |
| CloudFront | https://console.aws.amazon.com/cloudfront/v3/home |
| IAM | https://console.aws.amazon.com/iam/home#/roles/carbonkeeper-lambda-role |

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Blank page or 500 error | Missing env var or Lambda crash | Check CloudWatch Logs |
| CSS/JS 404 | Static assets not uploaded or wrong prefix | Upload `.open-next/assets` to S3; verify `NEXT_PUBLIC_ASSET_PREFIX` |
| API routes return 404 | Wrong handler name | Confirm handler is `index.handler` |
| Very slow first load | Lambda cold start | Increase memory to 1792 MB or enable Provisioned Concurrency |
| CloudFront shows stale content | Cache not invalidated | Create invalidation with path `/*` |
| CORS errors | Lambda Function URL CORS not configured | Re-check Step 7 CORS settings |

---

## Cost Estimate (Free Tier Friendly)

For a typical personal/demo workload (~10,000 requests/month):

| Service | Cost |
|---|---|
| Lambda (10K req × 0.5s × 1GB) | ~$0.08/mo |
| S3 (100 MB storage) | ~$0.002/mo |
| CloudFront (1 GB transfer) | ~$0.085/mo |
| **Total** | **< $0.20/mo** |

AWS Free Tier covers: 1M Lambda requests + 400K GB-seconds + 50 GB CloudFront transfer per month.

---

*CarbonKeeper v1.0.0 — Node.js 20.x — OpenNext 4.x*
