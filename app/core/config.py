from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    DATABASE_URL: str
    
    # --- ADD THESE TWO LINES ---
    SUPABASE_URL: str
    SUPABASE_KEY: str
    # ---------------------------

    class Config:
        env_file = ".env"

settings = Settings()