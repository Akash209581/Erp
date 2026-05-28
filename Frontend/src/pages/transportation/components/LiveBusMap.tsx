import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { io, Socket } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom bus icon
const busIcon = L.divIcon({
  html: `<div style="background-color: #1e3a8a; color: white; padding: 5px; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18 11h-12c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h6v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h1c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-10 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm8 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-5h-12v-2h12v2zm-12-8h12c1.1 0 2 .9 2 2s-.9 2-2 2h-12c-1.1 0-2-.9-2-2s.9-2 2-2z"/>
            </svg>
         </div>`,
  className: 'custom-bus-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

interface LiveBusMapProps {
  busId: number;
  busNumber: string;
  isBirdEye?: boolean;
}

const RecenterMap = ({ lat, lng }: { lat: number, lng: number }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], 15);
        }
    }, [lat, lng, map]);
    return null;
};

const LiveBusMap: React.FC<LiveBusMapProps> = ({ busId, busNumber, isBirdEye = false }) => {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [allLocations, setAllLocations] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const API_BASE = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000';
  const isNgrok = (() => {
    try {
      return /ngrok\.(io|free\.app|free\.dev)$/i.test(new URL(API_BASE).hostname);
    } catch {
      return false;
    }
  })();
  const fetchOptions = isNgrok ? { headers: { 'ngrok-skip-browser-warning': 'true' } } : undefined;
  const socketQuery = isNgrok ? { 'ngrok-skip-browser-warning': 'true' } : undefined;

  useEffect(() => {
    // Initial fetch
    const fetchInitialLocations = async () => {
      try {
        if (isBirdEye) {
          const res = await fetch(`${API_BASE}/transport/locations`, fetchOptions);
          const data = await res.json();
          setAllLocations(data.data);
        } else {
          // Use busNumber to get initial location
          const res = await fetch(`${API_BASE}/transport/location/bus/${busNumber}`, fetchOptions);
          const data = await res.json();
          if (data.data && data.data.latitude && data.data.longitude) {
            const lat = parseFloat(data.data.latitude);
            const lng = parseFloat(data.data.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
              setLocation({ lat, lng });
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch initial bus location', err);
      }
    };

    fetchInitialLocations();

    // Setup Socket.IO for real-time updates with bypass header
    socketRef.current = io(API_BASE, {
      transports: ['websocket', 'polling'],
      query: socketQuery,
      extraHeaders: {
        "bypass-tunnel-reminder": "true"
      }
    });
    
    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket for live map');
    });

    socketRef.current.on('bus_location_update', (payload: any) => {
      // payload: { bus_number, latitude, longitude, updated_at }
      const lat = parseFloat(payload.latitude);
      const lng = parseFloat(payload.longitude);

      if (isBirdEye) {
        setAllLocations(prev => {
          const existingIndex = prev.findIndex(loc => loc.bus_number === payload.bus_number || loc.bus_id === payload.bus_id);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = { ...updated[existingIndex], latitude: lat, longitude: lng, updated_at: payload.updated_at };
            return updated;
          } else {
            return [...prev, { bus_number: payload.bus_number, latitude: lat, longitude: lng, updated_at: payload.updated_at, bus_id: payload.bus_id }];
          }
        });
      } else {
        if (payload.bus_number === busNumber) {
          setLocation({ lat, lng });
        }
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [busId, busNumber, isBirdEye]);

  // Default center if no location yet
  const center: [number, number] = [16.2345, 80.4567]; // Guntur/Vignan area

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {isBirdEye ? (
            allLocations
              .filter(loc => !isNaN(parseFloat(loc.latitude)) && !isNaN(parseFloat(loc.longitude)))
              .map((loc, idx) => (
                <Marker key={loc.bus_id || loc.bus_number || idx} position={[parseFloat(loc.latitude), parseFloat(loc.longitude)]} icon={busIcon}>
                    <Popup>
                        Bus Number: {loc.bus_number || loc.bus_id} <br />
                        Last Updated: {loc.updated_at ? new Date(loc.updated_at).toLocaleTimeString() : 'Never'}
                    </Popup>
                </Marker>
            ))
        ) : (
            location && !isNaN(location.lat) && !isNaN(location.lng) && (
                <>
                    <Marker position={[location.lat, location.lng]} icon={busIcon}>
                        <Popup>
                            Bus {busNumber} is here!
                        </Popup>
                    </Marker>
                    <RecenterMap lat={location.lat} lng={location.lng} />
                </>
            )
        )}
      </MapContainer>
    </div>
  );
};

export default LiveBusMap;
