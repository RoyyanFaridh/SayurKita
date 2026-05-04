from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import sys
import os

# Tambahkan path ke utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.recommender import recommend

app = FastAPI(title="SayurKita AI Service")

# Model untuk request
class RecommendRequest(BaseModel):
    ingredients: List[str]
    top_k: int = 5

@app.get("/")
def root():
    return {"message": "AI SayurKita siap!"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/recommend")
def get_recommendations(request: RecommendRequest):
    results = recommend(request.ingredients, request.top_k)
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)