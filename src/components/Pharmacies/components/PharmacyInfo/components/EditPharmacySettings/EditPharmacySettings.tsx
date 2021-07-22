import React, { FC, useState } from 'react';
import usePharmacy from '../../../../../../hooks/usePharmacy';
import { useStores } from '../../../../../../store';
import OrdersSettings from '../../../PharmacyInputs/OrdersSettings/OrdersSettings';
import ReturnCashConfiguration from '../../../PharmacyInputs/ReturnCashBlock/ReturnCashBlock';
import HighVolumeDeliveriesBlock from '../../../PharmacyInputs/HighVolumeDeliveriesBlock/HighVolumeDeliveriesBlock';
import AffiliationBlock from '../../../PharmacyInputs/AffiliationBlock/AffiliationBlock';
import { isPharmacyIndependent } from '../../../../helper/isPharmacyIndependent';
//import Error from '../../../../../common/Error';
import styles from './styles.module.sass';

interface IEditAdditionalInfo {
  err: any;
  setError: any;
}

const EditAdditionalInfo: FC<IEditAdditionalInfo> = ({ err, setError }) => {
  const { pharmacyStore } = useStores();
  const { newPharmacy } = usePharmacy();
  const [turnHv, setTurnHv] = useState(newPharmacy.hvDeliveries !== 'Yes' ? 'No' : 'Yes');
  const [affiliation, setAffiliation] = useState(isPharmacyIndependent(newPharmacy) ? 'independent' : 'group');

  const handleChangeTabSelect = (key: string) => (value: string) => {
    if (key === 'hvDeliveries') {
      setTurnHv(value);
      if (value === 'No') {
        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          hvDeliveries: value,
          hvPriceFirstDelivery: '',
          // hvPriceFollowingDeliveries: '',
          hvPriceHighVolumeDelivery: ''
        });
        return;
      }
    }

    if (key === 'affiliation') setAffiliation(value);
    pharmacyStore.set('newPharmacy')({ ...newPharmacy, [key]: value });
    setError({ ...err, [key]: '' });
  };

  const handleChange = (key: string) => (e: any) => {
    const { value, checked } = e.target;
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
    }

    // console.log('key', key);
    // console.log('value', value);
    // console.log('checked', checked);
    if (key.includes('rc')) return handleRC(key, checked, newValue);
    if (key.includes('existingDrivers') || key.includes('assistedLivingFacilitiesOrGroupHomes')) {
      const keyName1 = key.split('_')[0] as 'existingDrivers' | 'assistedLivingFacilitiesOrGroupHomes';
      const keyName2 = key.split('_')[1];

      if (keyName2 === 'value' && newValue === 'No') {
        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          [keyName1]: {
            ...newPharmacy[keyName1],
            [keyName2]: newValue,
            volume: ''
          }
        });
      } else {
        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          [keyName1]: {
            ...newPharmacy[keyName1],
            [keyName2]: newValue
          }
        });
      }

      setError({
        ...err,
        [keyName1]: {
          value: '',
          volume: ''
        }
      });

      return;
    }

    pharmacyStore.set('newPharmacy')({ ...newPharmacy, [key]: newValue });
    setError({ ...err, [key]: '' });
  };

  const handleRC = (key: string, checked: boolean, value: string) => {
    const keyName = key.split('_')[1] as 'rcEnable' | 'rcFlatFeeForCourier' | 'rcFlatFeeForPharmacy';

    if (keyName === 'rcEnable') {
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        [keyName]: checked
      });
    } else {
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        [keyName]: value
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <AffiliationBlock
        affiliation={affiliation}
        pharmacy={newPharmacy}
        handleChangeTabSelect={handleChangeTabSelect}
      />
      <OrdersSettings newPharmacy={newPharmacy} handleChange={handleChange} />
      <HighVolumeDeliveriesBlock
        turnHv={turnHv}
        handleChangeTabSelect={handleChangeTabSelect}
        newPharmacy={newPharmacy}
        handleChange={handleChange}
        err={err}
      />
      <ReturnCashConfiguration pharmacy={newPharmacy} handleChange={handleChange} />
    </div>
  );
};
export default EditAdditionalInfo;
