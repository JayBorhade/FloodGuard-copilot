from typing import Literal

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.services import community

router = APIRouter(prefix="/community", tags=["community reports"])


class CommunityReportCreate(BaseModel):
    category: Literal["flooding", "blocked_road", "water_level", "infrastructure_damage", "other"]
    description: str = Field(min_length=8, max_length=1000)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    location_label: str | None = Field(default=None, max_length=120)


@router.get("/reports")
def get_reports(limit: int = Query(default=50, ge=1, le=100)) -> dict[str, object]:
    items = community.list_reports(limit)
    return {
        "items": items,
        "total": len(items),
        "source": "community-submitted",
        "message": "Community reports are unverified, may be inaccurate, and are not official alerts.",
        "verified_data_available": False,
    }


@router.post("/reports", status_code=201)
def submit_report(report: CommunityReportCreate) -> dict[str, object]:
    item = community.create_report(
        category=report.category,
        description=report.description,
        latitude=report.latitude,
        longitude=report.longitude,
        location_label=report.location_label,
    )
    return {
        "item": item,
        "message": "Report submitted for review. It is unverified and will not change the flood-risk assessment.",
    }


@router.post("/reports/{report_id}/flag")
def flag_report(report_id: str) -> dict[str, object]:
    if not community.flag_report(report_id):
        raise HTTPException(status_code=404, detail="Community report not found")
    return {"flagged": True, "message": "Report flagged for review."}
