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
        <a
          href={`https://app.invoiced.com/customers/${invoice.contactData.invoicedCustomerId}`}
          className={styles.link}
          target="_blank"
        >
          {`${invoice.contactData.fullName} (${invoice.contactData.invoicedCustomerNumber})`}
        </a>
      </div>

      <div className={styles.key}>Start Date</div>
      <div className={styles.value}>{getDateInvoicePeriod(invoice.queue.deliveryStartDateAt)}</div>

      <div className={styles.key}>End Date</div>
      <div className={styles.value}>{getDateInvoicePeriod(invoice.queue.deliveryEndDateAt)}</div>

      <div className={styles.key}>Queue ID</div>
      <div className={styles.value}>{invoice.queue.queue_id}</div>

      {invoice.errorText && invoice.status === 'ERROR' ? (
        <>
          <div className={styles.key}>Error</div>
          <div className={styles.value}>
            {invoice.errorText
              .replaceAll('Error:', '')
              .replaceAll('Error', '')
              .trim()}
          </div>
        </>
      ) : null}
    </div>
  );
};
