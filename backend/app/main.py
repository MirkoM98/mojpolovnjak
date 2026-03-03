import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base, SessionLocal
from .routes import auth, cars, users
from .seed_data import seed_if_empty

Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    seed_if_empty(db)
finally:
    db.close()

app = FastAPI(
    title="MojPolovnjak API",
    description="API za MojPolovnjak - sajt za prodaju polovnih automobila",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://mojpolovnjak.autos",
        "https://www.mojpolovnjak.autos",
        "https://mojpolovnjak.vercel.app",
        "https://mojpolovnjak-*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(cars.router)
app.include_router(users.router)


uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "MojPolovnjak API radi!"}
