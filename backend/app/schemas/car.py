from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class CarImageResponse(BaseModel):
    id: int
    image_url: str
    is_primary: int
    sort_order: int

    class Config:
        from_attributes = True


class SellerBrief(BaseModel):
    id: int
    name: str
    phone: Optional[str] = None

    class Config:
        from_attributes = True


class CarCreate(BaseModel):
    brand: str
    model: str
    year: int
    price: float
    mileage: Optional[int] = None
    fuel: str
    transmission: str
    horsepower: Optional[int] = None
    engine_size: Optional[float] = None
    body_type: Optional[str] = None
    color: Optional[str] = None
    doors: Optional[int] = None
    location: Optional[str] = None
    description: Optional[str] = None
    features: Optional[str] = None


class CarUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    price: Optional[float] = None
    mileage: Optional[int] = None
    fuel: Optional[str] = None
    transmission: Optional[str] = None
    horsepower: Optional[int] = None
    engine_size: Optional[float] = None
    body_type: Optional[str] = None
    color: Optional[str] = None
    doors: Optional[int] = None
    location: Optional[str] = None
    description: Optional[str] = None
    features: Optional[str] = None
    status: Optional[str] = None


class CarResponse(BaseModel):
    id: int
    brand: str
    model: str
    year: int
    price: float
    mileage: Optional[int] = None
    fuel: str
    transmission: str
    horsepower: Optional[int] = None
    engine_size: Optional[float] = None
    body_type: Optional[str] = None
    color: Optional[str] = None
    doors: Optional[int] = None
    location: Optional[str] = None
    description: Optional[str] = None
    features: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    images: List[CarImageResponse] = []
    seller: SellerBrief
    title: str

    class Config:
        from_attributes = True


class CarListResponse(BaseModel):
    cars: List[CarResponse]
    total: int
    page: int
    page_size: int
    has_next: bool
