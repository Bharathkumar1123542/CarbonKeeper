# AWS Lambda Deployment Script for CarbonKeeper
# PowerShell script for automated deployment

param(
    [Parameter(Mandatory=$false)]
    [string]$FunctionName = "carbonkeeper-app",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1",
    
    [Parameter(Mandatory=$false)]
    [string]$GeminiApiKey = "",
    
    [Parameter(Mandatory=$false)]
    [string]$RoleName = "carbonkeeper-lambda-role",
    
    [Parameter(Mandatory=$false)]
    [switch]$CreateRole = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Update = $false
)

Write-Host "🚀 CarbonKeeper AWS Lambda Deployment Script" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if AWS CLI is installed
try {
    $awsVersion = aws --version
    Write-Host "✓ AWS CLI detected: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ AWS CLI not found. Please install AWS CLI first." -ForegroundColor Red
    Write-Host "  Download from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Check if function.zip exists
$zipPath = ".\.open-next\function.zip"
if (-not (Test-Path $zipPath)) {
    Write-Host "✗ function.zip not found at $zipPath" -ForegroundColor Red
    Write-Host "  Please run 'npx open-next build' first" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Found deployment package: $zipPath" -ForegroundColor Green

# Get AWS Account ID
try {
    $accountId = (aws sts get-caller-identity --query Account --output text)
    Write-Host "✓ AWS Account ID: $accountId" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get AWS Account ID. Please configure AWS credentials." -ForegroundColor Red
    Write-Host "  Run: aws configure" -ForegroundColor Yellow
    exit 1
}

# Create IAM Role if needed
if ($CreateRole) {
    Write-Host ""
    Write-Host "📝 Creating IAM Role: $RoleName" -ForegroundColor Cyan
    
    try {
        aws iam create-role `
            --role-name $RoleName `
            --assume-role-policy-document file://lambda-trust-policy.json `
            --region $Region
        
        Write-Host "✓ IAM Role created" -ForegroundColor Green
        
        # Attach basic execution policy
        aws iam attach-role-policy `
            --role-name $RoleName `
            --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" `
            --region $Region
        
        Write-Host "✓ Basic execution policy attached" -ForegroundColor Green
        
        # Wait for role to be available
        Write-Host "  Waiting 10 seconds for IAM role to propagate..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    } catch {
        Write-Host "⚠ Role might already exist or failed to create: $_" -ForegroundColor Yellow
    }
}

$roleArn = "arn:aws:iam::${accountId}:role/${RoleName}"

# Update existing function
if ($Update) {
    Write-Host ""
    Write-Host "🔄 Updating existing Lambda function: $FunctionName" -ForegroundColor Cyan
    
    try {
        aws lambda update-function-code `
            --function-name $FunctionName `
            --zip-file "fileb://$zipPath" `
            --region $Region
        
        Write-Host "✓ Function code updated successfully" -ForegroundColor Green
        
        # Update environment variables if GeminiApiKey is provided
        if ($GeminiApiKey) {
            Write-Host "  Updating environment variables..." -ForegroundColor Cyan
            aws lambda update-function-configuration `
                --function-name $FunctionName `
                --environment "Variables={GEMINI_API_KEY=$GeminiApiKey}" `
                --region $Region
            
            Write-Host "✓ Environment variables updated" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "✅ Deployment complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Test your function in AWS Console" -ForegroundColor White
        Write-Host "2. Check CloudWatch Logs for any errors" -ForegroundColor White
        Write-Host "3. Access via Function URL (if configured)" -ForegroundColor White
        
    } catch {
        Write-Host "✗ Failed to update function: $_" -ForegroundColor Red
        exit 1
    }
    
    exit 0
}

# Create new function
Write-Host ""
Write-Host "🆕 Creating new Lambda function: $FunctionName" -ForegroundColor Cyan

if (-not $GeminiApiKey) {
    Write-Host "⚠ Warning: No Gemini API key provided" -ForegroundColor Yellow
    Write-Host "  You'll need to add it manually in AWS Console later" -ForegroundColor Yellow
    Write-Host ""
    $GeminiApiKey = "YOUR_API_KEY_HERE"
}

try {
    aws lambda create-function `
        --function-name $FunctionName `
        --runtime nodejs20.x `
        --role $roleArn `
        --handler index.handler `
        --zip-file "fileb://$zipPath" `
        --timeout 30 `
        --memory-size 1024 `
        --environment "Variables={GEMINI_API_KEY=$GeminiApiKey}" `
        --region $Region
    
    Write-Host "✓ Lambda function created successfully" -ForegroundColor Green
    
    # Create Function URL
    Write-Host ""
    Write-Host "🌐 Creating Function URL..." -ForegroundColor Cyan
    
    $functionUrl = aws lambda create-function-url-config `
        --function-name $FunctionName `
        --auth-type NONE `
        --cors '{\"AllowOrigins\":[\"*\"],\"AllowMethods\":[\"*\"],\"AllowHeaders\":[\"*\"]}' `
        --region $Region `
        --query FunctionUrl `
        --output text
    
    Write-Host "✓ Function URL created: $functionUrl" -ForegroundColor Green
    
    # Add permission for function URL
    aws lambda add-permission `
        --function-name $FunctionName `
        --action lambda:InvokeFunctionUrl `
        --principal "*" `
        --function-url-auth-type NONE `
        --statement-id FunctionURLAllowPublicAccess `
        --region $Region
    
    Write-Host ""
    Write-Host "✅ Deployment complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Your application is now live at:" -ForegroundColor Cyan
    Write-Host "   $functionUrl" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Visit the URL above to test your application" -ForegroundColor White
    Write-Host "2. Set up CloudFront + S3 for static assets (see AWS_DEPLOYMENT_GUIDE.md)" -ForegroundColor White
    Write-Host "3. Configure custom domain (optional)" -ForegroundColor White
    Write-Host "4. Monitor in CloudWatch: https://console.aws.amazon.com/cloudwatch/" -ForegroundColor White
    
} catch {
    Write-Host "✗ Failed to create function: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "- Function name already exists (use -Update flag)" -ForegroundColor White
    Write-Host "- IAM role doesn't exist (use -CreateRole flag)" -ForegroundColor White
    Write-Host "- Insufficient permissions in AWS account" -ForegroundColor White
    exit 1
}
