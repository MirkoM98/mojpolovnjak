from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, asc
from typing import Optional, List
from ..database import get_db
from ..models.car import Car, CarImage
from ..models.user import User
from ..schemas.car import CarCreate, CarUpdate, CarResponse, CarListResponse
from ..services.auth import get_current_user, get_optional_user
from ..services.s3 import upload_image

router = APIRouter(prefix="/api/cars", tags=["cars"])


@router.get("", response_model=CarListResponse)
def list_cars(
    brand: Optional[str] = None,
    fuel: Optional[str] = None,
    transmission: Optional[str] = None,
    body_type: Optional[str] = None,
    location: Optional[str] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    year_min: Optional[int] = None,
    year_max: Optional[int] = None,
    mileage_min: Optional[int] = None,
    mileage_max: Optional[int] = None,
    search: Optional[str] = None,
    sort: str = Query("newest", pattern="^(newest|price_asc|price_desc|year_desc|mileage_asc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50),
    db: Session = Depends(get_db),
):
    query = db.query(Car).options(
        joinedload(Car.images),
        joinedload(Car.seller),
    ).filter(Car.status == "active")

    if brand:
        query = query.filter(Car.brand == brand)
    if fuel:
        query = query.filter(Car.fuel == fuel)
    if transmission:
        query = query.filter(Car.transmission == transmission)
    if body_type:
        query = query.filter(Car.body_type == body_type)
    if location:
        query = query.filter(Car.location == location)
    if price_min is not None:
        query = query.filter(Car.price >= price_min)
    if price_max is not None:
        query = query.filter(Car.price <= price_max)
    if year_min is not None:
        query = query.filter(Car.year >= year_min)
    if year_max is not None:
        query = query.filter(Car.year <= year_max)
    if mileage_min is not None:
        query = query.filter(Car.mileage >= mileage_min)
    if mileage_max is not None:
        query = query.filter(Car.mileage <= mileage_max)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Car.brand.ilike(search_term)) |
            (Car.model.ilike(search_term)) |
            (Car.description.ilike(search_term))
        )

    total = query.count()

    sort_map = {
        "newest": desc(Car.created_at),
        "price_asc": asc(Car.price),
        "price_desc": desc(Car.price),
        "year_desc": desc(Car.year),
        "mileage_asc": asc(Car.mileage),
    }
    query = query.order_by(sort_map.get(sort, desc(Car.created_at)))

    offset = (page - 1) * page_size
    cars = query.offset(offset).limit(page_size).all()

    return CarListResponse(
        cars=cars,
        total=total,
        page=page,
        page_size=page_size,
        has_next=(offset + page_size) < total,
    )


@router.get("/{car_id}", response_model=CarResponse)
def get_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(Car).options(
        joinedload(Car.images),
        joinedload(Car.seller),
    ).filter(Car.id == car_id).first()

    if not car:
        raise HTTPException(status_code=404, detail="Oglas nije pronađen")
    return car


@router.post("", response_model=CarResponse, status_code=status.HTTP_201_CREATED)
def create_car(
    car_data: CarCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    car = Car(
        seller_id=current_user.id,
        **car_data.model_dump(),
    )
    db.add(car)
    db.commit()
    db.refresh(car)

    car = db.query(Car).options(
        joinedload(Car.images),
        joinedload(Car.seller),
    ).filter(Car.id == car.id).first()

    return car


@router.put("/{car_id}", response_model=CarResponse)
def update_car(
    car_id: int,
    car_data: CarUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Oglas nije pronađen")
    if car.seller_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Nemate dozvolu za izmenu ovog oglasa")

    update_data = car_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(car, key, value)

    db.commit()
    db.refresh(car)

    car = db.query(Car).options(
        joinedload(Car.images),
        joinedload(Car.seller),
    ).filter(Car.id == car.id).first()

    return car


@router.delete("/{car_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_car(
    car_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Oglas nije pronađen")
    if car.seller_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Nemate dozvolu za brisanje ovog oglasa")

    db.delete(car)
    db.commit()


@router.delete("/{car_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_car_image(
    car_id: int,
    image_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Oglas nije pronađen")
    if car.seller_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Nemate dozvolu")

    image = db.query(CarImage).filter(CarImage.id == image_id, CarImage.car_id == car_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Slika nije pronađena")

    was_primary = image.is_primary
    db.delete(image)

    if was_primary:
        next_img = db.query(CarImage).filter(CarImage.car_id == car_id).order_by(CarImage.sort_order).first()
        if next_img:
            next_img.is_primary = 1

    db.commit()


@router.put("/{car_id}/images/{image_id}/primary", response_model=CarResponse)
def set_primary_image(
    car_id: int,
    image_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Oglas nije pronađen")
    if car.seller_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Nemate dozvolu")

    image = db.query(CarImage).filter(CarImage.id == image_id, CarImage.car_id == car_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Slika nije pronađena")

    db.query(CarImage).filter(CarImage.car_id == car_id).update({"is_primary": 0})
    image.is_primary = 1
    db.commit()

    car = db.query(Car).options(
        joinedload(Car.images),
        joinedload(Car.seller),
    ).filter(Car.id == car.id).first()
    return car


@router.post("/{car_id}/images", response_model=CarResponse)
async def upload_car_images(
    car_id: int,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Oglas nije pronađen")
    if car.seller_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Nemate dozvolu")

    existing_count = db.query(CarImage).filter(CarImage.car_id == car_id).count()

    for i, file in enumerate(files):
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Samo slike su dozvoljene")

        image_url = await upload_image(file)
        car_image = CarImage(
            car_id=car_id,
            image_url=image_url,
            is_primary=1 if (existing_count == 0 and i == 0) else 0,
            sort_order=existing_count + i,
        )
        db.add(car_image)

    db.commit()

    car = db.query(Car).options(
        joinedload(Car.images),
        joinedload(Car.seller),
    ).filter(Car.id == car.id).first()

    return car
