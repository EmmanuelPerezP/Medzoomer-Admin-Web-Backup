import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
// import { Map, GoogleApiWrapper } from 'google-maps-react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

import { containerStyle, centerCoords } from './utils';
import { IMapDirectionProps } from './types';
import Loading from '../Loading';

const MapContainer: FC<IMapDirectionProps> = ({ waypoints }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY || '',
    language: 'en'
  });

  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>({
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true

    // disableDefaultUI: true
  });

  const [map, setMap] = useState<google.maps.Map<Element> | null>(null);

  const [center, setCenter] = useState(centerCoords);

  const setDefaultMapOptions = () => {
    setMapOptions({
      ...mapOptions,
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      }
    });
  };

  const onLoad = useCallback(
    (newMap: google.maps.Map<Element>) => {
      setDefaultMapOptions();
      const centeredBound = (waypoints[0] && waypoints[0].coords) || centerCoords;
      const bounds = new window.google.maps.LatLngBounds(centeredBound);
      // tslint:disable-next-line:no-console
      console.log('GOOGLE_MAPS', { GOOGLE_MAPS: window.google.maps });
      newMap.fitBounds(bounds);
      // tslint:disable-next-line:no-console
      console.log('map', { newMap, bounds });
      setMap(newMap);
    },
    [setMap, waypoints]
  );

  const onUnmount = useCallback(
    (unmountedMap) => {
      // tslint:disable-next-line:no-console
      console.log('Unmounted map', { unmountedMap });
      setMap(null);
    },
    [setMap]
  );

  useEffect(() => {
    // tslint:disable-next-line:no-console
    loadError && console.log('Load map error ', { loadError });
  }, [loadError]);

  useEffect(() => {
    if (map) {
      // tslint:disable-next-line:no-console
      console.log('map', { map });
      setTimeout(() => map.setZoom(15), 1000);
    }
  }, [map]);

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        mapTypeId="terrain"
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {waypoints.map((point, index) => (
          <Marker key={index} position={point.coords} />
        ))}
      </GoogleMap>
    </>
  ) : (
    <Loading />
  );
};

export default MapContainer;
