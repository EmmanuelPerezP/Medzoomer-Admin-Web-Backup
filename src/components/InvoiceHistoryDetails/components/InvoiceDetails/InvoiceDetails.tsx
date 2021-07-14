import React, { FC } from 'react';
import { IInvoiceDetailsProps } from './types';
import styles from './InvoiceDetails.module.sass';
import classNames from 'classnames';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { getDateInvoicePeriod } from '../../../../utils';
import Loading from '../../../common/Loading';

export const InvoiceDetails: FC<IInvoiceDetailsProps> = ({ invoice, isLoading }) => {
  const status: string = invoice && invoice.status;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Loading />
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.key}>Status</div>
      <div className={classNames(styles.value, styles.statusContainer)}>
        <div
          className={classNames(styles.itemStatus, {
            [styles.statusSent]: invoice.status === 'SENT',
            [styles.statusError]: invoice.status === 'ERROR'
          })}
        />
        <Typography className={styles.statusTitle}>{invoice.status}</Typography>
      </div>

      <div className={styles.key}>Invoice ID</div>
      <div className={styles.value}>
        <a href={invoice.invoicedLink} target="_blank" className={styles.link}>
          {invoice.invoicedId}
        </a>
      </div>

      <div className={styles.key}>Billing Contact</div>
      <div className={styles.value}>
        <Link to={'—'} className={styles.link}>
          {`${invoice.contactData.fullName} (${invoice.contactData.invoicedCustomerNumber})`}
        </Link>
      </div>

      <div className={styles.key}>Start Date</div>
      <div className={styles.value}>{getDateInvoicePeriod(invoice.queue.deliveryStartDate)}</div>

      <div className={styles.key}>End Date</div>
      <div className={styles.value}>{getDateInvoicePeriod(invoice.queue.deliveryEndDate)}</div>

      <div className={styles.key}>Queue ID</div>
      <div className={styles.value}>{getDateInvoicePeriod(invoice.queue.queue_id)}</div>
    </div>
  );
};
