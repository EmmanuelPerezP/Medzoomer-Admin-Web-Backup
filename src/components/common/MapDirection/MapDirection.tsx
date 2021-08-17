import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
// import { Map, GoogleApiWrapper } from 'google-maps-react'
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

import { containerStyle, centerCoords } from './utils';
import { Coords, IMapDirectionProps, TravelModes } from './types';
import Loading from '../Loading';
import { Marker } from './Marker';

// @ts-ignore
const travelMode: google.maps.TravelMode = 'DRIVING' as TravelModes;

const MapContainer: FC<IMapDirectionProps> = ({ waypoints: points }) => {
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

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const [map, setMap] = useState<google.maps.Map<Element> | null>(null);

  const [center, setCenter] = useState(centerCoords);

  const [origin, destination, waypoints] = useMemo(() => {
    if (points.length) {
      let originCoords: Coords | null = null;
      let destinationCoords: Coords | null = null;
      let waypointsCoords: google.maps.DirectionsWaypoint[] = [];

      originCoords = points[0].coords;

      if (points.length > 1) {
        destinationCoords = points[points.length === 2 ? 1 : points.length - 1].coords;
      }

      if (points.length > 2) {
        // @ts-ignore
        waypointsCoords = points.slice(1, points.length - 1).map((point) => ({
          location: {
            lat: point.coords.lat,
            lng: point.coords.lng
          }
        }));
      }
      return [originCoords, destinationCoords, waypointsCoords];
    }

    return [null, null, [] as google.maps.DirectionsWaypoint[]];
  }, [points]);

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
      const centeredBound = (points[0] && points[0].coords) || centerCoords;
      const bounds = new window.google.maps.LatLngBounds(centeredBound);
      // tslint:disable-next-line:no-console
      console.log('GOOGLE_MAPS', { GOOGLE_MAPS: window.google.maps });
      newMap.fitBounds(bounds);
      // tslint:disable-next-line:no-console
      console.log('map', { newMap, bounds });
      setMap(newMap);
    },
    [setMap, points]
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

  const onGettingDirectionResult = (
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (response !== null && status === 'OK') {
      setDirections(response);
    } else {
      console.error('onGettingDirectionResult.error()', { response, status });
    }
  };

  const onLoadDirection = (e: google.maps.DirectionsService) => {
    // console.info('onLoad Direction', { e });
  };

  const renderDirection = () => {
    if (points && points.length) {
      return (
        <>
          <DirectionsService
            options={{
              origin: origin || undefined,
              ...(waypoints.length ? { waypoints } : {}),
              destination: destination || undefined,
              travelMode
            }}
            callback={onGettingDirectionResult}
            onLoad={onLoadDirection}
          />
          {directions && <DirectionsRenderer options={{ directions }} />}
        </>
      );
    } else return null;
  };

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
        {/* {points.map((point, index) => (
          <Marker key={index} point={point} />
        ))} */}
        {renderDirection()}
      </GoogleMap>
    </>
  ) : (
    <Loading />
  );
};

export default MapContainer;
