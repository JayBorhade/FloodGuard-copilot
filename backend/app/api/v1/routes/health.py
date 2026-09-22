from fastapi import APIRouter

router = APIRouter(tags=['health'])


@router.get('/health')
def health_check() -> dict[str, str]:
    return {'status': 'ok', 'service': 'FloodGuard API'}


@router.get('/status')
def status() -> dict[str, str]:
    return {'status': 'foundation ready', 'mode': 'development'}
