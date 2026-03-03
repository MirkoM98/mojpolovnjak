from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "sqlite:///./mojpolovnjak.db"
    secret_key: str = "your-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_bucket_name: str = "mojpolovnjak-images"
    aws_region: str = "eu-central-1"

    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    class Config:
        env_file = ".env"


@lru_cache
def get_settings():
    return Settings()
