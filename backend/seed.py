"""Seed the database with initial mock data for testing."""
from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.car import Car, CarImage
from app.services.auth import get_password_hash

Base.metadata.create_all(bind=engine)

db = SessionLocal()

if db.query(User).count() > 0:
    print("Database already seeded. Skipping.")
    db.close()
    exit()

users = [
    User(email="marko@example.com", hashed_password=get_password_hash("password123"), name="Marko Petrović", phone="0641234567"),
    User(email="ana@example.com", hashed_password=get_password_hash("password123"), name="Ana Jovanović", phone="0659876543"),
    User(email="stefan@example.com", hashed_password=get_password_hash("password123"), name="Stefan Nikolić", phone="0621112233"),
    User(email="nikola@example.com", hashed_password=get_password_hash("password123"), name="Nikola Đorđević", phone="0634445566"),
    User(email="jelena@example.com", hashed_password=get_password_hash("password123"), name="Jelena Milić", phone="0647778899"),
]

for u in users:
    db.add(u)
db.commit()

for u in users:
    db.refresh(u)

car_images = {
    'BMW': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop',
    'Mercedes-Benz': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop',
    'Audi': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop',
    'Volkswagen': 'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=600&h=400&fit=crop',
    'Toyota': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop',
    'Skoda': 'https://images.unsplash.com/photo-1622838320237-ea159e72aaea?w=600&h=400&fit=crop',
    'Opel': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=400&fit=crop',
    'Renault': 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=600&h=400&fit=crop',
    'Fiat': 'https://images.unsplash.com/photo-1594950195961-290884e5ae5c?w=600&h=400&fit=crop',
    'Ford': 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=600&h=400&fit=crop',
    'Peugeot': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop',
}

