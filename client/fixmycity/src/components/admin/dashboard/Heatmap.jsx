import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

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
  const [features, setFeatures] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Get dashboard stats from backend (zoneCounts)
        const statsRes = await axios.get(`${API_URL}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const { zoneCounts } = statsRes.data;

        // Step 2: Load the .geojson file from public folder
        const geoRes = await fetch("/data/ahmedabad_zones.geojson");
        const geoData = await geoRes.json();

        // Step 3: Inject report counts into each zone feature
        const enrichedFeatures = geoData.features.map((feature) => {
          const zoneName = feature.properties.zone;
          const reports = zoneCounts[zoneName] || 0;
          return {
            ...feature,
            properties: {
              ...feature.properties,
              reports,
            },
          };
        });

        setFeatures(enrichedFeatures);
      } catch (err) {
        console.error("Error loading heatmap data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="font-medium mb-4">Reports Heatmap by Zone</h3>
      <div className="h-96">
        <MapContainer
          center={[23.035, 72.585]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {features.map((zone, idx) => (
            <GeoJSON
              key={zone.properties.zone + idx}
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
                  `<b>${feature.properties.zone}</b><br>${feature.properties.reports} reports`
                );
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
