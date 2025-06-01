import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

export default function LocationSelector({
  onLocationSelect,
  initialValue = "",
}) {
  const [address, setAddress] = useState(initialValue);
  const [position, setPosition] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // 🔁 Reverse geocode when marker is clicked
  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      if (data?.display_name) {
        setAddress(data.display_name);
        onLocationSelect({
          address: data.display_name,
          coordinates: { lat, lng: lon },
        });
      }
    } catch (err) {
      console.error("Reverse geocoding failed", err);
    }
  };

  // 📍 Handle map click
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition(e.latlng);
        reverseGeocode(lat, lng);
      },
    });

    return position ? <Marker position={position} /> : null;
  };

  // 🔍 Fetch address suggestions as user types
  const handleAddressChange = async (e) => {
    const value = e.target.value;
    setAddress(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          value
        )}&limit=5&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "FixMyCityApp/1.0 (fixmycity@example.com)",
          },
        }
      );

      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Autocomplete error:", err);
      setSuggestions([]);
    }
  };

  // 📌 When user clicks a suggestion
  const handleSuggestionClick = (place) => {
    const { display_name, lat, lon } = place;
    setAddress(display_name);
    setSuggestions([]);
    const coords = { lat: parseFloat(lat), lng: parseFloat(lon) };
    setPosition(coords);
    onLocationSelect({ address: display_name, coordinates: coords });
  };

  return (
    <div className="space-y-2">
      {/* Address Search Input */}
      <div className="relative">
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="Enter location or select from map"
          className="w-full p-2 border rounded"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((place) => (
              <li
                key={place.place_id}
                onClick={() => handleSuggestionClick(place)}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Leaflet Map */}
      <div className="h-64 w-full rounded border overflow-hidden">
        <MapContainer
          center={position || [28.6139, 77.209]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <LocationMarker />
        </MapContainer>
      </div>
    </div>
  );
}
