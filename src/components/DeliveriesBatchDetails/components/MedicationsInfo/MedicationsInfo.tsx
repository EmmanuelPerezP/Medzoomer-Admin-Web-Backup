import styles from './MedicationsInfo.module.sass';
import React, { FC } from 'react';
import classNames from 'classnames';

import { IMedicationsInfoProps } from './types';
import { emptyChar } from '../../utils';
import { getDateFromTimezone } from '../../../../utils';
import useUser from '../../../../hooks/useUser';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';

export const MedicationsInfo: FC<IMedicationsInfoProps> = ({ medications }) => {
  const user = useUser();
  const renderHeader = () => (
    <div className={styles.headerContainer}>
      <div className={classNames(styles.columnOrderId, styles.label)}>Order ID</div>
      <div className={classNames(styles.columnRxNumber, styles.label)}>RX Number</div>
      <div className={classNames(styles.columnRxFillDate, styles.label)}>RX Fill Date</div>
      <div className={classNames(styles.columnMedication, styles.label)}>Medication</div>
      <div className={classNames(styles.columnQty, styles.label)}>Qty</div>
      <div className={classNames(styles.columnCopay, styles.label)}>Copay</div>
    </div>
  );

  const renderItems = () => {
    return medications.map((item, index) => {
      const orderId = item._id;
      const rxNumber = item.rxNumber || emptyChar;
      const rxDate = item.rxFillDate ? getDateFromTimezone(item.rxFillDate, user, 'MM/DD/YYYY') : emptyChar;
      const description = item.dose || item.name || emptyChar;
      const quantity = item.quantity || emptyChar;
      const rxCopay = item.rxCopay ? `$${item.rxCopay.toFixed(2)}` : emptyChar;

      return (
        <div className={styles.itemContainer} key={index}>
          <div className={classNames(styles.columnOrderId, styles.value)}>
            <Link to={`/dashboard/orders/${orderId}`} style={{ textDecoration: 'none' }}>
              <Typography color="secondary">
                {/* item.order_uuid */}
                330
              </Typography>
            </Link>
          </div>

          <div className={classNames(styles.columnRxNumber, styles.value)}>{rxNumber}</div>

          <div className={classNames(styles.columnRxFillDate, styles.value)}>{rxDate}</div>

          <div className={classNames(styles.columnMedication, styles.value)}>{description}</div>

          <div className={classNames(styles.columnQty, styles.value)}>{quantity}</div>

          <div className={classNames(styles.columnCopay, styles.value)}>{rxCopay}</div>
        </div>
      );
    });
  };

  const renderEmptyMessage = () => <div className={styles.emptyMessage}>Medications list is empty</div>;

  return (
    <Wrapper
      title="Order Details"
      subTitle="Medications"
      iconName="medications"
      HeaderRightComponent={
        <div className={styles.totalContainer}>
          <div className={styles.label}>Total Copay</div>
          <div className={styles.value}>$88.50</div>
        </div>
      }
    >
      <div className={styles.content}>
        {renderHeader()}
        {medications.length ? renderItems() : renderEmptyMessage()}
      </div>
    </Wrapper>
  );
};
