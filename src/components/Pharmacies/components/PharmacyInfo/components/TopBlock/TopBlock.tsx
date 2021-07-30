import React, { FC } from 'react';
import classNames from 'classnames';
import { Typography } from '@material-ui/core';
import styles from './styles.module.sass';
import { getAddressString } from '../../../../../../utils';
import { PHARMACY_STATUS } from '../../../../../../constants';

interface ITopBlock {
  pharmacy: any;
}

const TopBlock: FC<ITopBlock> = ({ pharmacy }) => {
  return (
    <div className={styles.wrapper}>
      <Typography className={styles.pharmacyName}>{pharmacy.name}</Typography>
      <Typography className={styles.pharmacyAddress}>{getAddressString(pharmacy.address)}</Typography>
      <div className={styles.status}>
        <span
          className={classNames(styles.statusColor, {
            [styles.verified]: pharmacy.status === PHARMACY_STATUS.VERIFIED,
            [styles.declined]: pharmacy.status === PHARMACY_STATUS.DECLINED,
            [styles.pending]: pharmacy.status === PHARMACY_STATUS.PENDING
          })}
        />
        {pharmacy.status ? `${pharmacy.status.charAt(0).toUpperCase()}${pharmacy.status.slice(1)}` : 'Pending'}
      </div>
      {/* {pharmacy.dayPlannedDeliveryCount && (
        <div className={styles.deliveryCount}>{pharmacy.dayPlannedDeliveryCount} deliveries/day</div>
      )} */}
    </div>
  );
};

export default TopBlock;
