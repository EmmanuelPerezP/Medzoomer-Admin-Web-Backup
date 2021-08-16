import React, { FC } from 'react';
import { Marker as MarkerBase } from '@react-google-maps/api';

import { IMarkerProps } from './types';

export const Marker: FC<IMarkerProps> = ({ point: { coords, type } }) => {
  const isPharmacy = type === 'pharmacy';
  const isCustomer = type === 'customer';

  return (
    <MarkerBase position={coords}>
      <div
        style={{
          background: isPharmacy ? '#72ccff' : '#a889ff',
          width: 100,
          height: 100,
          borderRadius: '50%'
        }}
      >
        {type}
      </div>
    </MarkerBase>
  );
};
