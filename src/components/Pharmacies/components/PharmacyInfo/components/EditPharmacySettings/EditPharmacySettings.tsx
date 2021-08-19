import React, { FC, useState } from 'react';
import usePharmacy from '../../../../../../hooks/usePharmacy';
import useHandlePharmacyInputs from '../../../../../../hooks/useHandlePharmacyInputs';
import OrdersSettings from '../../../PharmacyInputs/OrdersSettings/OrdersSettings';
import ReturnCashBlock from '../../../PharmacyInputs/ReturnCashBlock/ReturnCashBlock';
import HighVolumeDeliveriesBlock from '../../../PharmacyInputs/HighVolumeDeliveriesBlock/HighVolumeDeliveriesBlock';
import AffiliationBlock from '../../../PharmacyInputs/AffiliationBlock/AffiliationBlock';
import { isPharmacyIndependent } from '../../../../helper/isPharmacyIndependent';
import styles from './styles.module.sass';

interface IEditAdditionalInfo {
  err: any;
  setError: any;
}

const EditAdditionalInfo: FC<IEditAdditionalInfo> = ({ err, setError }) => {
  const { newPharmacy } = usePharmacy();
  const { actions } = useHandlePharmacyInputs();
  const [turnHv, setTurnHv] = useState(newPharmacy.hvDeliveries !== 'Yes' ? 'No' : 'Yes');
  const [affiliation, setAffiliation] = useState(isPharmacyIndependent(newPharmacy) ? 'independent' : 'group');

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

    if (key.includes('rc')) return actions.handleRC(key, checked, value);
    if (key.includes('ordersSettings')) return actions.handleItemsWithTwoKeyNames(key, checked, setError, err);

    actions.handleStrValue(key, value, setError, err);
  };

  return (
    <div className={styles.wrapper}>
      <AffiliationBlock
        affiliation={affiliation}
        pharmacy={newPharmacy}
        handleChangeTabSelect={handleChangeTabSelect}
        isCreate={false}
      />
      <OrdersSettings newPharmacy={newPharmacy} handleChange={handleChange} />
      <HighVolumeDeliveriesBlock
        turnHv={turnHv}
        handleChangeTabSelect={handleChangeTabSelect}
        newPharmacy={newPharmacy}
        handleChange={handleChange}
        err={err}
      />
      <ReturnCashBlock pharmacy={newPharmacy} handleChange={handleChange} />
    </div>
  );
};
export default EditAdditionalInfo;
