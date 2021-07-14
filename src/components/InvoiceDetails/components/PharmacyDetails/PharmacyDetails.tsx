import React, { FC } from 'react';
import { IPharmacyDetailsProps } from './types';
import styles from './PharmacyDetails.module.sass';
import { Typography } from '@material-ui/core';

export const PharmacyDetails: FC<IPharmacyDetailsProps> = () => {
  return (
    <div className={styles.container}>
      <Typography className={styles.key}>Address</Typography>
      <Typography className={styles.value}>2919 Center, New York, NY, 30092</Typography>

      <Typography className={styles.key}>Contact Phone</Typography>
      <Typography className={styles.value}>1 (424) 956-5371</Typography>

      <Typography className={styles.key}>Pharmacist</Typography>
      <Typography className={styles.value}>Thanawan Chadee</Typography>
    </div>
  );
};
