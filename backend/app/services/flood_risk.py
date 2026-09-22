from datetime import datetime

from app.schemas.flood import FloodRiskAssessment, FloodRiskLevel, FloodRiskSource


class FloodRiskService:
    def assess_risk(
        self,
        rainfall_mm: float | None = None,
        river_level_m: float | None = None,
        official_alerts: list[str] | None = None,
        community_reports: int = 0,
    ) -> FloodRiskAssessment:
        score = 0

        if rainfall_mm is not None:
            score += min(int(rainfall_mm * 4), 35)
        if river_level_m is not None:
            score += min(int(river_level_m * 20), 25)
        if official_alerts:
            score += 25
        if community_reports:
            score += min(community_reports * 10, 20)

        score = max(0, min(score, 100))

        if score >= 80:
            level = FloodRiskLevel.CRITICAL
            summary = 'Critical flood risk conditions observed.'
        elif score >= 60:
            level = FloodRiskLevel.HIGH
            summary = 'High flood risk detected. Monitoring required.'
        elif score >= 40:
            level = FloodRiskLevel.MODERATE
            summary = 'Moderate flood risk. Nearby users should remain alert.'
        elif score >= 20:
            level = FloodRiskLevel.LOW
            summary = 'Low flood risk. Watch conditions continue.'
        else:
            level = FloodRiskLevel.SAFE
            summary = 'No active flood risk signals detected.'

        return FloodRiskAssessment(
            level=level,
            score=score,
            confidence=70,
            summary=summary,
            source=FloodRiskSource.DERIVED,
            updated_at=datetime.utcnow().isoformat(timespec='seconds') + 'Z',
        )
