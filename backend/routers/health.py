"""Health check endpoint for monitoring"""
from fastapi import APIRouter
from datetime import datetime
import os

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "MockMate API",
        "version": "1.0.0",
        "ai_configured": bool(os.getenv("GEMINI_API_KEY"))
    }

@router.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "MockMate API is running",
        "docs": "/docs",
        "health": "/health"
    }


