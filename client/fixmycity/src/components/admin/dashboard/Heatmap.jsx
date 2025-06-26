import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ✅ VALID GEOJSON MOCK DATA
const zonesGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Central Zone", reports: 120 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.5714, 23.03],
            [72.58, 23.03],
            [72.58, 23.04],
            [72.5714, 23.04],
            [72.5714, 23.03],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "East Zone", reports: 80 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.59, 23.03],
            [72.6, 23.03],
            [72.6, 23.04],
            [72.59, 23.04],
            [72.59, 23.03],
          ],
        ],
      },
    },
  ],
};

const getColor = (count) => {
  return count > 150
    ? "#EF4444"
    : count > 100
    ? "#F59E0B"
    : count > 50
    ? "#3B82F6"
    : "#10B981";
};

export default function Heatmap() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="font-medium mb-4">Reports Heatmap by Zone</h3>
      <div className="h-96">
        <MapContainer
          center={[23.035, 72.585]} // Ahmedabad area
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {zonesGeoJSON.features.map((zone, index) => (
            <GeoJSON
              key={zone.properties.name + index}
              data={zone}
              style={() => ({
                fillColor: getColor(zone.properties.reports),
                weight: 2,
                opacity: 1,
                color: "white",
                fillOpacity: 0.7,
              })}
              onEachFeature={(feature, layer) => {
                layer.bindPopup(
                  `<b>${feature.properties.name}</b><br>${feature.properties.reports} reports`
                );
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
