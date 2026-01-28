import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "BEOS Backend"
    API_V1_STR: str = "/api/v1"
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

settings = Settings()
