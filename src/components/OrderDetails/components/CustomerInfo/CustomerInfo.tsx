import styles from './CustomerInfo.module.sass';
import React, { FC, useMemo } from 'react';

import { ICustomerInfoProps } from './types';
import { Wrapper } from '../Wrapper';
import { getFullAddress, getMaskedPhone } from '../../utils';

const emptyChar = '—';

export const CustomerInfo: FC<ICustomerInfoProps> = ({ customer }) => {
  const phone = useMemo(() => {
    if (!customer.phone) return emptyChar;

    // masked phone
    return getMaskedPhone(customer.phone);
  }, [customer.phone]);

  const address = useMemo(() => {
    if (!customer.address) return emptyChar;

    // full address
    return getFullAddress(customer.address);
  }, [customer.address]);

  return (
    <Wrapper
      title="Patient"
      subTitle={customer.fullName}
      iconName="customer"
      subTitleLink={`/dashboard/consumers/${customer._id}`}
    >
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.label}>Delivery Address</div>
          <div className={styles.value}>{address}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Contact Phone</div>
          <div className={styles.value}>{phone}</div>
        </div>
      </div>
    </Wrapper>
  );
};
