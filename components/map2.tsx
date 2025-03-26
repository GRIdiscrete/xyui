'use client'

import { mapItem, Point } from "@/types.db";
import { GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";
import { useState, useEffect } from "react";

export const defaultMapContainerStyle = {
    width: '100%',
    height: '50vh',
    borderRadius: '15px 0px 0px 15px',
};

const defaultMapZoom = 14;

const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: 'auto',
  mapTypeId: 'roadmap',
  styles: [
    { "featureType": "all", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
    { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] },
    { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#81C784" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#5d9e6f" }] },
    { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#d7dbd8" }] },
    { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#81C784" }] }
  ]
};

const defaultMapCenter = {
  lat: -17.8237,
  lng: 31.0509
};

const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const MapComponent2 = ({ data }: { data: mapItem[] }) => {
  const [selectedPoint, setSelectedPoint] = useState<mapItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filteredPoints, setFilteredPoints] = useState<Array<{ point: Point; parentItem: mapItem }>>([]);
  const [mapCenter, setMapCenter] = useState(defaultMapCenter);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        setSearchLocation({ lat, lng });
        setMapCenter({ lat, lng });

        const allPoints = data.flatMap(mapItem =>
          mapItem.points.map(point => ({
            point,
            parentItem: mapItem,
          }))
        );

        const pointsWithDistance = allPoints.map(({ point, parentItem }) => {
          const pointLat = parseFloat(point.latitude);
          const pointLng = parseFloat(point.longitude);
          const distance = getDistance(lat, lng, pointLat, pointLng);
          return { point, parentItem, distance };
        });

        const nearest = pointsWithDistance
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 10)
          .map(({ distance, ...rest }) => rest);

        setFilteredPoints(nearest);
      } else {
        alert('Could not find the location. Please try another search.');
      }
    });
  };

  useEffect(() => {
    if (data && searchLocation) {
      const allPoints = data.flatMap(mapItem =>
        mapItem.points.map(point => ({
          point,
          parentItem: mapItem,
        }))
      );

      const pointsWithDistance = allPoints.map(({ point, parentItem }) => {
        const pointLat = parseFloat(point.latitude);
        const pointLng = parseFloat(point.longitude);
        const distance = getDistance(searchLocation.lat, searchLocation.lng, pointLat, pointLng);
        return { point, parentItem, distance };
      });

      const nearest = pointsWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10)
        .map(({ distance, ...rest }) => rest);

      setFilteredPoints(nearest);
    }
  }, [data, searchLocation]);

  const getPointsToDisplay = () => {
    if (searchLocation) {
      return filteredPoints;
    } else {
      return data.flatMap(mapItem =>
        mapItem.points.map(point => ({
          point,
          parentItem: mapItem,
        }))
      );
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="absolute top-4 right-4 z-10 bg-white p-2 rounded shadow flex">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded"
          placeholder="Search for a place..."
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
          Search
        </button>
        {searchLocation && (
          <button
            type="button"
            onClick={() => {
              setSearchLocation(null);
              setSearchQuery('');
              setMapCenter(defaultMapCenter);
            }}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Clear
          </button>
        )}
      </form>
      <div className="w-full mb-4">


          <GoogleMap
          
            mapContainerStyle={defaultMapContainerStyle}
            center={mapCenter}
            zoom={defaultMapZoom}
            options={defaultMapOptions}
          >
            {getPointsToDisplay().map(({ point, parentItem }, index) => {
              const position = {
                lat: parseFloat(point.latitude),
                lng: parseFloat(point.longitude)
              };
              return (
                <Marker
                  key={index}
                  position={position}
                  onClick={() => setSelectedPoint(parentItem)}
                >
                  {selectedPoint === parentItem && (
                    <InfoWindow onCloseClick={() => setSelectedPoint(null)}>
                      <div className="p-4 text-sm bg-white shadow-md rounded-lg">
                        <h3 className="font-bold text-lg mb-2 text-blue-600">{parentItem.name}</h3>
                        <div className="space-y-1">
                          <p className="text-gray-700">
                            <span className="font-semibold">Category:</span> {parentItem.category}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Sub Category:</span> {parentItem.sub_cat}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Location:</span> {parentItem.location}
                          </p>
                        </div>
                        {parentItem.qbar && (
                          <div className="mt-4">
                            <img
                              src={parentItem.qbar}
                              alt="QR Code"
                              className="w-24 h-24 mx-auto rounded border border-gray-300"
                            />
                          </div>
                        )}
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              );
            })}
          </GoogleMap>
   
      </div>
    </div>
  );
};

export { MapComponent2 };