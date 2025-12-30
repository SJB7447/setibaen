import React, { useCallback, useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0.5rem',
};

const defaultCenter = {
    lat: 37.5665, // Seoul
    lng: 126.9780
};

const MapComponent = ({ userLocation, cafes, onCafeSelect }) => {
    const [map, setMap] = useState(null);

    const center = userLocation || defaultCenter;

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    // Update map center when user location changes
    useEffect(() => {
        if (map && userLocation) {
            map.panTo(userLocation);
        }
    }, [map, userLocation]);

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
                disableDefaultUI: true,
                zoomControl: true,
                styles: [
                    {
                        "featureType": "poi.business",
                        "stylers": [{ "visibility": "off" }] // Hide default businesses to reduce clutter
                    }
                ]
            }}
        >
            {/* User Marker */}
            {userLocation && (
                <Marker
                    position={userLocation}
                    icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#4285F4",
                        fillOpacity: 1,
                        strokeColor: "white",
                        strokeWeight: 2,
                    }}
                    title="You are here"
                />
            )}

            {/* Cafe Markers */}
            {cafes.map(cafe => (
                cafe.location && (
                    <Marker
                        key={cafe.id}
                        position={cafe.location}
                        onClick={() => onCafeSelect && onCafeSelect(cafe)}
                        title={cafe.name}
                    />
                )
            ))}
        </GoogleMap>
    );
};

export default React.memo(MapComponent);
