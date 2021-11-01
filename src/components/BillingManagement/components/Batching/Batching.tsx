import React, { FC } from 'react';
import { InputAdornment, Typography } from '@material-ui/core';
import styles from './Batching.module.sass';
import classNames from 'classnames';
import SelectButton from '../../../common/SelectButton';
import TextField from '../../../common/TextField';
import Loading from '../../../common/Loading';
import { SettingsGP } from '../../../../interfaces';
import { Error } from '../../../common/Error/Error';

interface Props {
  sectionRef: any;
  settingGroup: SettingsGP;
  notDefaultBilling: any;
  isLoading: boolean;
  errors: any;
  handleChange: Function;
}

export const Batching: FC<Props> = (props) => {
  const { sectionRef, notDefaultBilling, isLoading, settingGroup, errors, handleChange } = props;
  const batchingOptions = {
    autoDispatchTimeframe: {
      label: 'Auto-Dispatch Timeframe',
      unit: 'min'
    },
    maxDeliveryLegDistance: {
      label: 'Max Delivery Leg Distance',
      unit: 'miles'
    }
  };

  const renderInputField = (field: string) => {
    return (
      <div className={styles.textField}>
        <TextField
          // @ts-ignore
          label={batchingOptions[field].label}
          classes={{
            root: classNames(styles.input)
          }}
          inputProps={{
            type: 'number',
            placeholder: '0.00',
            startAdornment: (
              // @ts-ignore
              <InputAdornment position="start">{batchingOptions[field].unit}</InputAdornment>
            )
          }}
          // @ts-ignore
          value={settingGroup[field]}
          onChange={handleChange(field)}
        />
        {errors[field] ? <Error className={styles.error} value={errors[field]} /> : null}
      </div>
    );
  };

  return (
    <div ref={sectionRef} className={notDefaultBilling ? styles.groupBlock : styles.systemsWrapper}>
      <Typography className={styles.blockTitle}>Batching</Typography>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.threeInput}>
          <div className={styles.toggle}>
            <SelectButton
              label="Manual Batch Deliveries"
              value={settingGroup.isManualBatchDeliveries}
              onChange={handleChange('isManualBatchDeliveries')}
            />
          </div>
          {Object.keys(batchingOptions).map((field) => renderInputField(field))}
        </div>
      )}
    </div>
  );
};
