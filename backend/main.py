import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import interview

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="MockMate API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include router
app.include_router(interview.router)
