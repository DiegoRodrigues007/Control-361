import React, { useState, useCallback } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoBox,
} from "@react-google-maps/api";
import type { LocationVehicle } from "@/types/veiculos";
import redTruck from "@/assets/icons/cars-red.png";
import greenTruck from "@/assets/icons/cars-green.png";
import yellowTruck from "@/assets/icons/cars-yellow.png";
import { InfoWindowContent } from "@/components/InfoWindowContent/InfoWindowContent";

const containerStyle = { width: "100%", height: "100%" };
const centerFallback = { lat: -23.55052, lng: -46.633308 };

interface MapaVeiculosProps {
  positions: LocationVehicle[];
}

export const MapaVeiculos: React.FC<MapaVeiculosProps> = ({ positions }) => {
  const apiKey = process.env.VITE_GOOGLE_MAPS_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const handleMarkerClick = useCallback((markerId: string) => {
    setActiveMarker(markerId);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setActiveMarker(null);
  }, []);

  if (loadError) {
    return (
      <p className="text-red-500 text-center py-6">Erro ao carregar o mapa</p>
    );
  }

  if (!isLoaded) {
    return <p className="text-gray-400 text-center py-6">Carregando mapa...</p>;
  }

  const center = positions.length
    ? { lat: positions[0].lat, lng: positions[0].lng }
    : centerFallback;

  const getIconUrl = (ignition: string) => {
    switch (ignition) {
      case "Ligado":
        return greenTruck;
      case "Desligado":
        return redTruck;
      default:
        return yellowTruck;
    }
  };

  return (
    <div className="w-full h-[650px] rounded-2xl border overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        options={{
          disableDefaultUI: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: false,
        }}
      >
        {positions.map((pos) => {
          const { id, equipmentId, lat, lng, ignition } = pos;
          const markerId = `${id}-${equipmentId}`;
          const iconUrl = getIconUrl(ignition);

          return (
            <React.Fragment key={markerId}>
              <Marker
                position={{ lat, lng }}
                icon={{
                  url: iconUrl,
                  scaledSize: new window.google.maps.Size(41, 48),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(20, 48),
                }}
                onClick={() => handleMarkerClick(markerId)}
              />

              {activeMarker === markerId && (
                <InfoBox
                  position={new window.google.maps.LatLng(lat, lng)}
                  options={{
                    closeBoxURL: "",
                    enableEventPropagation: true,
                    pixelOffset: new window.google.maps.Size(-128, -40),
                  }}
                >
                  <InfoWindowContent
                    position={pos}
                    onClose={handleInfoWindowClose}
                  />
                </InfoBox>
              )}
            </React.Fragment>
          );
        })}
      </GoogleMap>
    </div>
  );
};
