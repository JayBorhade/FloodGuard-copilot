from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter(prefix='/map', tags=['map'])


@router.get('/layers')
def get_map_layers() -> dict[str, object]:
    """Return normalized map layer metadata without inventing hazard features."""
    return {
        'data_available': False,
        'message': (
            'Verified flood, shelter, community-report, and road-condition feeds '
            'are not connected. The base map is for orientation only.'
        ),
        'updated_at': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        'layers': [
            {
                'id': 'flood-zones',
                'label': 'Flood hazard zones',
                'description': 'Verified flood extent and official alerts',
                'available': False,
                'source': None,
            },
            {
                'id': 'shelters',
                'label': 'Shelters & relief points',
                'description': 'Verified evacuation assistance locations',
                'available': False,
                'source': None,
            },
            {
                'id': 'community-reports',
                'label': 'Community reports',
                'description': 'Reports awaiting trusted ingestion',
                'available': False,
                'source': None,
            },
            {
                'id': 'road-conditions',
                'label': 'Road conditions',
                'description': 'Verified closures and road hazards',
                'available': False,
                'source': None,
            },
        ],
    }
