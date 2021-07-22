import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import generalStyles from '../PharmacyInputs.module.sass';
import styles from './OrdersSettings.module.sass';
import CheckBox from '../../../../common/Checkbox';

interface IOrdersSettings {
  handleChange: any;
  newPharmacy: any;
}

const OrdersSettings: FC<IOrdersSettings> = ({ handleChange, newPharmacy }) => (
  <div className={styles.wrapper}>
    <Typography className={generalStyles.title}>Orders Settings</Typography>

    <div className={styles.checkBoxesWrapper}>
      <div className={styles.title} style={{ paddingBottom: '4px' }}>
        Please check all the fields you would like to fill in during order creation
      </div>
      <CheckBox
        label={'Medication Details (Name, Route, Milligrams and Dosage, Quantity)'}
        labelPlacement="end"
        checked={newPharmacy.ordersSettings.medicationDetails}
        onChange={handleChange('ordersSettings_medicationDetails')}
        className={styles.checkbox}
        colorChecked="#e21c40"
      />
      <CheckBox
        label={'Rx Copay'}
        labelPlacement="end"
        checked={newPharmacy.ordersSettings.rxCopay}
        onChange={handleChange('ordersSettings_rxCopay')}
        className={styles.checkbox}
        colorChecked="#e21c40"
      />
      <CheckBox
        colorChecked="#e21c40"
        label={'RX Number (required)'}
        labelPlacement="end"
        checked
        disabled
        className={styles.checkbox}
      />
      <CheckBox
        colorChecked="#e21c40"
        label={'Rx Fill Date (required)'}
        labelPlacement="end"
        checked
        disabled
        className={styles.checkbox}
      />
    </div>
  </div>
);

export default OrdersSettings;
