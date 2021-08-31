import styles from './MedicationsInfo.module.sass';
import React, { FC, useMemo } from 'react';
import classNames from 'classnames';
import { IMedicationsInfoProps } from './types';
import { emptyChar, isPopulatedObject } from '../../utils';
import { getDateFromTimezone } from '../../../../utils';
import useUser from '../../../../hooks/useUser';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';
import { Delivery, ExpandedPrescriptions, IOrder } from '../../../../interfaces';

export const MedicationsInfo: FC<IMedicationsInfoProps> = ({ deliveries }) => {
  const user = useUser();

  const medications: ExpandedPrescriptions[] = useMemo(() => {
    const list: ExpandedPrescriptions[] = [];
    // eslint-disable-next-line
    deliveries.map((delivery) => {
      if (isPopulatedObject(delivery)) {
        const { order } = delivery as Delivery;
        if (isPopulatedObject(order)) {
          const { prescriptions, order_uuid, _id: orderId } = order as IOrder;
          const newMedicationList = prescriptions.map((item) => ({ ...item, order_uuid, orderId }));
          list.push(...(newMedicationList || []));
        }
      }
    });

    return list;
  }, [deliveries]);

  const totalCopay = useMemo(() => {
    const totalValue = (medications || []).reduce((acc, curr) => acc + (curr.rxCopay || 0), 0);
    return `$${Number(totalValue).toFixed(2)}`;
  }, [medications]);

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
      const orderId = item.orderId;
      const orderUuid = item.order_uuid;
      const rxNumber = item.rxNumber || emptyChar;
      const rxDate = item.rxFillDate ? getDateFromTimezone(item.rxFillDate, user, 'MM/DD/YYYY') : emptyChar;
      const description = item.dose || item.name || emptyChar;
      const quantity = item.quantity || emptyChar;
      const rxCopay = item.rxCopay ? `$${Number(item.rxCopay).toFixed(2)}` : emptyChar;

      return (
        <div className={styles.itemContainer} key={index}>
          <div className={classNames(styles.columnOrderId, styles.value)}>
            <Link to={`/dashboard/orders/${orderId}`} style={{ textDecoration: 'none' }}>
              <Typography color="secondary">{orderUuid}</Typography>
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
          <div className={styles.value}>{totalCopay}</div>
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
