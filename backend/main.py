import os

import httpx
import ormsgpack
from dotenv import load_dotenv, set_key
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

load_dotenv()

app = FastAPI(title="eVoice - Voice Clone")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FISH_API_BASE = "https://api.fish.audio"

_api_key: str = os.getenv("FISH_API_KEY", "")


def _get_api_key() -> str:
    if not _api_key:
        raise HTTPException(status_code=400, detail="API key not set. Please configure it in Settings.")
    return _api_key


@app.post("/api/settings/api-key")
async def set_api_key(api_key: str = Form(...)):
    global _api_key
    _api_key = api_key
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    set_key(env_path, "FISH_API_KEY", api_key)
    return {"ok": True}


@app.get("/api/settings/api-key")
async def get_api_key():
    return {"set": bool(_api_key)}


@app.post("/api/clone")
async def clone_voice(
    audio: UploadFile = File(...),
    text: str = Form(...),
    temperature: float = Form(0.7),
    top_p: float = Form(0.7),
    speed: float = Form(1.0),
    volume: float = Form(0.0),
    normalize_loudness: bool = Form(True),
    reference_id: str = Form(""),
    chunk_length: int = Form(300),
    normalize: bool = Form(True),
    format: str = Form("mp3"),
    sample_rate: int = Form(44100),
    mp3_bitrate: int = Form(128),
    opus_bitrate: int = Form(-1000),
    latency: str = Form("normal"),
    max_new_tokens: int = Form(1024),
    repetition_penalty: float = Form(1.2),
    min_chunk_length: int = Form(50),
    condition_on_previous_chunks: bool = Form(True),
    early_stop_threshold: int = Form(1),
):
    api_key = _get_api_key()

    audio_bytes = await audio.read()

    references = [
        {
            "audio": audio_bytes,
            "text": " ",
        }
    ]

    payload: dict = {
        "text": text,
        "references": references,
        "temperature": temperature,
        "top_p": top_p,
        "prosody": {
            "speed": speed,
            "volume": volume,
            "normalize_loudness": normalize_loudness,
        },
        "chunk_length": chunk_length,
        "normalize": normalize,
        "format": format,
        "sample_rate": sample_rate,
        "mp3_bitrate": mp3_bitrate,
        "opus_bitrate": opus_bitrate,
        "latency": latency,
        "max_new_tokens": max_new_tokens,
        "repetition_penalty": repetition_penalty,
        "min_chunk_length": min_chunk_length,
        "condition_on_previous_chunks": condition_on_previous_chunks,
        "early_stop_threshold": early_stop_threshold,
    }

    if reference_id:
        payload["reference_id"] = reference_id

    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(
            f"{FISH_API_BASE}/v1/tts",
            content=ormsgpack.packb(payload),
            headers={
                "authorization": f"Bearer {api_key}",
                "content-type": "application/msgpack",
                "model": "s2-pro",
            },
        )

    if resp.status_code != 200:
        detail = resp.text[:500]
        raise HTTPException(status_code=resp.status_code, detail=f"FishAudio API error: {detail}")

    return Response(content=resp.content, media_type="audio/mpeg")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8010, reload=True)
