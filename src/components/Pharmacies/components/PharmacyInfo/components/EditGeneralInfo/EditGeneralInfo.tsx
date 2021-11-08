import React, { FC, useEffect, useState } from 'react';

import BasicInfoBlock from '../../../PharmacyInputs/BasicInfo/BasicInfoBlock';
import Error from '../../../../../common/Error';
import ManagerProfile from '../../../PharmacyInputs/ManagerProfile/ManagerProfile';
import WorkingHours from '../../../PharmacyInputs/WorkingHours/WorkingHours';
import styles from './styles.module.sass';
import useHandlePharmacyInputs from '../../../../../../hooks/useHandlePharmacyInputs';
import usePharmacy from '../../../../../../hooks/usePharmacy';
import { useStores } from '../../../../../../store';
import { ActionMeta } from 'react-select';

interface IProps {
  err: any;
  setError: any;
  isOpen24_7?: boolean;
  handleChangeOpen24h7d?: any;
  addressError?: any;
  setAddressError?: any;
}
interface Option {
  readonly label: string;
  readonly value: string;
}


const EditGeneralInfo: FC<IProps> = ({
  err,
  setError,
  handleChangeOpen24h7d,
  isOpen24_7,
  addressError,
  setAddressError
}) => {
  const { pharmacyStore } = useStores();
  const { newPharmacy, getPharmacySoftware, createPharmacySoftware } = usePharmacy();
  const { actions } = useHandlePharmacyInputs();
  const [softwareList, setSoftwareList] = useState();

  useEffect(() => {
    if (newPharmacy && !newPharmacy.roughAddressObj) {
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        roughAddressObj: { ...newPharmacy.address }
      });
    }

    // eslint-disable-next-line
  }, [newPharmacy]);
  useEffect(() => {
    searchSoftware('');
  }, []);

  const handleChange = (key: string) => (e: any) => {
    const { value } = e.target;
    const newValue: any = value;

    if (key === 'apartment') return actions.handleApartment(newValue);
    if (key.includes('managers')) return actions.handleManagers(key, newValue, setError, err);

    actions.handleStrValue(key, newValue, setError, err);
  };

  const handleSelectSoftware = (newValue: Option, actionMeta: ActionMeta<Option>) => {
    actions.handleSoftware(newValue);
  };

  const createFunction = (value: string) => {
    console.log('value', value);
    createPharmacySoftware(value)
      .then((res) => {
        searchSoftware('');
        actions.handleSoftware({ value,label: value });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchSoftware = (value: string) => {
    getPharmacySoftware(value)
      .then((res) => {
        const formatData = res.data.map((item: { name: string; _id: string }) => ({
          value: item.name,
          label: item.name
        }));
        setSoftwareList(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSoftwareInput = (inputValue: any) => {
    searchSoftware(inputValue);
  };


  return (
    <div className={styles.infoWrapper}>
      <div className={styles.basicInfo}>
        <BasicInfoBlock
          addressError={addressError}
          setAddressError={setAddressError}
          err={err}
          setError={setError}
          newPharmacy={newPharmacy}
          handleChange={handleChange}
          options={softwareList}
          handleSelectSoftware={handleSelectSoftware}
          createFunction={createFunction}
        />
      </div>

      <WorkingHours
        err={err}
        setError={setError}
        handleChangeOpen24_7={handleChangeOpen24h7d}
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
