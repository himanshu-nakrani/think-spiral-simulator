# ThinkSpiral Deployment Guide

This guide explains how to deploy ThinkSpiral to production.

## Architecture Overview

ThinkSpiral has two independent deployment targets:
- **Frontend**: Deployed to GitHub Pages (static export)
- **Backend**: Deployed to Hugging Face Spaces (Docker)

## Quick Setup (GitHub Pages + Hugging Face)

### 1) One-time repository settings

In your GitHub repo:

1. **Settings → Pages**
   - Source: **GitHub Actions**
2. **Settings → Secrets and variables → Actions**
   - Add repository **variable**: `NEXT_PUBLIC_API_URL`
     - Example: `https://<your-space-name>.hf.space`
   - Add repository **variable**: `HF_SPACE_ID`
     - Format: `username/space-name`
   - Add repository **secret**: `HF_TOKEN`
     - Hugging Face token with write access to the Space

### 2) One-time Hugging Face Space setup

1. Create a new **Space** on Hugging Face.
2. Choose **Docker** SDK.
3. In Space settings, add secret:
   - `GEMINI_API_KEY`
4. Optional Space variable:
   - `CORS_ORIGINS=https://<github-username>.github.io`
   - For project page paths, use your full Pages origin.

### 3) Deploy flow

- Push to `main`.
- `deploy-frontend-pages.yml` publishes frontend to GitHub Pages.
- `deploy-backend-hf-space.yml` syncs `backend/` to your Hugging Face Space.
- Frontend uses `NEXT_PUBLIC_API_URL` set in GitHub variables at build time.

## Frontend Deployment (GitHub Pages)

This repository includes `.github/workflows/deploy-frontend-pages.yml`.
It builds static output (`out/`) and deploys with `actions/deploy-pages`.

Environment variable used at build time:

- `NEXT_PUBLIC_API_URL` (GitHub Actions repo variable)

## Backend Deployment (Hugging Face Spaces)

This repository includes `.github/workflows/deploy-backend-hf-space.yml`.
It uploads the `backend/` directory directly to your Docker Space.

Required:

- `HF_SPACE_ID` GitHub variable (e.g. `himanshu-nakrani/thinkspiral-backend`)
- `HF_TOKEN` GitHub secret (write access token)

Space runtime settings:

- Secret: `GEMINI_API_KEY`
- Optional variable: `CORS_ORIGINS=https://<github-username>.github.io`

## Database Setup for Production

### Switch to PostgreSQL

1. Update `backend/app/database.py`:
```python
import os
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./thinkspiral.db")
```

2. Create tables on first deployment:
```python
# Run this once to create tables
python -c "from app.database import engine; from app.models.base import Base; Base.metadata.create_all(engine)"
```

### Backup and Migration

```bash
# Export data from SQLite
sqlite3 thinkspiral.db ".dump" > backup.sql

# Import to PostgreSQL
psql -U postgres -d thinkspiral < backup.sql
```

## Environment Variables

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Backend
```
DATABASE_URL=postgresql://user:password@host:5432/thinkspiral
```

Optional:
```
PYTHONUNBUFFERED=1
```

## CORS Configuration for Production

Update `backend/app/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://thinkspiral.vercel.app",  # Your frontend domain
        "https://www.thinkspiral.com",     # Your custom domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Monitoring & Logging

### Frontend (Vercel)
- Built-in analytics via `@vercel/analytics`
- View logs in Vercel dashboard
- Performance monitoring automatically enabled

### Backend

Add Sentry for error tracking:

```bash
cd backend
uv add sentry-sdk
```

Update `backend/app/main.py`:
```python
import sentry_sdk

sentry_sdk.init(
    dsn="your-sentry-dsn",
    traces_sample_rate=0.1,
)
```

## Performance Optimization

### Frontend
- Already optimized with Next.js
- Consider enabling ISR (Incremental Static Regeneration) if needed
- Use Vercel Analytics to monitor

### Backend
- Use connection pooling for database
- Consider caching reality checks
- Monitor slow queries with SQLAlchemy logging

## SSL/HTTPS

All major deployment platforms provide free SSL:
- Vercel: Automatic
- Railway: Automatic
- Heroku: Automatic with custom domain
- AWS: Use AWS Certificate Manager

## Domain Setup

### Custom Domain on Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records according to Vercel instructions

### Custom Domain on Backend Provider
Each provider has different instructions. Consult their documentation.

## CI/CD Pipeline Example (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy ThinkSpiral

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          # Railway deployment command
          echo "Deploying to Railway..."
```

## Troubleshooting Production Issues

### Backend Not Responding
```bash
# Check logs
heroku logs --tail  # Heroku
railway logs         # Railway

# Check database connection
echo $DATABASE_URL
```

### CORS Errors
- Verify `NEXT_PUBLIC_API_URL` matches backend domain
- Check CORS origins in `app/main.py`
- Ensure backend is running and accessible

### Database Issues
```bash
# Check connection
psql $DATABASE_URL -c "SELECT 1"

# Run migrations
alembic upgrade head
```

## Rollback Procedures

### Vercel
1. Go to Deployments
2. Click "Promote to Production" on previous version

### Railway
1. Go to Deployments
2. Select previous deployment
3. Redeploy

## Monitoring Checklist

- [ ] Frontend loading performance
- [ ] Backend API response times
- [ ] Database query performance
- [ ] Error rates and exception tracking
- [ ] User analytics
- [ ] Uptime monitoring
- [ ] SSL certificate expiration
- [ ] Database backups

## Cost Estimation

- **Frontend (Vercel)**: Free tier available, ~$20/month for production
- **Backend (Railway)**: ~$20/month for PostgreSQL + API
- **Custom Domain**: ~$12/year
- **Total**: ~$52/month for full production setup

Use free tiers and development databases while testing.

## Next Steps

1. Set up your deployment platform accounts
2. Configure environment variables
3. Set up database
4. Deploy frontend and backend
5. Test all functionality
6. Set up monitoring
7. Configure backups and disaster recovery

For more details, see the main [README.md](README.md) and [SETUP.md](SETUP.md).
