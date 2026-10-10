import { useCallback, useEffect, useRef, useState } from 'react';
import maplibregl, { type Map as MapLibreMap, type Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NavLink } from 'react-router-dom';
import { fetchJson } from '../lib/api';
import { locationService } from '../services/location';
import type { UserLocation } from '../types/user';
import '../styles/map.css';

type MapLayerInfo = {
  id: string;
  label: string;
  description: string;
  available: boolean;
  source: string | null;
};

type MapLayersResponse = {
  data_available: boolean;
  layers: MapLayerInfo[];
  message: string;
  updated_at: string | null;
};

const DEFAULT_CENTER: [number, number] = [78.9629, 20.5937];
const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

function validCoordinates(latitude: number, longitude: number): boolean {
  return Number.isFinite(latitude) && Number.isFinite(longitude)
    && latitude >= -90 && latitude <= 90
    && longitude >= -180 && longitude <= 180;
}

export function MapPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [location, setLocation] = useState<UserLocation | null>(() => locationService.getUserLocation());
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapLoadedRef = useRef(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [layers, setLayers] = useState<MapLayerInfo[]>([]);
  const [layersLoading, setLayersLoading] = useState(true);
  const [layersError, setLayersError] = useState<string | null>(null);
  const [layerStatus, setLayerStatus] = useState('Checking hazard-layer availability…');

  useEffect(() => {
    let active = true;
    fetchJson<MapLayersResponse>('/api/v1/map/layers')
      .then((response) => {
        if (!active) return;
        setLayers(response.layers);
        setLayerStatus(response.data_available
          ? 'Map data sources connected.'
          : response.message || 'Hazard overlays are not available yet.');
      })
      .catch(() => {
        if (!active) return;
        setLayersError('Could not load layer status from the FloodGuard API.');
        setLayerStatus('Layer status unavailable. No hazard overlay is being displayed.');
      })
      .finally(() => {
        if (active) setLayersLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE_URL,
      center: location && validCoordinates(location.latitude, location.longitude)
        ? [location.longitude, location.latitude]
        : DEFAULT_CENTER,
      zoom: location ? 11 : 4,
      attributionControl: true,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.on('load', () => {
      mapLoadedRef.current = true;
      setMapLoaded(true);
      setMapError(null);
    });
    map.on('error', () => {
      if (!mapLoadedRef.current) {
        setMapError('The base map could not load. Check your internet connection and try again.');
      }
    });

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
    // Map instance is intentionally created once; location changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !location || !validCoordinates(location.latitude, location.longitude)) return;
    markerRef.current?.remove();
    const markerElement = document.createElement('div');
    markerElement.className = 'user-location-marker';
    markerElement.setAttribute('role', 'img');
    markerElement.setAttribute('aria-label', 'Saved user location');
    markerRef.current = new maplibregl.Marker({ element: markerElement })
      .setLngLat([location.longitude, location.latitude])
      .setPopup(new maplibregl.Popup({ offset: 18 }).setText('Saved location · not a flood-safety assessment'))
      .addTo(map);
    map.flyTo({ center: [location.longitude, location.latitude], zoom: Math.max(map.getZoom(), 11), essential: true });
  }, [location?.latitude, location?.longitude]);

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationMessage('This browser does not support location access. You can add a location in onboarding.');
      return;
    }
    setLocating(true);
    setLocationMessage(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy_meters: position.coords.accuracy,
          verified_at: new Date().toISOString(),
        };
        if (!validCoordinates(nextLocation.latitude, nextLocation.longitude)) {
          setLocationMessage('The browser returned invalid coordinates. Please try again.');
          setLocating(false);
          return;
        }
        locationService.storeUserLocation(nextLocation);
        setLocation(nextLocation);
        setLocationMessage('Your device location is shown. This does not indicate whether the area is safe.');
        setLocating(false);
      },
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? 'Location permission was denied. You can allow it in browser settings or use your saved location.'
          : error.code === error.TIMEOUT
            ? 'Location request timed out. Try again or use your saved location.'
            : 'Your location could not be determined. Check device location settings and try again.';
        setLocationMessage(message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }, []);

  const centerOnSavedLocation = () => {
    if (!location || !mapRef.current) {
      setLocationMessage('No saved location is available. Use “Locate me” or add one during onboarding.');
      return;
    }
    mapRef.current.flyTo({ center: [location.longitude, location.latitude], zoom: 13, essential: true });
  };

  return (
    <section className="page-shell map-page">
      <div className="page-header map-page-header">
        <div>
          <p className="eyebrow">FloodGuard · Explore</p>
          <h1>Interactive flood map</h1>
          <p className="page-subtitle">Explore the map and your location. Hazard overlays remain unavailable until verified data sources are connected.</p>
        </div>
        <span className={mapLoaded ? 'map-status-pill map-status-ready' : 'map-status-pill'}>
          <span aria-hidden="true" className="map-status-dot" />
          {mapError ? 'Map unavailable' : mapLoaded ? 'Base map ready' : 'Loading map…'}
        </span>
      </div>

      <div className="map-safety-banner" role="status">
        <span className="map-banner-icon" aria-hidden="true">!</span>
        <div>
          <strong>Hazard information is not connected</strong>
          <p>The base map is for orientation only. No flood zones, shelters, road conditions, or evacuation routes are verified here. Missing data does not mean an area is safe.</p>
        </div>
      </div>

      <div className="map-workspace">
        <section className="map-canvas-card card" aria-label="Interactive map">
          <div className="map-toolbar">
            <div>
              <span className="map-toolbar-title">Map view</span>
              <span className="map-toolbar-subtitle">{location ? 'Saved/device location available' : 'No location selected'}</span>
            </div>
            <div className="map-toolbar-actions">
              <button type="button" className="secondary-button" onClick={centerOnSavedLocation}>My saved location</button>
              <button type="button" className="primary-button" onClick={locateMe} disabled={locating}>
                {locating ? 'Locating…' : '⌖ Locate me'}
              </button>
            </div>
          </div>

          {mapError && (
            <div className="map-inline-error" role="alert">
              <strong>Map tiles unavailable</strong>
              <p>{mapError}</p>
              <button type="button" className="secondary-button" onClick={() => window.location.reload()}>Retry map</button>
            </div>
          )}
          <div ref={containerRef} className="maplibre-canvas" aria-label="Pan and zoom map" />
          {!mapLoaded && !mapError && <div className="map-loading-overlay" role="status">Loading interactive map…</div>}
          <div className="map-attribution-note">Base map © OpenStreetMap contributors · Map tiles by OpenFreeMap</div>
          {locationMessage && <div className="map-message" role="status">{locationMessage}</div>}
        </section>

        <aside className="map-side-panel" aria-label="Map layers and legend">
          <section className="card map-side-card">
            <div className="map-panel-heading">
              <div><p className="eyebrow">Map controls</p><h2>Layers</h2></div>
              <span className="map-count-badge">{layersLoading ? '…' : layers.length}</span>
            </div>
            <p className="map-muted-copy">Layers are enabled only when a verified source is available.</p>
            {layersError && <p className="map-inline-warning" role="alert">{layersError}</p>}
            <div className="map-layer-list">
              {(layers.length ? layers : [
                { id: 'flood-zones', label: 'Flood hazard zones', description: 'Verified flood extent and alerts', available: false, source: null },
                { id: 'shelters', label: 'Shelters & relief points', description: 'Verified evacuation assistance', available: false, source: null },
                { id: 'community-reports', label: 'Community reports', description: 'Reports awaiting trusted ingestion', available: false, source: null },
                { id: 'road-conditions', label: 'Road conditions', description: 'Verified closures and hazards', available: false, source: null },
              ]).map((layer) => (
                <div className="map-layer-row" key={layer.id}>
                  <span className={layer.available ? 'map-layer-symbol available' : 'map-layer-symbol unavailable'} aria-hidden="true" />
                  <div className="map-layer-copy"><strong>{layer.label}</strong><span>{layer.description}</span></div>
                  <span className={layer.available ? 'layer-state available' : 'layer-state'}>{layer.available ? 'Ready' : 'Offline'}</span>
                </div>
              ))}
            </div>
            <p className="map-layer-status">{layerStatus}</p>
          </section>

          <section className="card map-side-card">
            <p className="eyebrow">Legend</p>
            <h2>Map symbols</h2>
            <div className="map-legend-row"><span className="legend-dot user" /> Your saved/device location</div>
            <div className="map-legend-row"><span className="legend-dot flood" /> Flood hazard — unavailable</div>
            <div className="map-legend-row"><span className="legend-dot shelter" /> Verified shelter — unavailable</div>
            <div className="map-legend-row"><span className="legend-line route" /> Verified evacuation route — unavailable</div>
          </section>

          <section className="card map-side-card map-next-step">
            <p className="eyebrow">Location setup</p>
            <h2>Set your location</h2>
            <p className="map-muted-copy">A location helps center the map. It is not a risk reading.</p>
            <NavLink className="secondary-button" to="/onboarding/location">Manage saved location</NavLink>
          </section>
        </aside>
      </div>
    </section>
  );
}
