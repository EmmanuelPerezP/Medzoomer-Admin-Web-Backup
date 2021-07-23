import React, { FC, useEffect } from 'react';
import usePharmacy from '../../../../../../hooks/usePharmacy';
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

    if (key === 'apartment') {
      const tempRoughAddressObj = newPharmacy.roughAddressObj ? newPharmacy.roughAddressObj : newPharmacy.address;
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        roughAddressObj: {
          ...tempRoughAddressObj,
          apartment: newValue
        }
      });
      return;
    }

    if (key.includes('managers')) return handleManagers(key, newValue);

    pharmacyStore.set('newPharmacy')({ ...newPharmacy, [key]: newValue });
    setError({ ...err, [key]: '' });
  };

  const handleManagers = (key: string, newValue: string) => {
    const keyName1 = key.split('_')[1] as 'primaryContact' | 'secondaryContact';
    const keyName2 = key.split('_')[2] as 'firstName' | 'lastName' | 'phone' | 'email';

    if (keyName1 === 'primaryContact') {
      let oldKeyName = '';
      let managerName = '';
      let firstName = '';
      let lastName = '';

      if (keyName2 === 'firstName' || keyName2 === 'lastName') {
        oldKeyName = 'managerName';
        firstName = (keyName2 === 'firstName' ? newValue : '') || newPharmacy.managers.primaryContact.firstName;
        lastName = (keyName2 === 'lastName' ? newValue : '') || newPharmacy.managers.primaryContact.lastName;
        managerName = (firstName + ' ' + lastName).trim();
      }
      if (keyName2 === 'phone') oldKeyName = 'managerPhoneNumber';
      if (keyName2 === 'email') oldKeyName = 'email';

      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        [oldKeyName]: oldKeyName === 'managerName' ? managerName : newValue,
        managers: {
          ...newPharmacy.managers,

          [keyName1]: {
            ...newPharmacy.managers[keyName1],
            [keyName2]: newValue
          }
        }
      });
    } else {
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        managers: {
          ...newPharmacy.managers,
          [keyName1]: {
            ...newPharmacy.managers[keyName1],
            [keyName2]: newValue
          }
        }
      });
    }

    setError({
      ...err,
      managers: {
        ...err.managers,

        [keyName1]: {
          ...err.managers[keyName1],
          [keyName2]: ''
        }
      }
    });
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
