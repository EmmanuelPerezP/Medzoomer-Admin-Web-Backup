import styles from './OrderInfo.module.sass';
import React, { FC, useMemo } from 'react';

import { IOrderInfoProps } from './types';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';
import moment from 'moment';

const emptyChar = '—';

export const OrderInfo: FC<IOrderInfoProps> = ({ order }) => {
  const window = useMemo(() => {
    if (!order.dispatchAt) return emptyChar;

    return `After ${moment(order.dispatchAt).format('D/MM/YYYY, LT')}`;
  }, [order.dispatchAt]);

  return (
    <Wrapper title="Order" subTitle={order.order_uuid} iconName="order" subTitleLink={`/dashboard/orders/${order._id}`}>
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.label}>Delivery Window</div>
          <div className={styles.value}>{window}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Delivery Note</div>
          <div className={styles.value}>{order.notes}</div>
        </div>
      </div>
    </Wrapper>
  );
};
