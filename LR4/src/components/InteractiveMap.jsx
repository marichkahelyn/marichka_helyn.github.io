import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const customMarkerIcon = L.divIcon({
  className: 'map-marker', 
  iconSize: [15, 15], 
  iconAnchor: [9, 9] 
});

export default function InteractiveMap({ places, onHover }) {
  const position = [48.37, 20.16];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer 
        center={position} 
        zoom={4} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {places.map((place) => (
          <Marker 
            key={place.id} 
            position={[place.lat, place.lng]}
            icon={customMarkerIcon}
            eventHandlers={{
              mouseover: () => {
                onHover(place);
              },
              mouseout: () => {
                onHover(null);
              },
            }}
          >
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}