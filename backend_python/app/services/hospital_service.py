from supabase import Client
from app.models.hospital_models import HospitalCreate, HospitalUpdate

class HospitalService:
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client

    def get_hospitals(self, city: str = None, verified: bool = None):
        query = self.supabase.table("hospitals").select("*")
        if city:
            query = query.ilike("city", f"%{city}%")
        if verified is not None:
            query = query.eq("verified", verified)
        
        result = query.execute()
        return result.data

    def get_hospital_by_id(self, hospital_id: int):
        result = self.supabase.table("hospitals").select("*").eq("id", hospital_id).single().execute()
        return result.data

    def get_hospital_by_user_id(self, user_id: str):
        result = self.supabase.table("hospitals").select("*").eq("user_id", user_id).single().execute()
        return result.data

    def create_hospital(self, hospital: HospitalCreate, user_id: str):
        data = hospital.model_dump()
        data["user_id"] = user_id
        result = self.supabase.table("hospitals").insert(data).execute()
        return result.data[0]

    def update_hospital(self, hospital_id: int, hospital_update: HospitalUpdate):
        data = hospital_update.model_dump(exclude_unset=True)
        result = self.supabase.table("hospitals").update(data).eq("id", hospital_id).execute()
        return result.data[0]
