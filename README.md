# CarbonKeeper

CarbonKeeper helps individuals and teams measure and reduce their carbon footprint through activity tracking, recommendations, and insights.

## Features
- Track activity logs and footprint over time
- Automated recommendations and insights
- Dashboard with trends and savings
- Assistant-powered analysis and parsing

## Tech stack
- Next.js (app directory)
- TypeScript
- Jest for tests

## Prerequisites
- Node.js 18+ and npm

## Quick start

### Local Development

1. Install dependencies

```bash
npm install
```

2. Create `.env` file with your Gemini API key

```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

3. Run development server

```bash
npm run dev
```

4. Run tests

```bash
npm test
```

### AWS Lambda Deployment

Deploy CarbonKeeper to AWS Lambda with a single command:

```powershell
# Windows PowerShell
.\deploy-lambda.ps1 -CreateRole -GeminiApiKey "your-gemini-api-key"
```

Or use the AWS Console with the pre-built package:

1. Build and package: `npm run deploy:prepare`
2. Upload `.open-next/function.zip` to AWS Lambda
3. Configure and deploy

**📚 Complete Deployment Documentation:**
- **[Quick Start Guide](./CarbonKeeper/DEPLOYMENT_QUICK_START.md)** - Fast deployment with commands
- **[Complete Deployment Guide](./CarbonKeeper/AWS_DEPLOYMENT_GUIDE.md)** - Detailed step-by-step instructions
- **[Deployment Overview](./CarbonKeeper/README_DEPLOYMENT.md)** - Full documentation overview

See [CarbonKeeper/README_DEPLOYMENT.md](./CarbonKeeper/README_DEPLOYMENT.md) for complete AWS deployment instructions.

## Contributing
See CONTRIBUTING.md for contribution guidelines.

## License
This project is licensed under the MIT License — see [LICENSE.md](LICENSE.md) for details.
