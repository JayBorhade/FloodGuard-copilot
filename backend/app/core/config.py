from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str = 'FloodGuard'
    api_v1_prefix: str = '/api/v1'
    allowed_origins: list[str] = ['http://localhost:5173']
    firebase_project_id: str | None = None
    environment: str = 'development'

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', case_sensitive=False)


settings = Settings()
