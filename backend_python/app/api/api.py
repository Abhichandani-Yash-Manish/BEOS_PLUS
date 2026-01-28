from fastapi import APIRouter
from app.api.endpoints import donors, emergency, auth, hospitals, blood_banks, admin


api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(donors.router, prefix="/donors", tags=["donors"])
api_router.include_router(emergency.router, prefix="/emergency", tags=["emergency"])
api_router.include_router(hospitals.router, prefix="/hospitals", tags=["hospitals"])
# Note: frontend api.ts expects /api/hospitals so we might need alias or ensuring prefix is consistent.
# The main.py includes api_router with prefix /api/v1.
# So this becomes /api/v1/hospitals.
# Frontend api.ts calls `/api/hospitals`. 
# Wait, frontend uses `API_URL` + endpoint.
# If frontend calls `/api/hospitals`, and backend is `/api/v1/hospitals`, we have a mismatch if not handled.
# Frontend `api.ts` has specific paths: `/api/hospitals` and `/donors` (without /api prefix in string).
# Generally best to standardize. I will map them as requested by frontend code I read.

api_router.include_router(blood_banks.router, prefix="/blood-banks", tags=["blood-banks"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
# Future: api_router.include_router(emergency.router, prefix="/emergency", tags=["emergency"])
