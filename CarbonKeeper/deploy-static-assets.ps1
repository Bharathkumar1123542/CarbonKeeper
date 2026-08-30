# AWS S3 + CloudFront Static Assets Deployment Script
# PowerShell script for deploying static assets

param(
    [Parameter(Mandatory=$true)]
    [string]$BucketName,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1",
    
    [Parameter(Mandatory=$false)]
    [string]$DistributionId = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$CreateBucket = $false
)

Write-Host "📦 CarbonKeeper Static Assets Deployment" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if AWS CLI is installed
try {
    $awsVersion = aws --version
    Write-Host "✓ AWS CLI detected" -ForegroundColor Green
} catch {
    Write-Host "✗ AWS CLI not found. Please install AWS CLI first." -ForegroundColor Red
    exit 1
}

# Check if assets folder exists
$assetsPath = ".\.open-next\assets"
if (-not (Test-Path $assetsPath)) {
    Write-Host "✗ Assets folder not found at $assetsPath" -ForegroundColor Red
    Write-Host "  Please run 'npx open-next build' first" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Found assets folder: $assetsPath" -ForegroundColor Green

# Create S3 bucket if needed
if ($CreateBucket) {
    Write-Host ""
    Write-Host "🪣 Creating S3 bucket: $BucketName" -ForegroundColor Cyan
    
    try {
        if ($Region -eq "us-east-1") {
            aws s3 mb "s3://$BucketName"
        } else {
            aws s3 mb "s3://$BucketName" --region $Region
        }
        
        Write-Host "✓ S3 bucket created" -ForegroundColor Green
        
        # Disable block public access
        aws s3api put-public-access-block `
            --bucket $BucketName `
            --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
        
        Write-Host "✓ Public access configured" -ForegroundColor Green
        
        # Enable static website hosting
        aws s3 website "s3://$BucketName" `
            --index-document index.html `
            --error-document 404.html
        
        Write-Host "✓ Static website hosting enabled" -ForegroundColor Green
        
    } catch {
        Write-Host "⚠ Bucket might already exist or failed to create: $_" -ForegroundColor Yellow
    }
}

# Upload assets to S3
Write-Host ""
Write-Host "📤 Uploading static assets to S3..." -ForegroundColor Cyan

try {
    aws s3 sync $assetsPath "s3://$BucketName/" `
        --delete `
        --cache-control "public, max-age=31536000, immutable" `
        --exclude "*.html" `
        --region $Region
    
    # Upload HTML files with different cache settings
    aws s3 sync $assetsPath "s3://$BucketName/" `
        --exclude "*" `
        --include "*.html" `
        --cache-control "public, max-age=0, must-revalidate" `
        --region $Region
    
    Write-Host "✓ Assets uploaded successfully" -ForegroundColor Green
    
    # Count uploaded files
    $fileCount = (Get-ChildItem -Path $assetsPath -Recurse -File).Count
    Write-Host "  Uploaded $fileCount files" -ForegroundColor White
    
} catch {
    Write-Host "✗ Failed to upload assets: $_" -ForegroundColor Red
    exit 1
}

# Invalidate CloudFront cache if distribution ID provided
if ($DistributionId) {
    Write-Host ""
    Write-Host "🔄 Invalidating CloudFront cache..." -ForegroundColor Cyan
    
    try {
        $invalidationId = aws cloudfront create-invalidation `
            --distribution-id $DistributionId `
            --paths "/*" `
            --query 'Invalidation.Id' `
            --output text
        
        Write-Host "✓ CloudFront invalidation created: $invalidationId" -ForegroundColor Green
        Write-Host "  Note: Cache invalidation may take 5-10 minutes" -ForegroundColor Yellow
        
    } catch {
        Write-Host "⚠ Failed to invalidate CloudFront cache: $_" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Static assets deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 S3 Bucket URL:" -ForegroundColor Cyan
Write-Host "   http://$BucketName.s3-website-$Region.amazonaws.com" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create CloudFront distribution (if not done)" -ForegroundColor White
Write-Host "2. Point CloudFront origin to this S3 bucket" -ForegroundColor White
Write-Host "3. Update Lambda environment variable:" -ForegroundColor White
Write-Host "   NEXT_PUBLIC_ASSET_PREFIX=https://your-cloudfront-domain" -ForegroundColor White
Write-Host "4. Test your application with static assets loading from CDN" -ForegroundColor White
