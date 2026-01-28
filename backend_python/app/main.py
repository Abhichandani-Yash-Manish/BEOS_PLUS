from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.api.api import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Blood Emergency Operating System API",
    version="2.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite Frontend
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# Socket.IO Integration
from app.core.socket import sio
import socketio

# Wrap FastAPI with Socket.IO
# 'app' is now the Socket.IO ASGI app, wrapping the original FastAPI app
# But to avoid variable name collision loops if we reused 'app', let's benefit from python's sequential execution
# We will rename the FastAPI instance reference for clarity in future, but simpler here:
fastapi_app = app
app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app)

@fastapi_app.get("/health")
async def health_check():
    return {"status": "ok"}
