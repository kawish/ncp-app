'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const DEFAULT_CENTER = { lat: 28.613464, lng: 77.218500 };
const MAP_CONTAINER_STYLE = { width: '100%', height: '280px', borderRadius: 8 };
const MAP_LIBRARIES: 'marker'[] = ['marker'];

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
// Advanced Markers require a Map ID. Google's public demo ID works for development;
// set NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID to a real one (Cloud Console > Maps > Map Management) for production.
const GOOGLE_MAPS_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID';

export interface LocationPickerMapProps {
  coordinates: { lat: number; lng: number } | null;
  onLocationSelect: (address: string, coords: { lat: number; lng: number }) => void;
}

function LocationMarker({
  map,
  position,
}: {
  map: google.maps.Map | null;
  position: { lat: number; lng: number } | null;
}) {
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(() => {
    if (!map) return;
    const marker = new google.maps.marker.AdvancedMarkerElement({ map });
    markerRef.current = marker;
    return () => {
      marker.map = null;
      markerRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.position = position ?? null;
    }
  }, [position]);

  return null;
}

export function LocationPickerMap({ coordinates, onLocationSelect }: LocationPickerMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-location-picker',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: MAP_LIBRARIES,
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [geocodeError, setGeocodeError] = useState('');

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      if (lat === undefined || lng === undefined) return;

      setGeocodeError('');

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          onLocationSelect(results[0].formatted_address, { lat, lng });
        } else {
          console.error('Geocoder failed with status:', status);
          setGeocodeError(`Could not resolve an address for this point (${status}). Coordinates were saved instead.`);
          onLocationSelect(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, { lat, lng });
        }
      });
    },
    [onLocationSelect]
  );

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the map location picker.
      </Alert>
    );
  }

  if (loadError) {
    return <Alert severity="error" sx={{ mt: 1 }}>Failed to load Google Maps.</Alert>;
  }

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
        Click on the map to pin the incident location
      </Typography>
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={coordinates ?? DEFAULT_CENTER}
        zoom={coordinates ? 15 : 12}
        options={{ mapId: GOOGLE_MAPS_MAP_ID }}
        onClick={handleMapClick}
        onLoad={setMap}
      >
        <LocationMarker map={map} position={coordinates} />
      </GoogleMap>
      {geocodeError && (
        <Alert severity="warning" sx={{ mt: 1 }}>
          {geocodeError}
        </Alert>
      )}
    </Box>
  );
}
