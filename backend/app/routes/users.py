from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from ..models.user import User
from ..models.car import Car, Favorite
from ..schemas.user import UserResponse, UserUpdate
from ..schemas.car import CarResponse
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    update_data = user_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/me/cars", response_model=List[CarResponse])
def get_my_cars(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cars = db.query(Car).options(
        joinedload(Car.images),
        joinedload(Car.seller),
    ).filter(Car.seller_id == current_user.id).order_by(Car.created_at.desc()).all()
    return cars


@router.get("/me/favorites", response_model=List[CarResponse])
def get_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorites = db.query(Favorite).filter(Favorite.user_id == current_user.id).all()
    car_ids = [f.car_id for f in favorites]

    if not car_ids:
        return []

    cars = db.query(Car).options(
        joinedload(Car.images),
        joinedload(Car.seller),
    ).filter(Car.id.in_(car_ids), Car.status == "active").all()
    return cars


@router.post("/me/favorites/{car_id}", status_code=status.HTTP_201_CREATED)
def add_favorite(
    car_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Oglas nije pronađen")

    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.car_id == car_id,
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Oglas je već u favoritima")

    favorite = Favorite(user_id=current_user.id, car_id=car_id)
    db.add(favorite)
    db.commit()
    return {"message": "Dodato u favorite"}


@router.delete("/me/favorites/{car_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    car_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.car_id == car_id,
    ).first()

    if not favorite:
        raise HTTPException(status_code=404, detail="Oglas nije u favoritima")

    db.delete(favorite)
    db.commit()
