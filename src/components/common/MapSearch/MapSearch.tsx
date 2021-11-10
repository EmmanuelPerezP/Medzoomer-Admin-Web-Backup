import React, { useState } from 'react';

import { DestructByKey } from '../../../interfaces';
import FormControl from '@material-ui/core/FormControl';
import GoogleMapLoader from 'react-google-maps-loader';
import GooglePlacesSuggest from 'react-google-places-suggest';
import InputAdornment from '@material-ui/core/InputAdornment';
import SVGIcon from '../SVGIcon';
import TextField from '../TextField';
import parseGooglePlace from 'parse-google-place';
import { useStores } from '../../../store';

export const MapSearch = ({
  handleClearError,
  setError,
  err,
  setAddressError=()=>{return}
}: {
  handleClearError: any;
  setError: any;
  err: any;
  addressError: any;
  setAddressError?: any;
}) => {
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
      setAddressError(true);
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
    setAddressError(false);
    const locationAddress = getLocation(geocodedPrediction.geometry.location);
    handleChangeAddress(
      geocodedPrediction.formatted_address,
      locationAddress.longitude,
      locationAddress.latitude,
      geocodedPrediction.address_components
    );
  };

  const handleChangeLocation = (e: React.ChangeEvent<{ value: string }>) => {
    setAddressError(true);
    setLocation(e.target.value);
    pharmacyStore.set('newPharmacy')({ ...pharmacyStore.get('newPharmacy'), roughAddress: e.target.value });
    setError({ ...err, roughAddress: 'Address is not valid' });
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
                label={'Full Address'}
                inputProps={{
                  placeholder: 'Required',
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
