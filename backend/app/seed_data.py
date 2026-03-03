from sqlalchemy.orm import Session
from .models.user import User
from .models.car import Car, CarImage
from .services.auth import hash_password


def seed_if_empty(db: Session):
    if db.query(Car).first():
        return

    demo_user = db.query(User).filter(User.email == "demo@mojpolovnjak.autos").first()
    if not demo_user:
        demo_user = User(
            email="demo@mojpolovnjak.autos",
            hashed_password=hash_password("demo1234"),
            name="MojPolovnjak Tim",
            phone="+381 64 123 4567",
        )
        db.add(demo_user)
        db.flush()

    cars_data = [
        {
            "brand": "Volkswagen",
            "model": "Golf 7 1.6 TDI",
            "year": 2018,
            "price": 14500,
            "mileage": 132000,
            "fuel": "Dizel",
            "transmission": "Manuelni",
            "horsepower": 115,
            "engine_size": 1.6,
            "body_type": "Hečbek",
            "color": "Siva",
            "doors": 5,
            "location": "Beograd",
            "description": "Volkswagen Golf 7 u odličnom stanju. Redovno servisiran u ovlašćenom servisu, servisna knjižica uredna. Kupljen nov u Srbiji, prvi vlasnik. Zimske i letnje gume na felgama. Registrovan do septembra 2026.",
            "features": "Klima,Tempomat,Parking senzori,Navigacija,Bluetooth,Start/Stop,LED svetla",
            "image": "https://images.unsplash.com/photo-1622659889966-c4e570e12b53?w=800",
        },
        {
            "brand": "BMW",
            "model": "320d F30",
            "year": 2016,
            "price": 17900,
            "mileage": 178000,
            "fuel": "Dizel",
            "transmission": "Automatik",
            "horsepower": 190,
            "engine_size": 2.0,
            "body_type": "Limuzina",
            "color": "Crna",
            "doors": 4,
            "location": "Novi Sad",
            "description": "BMW 320d sa M paketom opreme, automatski menjač, koža enterijer. Dva ključa, svi servisi radjeni. Bez ulaganja, moguća zamena uz doplatu.",
            "features": "Koža,M paket,Xenon,Navigacija,Grejanje sedišta,Automatska klima,Tempomat,Parking senzori",
            "image": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
        },
        {
            "brand": "Audi",
            "model": "A4 2.0 TDI",
            "year": 2019,
            "price": 22500,
            "mileage": 95000,
            "fuel": "Dizel",
            "transmission": "Automatik",
            "horsepower": 150,
            "engine_size": 2.0,
            "body_type": "Karavan",
            "color": "Bela",
            "doors": 5,
            "location": "Niš",
            "description": "Audi A4 Avant u perfektnom stanju. S-Tronic automatski menjač, virtuelni kokpit, Matrix LED svetla. Uvezen iz Nemačke, ocarinjen i registrovan.",
            "features": "Virtuelni kokpit,Matrix LED,Navigacija,Automatska klima,Tempomat,Parking senzori,Kamera,Keyless",
            "image": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
        },
        {
            "brand": "Mercedes-Benz",
            "model": "C 220d W205",
            "year": 2017,
            "price": 23000,
            "mileage": 145000,
            "fuel": "Dizel",
            "transmission": "Automatik",
            "horsepower": 170,
            "engine_size": 2.1,
            "body_type": "Limuzina",
            "color": "Teget",
            "doors": 4,
            "location": "Beograd",
            "description": "Mercedes C klasa u Avantgarde paketu opreme. 9G-Tronic automatski menjač, koža/alcantara enterijer. Garažiran, nema tragova korozije.",
            "features": "Avantgarde,9G-Tronic,Koža,LED svetla,Navigacija,Grejanje sedišta,Tempomat,Parking senzori",
            "image": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
        },
        {
            "brand": "Škoda",
            "model": "Octavia 1.6 TDI",
            "year": 2020,
            "price": 16800,
            "mileage": 68000,
            "fuel": "Dizel",
            "transmission": "Manuelni",
            "horsepower": 115,
            "engine_size": 1.6,
            "body_type": "Karavan",
            "color": "Siva",
            "doors": 5,
            "location": "Kragujevac",
            "description": "Škoda Octavia Combi, Style paket opreme. Kupljena nova u Srbiji, servisirana u ovlašćenom servisu. Fabričko stanje, bez ikakvog ulaganja.",
            "features": "Klima,Tempomat,Parking senzori,Navigacija,LED svetla,Bluetooth,Android Auto,Apple CarPlay",
            "image": "https://images.unsplash.com/photo-1632038229898-1f862020be71?w=800",
        },
        {
            "brand": "Toyota",
            "model": "Corolla 1.8 Hybrid",
            "year": 2021,
            "price": 21000,
            "mileage": 42000,
            "fuel": "Hibrid",
            "transmission": "Automatik",
            "horsepower": 122,
            "engine_size": 1.8,
            "body_type": "Hečbek",
            "color": "Bela",
            "doors": 5,
            "location": "Beograd",
            "description": "Toyota Corolla Hybrid sa minimalnom potrošnjom goriva (4.2l/100km). Kupljena nova kod ovlašćenog dilera, pod garancijom do 2026. Kao nova.",
            "features": "Hibridni pogon,Toyota Safety Sense,Adaptivni tempomat,LED svetla,Kamera,Navigacija,Keyless",
            "image": "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800",
        },
        {
            "brand": "Renault",
            "model": "Clio 1.5 dCi",
            "year": 2019,
            "price": 10500,
            "mileage": 87000,
            "fuel": "Dizel",
            "transmission": "Manuelni",
            "horsepower": 85,
            "engine_size": 1.5,
            "body_type": "Hečbek",
            "color": "Crvena",
            "doors": 5,
            "location": "Subotica",
            "description": "Renault Clio u odličnom stanju, ekonomičan za grad i otvoreni put. Klima, multimedija sa ekranom na dodir. Registrovan do marta 2027.",
            "features": "Klima,Ekran na dodir,Bluetooth,USB,Tempomat,Dnevna LED svetla,Maglenke",
            "image": "https://images.unsplash.com/photo-1601929862217-f1175f0bfc23?w=800",
        },
        {
            "brand": "Fiat",
            "model": "500 1.2",
            "year": 2017,
            "price": 7900,
            "mileage": 62000,
            "fuel": "Benzin",
            "transmission": "Manuelni",
            "horsepower": 69,
            "engine_size": 1.2,
            "body_type": "Hečbek",
            "color": "Plava",
            "doors": 3,
            "location": "Novi Sad",
            "description": "Slatki Fiat 500 idealan za grad. Mala potrošnja, lak za parkiranje. Panorama krov, klima, city mode. Ženske ruke, garažiran.",
            "features": "Panorama krov,Klima,City mode,Bluetooth,Električni prozori,Centralno zaključavanje",
            "image": "https://images.unsplash.com/photo-1595787572734-fae6e689d2eb?w=800",
        },
    ]

    for car_data in cars_data:
        image_url = car_data.pop("image")
        car = Car(seller_id=demo_user.id, **car_data)
        db.add(car)
        db.flush()
        db.add(CarImage(car_id=car.id, image_url=image_url, is_primary=1, sort_order=0))

    db.commit()
    print(f"[SEED] Dodato {len(cars_data)} automobila u bazu.")
