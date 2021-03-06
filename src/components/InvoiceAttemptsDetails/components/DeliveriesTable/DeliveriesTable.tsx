import { Typography } from '@material-ui/core';
import classNames from 'classnames';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { IDeliveriesTable } from './types';
import styles from './DeliveriesTable.module.sass';
import moment from 'moment';

export const DeliveriesTable: FC<IDeliveriesTable> = ({ deliveries = [] }) => {
  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={classNames(styles.single, styles.leftAligned)}>Order ID</div>
        <div className={styles.group}>Delivery Date</div>
        <div className={styles.group}>Total Distance</div>
        <div className={styles.group}>Invoice Amount</div>
      </div>
      {(deliveries || []).length
        ? deliveries.map((delivery) => {
            const deliveryDate =
              delivery.completionDetails && delivery.completionDetails.events && delivery.completionDetails.events[1]
                ? moment(new Date(delivery.completionDetails.events[1].time)).format('MM/DD/YYYY HH:mm')
                : moment(new Date(delivery.createdAt)).format('MM/DD/YYYY HH:mm');
            const totalDistance =
              delivery.completionDetails && delivery.completionDetails.distance
                ? delivery.completionDetails.distance
                : delivery.distToPharmacy;
            const amount = delivery.income && delivery.income.amount ? Number(delivery.income.amount).toFixed(2) : null;

            return (
              <div key={delivery._id} className={styles.tableItem}>
                <div className={classNames(styles.single, styles.leftAligned)}>
                  <Link
                    to={
                      delivery.type === 'RETURN_CASH'
                        ? `/dashboard/deliveries/task/${delivery._id}`
                        : `/dashboard/orders/${delivery.order}`
                    }
                    className={styles.link}
                  >
                    {delivery && delivery.type === 'RETURN_CASH' ? 'Return Cash' : delivery.order_uuid}
                  </Link>
                </div>

                <div className={styles.group}>
                  <Typography className={styles.value}>{deliveryDate}</Typography>
                </div>

                <div className={styles.group}>
                  <Typography className={styles.value}>{`${totalDistance} mi`}</Typography>
                </div>

                <div className={styles.group}>
                  <Typography className={styles.valueBold}>{amount ? `$${amount}` : '-'}</Typography>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};
