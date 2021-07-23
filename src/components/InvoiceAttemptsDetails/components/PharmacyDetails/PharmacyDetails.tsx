import React, { FC } from 'react';
import { IPharmacyDetailsProps } from './types';
import styles from './PharmacyDetails.module.sass';
import { Typography } from '@material-ui/core';

export const PharmacyDetails: FC<IPharmacyDetailsProps> = ({pharmacy}) => {
  // @ts-ignore
  return (
    <div className={styles.container}>
      <Typography className={styles.key}>Address</Typography>
      <Typography className={styles.value}>{pharmacy && pharmacy.address
        // @ts-ignore
        ? `${pharmacy.address.street} ${pharmacy.address.number} ${pharmacy.address.city}, ${pharmacy.address.state}, ${pharmacy.address.postalCode}`
        : '-'}</Typography>

      <Typography className={styles.key}>Contact Phone</Typography>
      <Typography className={styles.value}>{pharmacy.phone_number}</Typography>

      <Typography className={styles.key}>Pharmacist</Typography>
      <Typography className={styles.value}>{pharmacy.name}</Typography>
    </div>
  );
};
