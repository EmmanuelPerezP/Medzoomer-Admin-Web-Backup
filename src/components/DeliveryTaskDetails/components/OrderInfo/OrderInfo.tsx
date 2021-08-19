import styles from './OrderInfo.module.sass';
import React, { FC, useMemo } from 'react';

import { IOrderInfoProps } from './types';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';
import moment from 'moment';
import { getStartedEvent } from '../../utils';
import { getDateFromTimezone } from '../../../../utils';
import useUser from '../../../../hooks/useUser';

const emptyChar = '—';

export const OrderInfo: FC<IOrderInfoProps> = ({ delivery }) => {
  const user = useUser();
  const window = useMemo(() => {
    if (!delivery.order.dispatchAt) return emptyChar;
    const date = getStartedEvent(delivery);
    if (date) {
      return `After ${getDateFromTimezone(moment(date).format(), user, 'D/MM/YYYY, LT')}`;
    } else {
      return emptyChar;
    }
  }, [delivery.order.dispatchAt]);

  return (
    <Wrapper
      title="Order"
      subTitle={delivery.order.order_uuid}
      iconName="order"
      subTitleLink={`/dashboard/orders/${delivery.order._id}`}
    >
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.label}>Delivery Window</div>
          <div className={styles.value}>{window}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Delivery Note</div>
          <div className={styles.value}>{delivery.order.notes ? delivery.order.notes : emptyChar}</div>
        </div>
      </div>
    </Wrapper>
  );
};
