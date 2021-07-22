import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '../../../../common/TextField';
//import Error from '../../../../common/Error';
import generalStyles from '../PharmacyInputs.module.sass';
import styles from './ReferralsBlock.module.sass';
import SVGIcon from '../../../../common/SVGIcon';

interface IReferralsBlock {
  err: any;
  setError: any;
  handleChange: any;
  newPharmacy: any;
  addNewReferrals: any;
  removeReferral: any;
}

const ReferralsBlock: FC<IReferralsBlock> = ({
  err,
  setError,
  handleChange,
  newPharmacy,
  addNewReferrals,
  removeReferral
}) => (
  <div className={styles.wrapper}>
    <Typography className={generalStyles.blockTitle}>
      Do you have any pharmacies you could refer to us that would also be interested in our delivery service?
    </Typography>
    <div className={styles.bonusLabel}>
      You will receive
      <span className={styles.amount}> $250 </span>
      for every location that signs up!
    </div>

    {newPharmacy.referrals.map((referral: any, i: any) => {
      // console.log('referral -->', referral);

      return (
        <div key={i}>
          <div className={styles.referralLabel}>
            Referral #{i + 1}
            {i !== 0 && (
              <Button className={styles.removeButton} onClick={() => removeReferral(i)}>
                <SVGIcon name={'remove'} />
              </Button>
            )}
          </div>

          <div className={generalStyles.twoInputInRowBlock}>
            <div className={generalStyles.inputWrapper}>
              <TextField
                label={'Pharmacy Name'}
                classes={{
                  inputRoot: generalStyles.inputRoot,
                  root: generalStyles.textField
                }}
                inputProps={{
                  placeholder: 'Please enter'
                }}
                value={newPharmacy.referrals[i].pharmacyName}
                onChange={handleChange(`referrals_${i}_pharmacyName`)} // will be changed !
              />
              {/* {err.name && <Error className={generalStyles.error} value={err.name} />} */}
            </div>

            <div className={generalStyles.inputWrapper}>
              <TextField
                label={'Manager/Owner Name'}
                classes={{
                  inputRoot: generalStyles.inputRoot,
                  root: generalStyles.textField
                }}
                inputProps={{
                  placeholder: 'Please enter'
                }}
                value={newPharmacy.referrals[i].managerName}
                onChange={handleChange(`referrals_${i}_managerName`)} // will be changed !
              />
              {/* {err.phone_number && <Error className={generalStyles.error} value={err.phone_number} />} */}
            </div>
          </div>
          <TextField
            label={'Contact Information'}
            classes={{
              inputRoot: generalStyles.inputRoot,
              root: styles.contactInformationInput
            }}
            inputProps={{
              placeholder: 'Email, phone number, etc.'
            }}
            value={newPharmacy.referrals[i].contactInfo}
            onChange={handleChange(`referrals_${i}_contactInfo`)} // will be changed !
          />
        </div>
      );
    })}
    <div className={styles.addOneMoreButtonWrapper}>
      <Button className={styles.addOneMoreButton} onClick={() => addNewReferrals()}>
        + Add one more
      </Button>
    </div>
  </div>
);

export default ReferralsBlock;
