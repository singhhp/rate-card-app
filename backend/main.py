from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. Change to specific origins if needed.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, OPTIONS, etc.).
    allow_headers=["*"],  # Allows all headers.
)

class RateCardEntry(BaseModel):
    description: str
    identifier: str
    zone: str = None  # Optional
    discount: float = 0.0
    published_price: float
    
@app.get("/")
def read_root():
    return {"message": "Welcome to the Rate Card API"}

@app.post("/calculate")
def calculate_rate(entry: RateCardEntry):
    client_cost = entry.published_price -(entry.published_price * (entry.discount/100))
    return JSONResponse(content={
        "description": entry.description,
        "identifier": entry.identifier,
        "zone": entry.zone,
        "discount": entry.discount,
        "published_price": entry.published_price,
        "client_cost": client_cost
    })
