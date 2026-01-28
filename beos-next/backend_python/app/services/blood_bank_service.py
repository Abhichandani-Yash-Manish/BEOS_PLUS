from supabase import Client
from typing import List, Optional
from app.models.blood_bank_models import (
    BloodBankCreate, BloodBankUpdate, BloodInventoryUpdate, BloodBatchCreate
)

class BloodBankService:
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client

    # --- Blood Bank Profile Management ---

    def get_blood_banks(self, city: str = None, blood_type: str = None, min_units: int = 1):
        if blood_type:
            # Complex query: Find blood banks that have enough inventory of specific blood type
            # This generally requires a join or two-step query in Supabase-py if relationships aren't perfect
            # For simplicity, we'll fetch inventory separately or use a stored procedure if available.
            # Here: Fetch inventory matching criteria, then fetch blood banks.
            inventory = self.supabase.table("blood_inventory")\
                .select("blood_bank_id")\
                .eq("blood_type", blood_type)\
                .gte("units", min_units)\
                .execute()
            
            ids = [item['blood_bank_id'] for item in inventory.data]
            if not ids:
                return []
            
            query = self.supabase.table("blood_banks").select("*").in_("id", ids)
            if city:
                query = query.ilike("city", f"%{city}%")
            return query.execute().data
        
        else:
            query = self.supabase.table("blood_banks").select("*")
            if city:
                query = query.ilike("city", f"%{city}%")
            return query.execute().data

    def get_blood_bank_by_id(self, bank_id: int):
        return self.supabase.table("blood_banks").select("*").eq("id", bank_id).single().execute().data

    def get_blood_bank_by_user_id(self, user_id: str):
        return self.supabase.table("blood_banks").select("*").eq("user_id", user_id).single().execute().data

    def create_blood_bank(self, bank: BloodBankCreate, user_id: str):
        data = bank.model_dump()
        data["user_id"] = user_id
        return self.supabase.table("blood_banks").insert(data).execute().data[0]

    def update_blood_bank(self, bank_id: int, update: BloodBankUpdate):
        data = update.model_dump(exclude_unset=True)
        return self.supabase.table("blood_banks").update(data).eq("id", bank_id).execute().data[0]

    # --- Inventory Management ---

    def get_inventory(self, bank_id: int):
        return self.supabase.table("blood_inventory").select("*").eq("blood_bank_id", bank_id).execute().data

    def update_inventory(self, bank_id: int, inventory: BloodInventoryUpdate):
        # Check if exists
        existing = self.supabase.table("blood_inventory")\
            .select("*")\
            .eq("blood_bank_id", bank_id)\
            .eq("blood_type", inventory.blood_type)\
            .execute().data
        
        if existing:
            # Update
            return self.supabase.table("blood_inventory")\
                .update({"units": inventory.units})\
                .eq("id", existing[0]['id'])\
                .execute().data[0]
        else:
            # Insert
            return self.supabase.table("blood_inventory")\
                .insert({
                    "blood_bank_id": bank_id, 
                    "blood_type": inventory.blood_type, 
                    "units": inventory.units
                })\
                .execute().data[0]
                
    def get_total_inventory_stats(self):
        # Implementation depends on aggregator availability or raw fetch
        # Fetch all inventory and sum in python for MVP
        data = self.supabase.table("blood_inventory").select("*").execute().data
        stats = {}
        for item in data:
            btype = item['blood_type']
            stats[btype] = stats.get(btype, 0) + item['units']
        return stats

    # --- Batch Management ---
    
    def add_batch(self, bank_id: int, batch: BloodBatchCreate):
        # Add batch
        batch_data = batch.model_dump()
        batch_data["blood_bank_id"] = bank_id
        # Convert date to string for JSON serialization if necessary, though pydantic handles it usually
        batch_data["expiry_date"] = batch.expiry_date.isoformat()
        
        new_batch = self.supabase.table("blood_batches").insert(batch_data).execute().data[0]
        
        # Auto-update summary inventory
        current_inv = self.supabase.table("blood_inventory")\
            .select("units")\
            .eq("blood_bank_id", bank_id)\
            .eq("blood_type", batch.blood_type)\
            .execute().data
            
        current_units = current_inv[0]['units'] if current_inv else 0
        new_units = current_units + batch.units
        
        self.update_inventory(bank_id, BloodInventoryUpdate(blood_type=batch.blood_type, units=new_units))
        
        return new_batch

    def get_batches(self, bank_id: int):
        return self.supabase.table("blood_batches").select("*").eq("blood_bank_id", bank_id).execute().data
