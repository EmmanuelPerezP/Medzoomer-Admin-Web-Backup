import React, { FC, useState, ReactNode, useRef, useEffect, useCallback } from 'react';
import usePharmacy from '../../../../hooks/usePharmacy';
import useHandlePharmacyInputs from '../../../../hooks/useHandlePharmacyInputs';
import { useStores } from '../../../../store';
import Error from '../../../common/Error';
import styles from './PharmacyInputs.module.sass';
import { isPharmacyIndependent } from '../../helper/isPharmacyIndependent';
import { checkIsOpen24h7d } from '../../../../utils';
import BasicInfoBlock from './BasicInfo/BasicInfoBlock';
import WorkingHours from './WorkingHours/WorkingHours';
import ManagerProfile from './ManagerProfile/ManagerProfile';
import OrdersSettings from './OrdersSettings/OrdersSettings';
import ReturnCashConfiguration from './ReturnCashBlock/ReturnCashBlock';
import HighVolumeDeliveriesBlock from './HighVolumeDeliveriesBlock/HighVolumeDeliveriesBlock';
import AffiliationBlock from './AffiliationBlock/AffiliationBlock';
import { ActionMeta } from 'react-select';

interface IProps {
  err: any;
  setError: any;
  children?: ReactNode;
  reference?: any;
  isOpen24_7?: boolean;
  handleChangeOpen24_7?: any;
}
interface Option {
  readonly label: string;
  readonly value: string;
}

export const PharmacyInputs: FC<IProps> = ({ err, setError, reference, handleChangeOpen24_7, isOpen24_7 }) => {
  const { pharmacyStore } = useStores();
  const { newPharmacy, getPharmacySoftware, createPharmacySoftware } = usePharmacy();
  const { actions } = useHandlePharmacyInputs();
  const [turnHv, setTurnHv] = useState(newPharmacy.hvDeliveries !== 'Yes' ? 'No' : 'Yes');
  const [affiliation, setAffiliation] = useState(isPharmacyIndependent(newPharmacy) ? 'independent' : 'group');
  const [softwareList, setSoftwareList] = useState();
  const refBasicInfo = useRef(null);
  const refWorkingHours = useRef(null);
  const refManagerInfo = useRef(null);
  const refOrdersSettings = useRef(null);
  const refHVDelideries = useRef(null);
  const refReturnCopay = useRef(null);
  const refAffiliation = useRef(null);
  const refSignedBlock = useRef(null);

  useEffect(() => {
    switch (reference) {
      case 'refBasicInfo':
        (refBasicInfo.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'refWorkingHours':
        (refWorkingHours.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (checkIsOpen24h7d(newPharmacy.schedule)) handleChangeOpen24_7(null, true);
        break;
      case 'refManagerInfo':
        (refManagerInfo.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'refOrdersSettings':
        (refOrdersSettings.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'refHVDelideries':
        (refHVDelideries.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'refReturnCopay':
        (refReturnCopay.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'refAffiliation':
        (refAffiliation.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'refSignedBlock':
        (refSignedBlock.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      default:
        return;
    }
  }, [reference]); // eslint-disable-line

  useEffect(() => {
    if (newPharmacy && !newPharmacy.roughAddressObj) {
      // newPharmacy.roughAddressObj = newPharmacy.address; // was before
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

  const handleChangeTabSelect = (key: string) => (value: string) => {
    if (key === 'hvDeliveries') {
      setTurnHv(value);
      actions.handleTabHvDeliveries(value, setError, err);
    }
    if (key === 'affiliation') {
      setAffiliation(value);
      actions.handleStrValue(key, value, setError, err);
    }
  };

  const handleChange = (key: string) => (e: any) => {
    const { value, checked } = e.target;
    const newValue: any = value;

    if (key === 'apartment') return actions.handleApartment(newValue);
    if (key.includes('rc')) return actions.handleRC(key, checked, newValue);
    if (key.includes('managers')) return actions.handleManagers(key, newValue, setError, err);
    if (key.includes('controlledMedications')) {
      return actions.handleControlledMedications(key, newValue, checked, setError, err);
    }
    if (key.includes('reportedBackItems') || key.includes('ordersSettings')) {
      return actions.handleItemsWithTwoKeyNames(key, checked, setError, err);
    }
    if (key.includes('existingDrivers') || key.includes('assistedLivingFacilitiesOrGroupHomes')) {
      return actions.handleExistingDriversOrAssistedLivingFacilitiesOrGroupHomes(key, newValue, setError, err);
    }

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
      <div ref={refBasicInfo} className={styles.basicInfo}>
        <BasicInfoBlock
          err={err}
          setError={setError}
          newPharmacy={newPharmacy}
          handleSelectSoftware={handleSelectSoftware}
          handleChange={handleChange}
          searchFunction={searchSoftware}
          createFunction={createFunction}
          options={softwareList}
          handleInputSoftware={handleSoftwareInput}
        />
      </div>

      <div ref={refWorkingHours}>
        <WorkingHours
          err={err}
          setError={setError}
          handleChangeOpen24_7={handleChangeOpen24_7}
          isOpen24_7={isOpen24_7 || false}
        />
      </div>

      <div ref={refManagerInfo}>
        {newPharmacy.managers && newPharmacy.managers.primaryContact && (
          <ManagerProfile err={err} newPharmacy={newPharmacy} handleChange={handleChange} />
        )}
      </div>

      <div ref={refOrdersSettings}>
        <OrdersSettings newPharmacy={newPharmacy} handleChange={handleChange} />
      </div>
      <div ref={refHVDelideries}>
        <HighVolumeDeliveriesBlock
          turnHv={turnHv}
          handleChangeTabSelect={handleChangeTabSelect}
          newPharmacy={newPharmacy}
          handleChange={handleChange}
          err={err}
        />
      </div>
      <div ref={refReturnCopay}>
        <ReturnCashConfiguration pharmacy={newPharmacy} handleChange={handleChange} />
      </div>
      <div ref={refAffiliation}>
        <AffiliationBlock
          affiliation={affiliation}
          pharmacy={newPharmacy}
          handleChangeTabSelect={handleChangeTabSelect}
          isCreate
        />
      </div>

      {err.global && <Error value={err.global} />}
    </div>
  );
};
