import React, { useState } from 'react';
import uuid from 'uuid/v4';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import GooglePlacesSuggest from 'react-google-places-suggest';
import GoogleMapLoader from 'react-google-maps-loader';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useStores } from '../../../store';
import SVGIcon from '../SVGIcon';
import TextField from '../TextField';

export const MapSearch = ({ handleClearError }: { handleClearError: any }) => {
  const { pharmacyStore } = useStores();
  const [location, setLocation] = useState('');
  const inputId = `id-${uuid()}`;

  const handleChangeAddress = (roughAddress: string, longitude: string, latitude: string) => {
    pharmacyStore.set('newPharmacy')({ ...pharmacyStore.get('newPharmacy'), roughAddress, longitude, latitude });
  };

  const getLocation = (locationAddress: { lat: () => string; lng: () => string }) => {
    return {
      latitude: locationAddress.lat().toString(),
      longitude: locationAddress.lng().toString()
    };
  };

  const handleSelectSuggest = (geocodedPrediction: any) => {
    setLocation('');
    const locationAddress = getLocation(geocodedPrediction.geometry.location);
    handleChangeAddress(geocodedPrediction.formatted_address, locationAddress.longitude, locationAddress.latitude);
  };

  const handleChangeLocation = (e: React.ChangeEvent<{ value: string }>) => {
    setLocation(e.target.value);
    pharmacyStore.set('newPharmacy')({ ...pharmacyStore.get('newPharmacy'), roughAddress: e.target.value });
    handleClearError();
  };

  return (
    <GoogleMapLoader
      params={{
        key: process.env.REACT_APP_GOOGLE_KEY,
        libraries: 'places'
      }}
      render={(googleMaps: any) =>
        googleMaps && (
          <GooglePlacesSuggest
            googleMaps={googleMaps}
            autocompletionRequest={{
              input: location
            }}
            onSelectSuggest={handleSelectSuggest}
            textNoResults="No results"
          >
            <FormControl style={{ width: '100%', marginBottom: '20px' }}>
              <InputLabel
                shrink
                htmlFor={inputId}
                style={{
                  position: 'relative',
                  transform: 'none',
                  color: '#73738b',
                  fontSize: '14px'
                }}
              >
                Full Address
              </InputLabel>
              <TextField
                inputProps={{
                  placeholder: 'Full Address',
                  endAdornment: (
                    <InputAdornment position="start">
                      <SVGIcon name={'location'} />
                    </InputAdornment>
                  )
                }}
                onChange={handleChangeLocation}
                value={pharmacyStore.get('newPharmacy').roughAddress}
              />
            </FormControl>
          </GooglePlacesSuggest>
        )
      }
    />
  );
};
