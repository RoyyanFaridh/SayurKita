from fastapi import FastAPI

app = FastAPI(title="SayurKita AI Service")

@app.get("/")
def root():
    return {"message": "AI Service SayurKita siap!"}

@app.get("/health")
def health():
    return {"status": "healthy"}