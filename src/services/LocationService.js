
export const LocationService = {
    getCurrentPosition: () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    (error) => {
                        reject(error);
                    }
                );
            }
        });
    },

    // Calculate distance between two points in km (Haversine formula)
    calculateDistance: (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d.toFixed(1);
    },

    searchNearbyCafes: (location, keyword) => {
        return new Promise((resolve, reject) => {
            if (!window.google || !window.google.maps || !window.google.maps.places) {
                reject(new Error('Google Maps API not loaded'));
                return;
            }

            const service = new window.google.maps.places.PlacesService(document.createElement('div'));
            const request = {
                location: new window.google.maps.LatLng(location.lat, location.lng),
                radius: '2000', // 2km
                type: ['cafe'],
                keyword: keyword
            };

            service.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                    const mappedResults = results.map(place => ({
                        id: place.place_id,
                        name: place.name,
                        type: place.types[0]?.replace(/_/g, ' ') || 'Cafe',
                        distance: LocationService.calculateDistance(location.lat, location.lng, place.geometry.location.lat(), place.geometry.location.lng()) + 'km',
                        image: place.photos ? place.photos[0].getUrl({ maxWidth: 600 }) : "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1000",
                        description: place.vicinity,
                        location: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
                        rating: place.rating || 0,
                        reviewCount: place.user_ratings_total || 0,
                        // Add mood/emotion tag in the caller if needed
                    }));
                    resolve(mappedResults);
                } else {
                    reject(new Error(`Places API failed: ${status}`));
                }
            });
        });
    }
};

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
