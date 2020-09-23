import React, { useState, useEffect } from 'react';
import { Map, Polygon, GoogleApiWrapper } from 'google-maps-react';

const styleGoogleMap = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#212121'
      }
    ]
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575'
      }
    ]
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#212121'
      }
    ]
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#757575'
      }
    ]
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e'
      }
    ]
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd'
      }
    ]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575'
      }
    ]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#181818'
      }
    ]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161'
      }
    ]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1b1b1b'
      }
    ]
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#2c2c2c'
      }
    ]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8a8a8a'
      }
    ]
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#373737'
      }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#3c3c3c'
      }
    ]
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#4e4e4e'
      }
    ]
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161'
      }
    ]
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575'
      }
    ]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000'
      }
    ]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3d3d3d'
      }
    ]
  }
];

const MapContainer = (props: any) => {
  const [polygons, setPolygons] = useState([]);
  const { geoJson } = props;

  useEffect(() => {
    try {
      const geoJsonNor = JSON.parse(geoJson);
      const polygonsTemp = [];
      if (geoJsonNor.features.length > 0) {
        // tslint:disable-next-line:forin
        for (const i in geoJsonNor.features) {
          const feature = geoJsonNor.features[i];
          if (feature.geometry && feature.geometry.type === 'Polygon') {
            const coordinateNewPolygon = [];
            // tslint:disable-next-line:forin
            for (const g in feature.geometry.coordinates[0]) {
              coordinateNewPolygon.push({
                lat: feature.geometry.coordinates[0][g][1],
                lng: feature.geometry.coordinates[0][g][0]
              });
            }
            polygonsTemp.push({
              paths: coordinateNewPolygon,
              strokeColor: feature.properties.stroke,
              strokeOpacity: feature.properties['stroke-opacity'],
              strokeWeight: feature.properties['stroke-width'],
              fillColor: feature.properties.fill,
              fillOpacity: feature.properties['fill-opacity']
            });
          }
        }
        // @ts-ignore
        setPolygons(polygonsTemp);
      }
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
    }
  }, [geoJson]);

  // @ts-ignore
  return (
    // @ts-ignore
    <Map
      style={props.style}
      google={props.google}
      zoom={7}
      styles={styleGoogleMap}
      clickableIcons={false}
      fullscreenControl={false}
      streetViewControl={false}
      mapTypeControl={false}
      draggableCursor={false}
      initialCenter={{
        lat: 27.503230262977006,
        lng: -80.80129333483394
      }}
    >
      {polygons.length > 0 &&
        polygons.map((item) => {
          return (
            // tslint:disable-next-line:jsx-key
            <Polygon {...item} />
          );
        })}
    </Map>
  );
};

// @ts-ignore
export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_KEY
})(MapContainer);
