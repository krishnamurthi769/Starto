import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Navigation, Zap, Plane } from 'lucide-react';
import gsap from 'gsap';
import { api } from '../services/api'; // Ensure this import exists or use axios directly if api.js is not suitable

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

// Premium "Starto Dark" Map Style
const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
    { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] }
];

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
    { featureType: "poi", stylers: [{ visibility: "simplified" }] } // Keep POIs subtle
];

// Plane Icon SVG Path (Simplified)
const planePath = "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z";

const MapComponent = ({ onLocationSelect, selectedLocation }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
    });

    const [map, setMap] = useState(null);
    const [liveFlights, setLiveFlights] = useState([]);
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

    // Fetch Live Flights
    useEffect(() => {
        const fetchFlights = async () => {
            const center = selectedLocation || defaultCenter;
            try {
                // Determine API URL based on environment/setup. 
                // Assuming proxy set up or direct call if on same domain.
                // Using relative path for now, assuming api.js base URL configuration handles it 
                // OR simpler fetch if needed. here we use the backend route we just made.
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const response = await fetch(`${API_URL}/live-flights?lat=${center.lat}&lng=${center.lng}&radius_km=100`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.flights) {
                        setLiveFlights(data.flights);
                        // console.log("Updated Flights:", data.flights.length);
                    }
                }
            } catch (error) {
                console.error("Flight fetch error:", error);
            }
        };

        // Initial fetch
        if (isLoaded) fetchFlights();

        // Poll every 10 seconds (OpenSky limit)
        const interval = setInterval(fetchFlights, 10000);
        return () => clearInterval(interval);
    }, [selectedLocation, isLoaded]); // Re-fetch if location changes significantly to center new box


    // GSAP Ambient Animations (Clouds/Atmosphere only, no fake planes)
    useEffect(() => {
        if (!animationLayerRef.current) return;

        const ctx = gsap.context(() => {
            // Cloud/Fog Animation (Subtle)
            gsap.to(".map-cloud", {
                x: 100,
                opacity: 0.1,
                duration: 20,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 5
            });

            if (selectedLocation) {
                gsap.fromTo(".radar-pulse",
                    { scale: 0, opacity: 0.8 },
                    { scale: 4, opacity: 0, duration: 2, repeat: -1, ease: "out" }
                );
            }

        }, animationLayerRef);

        return () => ctx.revert();
    }, [selectedLocation]);

    if (!isLoaded) return (
        <div className="h-full w-full bg-slate-900 rounded-xl animate-pulse flex flex-col items-center justify-center text-slate-500 border border-slate-800">
            <Zap className="w-8 h-8 mb-4 animate-bounce text-amber-500" />
            <span className="font-mono text-sm">Initializing Satellites...</span>
        </div>
    );

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">

            {/* Ambient Animation Layer (Pointer Events None) */}
            <div ref={animationLayerRef} className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                {/* Floating "Clouds" / Atmosphere */}
                <div className="map-cloud absolute top-10 left-10 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full"></div>
                <div className="map-cloud absolute bottom-20 right-20 w-48 h-48 bg-purple-500/5 blur-[60px] rounded-full delay-1000"></div>
                {selectedLocation && (
                    <div
                        className="absolute w-8 h-8 bg-amber-500/30 rounded-full radar-pulse"
                        style={{ display: 'none' }} // Hidden in favor of pure marker logic or could be overlay
                    />
                )}
            </div>

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={selectedLocation || defaultCenter}
                zoom={11} // Slight zoom out to see more flights
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
                {/* User Pin */}
                {selectedLocation && (
                    <Marker
                        position={selectedLocation}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: "#F59E0B", // Amber
                            fillOpacity: 1,
                            strokeColor: "#ffffff",
                            strokeWeight: 2,
                        }}
                    />
                )}

                {/* Live Real-Time Flights */}
                {liveFlights.map((flight) => (
                    <Marker
                        key={flight.id}
                        position={{ lat: flight.lat, lng: flight.lng }}
                        icon={{
                            path: planePath,
                            fillColor: "#60A5FA", // Blue-400
                            fillOpacity: 0.9,
                            scale: 1.2,
                            strokeColor: "white",
                            strokeWeight: 1,
                            rotation: flight.heading, // Real-time heading
                            anchor: new google.maps.Point(12, 12) // Center rotation
                        }}
                        title={`Flight ${flight.callsign} (${Math.round(flight.velocity * 3.6)} km/h)`}
                        zIndex={100} // Above roads
                    />
                ))}
            </GoogleMap>

            {/* Custom UI Controls Overlay */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <button
                    onClick={() => {
                        if (map && selectedLocation) map.panTo(selectedLocation);
                        else if (map) map.panTo(defaultCenter);
                    }}
                    className="p-2.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-amber-500 hover:text-black transition-all shadow-lg"
                >
                    <Navigation className="w-5 h-5" />
                </button>
            </div>

            {/* Live Status Badge */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    Live Air Traffic: {liveFlights.length}
                </span>
            </div>

            {/* Scanning Effect Overlay */}
            {!selectedLocation && (
                <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]"></div>
            )}
        </div>
    );
};

export default React.memo(MapComponent);
