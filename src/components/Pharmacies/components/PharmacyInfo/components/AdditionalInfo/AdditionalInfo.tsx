import React, { FC } from 'react';
import { Typography } from '@material-ui/core';
import { addPhoneCounryCode } from '../../../../../../utils';
import styles from './styles.module.sass';

interface IAdditionalInfo {
  pharmacy: any;
}

const AdditionalInfo: FC<IAdditionalInfo> = ({ pharmacy }) => {
  const valueOfFacilitiesOrExistingDrivers = (keyName: any) => {
    const key = keyName as 'assistedLivingFacilitiesOrGroupHomes' | 'existingDrivers';

    let value1 = pharmacy[key].value;
    let value2 = '';
    let resultValue;

    if (pharmacy[key].volume) {
      if (key === 'assistedLivingFacilitiesOrGroupHomes') {
        value2 = 'expected daily volume ' + pharmacy[key].volume;
      } else {
        value2 = pharmacy[key].volume;
      }
    }

    if (value1 && value2) resultValue = value1 + ', ' + value2;
    if (value1 && !value2) resultValue = value1;
    if (!value1 && value2) resultValue = value2;

    return resultValue || '';
  };

  const valueOfReportedBackItems = () => {
    let resultValue: string[] = [];
    (Object.keys(pharmacy.reportedBackItems) || []).forEach((item) => {
      const el = item as keyof typeof pharmacy.reportedBackItems;

      if (pharmacy.reportedBackItems[el]) {
        switch (el) {
          case 'customerName':
            resultValue.push('Customer Name');
            break;
          case 'rxNumber':
            resultValue.push('RX Number');
            break;
          case 'signature':
            resultValue.push('Signature');
            break;
          case 'date':
            resultValue.push('Date');
            break;
          case 'medicationName':
            resultValue.push('Medication name');
            break;
          case 'deliveryConfirmationPhotos':
            resultValue.push('Delivery Confirmation Photos (only for contactless deliveries)');
            break;
          default:
            break;
        }
      }
    });

    return resultValue.join(', ');
  };

  const valueOfReferrals = () => {
    if (pharmacy.referrals.length > 0) {
      return pharmacy.referrals.map((referral: any, i: any) => {
        if (!referral.pharmacyName && !referral.managerName && !referral.contactInfo) {
          return '';
        } else {
          return (
            <div
              key={i}
              style={{
                marginBottom: 10
              }}
            >
              {`Referral #${i + 1} ${referral.pharmacyName || ''} ${referral.managerName ||
                ''} ${referral.contactInfo || ''}`}
            </div>
          );
        }
      });
    } else return '';
  };

  const valueOfManagers = (keyName: string) => {
    const key = keyName as 'primaryContact' | 'secondaryContact';
    return (
      <>
        {pharmacy.managers[key] && (
          <div>
            {(pharmacy.managers[key].firstName ? pharmacy.managers[key].firstName + ' ' : '') +
              (pharmacy.managers[key].lastName ? pharmacy.managers[key].lastName + ', ' : '') +
              (pharmacy.managers[key].phone ? `${addPhoneCounryCode(pharmacy.managers[key].phone)}, ` : '') +
              (pharmacy.managers[key].email ? pharmacy.managers[key].email + ', ' : '')}
          </div>
        )}
      </>
    );
  };

  const valueOfControlledMedications = () => {
    let value = '';

    if (pharmacy.controlledMedications.value) value = `${pharmacy.controlledMedications.value}`;
    if (pharmacy.controlledMedications.signature) value += `, Signature`;
    if (pharmacy.controlledMedications.photoOfId) value += `, Photo of ID`;
    if (pharmacy.controlledMedications.specialRequirements) value += `, Special Requirements`;
    if (pharmacy.controlledMedications.specialRequirementsNote)
      value += `, ${pharmacy.controlledMedications.specialRequirementsNote}`;

    return value;
  };

  const renderSummaryItem = (name: string, value: string, isReferrals: boolean = false, manager: string = '') => (
    <div className={styles.summaryItem}>
      <Typography className={styles.field}>{name}</Typography>
      {isReferrals && !manager && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {valueOfReferrals()}
        </div>
      )}
      {manager && !isReferrals && <div>{valueOfManagers(manager)}</div>}
      {!isReferrals && !manager && <Typography>{value}</Typography>}
      {!value && !manager && !isReferrals && (
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

  const renderAdditionalInfo = () => (
    <div>
      {renderSummaryItem('How many deliveries will you have per day? ', pharmacy.dayPlannedDeliveryCount || '')}
      {renderSummaryItem('What is your expected delivery radius?', pharmacy.expectedDeliveryRadius || '')}
      {renderSummaryItem(
        'Do you deliver to assisted living facilities or group homes?',
        valueOfFacilitiesOrExistingDrivers('assistedLivingFacilitiesOrGroupHomes')
      )}
      {renderSummaryItem(
        'Will our couriers be allowed to leave prescriptions at the door/ in a safe location for our contactless delivery option?',
        pharmacy.isContactlessDelivery
      )}
      {renderSummaryItem(
        'Please check all the items you would like to have reported back at the end of each day',
        valueOfReportedBackItems()
      )}
      {renderSummaryItem('What time would you like our couriers to come by everyday?', pharmacy.timeForCouriers)}
      {renderSummaryItem(
        'Will you be delivering temperature regulated medications?',
        pharmacy.isTemperatureRegulatedMedications
      )}
      {renderSummaryItem(
        'Will you be delivering temperature regulated medications?',
        pharmacy.isTemperatureRegulatedMedications
      )}
      {renderSummaryItem(
        'Do you have any existing drivers you would like us to hire and use for your location?',
        valueOfFacilitiesOrExistingDrivers('existingDrivers')
      )}
      {renderSummaryItem('Will you be delivering controlled medications?', valueOfControlledMedications())}
      {renderSummaryItem(
        'Do you have any pharmacies you could refer to us that would also be interested in our delivery service?',
        '',
        true
      )}
      {renderSummaryItem('Any special instructions you would like our team to know?', pharmacy.specialInstructions)}
    </div>
  );

  return (
    <div className={styles.createPharmacyWrapper}>
      <div className={styles.pharmacyBlock}>{renderAdditionalInfo()}</div>
    </div>
  );
};

export default AdditionalInfo;
