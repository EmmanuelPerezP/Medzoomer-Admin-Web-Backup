import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '../../../../common/TextField';
import Error from '../../../../common/Error';
import generalStyles from '../PharmacyInputs.module.sass';
import styles from './ManagerProfile.module.sass';
import PhoneInput from '../../../../common/PhoneInput';

interface IManagerProfile {
  err: any;
  handleChange: any;
  newPharmacy: any;
}

const ManagerProfile: FC<IManagerProfile> = ({ err, handleChange, newPharmacy }) => (
  <div className={styles.managerProfileWrapper}>
    <Typography className={generalStyles.blockTitle}>Manager Profile</Typography>

    <Typography className={styles.subtitle}>Primary Contact</Typography>
    <div className={generalStyles.twoInputInRowBlock}>
      <div className={generalStyles.inputWrapper}>
        <TextField
          label={'First Name'}
          classes={{
            root: generalStyles.textField
          }}
          inputProps={{
            placeholder: 'Required'
          }}
          value={newPharmacy.managers.primaryContact.firstName}
          onChange={handleChange('managers_primaryContact_firstName')}
        />
        {err.managers.primaryContact.firstName && (
          <Error className={generalStyles.error} value={err.managers.primaryContact.firstName} />
        )}
      </div>

      <div className={generalStyles.inputWrapper}>
        <TextField
          label={'Last Name'}
          classes={{
            root: generalStyles.textField
          }}
          inputProps={{
            placeholder: 'Required'
          }}
          value={newPharmacy.managers.primaryContact.lastName}
          onChange={handleChange('managers_primaryContact_lastName')}
        />
        {err.managers.primaryContact.lastName && (
          <Error className={generalStyles.error} value={err.managers.primaryContact.lastName} />
        )}
      </div>
    </div>
    <div className={generalStyles.twoInputInRowBlock}>
      <div className={generalStyles.inputWrapper}>
        <PhoneInput
          label="Contact Phone"
          fullBorder
          value={newPharmacy.managers.primaryContact.phone}
          onChange={handleChange('managers_primaryContact_phone')}
        />
        {err.managers.primaryContact.phone && (
          <Error className={generalStyles.error} value={err.managers.primaryContact.phone} />
        )}
      </div>

      <div className={generalStyles.inputWrapper}>
        <TextField
          label={'Contact Email'}
          classes={{
            root: generalStyles.textField
          }}
          inputProps={{
            placeholder: 'Required'
          }}
          value={newPharmacy.managers.primaryContact.email}
          onChange={handleChange('managers_primaryContact_email')}
        />
        {err.managers.primaryContact.email && (
          <Error className={generalStyles.error} value={err.managers.primaryContact.email} />
        )}
      </div>
    </div>

    <Typography className={styles.subtitle}>Secondary Contact</Typography>
    <div className={generalStyles.twoInputInRowBlock}>
      <div className={generalStyles.inputWrapper}>
        <TextField
          label={'First Name'}
          classes={{
            root: generalStyles.textField
          }}
          inputProps={{
            placeholder: 'Optional'
          }}
          value={newPharmacy.managers.secondaryContact.firstName}
          onChange={handleChange('managers_secondaryContact_firstName')}
        />
      </div>

      <div className={generalStyles.inputWrapper}>
        <TextField
          label={'Last Name'}
          classes={{
            root: generalStyles.textField
          }}
          inputProps={{
            placeholder: 'Optional'
          }}
          value={newPharmacy.managers.secondaryContact.lastName}
          onChange={handleChange('managers_secondaryContact_lastName')}
        />
      </div>
    </div>
    <div className={generalStyles.twoInputInRowBlock}>
      <div className={generalStyles.inputWrapper}>
        <PhoneInput
          label="Contact Phone"
          fullBorder
          value={newPharmacy.managers.secondaryContact.phone}
          onChange={handleChange('managers_secondaryContact_phone')}
        />
      </div>

      <div className={generalStyles.inputWrapper}>
        <TextField
          label={'Contact Email'}
          classes={{
            root: generalStyles.textField
          }}
          inputProps={{
            placeholder: 'Optional'
          }}
          value={newPharmacy.managers.secondaryContact.email}
          onChange={handleChange('managers_secondaryContact_email')}
        />
      </div>
    </div>
  </div>
);

export default ManagerProfile;
