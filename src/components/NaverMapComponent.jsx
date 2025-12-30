import React, { useEffect, useRef } from 'react';
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps';

const NaverMapComponent = ({ userLocation, cafes, onCafeSelect }) => {
    const navermaps = useNavermaps();
    const mapRef = useRef(null);

    // Default to Seoul City Hall if user location not available
    const defaultCenter = new navermaps.LatLng(37.5665, 126.9780);
    const center = userLocation
        ? new navermaps.LatLng(userLocation.lat, userLocation.lng)
        : defaultCenter;

    return (
        <MapDiv
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <NaverMap
                defaultCenter={center}
                defaultZoom={15}
                ref={mapRef}
            >
                {/* User Location Marker (Blue) */}
                {userLocation && (
                    <Marker
                        position={new navermaps.LatLng(userLocation.lat, userLocation.lng)}
                        icon={{
                            content: '<div style="background:blue;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.3);"></div>',
                            anchor: new navermaps.Point(6, 6),
                        }}
                    />
                )}

                {/* Cafe Markers */}
                {cafes.map((cafe) => (
                    <Marker
                        key={cafe.id}
                        position={new navermaps.LatLng(cafe.location.lat, cafe.location.lng)}
                        title={cafe.name}
                        onClick={() => onCafeSelect && onCafeSelect(cafe)}
                        animation={2} // DROP animation
                    />
                ))}
            </NaverMap>
        </MapDiv>
    );
};

export default NaverMapComponent;
