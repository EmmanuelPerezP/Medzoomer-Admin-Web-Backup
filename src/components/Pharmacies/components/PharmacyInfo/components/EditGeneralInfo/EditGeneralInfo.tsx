import React, { FC, useEffect } from 'react';
import usePharmacy from '../../../../../../hooks/usePharmacy';
import useHandlePharmacyInputs from '../../../../../../hooks/useHandlePharmacyInputs';
import { useStores } from '../../../../../../store';
import Error from '../../../../../common/Error';
import styles from './styles.module.sass';
import { checkIsOpen24h7d } from '../../../../../../utils';
import BasicInfoBlock from '../../../PharmacyInputs/BasicInfo/BasicInfoBlock';
import WorkingHours from '../../../PharmacyInputs/WorkingHours/WorkingHours';
import ManagerProfile from '../../../PharmacyInputs/ManagerProfile/ManagerProfile';

interface IProps {
  err: any;
  setError: any;
  isOpen24_7?: boolean;
  handleChangeOpen24_7?: any;
}

const EditGeneralInfo: FC<IProps> = ({ err, setError, handleChangeOpen24_7, isOpen24_7 }) => {
  const { pharmacyStore } = useStores();
  const { newPharmacy } = usePharmacy();
  const { actions } = useHandlePharmacyInputs();

  useEffect(() => {
    if (newPharmacy && !newPharmacy.roughAddressObj) {
      // newPharmacy.roughAddressObj = newPharmacy.address; // was before
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        roughAddressObj: { ...newPharmacy.address }
      });
    }
    if (checkIsOpen24h7d(newPharmacy.schedule)) handleChangeOpen24_7(null, true);

    // eslint-disable-next-line
  }, [newPharmacy]);

  const handleChange = (key: string) => (e: any) => {
    const { value } = e.target;
    const newValue: any = value;

    if (key === 'apartment') return actions.handleApartment(newValue);
    if (key.includes('managers')) return actions.handleManagers(key, newValue, setError, err);

    actions.handleStrValue(key, newValue, setError, err);
  };

  return (
    <div className={styles.infoWrapper}>
      <div className={styles.basicInfo}>
        <BasicInfoBlock err={err} setError={setError} newPharmacy={newPharmacy} handleChange={handleChange} />
      </div>

      <WorkingHours
        err={err}
        setError={setError}
        handleChangeOpen24_7={handleChangeOpen24_7}
        isOpen24_7={isOpen24_7 || false}
      />

      {newPharmacy.managers && newPharmacy.managers.primaryContact && (
        <ManagerProfile err={err} newPharmacy={newPharmacy} handleChange={handleChange} />
      )}
      {err.global && <Error value={err.global} />}
    </div>
  );
};

export default EditGeneralInfo;
