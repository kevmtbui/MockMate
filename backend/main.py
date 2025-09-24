from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import interview

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
