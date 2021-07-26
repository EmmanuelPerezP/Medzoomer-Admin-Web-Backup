import { Typography } from '@material-ui/core';
import classNames from 'classnames';
import moment from 'moment';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { IDeliveriesTable } from './types';
import styles from './DeliveriesTable.module.sass';
import Loading from '../../../common/Loading';
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

export const DeliveriesTable: FC<IDeliveriesTable> = ({ attempts = [] }) => {
  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={classNames(styles.single, styles.leftAligned)}>Invoice ID</div>
        <div className={styles.group}>Run Date</div>
        <div className={styles.group}>Total Deliveries</div>
        <div className={styles.group}>Total Price</div>
        <div className={styles.status}>Status</div>
      </div>
      {(attempts || []).length // TODO - replace data with deliveries
        ? attempts.map((attempt) => {
            return (
              <div key={attempt._id} className={styles.tableItem}>
                <div className={classNames(styles.single, styles.leftAligned)}>
                  <Typography className={styles.value}>{attempt.history_id}</Typography>
                </div>

                <div className={styles.group}>
                  <Typography className={styles.value}>{moment(attempt.createdAt).format('DD/MM/YYYY')}</Typography>
                </div>

                <div className={styles.group}>
                  <Typography className={styles.value}>
                    {attempt.deliveryIDCollection.length ? attempt.deliveryIDCollection.length : 0}
                  </Typography>
                </div>

                <div className={styles.group}>
                  <Typography className={styles.value}>{attempt.amount}</Typography>
                </div>

                <div className={styles.status}>
                  <div
                    className={classNames(styles.itemStatus, {
                      [styles.completed]: attempt.status === 'SENT'
                    })}
                  />
                  <Typography className={styles.value}>{attempt.status}</Typography>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};
