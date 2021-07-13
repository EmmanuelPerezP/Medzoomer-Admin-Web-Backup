import React, { FC } from 'react';
import { IInvoiceDetailsProps } from './types';
import styles from './InvoiceDetails.module.sass';
import classNames from 'classnames';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

export const InvoiceDetails: FC<IInvoiceDetailsProps> = ({ invoice }) => {
  const status: string = 'sent';

  return (
    <div className={styles.container}>
      <div className={styles.key}>Status</div>
      <div className={classNames(styles.value, styles.statusContainer)}>
        <div
          className={classNames(styles.itemStatus, {
            [styles.statusSent]: status === 'sent',
            [styles.statusError]: status === 'error'
          })}
        />
        <Typography className={styles.statusTitle}>Sent</Typography>
      </div>

      <div className={styles.key}>Invoice Number</div>
      <div className={styles.value}>
        <a href="www.google.com" target="_blank" className={styles.link}>
          ABC-299938-XYZ
        </a>
      </div>

      <div className={styles.key}>Billing Contact</div>
      <div className={styles.value}>
        <Link to={'—'} className={styles.link}>
          William Tran
        </Link>
      </div>

      <div className={styles.key}>Start Date</div>
      <div className={styles.value}>07/23/2021</div>

      <div className={styles.key}>End Date</div>
      <div className={styles.value}>07/24/2021</div>

      <div className={styles.key}>Queue ID</div>
      <div className={styles.value}>60e2e97719</div>
    </div>
  );
};
