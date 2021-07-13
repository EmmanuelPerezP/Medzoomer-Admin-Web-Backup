import { Typography } from '@material-ui/core';
import classNames from 'classnames';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { IPharmacyGroupTable } from './types';
import styles from './PharmacyGroupTable.module.sass';

const data = [
  // TODO - remove that
  {
    _id: '1',
    pharmacy: 'Duane Reade Pharmacy',
    address: '2919 Center Ave, New York',
    totalDelivery: '2',
    invoiceAmount: 12.2121
  },
  {
    _id: '2',
    pharmacy: 'Duasdane Reade Pharmacy',
    address: '2911 Center Ave, New York',
    totalDelivery: '2',
    invoiceAmount: 15.2121
  }
];

export const PharmacyGroupTable: FC<IPharmacyGroupTable> = ({ pharmacies = [] }) => {
  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={classNames(styles.group, styles.leftAligned)}>Pharmacy</div>
        <div className={classNames(styles.group, styles.leftAligned)}>Address</div>
        <div className={styles.single}>Total Delivery</div>
        <div className={styles.single}>Invoice Amount</div>
      </div>
      {(data || []).length // TODO - replace data with pharmacies
        ? data.map((delivery) => {
            return (
              <div key={delivery._id} className={styles.tableItem}>
                <div className={classNames(styles.group, styles.leftAligned)}>
                  <Link to={'—'} className={styles.link}>
                    {delivery.pharmacy}
                  </Link>
                </div>

                <div className={classNames(styles.group, styles.leftAligned)}>
                  <Typography className={styles.value}>{delivery.address}</Typography>
                </div>

                <div className={styles.single}>
                  <Typography className={styles.value}>{delivery.totalDelivery}</Typography>
                </div>

                <div className={styles.single}>
                  <Typography className={styles.value}>${Number(delivery.invoiceAmount).toFixed(2)}</Typography>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};