cars_data = [
    dict(seller_id=users[0].id, brand="BMW", model="320d M Sport", year=2019, price=25000, mileage=85000, fuel="Dizel", transmission="Automatik", horsepower=190, engine_size=2.0, body_type="Limuzina", color="Teget", doors=4, location="Beograd", description="Odlično očuvan BMW 320d sa M Sport paketom. Servisna knjiga, prvi vlasnik u Srbiji.", features="Navigacija,Kožna sedišta,LED farovi,Parking senzori,Tempomat"),
    dict(seller_id=users[1].id, brand="Mercedes-Benz", model="C220d AMG Line", year=2020, price=32000, mileage=62000, fuel="Dizel", transmission="Automatik", horsepower=194, engine_size=2.0, body_type="Limuzina", color="Srebrna", doors=4, location="Novi Sad", description="Mercedes C klasa sa AMG Line paketom. Burmester zvučnici, panorama krov.", features="AMG Line,Panorama krov,Burmester zvuk,Ambijentalno svetlo,Kamera"),
    dict(seller_id=users[2].id, brand="Audi", model="A4 2.0 TDI Quattro", year=2018, price=22500, mileage=110000, fuel="Dizel", transmission="Automatik", horsepower=190, engine_size=2.0, body_type="Karavan", color="Crna", doors=5, location="Beograd", description="Audi A4 Avant sa Quattro pogonom. Virtual cockpit, Matrix LED.", features="Quattro pogon,Virtual cockpit,Matrix LED,Bang & Olufsen,Lane assist"),
    dict(seller_id=users[3].id, brand="Volkswagen", model="Golf 8 1.5 TSI", year=2021, price=23000, mileage=45000, fuel="Benzin", transmission="Manuelni", horsepower=150, engine_size=1.5, body_type="Hečbek", color="Bela", doors=5, location="Kragujevac", description="Novi Golf 8 u odličnom stanju. Digitalna tabla, CarPlay.", features="Digitalna tabla,Apple CarPlay,Android Auto,Adaptivni tempomat"),
    dict(seller_id=users[4].id, brand="Toyota", model="RAV4 2.5 Hybrid", year=2022, price=38000, mileage=28000, fuel="Hibrid", transmission="Automatik", horsepower=218, engine_size=2.5, body_type="SUV", color="Siva", doors=5, location="Beograd", description="Toyota RAV4 Hybrid sa naprednim paketom bezbednosti.", features="Toyota Safety Sense,JBL zvučnici,Head-up display,360 kamera"),
    dict(seller_id=users[0].id, brand="Skoda", model="Octavia 2.0 TDI", year=2020, price=19800, mileage=75000, fuel="Dizel", transmission="Automatik", horsepower=150, engine_size=2.0, body_type="Karavan", color="Siva", doors=5, location="Subotica", description="Škoda Octavia Combi sa DSG menjačem. Ogroman prtljažnik.", features="DSG menjač,Virtual cockpit,Canton zvuk,Grejanje sedišta"),
    dict(seller_id=users[1].id, brand="Opel", model="Astra 1.2 Turbo", year=2022, price=21000, mileage=32000, fuel="Benzin", transmission="Automatik", horsepower=130, engine_size=1.2, body_type="Hečbek", color="Crvena", doors=5, location="Pančevo", description="Nova Opel Astra L sa potpuno novim dizajnom.", features="Vizir kokpit,Matrix LED,Navigacija,Bežično punjenje"),
    dict(seller_id=users[2].id, brand="Renault", model="Megane 1.3 TCe", year=2019, price=13200, mileage=88000, fuel="Benzin", transmission="Manuelni", horsepower=140, engine_size=1.3, body_type="Hečbek", color="Siva", doors=5, location="Čačak", description="Renault Megane GT Line sa sportskim paketom.", features="GT Line,Bose zvučnici,Panorama krov,Full LED"),
    dict(seller_id=users[3].id, brand="Fiat", model="500 1.0 Hybrid", year=2021, price=14800, mileage=25000, fuel="Hibrid", transmission="Manuelni", horsepower=70, engine_size=1.0, body_type="Hečbek", color="Bela", doors=3, location="Beograd", description="Sladak Fiat 500 Hybrid, idealan za grad.", features="Apple CarPlay,Android Auto,City brake,Start/Stop"),
    dict(seller_id=users[4].id, brand="BMW", model="X3 xDrive20d", year=2020, price=42000, mileage=55000, fuel="Dizel", transmission="Automatik", horsepower=190, engine_size=2.0, body_type="SUV", color="Crna", doors=5, location="Novi Sad", description="BMW X3 sa xDrive pogonom. Luxury Line, koža Vernasca.", features="xDrive,Luxury Line,Koža Vernasca,Panorama krov,Harman Kardon"),
    dict(seller_id=users[0].id, brand="Ford", model="Focus 1.5 EcoBlue", year=2019, price=14500, mileage=98000, fuel="Dizel", transmission="Manuelni", horsepower=120, engine_size=1.5, body_type="Hečbek", color="Plava", doors=5, location="Niš", description="Ford Focus u odličnom stanju, ekonomičan.", features="SYNC 3,Navigacija,Tempomat,Start/Stop,Parking senzori"),
    dict(seller_id=users[1].id, brand="Peugeot", model="308 1.5 BlueHDi", year=2022, price=24500, mileage=38000, fuel="Dizel", transmission="Automatik", horsepower=130, engine_size=1.5, body_type="Hečbek", color="Zelena", doors=5, location="Kraljevo", description="Novi Peugeot 308 sa i-Cockpit digitalom.", features="i-Cockpit,Full LED,10 inch ekran,Navigacija,Wireless CarPlay"),
]

for car_data in cars_data:
    car = Car(**car_data)
    db.add(car)
    db.commit()
    db.refresh(car)

    img_url = car_images.get(car.brand, car_images['Peugeot'])
    img = CarImage(car_id=car.id, image_url=img_url, is_primary=1, sort_order=0)
    db.add(img)

db.commit()
db.close()

print(f"Seeded {len(users)} users and {len(cars_data)} cars successfully!")
