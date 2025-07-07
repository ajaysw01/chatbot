from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import logging
import os
from dotenv import load_dotenv
import time
from collections import defaultdict, deque
import inspect

load_dotenv()

OLLAMA_API_URL = os.getenv("OLLAMA_API_URL")
OLLAMA_MODEL_NAME = os.getenv("OLLAMA_MODEL_NAME")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN] if FRONTEND_ORIGIN else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory rate limiting (per IP)
RATE_LIMIT = 10  # requests
RATE_PERIOD = 60  # seconds
ip_requests = defaultdict(lambda: deque())


def is_rate_limited(ip: str) -> bool:
    now = time.time()
    dq = ip_requests[ip]
    # Remove old requests
    while dq and now - dq[0] > RATE_PERIOD:
        dq.popleft()
    if len(dq) >= RATE_LIMIT:
        return True
    dq.append(now)
    return False


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    model: str
    response_time_ms: int


@app.post("/chat", response_model=ChatResponse)
async def chat(request: Request, body: ChatRequest):
    # Rate limiting
    client_ip = request.client.host if request.client else "unknown"
    if is_rate_limited(client_ip):
        raise HTTPException(
            status_code=429, detail="Too many requests. Please slow down."
        )

    if not body.message.strip():
        raise HTTPException(status_code=400, detail="No input provided.")

    payload = {
        "model": OLLAMA_MODEL_NAME,
        "prompt": body.message.strip(),
        "stream": False,
    }
    logger.info(f"Sending prompt to Ollama: {body.message.strip()}")
    start_time = time.time()
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(OLLAMA_API_URL, json=payload)
            response.raise_for_status()
            if inspect.iscoroutinefunction(response.json):
                result = await response.json()
            else:
                result = response.json()
            reply = result.get("response", "").strip()
            if not reply:
                raise HTTPException(
                    status_code=500, detail="Empty response from model."
                )
            elapsed = int((time.time() - start_time) * 1000)
            return ChatResponse(
                reply=reply, model=OLLAMA_MODEL_NAME, response_time_ms=elapsed
            )
    except httpx.TimeoutException:
        logger.error("Ollama timed out.")
        raise HTTPException(status_code=504, detail="Ollama request timed out.")
    except httpx.RequestError as e:
        logger.error(f"Request failed: {e}")
        raise HTTPException(status_code=502, detail=f"Ollama error: {str(e)}")
    except Exception as e:
        logger.exception("Unexpected error occurred.")
        raise HTTPException(status_code=500, detail="Internal server error.")


@app.get("/health")
def health_check():
    return {"status": "ok"}
