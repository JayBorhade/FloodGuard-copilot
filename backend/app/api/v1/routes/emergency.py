from fastapi import APIRouter

router = APIRouter(prefix="/emergency", tags=["emergency assistance"])


@router.get("/guidance")
def emergency_guidance() -> dict[str, object]:
    """Provide official India emergency guidance without claiming to dispatch help."""
    return {
        "country": "India",
        "emergency_number": "112",
        "service_name": "Emergency Response Support System (ERSS)",
        "services": ["Police", "Fire and rescue", "Health emergencies"],
        "source": "Government of India ERSS",
        "source_url": "https://112.gov.in/",
        "available": True,
        "dispatch_integrated": False,
        "message": "For immediate danger, call 112 directly. FloodGuard does not contact responders or transmit your location.",
        "steps": [
            "Move away from floodwater and electrical hazards if you can do so safely.",
            "Call 112 for urgent rescue or life-threatening emergencies.",
            "Tell the operator your location, nearby landmarks, number of people, and immediate hazards.",
            "Follow instructions from official emergency responders and local authorities.",
        ],
    }
