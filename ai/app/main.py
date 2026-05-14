# app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.recommender import recommender
from utils.carbon import hitung_co2e
from utils.fraud import cek_aksi

app = FastAPI()

# izin CORS untuk frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------- Model Request/Response -------------------------
class RekomendasiRequest(BaseModel):
    ingredients: List[str]
    expired: Optional[List[int]] = None
    top_k: int = 5

class ResepResponse(BaseModel):
    id: int
    name: str
    ingredients: str
    match_score: float

class CarbonRequest(BaseModel):
    ingredient_name: str
    weight_grams: float

class CarbonResponse(BaseModel):
    ingredient_name: str
    weight_grams: float
    co2e_kg: float
    message: str

class FraudRequest(BaseModel):
    user_id: int
    action: str

class FraudResponse(BaseModel):
    allowed: bool
    message: str

# ------------------------- Endpoint -------------------------
@app.get("/")
def root():
    return {"message": "SayurKita AI Service", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/recommend-ai", response_model=List[ResepResponse])
def recommend_ai(req: RekomendasiRequest):
    if not req.ingredients:
        raise HTTPException(status_code=400, detail="Daftar bahan kosong")
    hasil = recommender.recommend(
        user_ingredients=req.ingredients,
        expired=req.expired,
        top_k=req.top_k
    )
    return hasil

@app.post("/carbon", response_model=CarbonResponse)
def carbon(req: CarbonRequest):
    co2e = hitung_co2e(req.ingredient_name, req.weight_grams)
    return CarbonResponse(
        ingredient_name=req.ingredient_name,
        weight_grams=req.weight_grams,
        co2e_kg=round(co2e, 4),
        message=f"Jejak karbon {req.ingredient_name}: {round(co2e,4)} kg CO₂e"
    )

@app.post("/fraud-check", response_model=FraudResponse)
def fraud_check(req: FraudRequest):
    allowed, msg = cek_aksi(req.user_id, req.action)
    return FraudResponse(allowed=allowed, message=msg)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
