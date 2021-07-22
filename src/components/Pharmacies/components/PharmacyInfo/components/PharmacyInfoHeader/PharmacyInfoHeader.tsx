import React, { FC, useState, useMemo } from 'react';
import {
  Typography
  //Button
} from '@material-ui/core';
import usePharmacy from '../../../../../../hooks/usePharmacy';
import styles from './styles.module.sass';
import AddFeeModal from '../AddFeeModal';
import Back from '../../../../../common/Back';

interface IPharmacyInfoHeader {
  id: string;
  label: string;
  pharmacyName: string;
}

const PharmacyInfoHeader: FC<IPharmacyInfoHeader> = ({ id, label = '', pharmacyName = '' }) => {
  const { resetPharmacy, sendAdditionalPharmacyFee } = usePharmacy();
  const [newFeeModal, setNewFeeModal] = useState<boolean>(false);

  const handleSendFee = async (amount: number) => {
    try {
      await sendAdditionalPharmacyFee(id, amount);
    } catch (e) {
      console.error('handleSendFee', { e });
    }
  };

  const feeModalActions = useMemo(
    () => ({
      show: () => setNewFeeModal(true),
      hide: () => setNewFeeModal(false)
    }),
    [setNewFeeModal]
  );

  return (
    <>
      <div className={styles.header}>
        <Back onClick={resetPharmacy} />
        <div className={styles.titleWrapper}>
          <Typography className={styles.title}>{label}</Typography>
          <Typography className={styles.subtitle}>{pharmacyName}</Typography>
        </div>

        {/* <Button color="primary" variant={'contained'} onClick={feeModalActions.show} className={styles.addFeeButton}>
          &nbsp;Send&nbsp;Fee&nbsp;
        </Button> */}
      </div>
      <AddFeeModal setNewFee={handleSendFee} isOpen={newFeeModal} onClose={feeModalActions.hide} />
    </>
  );
};

export default PharmacyInfoHeader;
