'use client';
import React from 'react';

import { useRef, useEffect, useState } from 'react';
import Map, { Marker, NavigationControl, Popup, type MapRef } from 'react-map-gl/maplibre';
import type { LngLatBoundsLike } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface MapMarker {
  id: string;
  longitude: number;
  latitude: number;
  label?: string;
  color?: 'green' | 'red' | 'blue' | 'teal';
  address?: string;
}

export interface InteractiveMapProps {
  markers?: MapMarker[];
  onMapClick?: (lng: number, lat: number) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
  interactive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  selectedMarkerId?: string | null;
  onMarkerSelect?: (id: string) => void;
  renderPopup?: (markerId: string) => React.ReactNode;
}

const MARKER_COLORS = {
  green: '#10b981',
  red: '#ef4444',
  blue: '#3b82f6',
  teal: '#548CA1',
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  markers = [],
  onMapClick,
  initialCenter = [-74.006, 40.7128],
  initialZoom = 12,
  interactive = true,
  style,
  className,
  selectedMarkerId,
  onMarkerSelect,
  renderPopup,
}) => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: initialCenter[0],
    latitude: initialCenter[1],
    zoom: initialZoom,
  });
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  // Auto-fit bounds when markers change
  useEffect(() => {
    if (!mapRef.current || markers.length === 0) return;
    const map = mapRef.current.getMap();
    if (markers.length === 1) {
      map.flyTo({ center: [markers[0].longitude, markers[0].latitude], zoom: 14, duration: 800 });
    } else {
      const bounds: LngLatBoundsLike = markers.reduce(
        (acc, m) => [
          [Math.min((acc as number[][])[0][0], m.longitude), Math.min((acc as number[][])[0][1], m.latitude)],
          [Math.max((acc as number[][])[1][0], m.longitude), Math.max((acc as number[][])[1][1], m.latitude)],
        ],
        [[markers[0].longitude, markers[0].latitude], [markers[0].longitude, markers[0].latitude]]
      );
      map.fitBounds(bounds, { padding: 60, duration: 800 });
    }
  }, [markers]);

  // Fly to selected marker from parent
  useEffect(() => {
    if (!mapRef.current || !selectedMarkerId) return;
    const target = markers.find((m) => m.id === selectedMarkerId);
    if (!target) return;
    mapRef.current.getMap().flyTo({ center: [target.longitude, target.latitude], zoom: 14, duration: 500 });
    setActiveMarkerId(selectedMarkerId);
  }, [selectedMarkerId, markers]);

  const activeMarker = markers.find((m) => m.id === activeMarkerId) ?? null;

  return (
    <div style={{ width: '100%', height: '100%', ...style }} className={className}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={() => { if (onMapClick && interactive) {} }}
        mapStyle={{
          version: 8,
          sources: { 'osm-tiles': { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '© OpenStreetMap' } },
          layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm-tiles', minzoom: 0, maxzoom: 19 }],
        }}
        style={{ width: '100%', height: '100%' }}
        dragPan={interactive}
        scrollZoom={interactive}
        doubleClickZoom={interactive}
        touchZoomRotate={interactive}
        dragRotate={false}
        pitchWithRotate={false}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {markers.map((marker) => {
          const isActive = marker.id === activeMarkerId;
          return (
            <Marker
              key={marker.id}
              longitude={marker.longitude}
              latitude={marker.latitude}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                const next = isActive ? null : marker.id;
                setActiveMarkerId(next);
                if (next && onMarkerSelect) onMarkerSelect(next);
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transform: isActive ? 'scale(1.2)' : 'scale(0.85)',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = isActive ? 'scale(1.2)' : 'scale(0.85)')}
              >
                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: MARKER_COLORS[marker.color || 'teal'], opacity: 0.15, position: 'absolute' }} />
                <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: MARKER_COLORS[marker.color || 'teal'], border: `2px solid ${isActive ? '#fff' : 'white'}`, boxShadow: isActive ? '0 0 0 2px #548CA1, 0 2px 8px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C8.5 2 6 4.5 6 8C6 10 6.5 11.5 7 13C7.5 14.5 8 16 8 18C8 20 9 22 11 22C11.5 22 12 21.5 12 21V19C12 18.5 12.5 18 13 18C13.5 18 14 18.5 14 19V21C14 21.5 14.5 22 15 22C17 22 18 20 18 18C18 16 18.5 14.5 19 13C19.5 11.5 20 10 20 8C20 4.5 17.5 2 14 2H12Z" />
                  </svg>
                </div>
              </div>
            </Marker>
          );
        })}

        {/* Popup on active marker */}
        {activeMarker && (
          <Popup
            longitude={activeMarker.longitude}
            latitude={activeMarker.latitude}
            anchor="bottom"
            offset={20}
            onClose={() => setActiveMarkerId(null)}
            closeButton={true}
            closeOnClick={false}
            maxWidth="300px"
            style={{ padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {renderPopup ? (
              <div style={{ padding: 0 }}>{renderPopup(activeMarker.id)}</div>
            ) : (
              <div style={{ padding: '8px 12px', fontSize: 12, color: '#1f2937' }}>
                <span>📍 </span><span style={{ fontWeight: 500 }}>{activeMarker.address}</span>
              </div>
            )}
          </Popup>
        )}
      </Map>

      <style jsx>{`
        .maplibregl-ctrl-group { border-radius: 6px !important; box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; }
        .maplibregl-ctrl button { width: 28px !important; height: 28px !important; }
        .maplibregl-popup-content { padding: 0 !important; border-radius: 8px !important; box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important; }
        .maplibregl-popup-close-button { width: 20px !important; height: 20px !important; font-size: 14px !important; right: 4px !important; top: 4px !important; color: #9ca3af !important; }
        .maplibregl-popup-tip { border-top-color: white !important; }
      `}</style>
    </div>
  );
};
