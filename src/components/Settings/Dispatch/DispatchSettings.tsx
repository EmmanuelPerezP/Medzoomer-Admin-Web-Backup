import React, { useState, useEffect } from 'react';
// import { useRouteMatch } from 'react-router';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
// import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '../../common/TextField';
import Loading from '../../common/Loading';
import styles from '../Settings.module.sass';
// import Error from "../../common/Error/Error";
import Select from '../../common/Select';
import { TurnOnOrOff } from '../../../constants';
import InputAdornment from '@material-ui/core/InputAdornment';
import useSettingsGP from '../../../hooks/useSettingsGP';
import Button from '@material-ui/core/Button';
import { Error } from '../../common/Error/Error';

export interface DispatchSettingsProps {
  typeObject: string;
  objectId: string;
  settingsGP: any;
}

export const DispatchSettings = (props: DispatchSettingsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateSettingGP } = useSettingsGP();
  const { typeObject, settingsGP, objectId } = props;
  const [newSettingGP, setNewSettingGP] = useState({
    _id: null,
    isManualBatchDeliveries: 'No',
    autoDispatchTimeframe: '180',
    dispatchedBeforeClosingHours: '120',
    maxDeliveryLegDistance: '10'
  });

  const [errors, setErrors] = useState({
    autoDispatchTimeframe: '',
    dispatchedBeforeClosingHours: '',
    maxDeliveryLegDistance: ''
  });

  const valid = (data: any) => {
    let isError = false;
    const newError = {
      autoDispatchTimeframe: '',
      dispatchedBeforeClosingHours: '',
      maxDeliveryLegDistance: ''
    };

    for (const i in newError) {
      if (!data[i]) {
        // @ts-ignore
        newError[i] = 'Field is not allowed to be empty';
        isError = true;
      }
    }

    if (data.autoDispatchTimeframe <= 0 || data.autoDispatchTimeframe % 15 > 0) {
      newError.autoDispatchTimeframe = 'Must be a multiple of 15';
      isError = true;
    }
    if (data.dispatchedBeforeClosingHours < 0) {
      newError.dispatchedBeforeClosingHours = 'Must be greater than or equal to 0';
      isError = true;
    }
    if (data.maxDeliveryLegDistance <= 0) {
      newError.maxDeliveryLegDistance = 'Must be greater than 0';
      isError = true;
    }

    setErrors(newError);
    return !isError;
  };

  const updateSettingGPEx = () => {
    if (valid(newSettingGP) && newSettingGP) {
      setIsLoading(true);
      updateSettingGP(newSettingGP, objectId, typeObject)
        .then((res) => {
          setNewSettingGP({ ...res.data });
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (settingsGP) {
      setNewSettingGP({ ...newSettingGP, ...settingsGP });
    }
    // eslint-disable-next-line
  }, [settingsGP]);

  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: string }>) => {
    const { value } = e.target;
    setNewSettingGP({ ...newSettingGP, [key]: value });
  };

  if (isLoading) {
    return <div className={styles.contactForm}>{<Loading />}</div>;
  }
  return (
    <div className={styles.contactForm}>
      <Typography className={styles.blockTitle}> Settings </Typography>
      <div className={styles.threeInput}>
        <div className={styles.textField}>
          <Select
            label={'Manual Batch Deliveries'}
            value={newSettingGP.isManualBatchDeliveries}
            onChange={handleChange('isManualBatchDeliveries')}
            items={TurnOnOrOff}
            classes={{ input: styles.input, selectLabel: styles.selectLabel, inputRoot: styles.inputRoot }}
            className={styles.periodSelect}
          />
        </div>
        <div className={styles.textField}>
          <TextField
            label={'Auto Dispatch Timeframe'}
            classes={{ root: classNames(styles.textField, styles.priceInput) }}
            value={newSettingGP.autoDispatchTimeframe}
            onChange={handleChange('autoDispatchTimeframe')}
            inputProps={{
              type: 'number',
              placeholder: '0',
              endAdornment: <InputAdornment position="start">minutes</InputAdornment>
            }}
          />
          {errors.autoDispatchTimeframe ? (
            <Error className={styles.errorAbsolute} value={errors.autoDispatchTimeframe} />
          ) : null}
        </div>
        <div className={styles.textField}>
          <TextField
            label={'Max delivery leg distance'}
            classes={{ root: classNames(styles.textField, styles.priceInput) }}
            value={newSettingGP.maxDeliveryLegDistance}
            onChange={handleChange('maxDeliveryLegDistance')}
            inputProps={{
              type: 'number',
              placeholder: '0',
              endAdornment: <InputAdornment position="start">miles</InputAdornment>
            }}
          />
          {errors.maxDeliveryLegDistance ? (
            <Error className={styles.errorAbsolute} value={errors.maxDeliveryLegDistance} />
          ) : null}
        </div>
      </div>

      <div className={styles.twoInput}>
        <div className={styles.textField}>
          <TextField
            label={'Orders should be dispatched before closing hours'}
            classes={{ root: classNames(styles.textField, styles.priceInput) }}
            value={newSettingGP.dispatchedBeforeClosingHours}
            onChange={handleChange('dispatchedBeforeClosingHours')}
            inputProps={{
              type: 'number',
              placeholder: '0',
              endAdornment: <InputAdornment position="start">minutes</InputAdornment>
            }}
          />
          {errors.dispatchedBeforeClosingHours ? (
            <Error className={styles.errorAbsolute} value={errors.dispatchedBeforeClosingHours} />
          ) : null}
        </div>
      </div>
      <div className={styles.buttonsSaveGP}>
        <Button
          className={styles.changeStepButton}
          variant="contained"
          color="secondary"
          disabled={isLoading}
          onClick={updateSettingGPEx}
        >
          <Typography className={styles.summaryText}>Save</Typography>
        </Button>
      </div>
    </div>
  );
};
