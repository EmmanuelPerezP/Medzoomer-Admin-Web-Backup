import React, { FC, useState, useMemo } from 'react';
import {
  Typography
  //Button
} from '@material-ui/core';
import usePharmacy from '../../../../../../hooks/usePharmacy';
import styles from './styles.module.sass';
import AddFeeModal from '../AddFeeModal';
import Back from '../../../../../common/Back';
import { useHistory } from 'react-router';

interface IPharmacyInfoHeader {
  id: string;
  label: string;
  pharmacyName: string;
  setIsUpdate: any;
  isUpdate: any;
}

const PharmacyInfoHeader: FC<IPharmacyInfoHeader> = ({ id, label = '', pharmacyName = '', setIsUpdate, isUpdate }) => {
  const { resetPharmacy, sendAdditionalPharmacyFee } = usePharmacy();
  const [newFeeModal, setNewFeeModal] = useState<boolean>(false);
  const history = useHistory();

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
        <Back
          canGoBack={false}
          onClick={() => {
            if (!isUpdate) {
              resetPharmacy();
              history.goBack();
            } else {
              setIsUpdate(false);
            }
          }}
        />
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
