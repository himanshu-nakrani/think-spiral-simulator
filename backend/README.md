---
title: ThinkSpiral Backend API
emoji: 🧠
colorFrom: purple
colorTo: pink
sdk: docker
app_port: 7860
---

# ThinkSpiral Backend API

FastAPI backend for ThinkSpiral.

## Environment Variables

- `GEMINI_API_KEY` (required for Gemini-powered generation)
- `CORS_ORIGINS` (optional, comma-separated frontend origins)

## Health Check

- `GET /health`
