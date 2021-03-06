import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '../../../../../common/TextField';
import styles from './styles.module.sass';
import RadioGroup from '../../../../../common/RadioGroup';
import CheckBox from '../../../../../common/Checkbox';
import ReferralsBlock from '../../../PharmacyInputs/ReferralsBlock/ReferralsBlock';
import usePharmacy from '../../../../../../hooks/usePharmacy';
import useHandlePharmacyInputs from '../../../../../../hooks/useHandlePharmacyInputs';

interface IEditAdditionalInfo {
  err: any;
  setError: any;
}

const expectedDeliveryRadiusItems = [
  {
    label: '0-10 mi',
    value: '0-10'
  },
  {
    label: '0-25 mi',
    value: '0-25'
  },
  {
    label: '0-50 mi',
    value: '0-50'
  },
  {
    label: '50+ mi (Please call for pricing)',
    value: '50+'
  }
];

const couriersTimeItems = [
  {
    label: 'Before noon',
    value: 'Before noon'
  },
  {
    label: 'Before 2 pm',
    value: 'Before 2 pm'
  },
  {
    label: '2 hours before store closed',
    value: '2 hours before store closed'
  }
];

const EditAdditionalInfo: FC<IEditAdditionalInfo> = ({ err, setError }) => {
  const { newPharmacy } = usePharmacy();
  const { actions } = useHandlePharmacyInputs();

  const handleChange = (key: string) => (e: any) => {
    const { value, checked } = e.target;
    const newValue: any = value;

    if (key.includes('reportedBackItems') || key.includes('ordersSettings')) {
      return actions.handleItemsWithTwoKeyNames(key, checked, setError, err);
    }
    if (key.includes('controlledMedications')) {
      return actions.handleControlledMedications(key, newValue, checked, setError, err);
    }
    if (key.includes('existingDrivers') || key.includes('assistedLivingFacilitiesOrGroupHomes')) {
      return actions.handleExistingDriversOrAssistedLivingFacilitiesOrGroupHomes(key, newValue, setError, err);
    }
    if (key.includes('referrals')) return actions.handleReferrals(key, newValue, setError, err);

    actions.handleStrValue(key, value, setError, err);
  };

  return (
    <div className={styles.additionalInfoWrapper}>
      <Typography className={styles.mainTitle}>Additional Information</Typography>

      <div className={styles.blockWrapper} style={{ paddingTop: 0 }}>
        <div className={styles.title}>How many deliveries will you have per day?</div>
        <TextField
          label={''}
          classes={{
            inputRoot: styles.inputRoot,
            root: styles.textField
          }}
          inputProps={{
            placeholder: 'e.g. 10-20'
          }}
          value={newPharmacy.dayPlannedDeliveryCount}
          onChange={handleChange('dayPlannedDeliveryCount')}
        />
      </div>

      <div className={styles.blockWrapper} style={{ paddingBottom: '10px' }}>
        <div className={styles.title}>What is your expected delivery radius?</div>
        <RadioGroup
          items={expectedDeliveryRadiusItems}
          value={newPharmacy.expectedDeliveryRadius || expectedDeliveryRadiusItems[0].value}
          onChange={handleChange('expectedDeliveryRadius')}
        />
      </div>

      <div className={styles.blockWrapper}>
        <div className={styles.title}>Do you deliver to assisted living facilities or group homes?</div>
        <RadioGroup
          items={[]}
          value={newPharmacy.assistedLivingFacilitiesOrGroupHomes.value}
          onChange={handleChange('assistedLivingFacilitiesOrGroupHomes_value')}
        />
        {newPharmacy.assistedLivingFacilitiesOrGroupHomes.value === 'Yes' && (
          <TextField
            label={'Expected daily volume'}
            classes={{
              inputRoot: styles.inputRoot,
              root: styles.textField
            }}
            inputProps={{
              placeholder: 'e.g. 10'
            }}
            value={newPharmacy.assistedLivingFacilitiesOrGroupHomes.volume}
            onChange={handleChange('assistedLivingFacilitiesOrGroupHomes_volume')}
          />
        )}
        {newPharmacy.assistedLivingFacilitiesOrGroupHomes.value !== 'Yes' && <div style={{ height: '10px' }} />}
      </div>

      <div className={styles.blockWrapper} style={{ paddingBottom: '10px' }}>
        <div className={styles.title}>
          Will our couriers be allowed to leave prescriptions at the door/ in a safe location for our contactless
          delivery option?
        </div>
        <RadioGroup
          items={[]}
          value={newPharmacy.isContactlessDelivery}
          onChange={handleChange('isContactlessDelivery')}
        />
      </div>

      <div className={styles.blockWrapper}>
        <div className={styles.title} style={{ paddingBottom: '4px' }}>
          Please check all the items you would like to have reported back at the end of each day
        </div>
        <CheckBox
          label={'Customer Name'}
          labelPlacement="end"
          checked={newPharmacy.reportedBackItems.customerName}
          onChange={handleChange('reportedBackItems_customerName')}
          className={styles.checkbox}
          colorChecked="#e21c40"
        />
        <CheckBox
          label={'RX Number'}
          labelPlacement="end"
          checked={newPharmacy.reportedBackItems.rxNumber}
          onChange={handleChange('reportedBackItems_rxNumber')}
          className={styles.checkbox}
          colorChecked="#e21c40"
        />
        <CheckBox
          label={'Signature'}
          labelPlacement="end"
          checked={newPharmacy.reportedBackItems.signature}
          onChange={handleChange('reportedBackItems_signature')}
          className={styles.checkbox}
          colorChecked="#e21c40"
        />
        <CheckBox
          label={'Date'}
          labelPlacement="end"
          checked={newPharmacy.reportedBackItems.date}
          onChange={handleChange('reportedBackItems_date')}
          className={styles.checkbox}
          colorChecked="#e21c40"
        />
        <CheckBox
          label={'Medication name'}
          labelPlacement="end"
          checked={newPharmacy.reportedBackItems.medicationName}
          onChange={handleChange('reportedBackItems_medicationName')}
          className={styles.checkbox}
          colorChecked="#e21c40"
        />
        <CheckBox
          label={'Delivery Confirmation Photos'}
          secondLabel={' (only for contactless deliveries)'}
          secondLabelClassName={styles.checkboxSecondLabelClassName}
          labelPlacement="end"
          checked={newPharmacy.reportedBackItems.deliveryConfirmationPhotos}
          onChange={handleChange('reportedBackItems_deliveryConfirmationPhotos')}
          className={styles.checkbox}
          colorChecked="#e21c40"
        />
        <div style={{ height: '20px' }} />
      </div>

      <div className={styles.blockWrapper}>
        <div className={styles.title}>What time would you like our couriers to come by everyday?</div>
        <RadioGroup
          items={couriersTimeItems}
          value={newPharmacy.timeForCouriers}
          onChange={handleChange('timeForCouriers')}
        />
        <div style={{ height: '10px' }} />
      </div>

      <div className={styles.blockWrapper}>
        <div className={styles.title}>Will you be delivering temperature regulated medications?</div>
        <RadioGroup
          items={[]}
          value={newPharmacy.isTemperatureRegulatedMedications}
          onChange={handleChange('isTemperatureRegulatedMedications')}
        />
        <div style={{ height: '10px' }} />
      </div>

      <div className={styles.blockWrapper}>
        <div className={styles.title}>
          Do you have any existing drivers you would like us to hire and use for your location?
        </div>
        <RadioGroup
          items={[]}
          value={newPharmacy.existingDrivers.value}
          onChange={handleChange('existingDrivers_value')}
        />
        {newPharmacy.existingDrivers.value === 'Yes' && (
          <TextField
            label={'How many'}
            classes={{
              inputRoot: styles.inputRoot,
              root: styles.textField
            }}
            inputProps={{
              placeholder: 'e.g. 5'
            }}
            value={newPharmacy.existingDrivers.volume}
            onChange={handleChange('existingDrivers_volume')}
          />
        )}
        {newPharmacy.existingDrivers.value !== 'Yes' && <div style={{ height: '10px' }} />}
      </div>

      <div className={styles.blockWrapper}>
        <div className={styles.title}>Will you be delivering controlled medications?</div>
        <RadioGroup
          items={[]}
          value={newPharmacy.controlledMedications.value}
          onChange={handleChange('controlledMedications_value')}
        />
        {newPharmacy.controlledMedications.value !== 'Yes' && <div style={{ height: '10px' }} />}
        {newPharmacy.controlledMedications.value === 'Yes' && (
          <div>
            <div className={styles.subtitle}>How would you like us to confirm the delivery?</div>
            <div className={styles.controlledMedicationsCheckboxes}>
              <CheckBox
                label={'Signature'}
                labelPlacement="end"
                checked={newPharmacy.controlledMedications.signature}
                onChange={handleChange('controlledMedications_signature')}
                className={styles.checkbox}
                colorChecked="#e21c40"
              />
              <CheckBox
                label={'Photo of ID'}
                labelPlacement="end"
                checked={newPharmacy.controlledMedications.photoOfId}
                onChange={handleChange('controlledMedications_photoOfId')}
                className={styles.checkbox}
                colorChecked="#e21c40"
              />
              <CheckBox
                label={'Special Requirements'}
                labelPlacement="end"
                checked={newPharmacy.controlledMedications.specialRequirements}
                onChange={handleChange('controlledMedications_specialRequirements')}
                className={styles.checkbox}
                colorChecked="#e21c40"
              />
            </div>
            <div className={styles.specialRequirementsTextField}>
              <TextField
                label={''}
                classes={{
                  root: styles.textFieldMultiline,
                  input: styles.input
                }}
                inputProps={{ placeholder: 'Your Requirements' }}
                multiline
                rows={4}
                value={newPharmacy.controlledMedications.specialRequirementsNote}
                onChange={handleChange('controlledMedications_specialRequirementsNote')}
              />
            </div>
          </div>
        )}
      </div>

      <ReferralsBlock
        err={err}
        handleChange={handleChange}
        newPharmacy={newPharmacy}
        removeReferral={actions.removeReferral}
        addNewReferrals={actions.addNewReferrals}
      />

      <div className={styles.blockWrapper}>
        <div className={styles.title}>Any special instructions you would like our team to know?</div>
        <TextField
          label={''}
          classes={{
            root: styles.textFieldMultiline,
            input: styles.input
          }}
          inputProps={{ placeholder: 'Optional' }}
          multiline
          rows={4}
          value={newPharmacy.specialInstructions}
          onChange={handleChange('specialInstructions')}
        />
      </div>
    </div>
  );
};
export default EditAdditionalInfo;
