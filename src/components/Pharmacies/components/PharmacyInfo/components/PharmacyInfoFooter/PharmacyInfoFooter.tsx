import React, { FC } from 'react';
import { Typography, Button } from '@material-ui/core';
import styles from './styles.module.sass';

interface IPharmacyInfoFooter {
  isRequestLoading: any;
  handleUpdatePharmacy: any;
}

const PharmacyInfoFooter: FC<IPharmacyInfoFooter> = ({ isRequestLoading, handleUpdatePharmacy }) => (
  <div className={styles.buttons}>
    <Button
      className={styles.changeStepButton}
      variant="contained"
      disabled={isRequestLoading}
      color="secondary"
      onClick={handleUpdatePharmacy}
    >
      <Typography className={styles.summaryText}>Update</Typography>
    </Button>
  </div>
);

export default PharmacyInfoFooter;
