import { useEffect, useRef } from 'react';

interface MapLibreMap {
  remove: () => void;
}

interface MapOptions {
  container: string;
  style: string;
  center: [number, number];
  zoom: number;
}

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
  const map = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const initMap = async () => {
      try {
        // Dynamically import MapLibre to keep it optional
        const maplibregl = await import('maplibre-gl');
        // Use a basic OSM-compatible tile provider
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
        } as any);

        // Add a marker for user location
        const markerEl = document.createElement('div');
        markerEl.className = 'map-marker';
        new maplibregl.Marker(markerEl)
          .setLngLat([longitude, latitude])
          .addTo(map.current);
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
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
