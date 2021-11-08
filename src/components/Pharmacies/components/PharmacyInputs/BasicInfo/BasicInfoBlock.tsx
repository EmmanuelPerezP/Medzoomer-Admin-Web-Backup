import React, { FC } from 'react';

import Error from '../../../../../components/common/Error';
import MapSearch from '../../../../../components/common/MapSearch';
import PhoneInput from '../../../../../components/common/PhoneInput';
import TextField from '../../../../../components/common/TextField';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import generalStyles from '../PharmacyInputs.module.sass';
import styles from './BasicInfoBlock.module.sass';
import AutoCompleteField from '../../../../common/PharmacyAutocomplete/AutoCompleteField';
import AutoComplete from '../../../../common/AutoComplete/index';
import AsyncCreatable from 'react-select/async-creatable';
import CreatableSelect from 'react-select/creatable';
interface IBasicInfoBlock {
  err: any;
  setError: any;
  handleChange: any;
  newPharmacy: any;
  addressError?: any;
  setAddressError?: any;
  searchFunction?: any;
  createFunction?: any;
  handleInputSoftware?: any;
  handleSelectSoftware?: any;
  options?: [];
}

const BasicInfoBlock: FC<IBasicInfoBlock> = ({
  err,
  setError,
  handleChange,
  newPharmacy,
  addressError,
  setAddressError,
  searchFunction,
  createFunction,
  handleSelectSoftware,
  options,
  handleInputSoftware
}) => (
  <div
    className={clsx({
      [styles.basicInfoBlock]: true
    })}
  >
    <Typography className={generalStyles.blockTitle}>Basic Information</Typography>

    <div className={generalStyles.twoInputInRowBlock}>
      <div className={generalStyles.inputWrapper}>
        <TextField
          label={'Pharmacy Name'}
          classes={{
            inputRoot: generalStyles.inputRoot,
            root: generalStyles.textField
          }}
          inputProps={{
            placeholder: 'Required'
          }}
          value={newPharmacy.name}
          onChange={handleChange('name')}
        />
        {err.name && <Error className={generalStyles.error} value={err.name} />}
      </div>

      <div className={generalStyles.inputWrapper}>
        <PhoneInput
          label="Pharmacy Phone Number"
          fullBorder
          value={newPharmacy.phone_number}
          onChange={handleChange('phone_number')}
        />
        {err.phone_number && <Error className={generalStyles.error} value={err.phone_number} />}
      </div>
    </div>

    <div className={generalStyles.twoInputInRowBlock}>
      <div className={generalStyles.inputWrapper}>
        <MapSearch
          addressError={addressError}
          setAddressError={setAddressError}
          handleClearError={() => setError({ ...err, roughAddress: '', latitude: '', longitude: '' })}
          setError={setError}
          err={err}
        />
        {err.roughAddress && <Error className={generalStyles.error} value={err.roughAddress} />}
        {!err.roughAddress && (err.latitude || err.longitude) && (
          <Error value={'Please, select an address from the proposed'} />
        )}
      </div>
      <div className={generalStyles.inputWrapper}>
        <TextField
          label={'Unit/Apartment Number'}
          classes={{
            input: styles.input,
            inputRoot: styles.inputRoot,
            root: styles.textField
          }}
          inputProps={{
            placeholder: 'Unit/Apartment'
          }}
          value={newPharmacy.roughAddressObj ? newPharmacy.roughAddressObj.apartment : newPharmacy.address.apartment}
          onChange={handleChange('apartment')}
        />
      </div>

      <div className={generalStyles.inputWrapper}>
        <p className={styles.Label}>Pharmacy Software</p>
        <CreatableSelect
          defaultOptions
          className={styles.Select}
          options={options}
          value={newPharmacy.pharmacySoftware}
          onChange={handleSelectSoftware}

          onCreateOption={createFunction}
          placeholder={'Required'}
        />
      </div>
    </div>
  </div>
);

export default BasicInfoBlock;
