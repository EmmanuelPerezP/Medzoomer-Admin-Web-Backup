import React, { FC, useState, ReactNode, useRef, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import usePharmacy from '../../../../hooks/usePharmacy';
import useHandlePharmacyInputs from '../../../../hooks/useHandlePharmacyInputs';
import { useStores } from '../../../../store';
import Error from '../../../common/Error';
import Button from '@material-ui/core/Button';
import styles from './PharmacyInputs.module.sass';
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
  const { actions } = useHandlePharmacyInputs();
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
    if (key.includes('controlledMedications'))
      return actions.handleControlledMedications(key, newValue, checked, setError, err);
    if (key.includes('reportedBackItems') || key.includes('ordersSettings'))
      return actions.handleItemsWithTwoKeyNames(key, checked, setError, err);
    if (key.includes('existingDrivers') || key.includes('assistedLivingFacilitiesOrGroupHomes')) {
      return actions.handleExistingDriversOrAssistedLivingFacilitiesOrGroupHomes(key, newValue, setError, err);
    }

    actions.handleStrValue(key, newValue, setError, err);
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
