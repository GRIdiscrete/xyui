/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
'use client'

import { mapItem, Point} from "@/types.db";
//Map component Component from library
import { GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";
import { useState } from "react";

//Map's styling
export const defaultMapContainerStyle = {
    width: '100%',
    height: '100vh',
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
    { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#81C784" }] }, // Light green for railways
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#5d9e6f" }] }, // Dark green for roads
    { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#d7dbd8" }] }, // Light grey for land
    { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#ffffff" }] }, // Dark grey for ocean
    { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#81C784" }] } // Dark green for areas of significance
  ]
};
interface dataProps {
  data: mapItem[]
}
const defaultMapCenter = {
  lat: -17.8237,
  lng: 31.0509
};

const MapComponent = ({data}: dataProps) => {
  const [selectedPoint, setSelectedPoint] : any = useState();

    return (
      <div className="w-full">
        <LoadScript googleMapsApiKey="AIzaSyDpli1UvuqODlCd-NBLs0hw-4G9a6kbzHo">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={defaultMapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
      >
        {
          data.map((point) => {
            const atte: Point[] = point.points as Point[]

            const positions = atte.map((item) => {
              return {
                  lat: parseFloat(item.latitude),
                  lng: parseFloat(item.longitude)
              };
            });

             
              return positions.map((position, index) => (
                <Marker
                  key={index}
                  position={position}
                  onClick={() => setSelectedPoint(point)}
                >
                  {selectedPoint === point && (
                    <InfoWindow onCloseClick={() => setSelectedPoint(null)}>
                      <div className="text-sm">
                        <h3 className="font-bold mb-2">{point.name}</h3>
                        <p><strong>Category:</strong> {point.category}</p>
                        <p><strong>Sub Category:</strong> {point.sub_cat}</p>
                        <p><strong>Location:</strong> {point.location}</p>
                        {point.qbar && (
                          <img 
                            src={point.qbar} 
                            alt="QR Code" 
                            className="mt-2 w-24 h-24"
                          />
                        )}
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              )
            )

            
          })
        }
      </GoogleMap></LoadScript>
    </div>
    )
};

export { MapComponent };