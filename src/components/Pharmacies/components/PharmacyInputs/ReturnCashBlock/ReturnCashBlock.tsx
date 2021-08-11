import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '../../../../common/TextField';
import CheckBox from '../../../../common/Checkbox';
import styles from './styles.module.sass';
import generalStyles from '../PharmacyInputs.module.sass';

interface IProps {
  handleChange: any;
  pharmacy: any;
}

const ReturnCashBlock: FC<IProps> = ({ pharmacy, handleChange }) => (
  <div className={styles.wrapper}>
    <Typography className={generalStyles.title}>Return Copay Configuration</Typography>

    <div className={styles.abilityToEnable}>
      <CheckBox label={''} checked={pharmacy.rcEnable} onChange={handleChange('rc_rcEnable')} colorChecked="#e21c40" />
      <Typography className={styles.subTitle}>Ability to enable return copay for orders</Typography>
    </div>

    {pharmacy.rcEnable && (
      <>
        <div className={generalStyles.twoInputInRowBlock}>
          <div className={generalStyles.inputWrapper}>
            <TextField
              label={'Flat Fee for Paying Courier'}
              classes={{
                root: styles.textField
              }}
              inputProps={{
                type: 'number',
                placeholder: '0.00',
                endAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              value={pharmacy.rcFlatFeeForCourier}
              onChange={handleChange('rc_rcFlatFeeForCourier')}
            />
          </div>

          <div className={generalStyles.inputWrapper}>
            <TextField
              label={'Flat Fee for Charge Pharmacy'}
              classes={{
                root: styles.textField
              }}
              inputProps={{
                type: 'number',
                placeholder: '0.00',
                endAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              value={pharmacy.rcFlatFeeForPharmacy}
              onChange={handleChange('rc_rcFlatFeeForPharmacy')}
            />
          </div>
        </div>
      </>
    )}
  </div>
);

export default ReturnCashBlock;
