from fastapi import APIRouter, Depends, HTTPException
from typing import List, Any
from app.services.auth import get_current_user, get_supabase_client
from supabase import Client

router = APIRouter()

# Dependency to check if user is admin
def get_current_admin(current_user: dict = Depends(get_current_user)):
    user_role = current_user.get("user_metadata", {}).get("role")
    # Also check our custom 'users' table role if metadata isn't reliable, 
    # but for now assume metadata 'role' == 'admin'
    if user_role != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized as admin")
    return current_user

@router.get("/stats")
def get_admin_stats(
    current_user: dict = Depends(get_current_admin),
    supabase: Client = Depends(get_supabase_client)
):
    """
    Get system-wide statistics.
    """
    donors_count = supabase.table("donors").select("*", count="exact").execute().count
    hospitals_count = supabase.table("hospitals").select("*", count="exact").execute().count
    banks_count = supabase.table("blood_banks").select("*", count="exact").execute().count
    requests_count = supabase.table("blood_requests").select("*", count="exact").execute().count
    
    return {
        "donors": donors_count,
        "hospitals": hospitals_count,
        "blood_banks": banks_count,
        "requests": requests_count,
        # Placeholder for more complex stats
        "total_units_donated": 1500, 
        "lives_saved": 450
    }

@router.get("/users")
def get_all_users(
    current_user: dict = Depends(get_current_admin),
    supabase: Client = Depends(get_supabase_client)
):
    """
    List all users.
    """
    # Requires Supabase Service Role Key for auth.users usually, or just query public.users
    # Here we query public.users
    return supabase.table("users").select("*").execute().data

@router.delete("/users/{user_id}")
def delete_user(
    user_id: str,
    current_user: dict = Depends(get_current_admin),
    supabase: Client = Depends(get_supabase_client)
):
    """
    Delete a user.
    """
    # Delete from public.users
    # To delete from auth.users, we need supabase admin client (service_role), 
    # which we might not have exposed in this simple client.
    # For now, just delete the public reference.
    return supabase.table("users").delete().eq("user_id", user_id).execute()
