#!/bin/bash

# Create backend directory
mkdir -p backend
cd backend

# Initialize UV project
uv init --bare .

# Add required dependencies
uv add fastapi uvicorn sqlalchemy pydantic python-dotenv transformers torch

# Create main directory structure
mkdir -p app
mkdir -p app/models
mkdir -p app/schemas
mkdir -p app/routes
mkdir -p app/services

echo "Backend project initialized successfully!"
echo "To run the backend server, execute:"
echo "cd backend"
echo "uv run uvicorn app.main:app --reload --port 8000"
