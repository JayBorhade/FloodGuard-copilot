from app.services import weather


class FakeResponse:
    def __init__(self, payload, status=200):
        self.payload = payload
        self.status = status

    def raise_for_status(self):
        if self.status >= 400:
            import requests
            raise requests.HTTPError("provider error")

    def json(self):
        return self.payload


def test_weather_normalizes_current_and_forecast(monkeypatch):
    monkeypatch.setattr(weather.requests, "get", lambda *args, **kwargs: FakeResponse({
        "timezone": "Asia/Kolkata",
        "current": {"time": "2026-10-10T10:00", "temperature_2m": 25, "precipitation": 2, "rain": 2, "showers": 0, "wind_speed_10m": 10},
        "hourly": {"time": ["10:00", "11:00"], "precipitation": [2, 4], "precipitation_probability": [60, 80]},
    }))
    result = weather.get_weather(18.52, 73.85)
    assert result["available"] is True
    assert result["source"] == "Open-Meteo"
    assert result["current"]["temperature_c"] == 25
    assert result["next_hours"][1]["precipitation_mm"] == 4
    assert "not official flood warnings" in result["disclaimer"]


def test_weather_provider_failure_is_unknown_not_safe(monkeypatch):
    import requests
    monkeypatch.setattr(weather.requests, "get", lambda *args, **kwargs: (_ for _ in ()).throw(requests.Timeout()))
    result = weather.get_weather(18.52, 73.85)
    assert result["available"] is False
    assert result["current"] is None
    assert "not evidence" in result["disclaimer"]
