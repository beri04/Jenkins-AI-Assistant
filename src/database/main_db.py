# main_db.py

from fastapi import FastAPI, Request
from src.api.auth_router import router as auth_router
from src.api.router import router as ai_router  # your AI endpoints
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
import logging
import time 
from src.logging import logger

app = FastAPI(
    title="Jenkins AI Assistant",
    description="Backend with JWT authentication + RAG engine",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -------------------------------
# Include Routers Here
# -------------------------------
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(ai_router, prefix="/ai", tags=["Jenkins AI"])

# -------------------------------
# Health Check (Optional)
# -------------------------------
@app.get("/")
def home():
    return {"message": "Jenkins AI Backend Running!"}



# -------------------------------
# GLOBAL EXCEPTION HANDLER
# -------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request:Request, exc: Exception):
    logging.error(f"[ERROR] error in {request.url.path} -> {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error":"Internal Server Error"}
    )


# -------------------------------
# REQUEST LOGGING MIDDLEWARE
# -------------------------------
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = (time.time() - start_time) * 1000

    session_id = getattr(request.state, "session_id", None)

    user_id = getattr(request.state, "user_id", None)

    logging.info(
        f"METHOD={request.method} PATH={request.url.path} USER={user_id} SESSION = {session_id}DURATION={duration:.2f}ms"
    )

    return response