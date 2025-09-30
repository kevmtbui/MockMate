#!/usr/bin/env python3
import os
from dotenv import load_dotenv
import uvicorn

# Load environment variables
load_dotenv()

# Verify API key is loaded
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    print(f"✅ GEMINI_API_KEY loaded: {api_key[:10]}...")
else:
    print("❌ GEMINI_API_KEY not found!")

# Start server
if __name__ == "__main__":
    print("🚀 Starting MockMate Backend Server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🤖 AI Features: Google Gemini API")
    print("=" * 50)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
