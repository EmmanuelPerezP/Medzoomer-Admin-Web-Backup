import React, { FC } from 'react';
import { Typography } from '@material-ui/core';
import styles from './styles.module.sass';

interface IPharmacySettingsInfo {
  pharmacy: any;
}

const PharmacySettingsInfo: FC<IPharmacySettingsInfo> = ({ pharmacy }) => {
  const valueOfOrdersSettings = () => {
    let value1 = '';
    let value2 = '';

    if (pharmacy.ordersSettings.medicationDetails) {
      value1 = 'Medication Details (Name, Route, Milligrams and Dosage, Quantity)';
    }
    if (pharmacy.ordersSettings.rxCopay) {
      value2 = 'Rx Copay';
    }

    return (value1 ? value1 + ', ' : '') + (value2 ? value2 + ', ' : '') + 'RX Number, Rx Fill Date';
  };

  const renderOrdersSettings = () => (
    <div>
      <div className={styles.titleBlock}>
        <Typography className={styles.title}>Orders Settings</Typography>
      </div>
      {renderSummaryItem(
        'Please check all the fields you would like to fill in during order creation',
        valueOfOrdersSettings()
      )}
    </div>
  );

  const renderAffiliation = () => (
    <div>
      <div className={styles.titleBlock}>
        <Typography className={styles.title}>Affiliation Settings</Typography>
      </div>
      {renderSummaryItem(
        'Affiliation Type',
        pharmacy.affiliation
          ? `${pharmacy.affiliation[0].toUpperCase()}${pharmacy.affiliation.slice(1, pharmacy.affiliation.length)}`
          : ''
      )}
    </div>
  );

  const renderHighVolumeDeliveries = () => (
    <div>
      <div className={styles.titleBlock}>
        <Typography className={styles.title}>High Volume Deliveries</Typography>
      </div>
      {renderSummaryItem('High Volume Deliveries', pharmacy.hvDeliveries === 'No' ? 'Off' : 'On')}
      {pharmacy.hvDeliveries === 'Yes' &&
        renderSummaryItem(
          'Price for Delivery (Pharmacy)',
          pharmacy.hvPriceFirstDelivery ? `$${(+pharmacy.hvPriceFirstDelivery).toFixed(2)}` : '0.00'
        )}
      {pharmacy.hvDeliveries === 'Yes' &&
        renderSummaryItem(
          'Price for Delivery (Courier)',
          pharmacy.hvPriceHighVolumeDelivery ? `$${(+pharmacy.hvPriceHighVolumeDelivery).toFixed(2)}` : '0.00'
        )}
    </div>
  );

  const renderReturnCopay = () => (
    <div>
      <div className={styles.titleBlock}>
        <Typography className={styles.title}>Return Copay Configuration</Typography>
      </div>
      {renderSummaryItem('Ability to enable return Сopay for orders', pharmacy.rcEnable ? 'On' : 'Off')}
      {pharmacy.rcEnable &&
        renderSummaryItem(
          'Flat Fee for Paying Courier',
          pharmacy.rcFlatFeeForCourier ? `$${(+pharmacy.rcFlatFeeForCourier).toFixed(2)}` : '0.00'
        )}
      {pharmacy.rcEnable &&
        renderSummaryItem(
          'Flat Fee for Charge Pharmacy',
          pharmacy.rcFlatFeeForPharmacy ? `$${(+pharmacy.rcFlatFeeForPharmacy).toFixed(2)}` : '0.00'
        )}
    </div>
  );

  const renderSummaryItem = (name: string, value: string) => (
    <div className={styles.summaryItem}>
      <Typography className={styles.field}>{name}</Typography>
      {value && <Typography>{value}</Typography>}
      {!value && (
        <Typography
          style={{
            color: '#798c9e'
          }}
        >
          Not provided
        </Typography>
      )}
    </div>
  );

  return (
    <div className={styles.createPharmacyWrapper}>
      <div className={styles.pharmacyBlock}>
        {renderAffiliation()}
        {renderOrdersSettings()}
        {renderHighVolumeDeliveries()}
        {renderReturnCopay()}
      </div>
    </div>
  );
};

export default PharmacySettingsInfo;
