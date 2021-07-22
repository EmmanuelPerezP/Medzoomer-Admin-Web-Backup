import React, { FC, useState, ReactNode, useRef, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import usePharmacy from '../../../../hooks/usePharmacy';
import { useStores } from '../../../../store';
import Error from '../../../common/Error';
import Button from '@material-ui/core/Button';
import styles from './PharmacyInputs.module.sass';
import SelectButton from '../../../common/SelectButton';
import { isPharmacyIndependent } from '../../helper/isPharmacyIndependent';
import { checkIsOpen24_7 } from '../../../../utils';
import BasicInfoBlock from './BasicInfo/BasicInfoBlock';
import WorkingHours from './WorkingHours/WorkingHours';
import ManagerProfile from './ManagerProfile/ManagerProfile';
import OrdersSettings from './OrdersSettings/OrdersSettings';
import ReturnCashConfiguration from './ReturnCashBlock/ReturnCashBlock';
import HighVolumeDeliveriesBlock from './HighVolumeDeliveriesBlock/HighVolumeDeliveriesBlock';
import AffiliationBlock from './AffiliationBlock/AffiliationBlock';

interface IProps {
  err: any;
  setError: any;
  children?: ReactNode;
  reference?: any;
  isOpen24_7?: boolean;
  handleChangeOpen24_7?: any;
}

export const PharmacyInputs: FC<IProps> = ({ err, setError, reference, handleChangeOpen24_7, isOpen24_7 }) => {
  const { pharmacyStore } = useStores();
  const { newPharmacy } = usePharmacy();
  const [turnHv, setTurnHv] = useState(newPharmacy.hvDeliveries !== 'Yes' ? 'No' : 'Yes');
  const [affiliation, setAffiliation] = useState(isPharmacyIndependent(newPharmacy) ? 'independent' : 'group');
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
        if (checkIsOpen24_7(newPharmacy.schedule)) handleChangeOpen24_7(null, true);
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
    if (key.includes('reportedBackItems') || key.includes('ordersSettings')) {
      return handleItemsWithTwoKeyNames(key, checked);
    }
    if (key.includes('controlledMedications')) return handleControlledMedications(key, newValue, checked);
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

    if (key.includes('managers')) return handleManagers(key, newValue);

    pharmacyStore.set('newPharmacy')({ ...newPharmacy, [key]: newValue });
    setError({ ...err, [key]: '' });
  };

  const renderSwitch = () => {
    return (
      <div className={styles.affiliationWrapper}>
        <Typography className={styles.blockTitle}>Pharmacy Affiliation</Typography>
        <div className={styles.independentInput}>
          <SelectButton
            defItems={[
              { value: 'independent', label: 'Independent' },
              { value: 'group', label: 'Group' }
            ]}
            label=""
            value={affiliation}
            onChange={handleChangeTabSelect('affiliation')}
          />
        </div>
      </div>
    );
  };

  const renderSignedBlock = () => {
    return (
      <div ref={refSignedBlock} className={styles.signedBlock}>
        <Typography className={styles.blockTitle}>Signed Agreement</Typography>
        <a
          href={newPharmacy.signedAgreementUrl}
          download
          style={{ textDecoration: 'none' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className={styles.changeStepButton} variant="contained" color="secondary">
            <Typography className={styles.summaryText}>Download PDF</Typography>
          </Button>
        </a>
      </div>
    );
  };

  const handleControlledMedications = (key: string, newValue: string, checked: boolean) => {
    const keyName = key.split('_')[1];

    if (keyName === 'value' && newValue === 'No') {
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        controlledMedications: {
          value: 'No',
          signature: false,
          photoOfId: false,
          specialRequirements: false,
          specialRequirementsNote: ''
        }
      });
    } else {
      let value: string | boolean = newValue;
      if (['signature', 'photoOfId', 'specialRequirements'].includes(keyName)) {
        value = checked;
      }
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        controlledMedications: {
          ...newPharmacy.controlledMedications,
          [keyName]: value
        }
      });
    }
    setError({
      ...err,
      controlledMedications: {
        value: '',
        signature: '',
        photoOfId: '',
        specialRequirements: '',
        specialRequirementsNote: ''
      }
    });
  };

  const handleManagers = (key: string, newValue: string) => {
    const keyName1 = key.split('_')[1] as 'primaryContact' | 'secondaryContact';
    const keyName2 = key.split('_')[2] as 'firstName' | 'lastName' | 'phone' | 'email';

    // console.log('keyName1 -------->', keyName1);
    // console.log('keyName2 -------->', keyName2);
    // console.log('newValue -------->', newValue);
    // if (keyName2 === 'phone' && newValue && !newValue.startsWith('+') && !newValue.startsWith(PHONE_COUNTRY_CODE)) {
    //   newValue = `${PHONE_COUNTRY_CODE}${newValue}`;
    // }

    if (keyName1 === 'primaryContact') {
      let oldKeyName = '';
      let managerName,
        firstName,
        lastName = '';

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

  const handleItemsWithTwoKeyNames = (key: string, checked: boolean) => {
    const keyName1 = key.split('_')[0] as 'reportedBackItems' | 'ordersSettings';
    const keyName2 = key.split('_')[1];

    pharmacyStore.set('newPharmacy')({
      ...newPharmacy,
      [keyName1]: {
        ...newPharmacy[keyName1],
        [keyName2]: checked
      }
    });
    setError({
      ...err,
      [keyName1]: {
        ...err[keyName1],
        [keyName2]: ''
      }
    });
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

  //console.log('newPharmacy ---->', newPharmacy);

  return (
    <div className={styles.infoWrapper}>
      <div ref={refBasicInfo} className={styles.basicInfo}>
        <BasicInfoBlock err={err} setError={setError} newPharmacy={newPharmacy} handleChange={handleChange} />
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
        />
      </div>

      {err.global && <Error value={err.global} />}
    </div>
  );
};
