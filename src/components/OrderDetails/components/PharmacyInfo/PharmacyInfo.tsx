import styles from './PharmacyInfo.module.sass';
import React, { FC, useMemo } from 'react';

import { IPharmacyInfoProps } from './types';
import { Wrapper } from '../Wrapper';
import { emptyChar, getFullAddress, getMaskedPhone } from '../../utils';
import { PharmacyUser } from '../../../../interfaces';

export const PharmacyInfo: FC<IPharmacyInfoProps> = ({ pharmacy, pharmacist = null }) => {
  const address = useMemo(() => {
    if (!pharmacy.address) return emptyChar;
    return getFullAddress(pharmacy.address);
  }, [pharmacy.address]);

  const phone = useMemo(() => {
    if (!pharmacy.phone_number) return emptyChar;
    return getMaskedPhone(pharmacy.phone_number);
  }, [pharmacy.phone_number]);

  const pharmacistName = useMemo(() => {
    if (!pharmacist) return emptyChar;
    const { name, family_name } = pharmacist as PharmacyUser;
    return `${name} ${family_name}`;
  }, [pharmacist]);

  return (
    <Wrapper
      title="Pharmacy"
      subTitle={pharmacy.name}
      iconName="pharmacyOrder"
      subTitleLink={`/dashboard/pharmacies/${pharmacy._id}`}
      biggerIcon
    >
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.label}>Address</div>
          <div className={styles.value}>{address}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Contact Phone</div>
          <div className={styles.value}>{phone}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Pharmacist</div>
          <div className={styles.value}>{pharmacistName}</div>
        </div>
      </div>
    </Wrapper>
  );
};
