import React, { useState } from 'react';
import GooglePlacesSuggest from 'react-google-places-suggest';
import GoogleMapLoader from 'react-google-maps-loader';
import parseGooglePlace from 'parse-google-place';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';

import { useStores } from '../../../store';
import { DestructByKey } from '../../../interfaces';
import SVGIcon from '../SVGIcon';
import TextField from '../TextField';

export const MapSearch = ({ handleClearError, setError, err }: { handleClearError: any; setError: any; err: any }) => {
  const { pharmacyStore } = useStores();
  const [location, setLocation] = useState('');

  const handleChangeAddress = (roughAddress: string, longitude: string, latitude: string, addressComponents: any) => {
    const address = parseGooglePlace({ address_components: addressComponents });
    const parsedAddress: DestructByKey<any> = {
      state: address.stateLong || '',
      country: address.countryLong || '',
      city: address.city || '',
      street: address.streetName || '',
      number: address.streetNumber || '',
      postalCode: address.zipCode || ''
    };
    if (Object.keys(parsedAddress).filter((e) => !parsedAddress[e]).length) {
      setError({ ...err, roughAddress: 'Address is not valid' });
    }
    pharmacyStore.set('newPharmacy')({
      ...pharmacyStore.get('newPharmacy'),
      roughAddress,
      roughAddressObj: {
        ...parsedAddress,
        apartment: ''
      },
      longitude,
      latitude
    });
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
    handleChangeAddress(
      geocodedPrediction.formatted_address,
      locationAddress.longitude,
      locationAddress.latitude,
      geocodedPrediction.address_components
    );
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
              <TextField
                label={'Full Address *'}
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
