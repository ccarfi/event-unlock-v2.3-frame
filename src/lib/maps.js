import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export const MapComponent = ({ lat, lon, zoom }) => {
  const mapRef = useRef(null); // For the map container div

  useEffect(() => {
    if (mapRef.current) {
      const map = L.map(mapRef.current).setView([lat, lon], zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      L.marker([lat, lon]).addTo(map)
        .bindPopup('Your location here')
        .openPopup();
    }
  }, [lat, lon, zoom]); // Reinitialize map if lat, lon, or zoom changes

  return <div id="map" ref={mapRef} style={{ height: '400px', width: '100%' }}></div>;
};
