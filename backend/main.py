import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import interview, health, auth, user_history, tts
from middleware.rate_limiter import limiter, RateLimitExceeded, rate_limit_handler
from middleware.session_cleanup import session_manager
from middleware.logging_config import logger

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="MockMate API",
    description="AI-Powered Mock Interview Platform",
    version="1.0.0"
)

# Add rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_handler)

# Global exception handler to ensure CORS headers are always sent
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler that ensures CORS headers are sent"""
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    )

# Get allowed origins from environment or use secure defaults
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

# CORS - Secure configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Only specified origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],  # Only needed methods
    allow_headers=["Content-Type", "Authorization"],  # Only needed headers
    max_age=3600  # Cache preflight requests for 1 hour
)

# Include routers
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(user_history.router)
app.include_router(interview.router)
app.include_router(tts.router)

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("MockMate API starting up...")
    logger.info(f"CORS origins: {allowed_origins}")
    logger.info("All security features active")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("MockMate API shutting down...")
