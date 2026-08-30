# Deployment Verification Script
# Tests your deployed Lambda function and reports status

param(
    [Parameter(Mandatory=$false)]
    [string]$FunctionName = "carbonkeeper-app",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1",
    
    [Parameter(Mandatory=$false)]
    [string]$FunctionUrl = ""
)

Write-Host "🔍 CarbonKeeper Deployment Verification" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check AWS CLI
try {
    aws --version | Out-Null
    Write-Host "✓ AWS CLI available" -ForegroundColor Green
} catch {
    Write-Host "✗ AWS CLI not found" -ForegroundColor Red
    exit 1
}

# Check Lambda function exists
Write-Host ""
Write-Host "Checking Lambda function..." -ForegroundColor Cyan

try {
    $functionConfig = aws lambda get-function-configuration `
        --function-name $FunctionName `
        --region $Region `
        --output json | ConvertFrom-Json
    
    Write-Host "✓ Function found: $FunctionName" -ForegroundColor Green
    Write-Host "  Runtime: $($functionConfig.Runtime)" -ForegroundColor White
    Write-Host "  Memory: $($functionConfig.MemorySize) MB" -ForegroundColor White
    Write-Host "  Timeout: $($functionConfig.Timeout) seconds" -ForegroundColor White
    Write-Host "  Handler: $($functionConfig.Handler)" -ForegroundColor White
    Write-Host "  Last Modified: $($functionConfig.LastModified)" -ForegroundColor White
    
    # Check memory size
    if ($functionConfig.MemorySize -lt 1024) {
        Write-Host "  ⚠ Warning: Memory is less than 1024 MB (recommended minimum)" -ForegroundColor Yellow
    }
    
    # Check timeout
    if ($functionConfig.Timeout -lt 30) {
        Write-Host "  ⚠ Warning: Timeout is less than 30 seconds (recommended minimum)" -ForegroundColor Yellow
    }
    
    # Check environment variables
    $envVars = $functionConfig.Environment.Variables
    if ($envVars.GEMINI_API_KEY) {
        Write-Host "  ✓ GEMINI_API_KEY is configured" -ForegroundColor Green
    } else {
        Write-Host "  ✗ GEMINI_API_KEY is missing" -ForegroundColor Red
    }
    
} catch {
    Write-Host "✗ Function not found or error accessing it" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Yellow
    exit 1
}

# Check Function URL
Write-Host ""
Write-Host "Checking Function URL..." -ForegroundColor Cyan

try {
    $urlConfig = aws lambda get-function-url-config `
        --function-name $FunctionName `
        --region $Region `
        --output json | ConvertFrom-Json
    
    $functionUrlFromAWS = $urlConfig.FunctionUrl
    Write-Host "✓ Function URL configured" -ForegroundColor Green
    Write-Host "  URL: $functionUrlFromAWS" -ForegroundColor White
    Write-Host "  Auth: $($urlConfig.AuthType)" -ForegroundColor White
    
    if (-not $FunctionUrl) {
        $FunctionUrl = $functionUrlFromAWS
    }
    
} catch {
    Write-Host "✗ Function URL not configured" -ForegroundColor Red
    Write-Host "  Create one with: aws lambda create-function-url-config" -ForegroundColor Yellow
}

