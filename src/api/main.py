from fastapi import FastAPI, Request
from src.api.router import router

app = FastAPI(title="Jenkins AI Assistant")

app.include_router(router)





