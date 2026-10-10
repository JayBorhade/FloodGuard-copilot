from datetime import datetime, timezone
from typing import Any

import requests


OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


def get_weather(latitude: float, longitude: float) -> dict[str, Any]:
    """Fetch a small, attributed weather snapshot. Weather is not a flood warning."""
    fetched_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    try:
        response = requests.get(
            OPEN_METEO_URL,
            params={
                "latitude": latitude,
                "longitude": longitude,
                "current": "temperature_2m,precipitation,rain,showers,wind_speed_10m",
                "hourly": "precipitation,precipitation_probability",
                "forecast_hours": 6,
                "timezone": "auto",
            },
            timeout=(3.05, 8),
        )
        response.raise_for_status()
        payload = response.json()
        current = payload.get("current")
        if not isinstance(current, dict):
            raise ValueError("Weather provider response did not include current conditions")
        hourly = payload.get("hourly") if isinstance(payload.get("hourly"), dict) else {}
        times = hourly.get("time") if isinstance(hourly.get("time"), list) else []
        precipitation = hourly.get("precipitation") if isinstance(hourly.get("precipitation"), list) else []
        probability = hourly.get("precipitation_probability") if isinstance(hourly.get("precipitation_probability"), list) else []
        forecast = []
        for index, timestamp in enumerate(times[:6]):
            forecast.append({
                "time": timestamp,
                "precipitation_mm": precipitation[index] if index < len(precipitation) else None,
                "precipitation_probability_percent": probability[index] if index < len(probability) else None,
            })
        return {
            "available": True,
            "source": "Open-Meteo",
            "source_url": "https://open-meteo.com/",
            "fetched_at": fetched_at,
            "provider_updated_at": current.get("time"),
            "timezone": payload.get("timezone"),
            "current": {
                "temperature_c": current.get("temperature_2m"),
                "precipitation_mm": current.get("precipitation"),
                "rain_mm": current.get("rain"),
                "showers_mm": current.get("showers"),
                "wind_speed_kmh": current.get("wind_speed_10m"),
            },
            "next_hours": forecast,
            "disclaimer": "Weather observations and forecasts are not official flood warnings or a safety assessment.",
        }
    except (requests.RequestException, ValueError, TypeError, AttributeError) as exc:
        return {
            "available": False,
            "source": "Open-Meteo",
            "source_url": "https://open-meteo.com/",
            "fetched_at": fetched_at,
            "provider_updated_at": None,
            "timezone": None,
            "current": None,
            "next_hours": [],
            "disclaimer": "Weather data is unavailable. This is not evidence that an area is safe.",
            "error": "Weather provider unavailable or returned an invalid response.",
        }
