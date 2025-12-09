import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { Navigation, Zap } from 'lucide-react';
import gsap from 'gsap';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '1rem',
    overflow: 'hidden'
};

const defaultCenter = {
    lat: 12.9716, // Bangalore (Tech Hub)
    lng: 77.5946
};

const premiumDarkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#1e293b" }] }, // Slate-800
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] }, // Slate-400
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#cbd5e1" }] }, // Slate-300
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] }, // Slate-500
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#334155" }] }, // Slate-700
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1e293b" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#475569" }] }, // Slate-600
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1e293b" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
    { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f172a" }] }, // Slate-900
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
    { featureType: "poi", stylers: [{ visibility: "simplified" }] }
];

const MapComponent = ({ onLocationSelect, selectedLocation, competitors = [] }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
    });

    const [map, setMap] = useState(null);
    const animationLayerRef = useRef(null);

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    const handleMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        onLocationSelect({ lat, lng });
    };

    if (!isLoaded) return (
        <div className="h-full w-full bg-slate-900 rounded-xl animate-pulse flex flex-col items-center justify-center text-slate-500 border border-slate-800">
            <Zap className="w-8 h-8 mb-4 animate-bounce text-blue-500" />
            <span className="font-mono text-sm">Initializing Satellite Data...</span>
        </div>
    );

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={selectedLocation || defaultCenter}
                zoom={14}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleMapClick}
                options={{
                    disableDefaultUI: true,
                    zoomControl: false,
                    styles: premiumDarkMapStyle,
                    streetViewControl: false,
                    mapTypeControl: false,
                }}
            >
                {/* User Pin - BLUE */}
                {selectedLocation && (
                    <>
                        <Marker
                            position={selectedLocation}
                            icon={{
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: "#3B82F6", // Blue-500
                                fillOpacity: 1,
                                strokeColor: "#ffffff",
                                strokeWeight: 3,
                            }}
                            zIndex={100}
                        />
                        {/* Radius Overlay */}
                        <Circle
                            center={selectedLocation}
                            radius={1500} // 1.5km Analysis Radius
                            options={{
                                strokeColor: "#3B82F6",
                                strokeOpacity: 0.5,
                                strokeWeight: 1,
                                fillColor: "#3B82F6",
                                fillOpacity: 0.15,
                                clickable: false,
                            }}
                        />
                    </>
                )}

                {/* Competitor Pins - RED */}
                {competitors.map((comp, idx) => {
                    // Handle structure variation (Google Places Result vs Mock)
                    // Google Places stores location in geometry.location (dict or object)
                    // Our mock services.py flattens it sometimes or passes raw.
                    // We need to be robust. 
                    // From services.py: "location": {"lat": ..., "lng": ...} OR from Gmaps "geometry": {"location": {lat:.., lng:..}}

                    let position = { lat: 0, lng: 0 };

                    // Logic to extract lat/lng safely
                    if (comp.location && typeof comp.location.lat === 'number') {
                        position = comp.location;
                    } else if (comp.location && typeof comp.location.lat === 'function') {
                        position = { lat: comp.location.lat(), lng: comp.location.lng() };
                    } else if (comp.geometry && comp.geometry.location) {
                        position = comp.geometry.location;
                    }

                    return (
                        <Marker
                            key={idx}
                            position={position}
                            icon={{
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 6,
                                fillColor: "#EF4444", // Red-500
                                fillOpacity: 1,
                                strokeColor: "#ffffff",
                                strokeWeight: 1,
                            }}
                            title={comp.name || "Competitor"}
                        />
                    );
                })}

            </GoogleMap>

            {/* Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <button
                    onClick={() => {
                        if (map && selectedLocation) map.panTo(selectedLocation);
                        else if (map) map.panTo(defaultCenter);
                    }}
                    className="p-2.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-blue-500 hover:text-white transition-all shadow-lg"
                >
                    <Navigation className="w-5 h-5" />
                </button>
            </div>

            {/* Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-20 flex gap-4 px-4 py-2 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-slate-300">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white/20"></span>
                    <span>Your Location</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-white/20"></span>
                    <span>Competitors</span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(MapComponent);
