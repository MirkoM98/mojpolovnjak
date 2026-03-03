from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import enum


class CarStatus(str, enum.Enum):
    active = "active"
    sold = "sold"
    paused = "paused"


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    brand = Column(String, nullable=False, index=True)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=False, index=True)
    price = Column(Float, nullable=False, index=True)
    mileage = Column(Integer, nullable=True)
    fuel = Column(String, nullable=False)
    transmission = Column(String, nullable=False)
    horsepower = Column(Integer, nullable=True)
    engine_size = Column(Float, nullable=True)
    body_type = Column(String, nullable=True)
    color = Column(String, nullable=True)
    doors = Column(Integer, nullable=True)
    location = Column(String, nullable=True, index=True)
    description = Column(Text, nullable=True)
    features = Column(Text, nullable=True)  # JSON string of features list
    status = Column(String, default="active", index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    seller = relationship("User", back_populates="cars")
    images = relationship("CarImage", back_populates="car", cascade="all, delete-orphan")
    favorited_by = relationship("Favorite", back_populates="car", cascade="all, delete-orphan")

    @property
    def title(self):
        return f"{self.brand} {self.model} {self.year}"


class CarImage(Base):
    __tablename__ = "car_images"

    id = Column(Integer, primary_key=True, index=True)
    car_id = Column(Integer, ForeignKey("cars.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String, nullable=False)
    is_primary = Column(Integer, default=0)
    sort_order = Column(Integer, default=0)

    car = relationship("Car", back_populates="images")


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    car_id = Column(Integer, ForeignKey("cars.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="favorites")
    car = relationship("Car", back_populates="favorited_by")
