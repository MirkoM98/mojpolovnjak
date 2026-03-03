# MojPolovnjak - Polovni Automobili

Sajt za prodaju i kupovinu polovnih automobila u Srbiji.

## Tech Stack

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Python FastAPI + SQLAlchemy
- **Baza:** SQLite (dev) / PostgreSQL (prod)
- **Slike:** AWS S3 (prod) / lokalni fajlovi (dev)
- **Hosting:** Vercel (frontend) + Railway (backend)

## Pokretanje lokalno

### Preduslovi

- Node.js 20+
- Python 3.10+

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Otvori http://localhost:3000

### Backend

```bash
cd backend
pip install -r requirements.txt
python seed.py          # popuni bazu test podacima
python -m uvicorn app.main:app --reload --port 8000
```

API dokumentacija: http://localhost:8000/docs

### Test nalog

- Email: `marko@example.com`
- Lozinka: `password123`

## Deploy

### Frontend (Vercel)

1. Push kod na GitHub
2. Importuj `frontend/` folder na vercel.com
3. Dodaj env var: `VITE_API_URL=https://your-api-domain.com/api`

### Backend (Railway)

1. Importuj `backend/` folder na railway.app
2. Dodaj PostgreSQL plugin
3. Podesi env vars: `DATABASE_URL`, `SECRET_KEY`, `AWS_*`

## API Rute

| Metod | Ruta | Opis |
|-------|------|------|
| POST | /api/auth/register | Registracija |
| POST | /api/auth/login | Prijava |
| GET | /api/cars | Lista automobila |
| GET | /api/cars/:id | Detalji automobila |
| POST | /api/cars | Kreiraj oglas |
| PUT | /api/cars/:id | Izmeni oglas |
| DELETE | /api/cars/:id | Obriši oglas |
| POST | /api/cars/:id/images | Upload slika |
| GET | /api/users/me | Moj profil |
| PUT | /api/users/me | Ažuriraj profil |
| GET | /api/users/me/cars | Moji oglasi |
| GET | /api/users/me/favorites | Favoriti |
| POST | /api/users/me/favorites/:id | Dodaj u favorite |
| DELETE | /api/users/me/favorites/:id | Ukloni iz favorita |
