from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from typing import Optional
from ..database import get_db
from ..models.user import User
from ..models.car import Car, CarImage
from ..schemas.user import UserResponse
from ..schemas.car import CarResponse, CarListResponse
from ..services.auth import get_admin_user

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/users", response_model=list[UserResponse])
def list_users(
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    return db.query(User).order_by(desc(User.created_at)).all()


@router.put("/users/make-admin")
def make_admin(
    email: str,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik sa tim emailom nije pronađen")
    if user.is_admin:
        raise HTTPException(status_code=400, detail="Korisnik je već admin")

    user.is_admin = True
    db.commit()
    return {"message": f"{user.name} je sada admin"}


@router.put("/users/{user_id}/remove-admin")
def remove_admin(
    user_id: int,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    if admin.id == user_id:
        raise HTTPException(status_code=400, detail="Ne možete ukloniti admin status sebi")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen")

    user.is_admin = False
    db.commit()
    return {"message": f"{user.name} više nije admin"}


@router.get("/cars", response_model=CarListResponse)
def list_all_cars(
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    query = db.query(Car).options(
        joinedload(Car.images),
        joinedload(Car.seller),
    )

    if search:
        term = f"%{search}%"
        query = query.filter(
            (Car.brand.ilike(term)) | (Car.model.ilike(term)) | (Car.description.ilike(term))
        )

    total = query.count()
    offset = (page - 1) * page_size
    cars = query.order_by(desc(Car.created_at)).offset(offset).limit(page_size).all()

    return CarListResponse(
        cars=cars,
        total=total,
        page=page,
        page_size=page_size,
        has_next=(offset + page_size) < total,
    )


@router.delete("/cars/{car_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_car(
    car_id: int,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Oglas nije pronađen")

    db.delete(car)
    db.commit()