# Test Function URL if available
if ($FunctionUrl) {
    Write-Host ""
    Write-Host "Testing Function URL..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri $FunctionUrl -Method Get -TimeoutSec 30 -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Function responds successfully (HTTP 200)" -ForegroundColor Green
            Write-Host "  Response length: $($response.Content.Length) bytes" -ForegroundColor White
            
            # Check if it looks like HTML
            if ($response.Content -like "*<!DOCTYPE*" -or $response.Content -like "*<html*") {
                Write-Host "✓ Response contains HTML (likely Next.js page)" -ForegroundColor Green
            } else {
                Write-Host "⚠ Response doesn't look like HTML" -ForegroundColor Yellow
            }
        } else {
            Write-Host "⚠ Unexpected status code: $($response.StatusCode)" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "✗ Failed to reach Function URL" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # Test API endpoint
    Write-Host ""
    Write-Host "Testing API endpoint..." -ForegroundColor Cyan
    
    try {
        $apiUrl = "$FunctionUrl/api/chat"
        $response = Invoke-WebRequest -Uri $apiUrl -Method Get -TimeoutSec 30 -UseBasicParsing
        
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 405) {
            Write-Host "✓ API endpoint accessible" -ForegroundColor Green
        } else {
            Write-Host "⚠ Unexpected API response: $($response.StatusCode)" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "⚠ API endpoint test inconclusive" -ForegroundColor Yellow
    }
}

# Check CloudWatch Logs
Write-Host ""
Write-Host "Checking CloudWatch Logs..." -ForegroundColor Cyan

try {
    $logGroupName = "/aws/lambda/$FunctionName"
    
    # Get latest log stream
    $latestStream = aws logs describe-log-streams `
        --log-group-name $logGroupName `
        --order-by LastEventTime `
        --descending `
        --max-items 1 `
        --region $Region `
        --output json | ConvertFrom-Json
    
    if ($latestStream.logStreams.Count -gt 0) {
        $streamName = $latestStream.logStreams[0].logStreamName
        $lastEventTime = [DateTimeOffset]::FromUnixTimeMilliseconds($latestStream.logStreams[0].lastEventTime).DateTime
        
        Write-Host "✓ CloudWatch Logs available" -ForegroundColor Green
        Write-Host "  Log Group: $logGroupName" -ForegroundColor White
        Write-Host "  Latest Stream: $streamName" -ForegroundColor White
        Write-Host "  Last Event: $lastEventTime" -ForegroundColor White
        
        # Get recent errors
        Write-Host ""
        Write-Host "Checking for recent errors..." -ForegroundColor Cyan
        
        $errors = aws logs filter-log-events `
            --log-group-name $logGroupName `
            --filter-pattern "ERROR" `
            --max-items 5 `
            --region $Region `
            --output json | ConvertFrom-Json
        
        if ($errors.events.Count -gt 0) {
            Write-Host "⚠ Found $($errors.events.Count) recent error(s)" -ForegroundColor Yellow
            foreach ($event in $errors.events) {
                Write-Host "  - $($event.message)" -ForegroundColor Yellow
            }
        } else {
            Write-Host "✓ No recent errors found" -ForegroundColor Green
        }
        
    } else {
        Write-Host "⚠ No log streams found (function may not have been invoked yet)" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "⚠ Unable to check CloudWatch Logs" -ForegroundColor Yellow
    Write-Host "  Error: $_" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Verification Summary" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

if ($FunctionUrl) {
    Write-Host "🌐 Your application is accessible at:" -ForegroundColor Green
    Write-Host "   $FunctionUrl" -ForegroundColor White
    Write-Host ""
}

Write-Host "📊 Monitoring & Logs:" -ForegroundColor Cyan
Write-Host "   Lambda Console: https://console.aws.amazon.com/lambda/home?region=$Region#/functions/$FunctionName" -ForegroundColor White
Write-Host "   CloudWatch Logs: https://console.aws.amazon.com/cloudwatch/home?region=$Region#logsV2:log-groups/log-group/`$252Faws`$252Flambda`$252F$FunctionName" -ForegroundColor White
Write-Host ""

Write-Host "🔧 Useful Commands:" -ForegroundColor Cyan
Write-Host "   Tail logs: aws logs tail /aws/lambda/$FunctionName --follow" -ForegroundColor White
Write-Host "   Update code: .\deploy-lambda.ps1 -Update" -ForegroundColor White
Write-Host "   Test locally: npm run dev" -ForegroundColor White
Write-Host ""

Write-Host "✅ Verification complete!" -ForegroundColor Green
