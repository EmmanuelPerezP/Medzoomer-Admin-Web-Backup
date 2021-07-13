import { Typography } from '@material-ui/core';
import classNames from 'classnames';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { IDeliveriesTable } from './types';
import styles from './DeliveriesTable.module.sass';

const data = [
  // TODO - remove that
  {
    _id: '1',
    deliveryId: '123123',
    deliveryDate: '12/05/2020',
    totalDistance: '4.1',
    amount: 12.2121,
    status: 'Completed'
  },
  {
    _id: '2',
    deliveryId: '123e13123',
    deliveryDate: '07/07/2021',
    totalDistance: '4.2',
    amount: 13.2121,
    status: 'Completed'
  }
];

export const DeliveriesTable: FC<IDeliveriesTable> = ({ deliveries = [] }) => {
  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={classNames(styles.single, styles.leftAligned)}>Delivery ID</div>
        <div className={styles.group}>Delivery Date</div>
        <div className={styles.group}>Total Distance</div>
        <div className={styles.group}>Invoice Amount</div>
        <div className={styles.status}>Status</div>
      </div>
      {(data || []).length // TODO - replace data with deliveries
        ? data.map((delivery) => {
            return (
              <div key={delivery._id} className={styles.tableItem}>
                <div className={classNames(styles.single, styles.leftAligned)}>
                  <Link to={'—'} className={styles.link}>
                    {delivery.deliveryId}
                  </Link>
                </div>

                <div className={styles.group}>
                  <Typography className={styles.value}>{delivery.deliveryDate}</Typography>
                </div>

                <div className={styles.group}>
                  <Typography className={styles.value}>{delivery.totalDistance}</Typography>
                </div>

                <div className={styles.group}>
                  <Typography className={styles.value}>${Number(delivery.amount).toFixed(2)}</Typography>
                </div>

                <div className={styles.status}>
                  <div
                    className={classNames(styles.itemStatus, {
                      [styles.completed]: delivery.status === 'Completed'
                    })}
                  />
                  <Typography className={styles.value}>{delivery.status}</Typography>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};
