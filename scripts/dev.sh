#!/bin/bash

# ThinkSpiral Development Server Starter
# This script starts both frontend and backend servers concurrently

set -e

echo "================================"
echo "ThinkSpiral Development Server"
echo "================================"
echo ""

# Check if backend directory exists
if [ ! -d "backend" ]; then
  echo "Backend directory not found. Running setup..."
  bash scripts/setup-backend.sh
fi

# Function to cleanup on exit
cleanup() {
  echo ""
  echo "Stopping development servers..."
  kill $FRONTEND_PID $BACKEND_PID 2>/dev/null || true
  echo "Development servers stopped."
  exit 0
}

# Trap SIGINT and SIGTERM
trap cleanup SIGINT SIGTERM

echo "Starting ThinkSpiral services..."
echo ""

# Start frontend
echo "Starting Frontend (Next.js) on port 3000..."
pnpm dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 2

# Start backend
echo "Starting Backend (FastAPI) on port 8000..."
cd backend
uv run uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

echo ""
echo "================================"
echo "Services Started Successfully!"
echo "================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait $FRONTEND_PID $BACKEND_PID
