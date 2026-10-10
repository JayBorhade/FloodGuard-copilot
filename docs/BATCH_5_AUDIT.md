# Batch 5 Audit — Live Data & Official Alerts

## Implemented
- Open-Meteo-backed weather context endpoint with coordinate validation, bounded HTTP timeouts, source attribution, provider timestamps, and normalized hourly precipitation context.
- Explicitly configured IMD alert adapter. It only calls HTTPS `api.imd.gov.in`, accepts an operator-supplied endpoint, and refuses to infer alerts from unknown response shapes.
- Dashboard panels for weather context and official warning feed status.
- Weather/alert failure paths remain unavailable/unknown and include safety disclaimers.
- Tests cover normalized provider responses, timeouts, missing configuration, and unapproved alert hosts.

## Configuration
- Weather context uses the public Open-Meteo forecast API. Review provider usage terms and attribution before deployment.
- Set `IMD_ALERTS_API_URL` only after obtaining access and choosing a documented IMD API product/endpoint. Optionally set `IMD_API_KEY` if the approved product requires it. The IMD API index is https://api.imd.gov.in/public/api_reference.html.
- Do not assume the IMD feed is connected merely because the adapter exists. With no endpoint configured, the service reports unavailable.

## Safety and limitations
- Weather data is not itself a flood-risk score, evacuation instruction, or official warning.
- The risk endpoint remains unknown until verified hydrological/official alert inputs and a reviewed risk methodology are integrated.
- Live API access and provider schema were not verified with deployment credentials. Do not claim official alerts are live until configured and manually checked.
