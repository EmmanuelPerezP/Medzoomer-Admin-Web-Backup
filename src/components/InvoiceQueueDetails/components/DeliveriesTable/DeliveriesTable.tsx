import { Typography } from '@material-ui/core';
import classNames from 'classnames';
import moment from 'moment';
import React, { FC } from 'react';
import { IDeliveriesTable } from './types';
import styles from './DeliveriesTable.module.sass';

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
      {(attempts || []).length
        ? attempts.map((attempt) => {
            return (
              <div key={attempt._id} className={styles.tableItem}>
                <div className={classNames(styles.single, styles.leftAligned)}>
                  <a
                    href={'/dashboard/invoice_history/' + attempt._id}
                    className={styles.tableLink}
                    // target="_blank"
                  >
                    {attempt.history_id}
                  </a>
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
                  <Typography className={styles.value}>{attempt.amount ? attempt.amount.toFixed(2) : ''}</Typography>
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
