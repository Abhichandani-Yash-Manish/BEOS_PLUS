from supabase import create_client, Client
from app.core.config import settings

if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
    # Fallback/mock for build time if keys aren't present
    print("Warning: Supabase credentials not found. Database features will fail.")
    supabase: Client = None
else:
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def get_supabase() -> Client:
    return supabase
