import { useEffect, useRef } from 'react';
import type { Map as MapLibreMapInstance, MapOptions } from 'maplibre-gl';

export function MapLibreMap({
  latitude,
  longitude,
  zoom = 12,
  className = '',
}: {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMapInstance | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    let disposed = false;

    const initMap = async () => {
      try {
        const maplibregl = await import('maplibre-gl');
        if (disposed || !mapContainer.current) return;

        const style = {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
            },
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm',
            },
          ],
        };

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style,
          center: [longitude, latitude],
          zoom,
        } as MapOptions);

        const markerEl = document.createElement('div');
        markerEl.className = 'map-marker';
        new maplibregl.Marker(markerEl)
          .setLngLat([longitude, latitude])
          .addTo(map.current);
      } catch (error) {
        if (!disposed) {
          console.error('Failed to initialize map:', error);
        }
      }
    };

    void initMap();

    return () => {
      disposed = true;
      map.current?.remove();
      map.current = null;
    };
  }, [latitude, longitude, zoom]);

  return (
    <div
      ref={mapContainer}
      className={`map-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    />
  );
}
