import React, { FC } from 'react';
import { IInvoiceDetailsProps } from './types';
import styles from './InvoiceDetails.module.sass';
import classNames from 'classnames';
import { Typography } from '@material-ui/core';
import { getDateInvoicePeriod } from '../../../../utils';
import Loading from '../../../common/Loading';

export const InvoiceDetails: FC<IInvoiceDetailsProps> = ({ queue, isLoading }) => {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.key}>Queue ID</div>
      <div className={classNames(styles.value, styles.statusContainer)}>
        <Typography className={styles.statusTitle}>{queue.queue_id ? queue.queue_id : ''}</Typography>
      </div>

      <div className={styles.key}>Pharmacy</div>
      <div className={styles.value}>
        <a
          href={
            queue.owner.type === 'group'
              ? `/dashboard/update-group/${queue.owner._id}`
              : `/dashboard/pharmacies/${queue.owner._id}`
          }
          // target="_blank"
          className={styles.link}
        >
          {queue.owner.name}
        </a>
      </div>

      <div className={styles.key}>Billing Contact</div>
      <div className={styles.value}>
        <div className={styles.value}>
          {queue.contactData.fullName}
          {` (${queue.contactData.companyName})`}
        </div>
      </div>

      <div className={styles.key}>Start Date</div>
      <div className={styles.value}>{getDateInvoicePeriod(queue.deliveryStartDateAt)}</div>

      <div className={styles.key}>End Date</div>
      <div className={styles.value}>{getDateInvoicePeriod(queue.deliveryEndDateAt)}</div>

      <div className={styles.key}>Run Date</div>
      <div className={styles.value}>{getDateInvoicePeriod(queue.runDateAt)}</div>
    </div>
  );
};
