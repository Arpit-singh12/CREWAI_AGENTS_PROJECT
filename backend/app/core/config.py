from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database settings
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "multi_agent_db"
    
    # API Keys
    OPENAI_API_KEY: str = "Enter_your_API_here"
    
    # Security
    JWT_SECRET_KEY: str = "Enter_Your_secret_here"

    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # External APIs
    STRIPE_SECRET_KEY: Optional[str] = None
    SENDGRID_API_KEY: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    
    # Agent Configuration
    MAX_QUERY_LENGTH: int = 1000
    AGENT_TIMEOUT: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()