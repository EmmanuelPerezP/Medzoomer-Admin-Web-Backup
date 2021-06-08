import React, { useCallback, useMemo, useState, FC } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';

import TextField from '../../../../../common/TextField';
import CheckBox from '../../../../../common/Checkbox';

import usePharmacy from '../../../../../../hooks/usePharmacy';
import { IProps, Event } from './types';

import styles from '../../PharmacyInfo.module.sass';
import Loading from '../../../../../common/Loading';

export const ReturnCashConfiguration: FC<IProps> = ({
  rcEnable = false,
  rcFlatFeeForCourier = null,
  rcFlatFeeForPharmacy = null,
  onChangeRcEnable,
  id,
  onChangeRcFlatFeeForCourier,
  onChangeRcFlatFeeForPharmacy
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const Loader = useMemo(
    () => ({
      show: () => setIsLoading(true),
      hide: () => setIsLoading(false)
    }),
    [setIsLoading]
  );

  const Error = useMemo(
    () => ({
      set: setError,
      clear: () => setError(null)
    }),
    [setError]
  );

  const { updatePharmacyRCSettings } = usePharmacy();

  const handleSave = useCallback(async () => {
    Loader.show();
    Error.clear();
    try {
      const res = await updatePharmacyRCSettings(id, {
        rcEnable,
        rcFlatFeeForCourier,
        rcFlatFeeForPharmacy
      });
    } catch (e) {
      Error.set(e.message || 'Something went wrong.')
      // tslint:disable-next-line:no-console
      console.log(e);
    } finally {
      Loader.hide();
    }
  }, [rcEnable, rcFlatFeeForCourier, rcFlatFeeForPharmacy]);

  const handleRcEnable = useMemo(
    () => ({
      toggle: () => onChangeRcEnable(!rcEnable)
    }),
    [onChangeRcEnable, rcEnable]
  );

  const handleFlatFeeForCourier = useCallback(
    (e: Event) => {
      const { value } = e.target;
      onChangeRcFlatFeeForCourier(+value);
    },
    [onChangeRcFlatFeeForCourier]
  );

  const handleFlatFeeForPharmacy = useCallback(
    (e: Event) => {
      const { value } = e.target;
      onChangeRcFlatFeeForPharmacy(+value);
    },
    [onChangeRcFlatFeeForPharmacy]
  );

  const renderButton = () => (
    <Button className={styles.saveButton} variant="contained" onClick={handleSave}>
      <Typography className={styles.saveButtonTitle}>Save</Typography>
    </Button>
  );

  const renderLoader = () => <Loading size={25} />;

  return (
    <div className={styles.returnCashContainer}>
      <div className={styles.configurationRow}>
        <Typography className={styles.blockTitle}>Return Cash Configuration</Typography>
        {isLoading ? renderLoader() : renderButton()}
      </div>

      <div className={styles.configurationRow}>
        <Typography className={styles.configurationTitle}>Ability to enable return cash for orders</Typography>
        <CheckBox label={''} checked={rcEnable} onChange={handleRcEnable.toggle} />
      </div>
      {rcEnable ? (
        <>
          <div className={styles.configurationRow}>
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
              value={rcFlatFeeForCourier}
              onChange={handleFlatFeeForCourier}
            />
          </div>
          <div className={styles.configurationRow}>
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
              value={rcFlatFeeForPharmacy}
              onChange={handleFlatFeeForPharmacy}
            />
          </div>
        </>
      ) : null}
      {error ? (
        <div className={styles.configurationRow}>
          <div className={styles.errorText}>Error while saving: {error}</div>
        </div>
      ) : null}
    </div>
  );
};
