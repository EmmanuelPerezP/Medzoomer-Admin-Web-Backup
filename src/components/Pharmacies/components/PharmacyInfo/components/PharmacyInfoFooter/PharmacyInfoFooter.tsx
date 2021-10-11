import { Button, Typography } from '@material-ui/core';
import React, { FC } from 'react';

import styles from './styles.module.sass';

interface IPharmacyInfoFooter {
  isRequestLoading: any;
  handleUpdatePharmacy: any;
  addressError?: boolean;
}

const PharmacyInfoFooter: FC<IPharmacyInfoFooter> = ({ isRequestLoading, handleUpdatePharmacy, addressError }) => (
  <div className={styles.buttons}>
    <Button
      className={styles.changeStepButton}
      variant="contained"
      disabled={isRequestLoading || addressError}
      color="secondary"
      onClick={handleUpdatePharmacy}
    >
      <Typography className={styles.summaryText}>Update</Typography>
    </Button>
  </div>
);

export default PharmacyInfoFooter;
