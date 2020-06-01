import React, { FC, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';

import TextField from '../common/TextField';
import useSetting from '../../hooks/useSetting';
import { SETTINGS } from '../../constants';

import styles from './SystemSettings.module.sass';

export const SystemSettings: FC = () => {
  const { getSetting, updateListSettings } = useSetting();
  const [settings, setSettings] = useState();
  const [loading, setLoading] = useState(false);

  const handleUpdateSettings = useCallback(async () => {
    try {
      setLoading(true);
      await updateListSettings(settings);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }, [settings]); // eslint-disable-line

  useEffect(() => {
    setLoading(true);
    getSetting([
      SETTINGS.COURIER_COMMISSION_DELIVERY,
      SETTINGS.COURIER_COMMISSION_TIPS,
      SETTINGS.DEFAULT_PRICE_PER_DELIVERY_PRICE,
      SETTINGS.VOLUME_PRICE_PER_DELIVERY_PRICE,
      SETTINGS.VOLUME_PRICE_PER_DELIVERY_OFFER_PER_MONTH
    ])
      .then((d) => {
        if (d && d.data) {
          setSettings(d.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []); // eslint-disable-line

  const handleChangeField = useCallback(
    (settingKey) => (e: any) => {
      setSettings({
        ...settings,
        [settingKey]: e.target.value
      });
    },
    [settings]
  );

  const getSettingValue = useCallback(
    (key) => {
      return settings && settings[key];
    },
    [settings]
  );

  return (
    <div className={styles.systemsWrapper}>
      <div className={styles.navigation}>
        <Typography className={styles.title}>System settings</Typography>
      </div>
      <div className={styles.settingBlock}>
        <Typography className={styles.blockTitle}>Courier Commissions</Typography>
        <div className={styles.inputBlock}>
          <TextField
            label={'Delivery'}
            className={styles.procentField}
            inputProps={{
              placeholder: 'Delivery',
              endAdornment: <InputAdornment position="start">%</InputAdornment>
            }}
            value={getSettingValue(SETTINGS.COURIER_COMMISSION_DELIVERY)}
            onChange={handleChangeField(SETTINGS.COURIER_COMMISSION_DELIVERY)}
          />
          <TextField
            label={'Tips'}
            className={styles.procentField}
            inputProps={{
              placeholder: 'Tips',
              endAdornment: <InputAdornment position="start">%</InputAdornment>
            }}
            value={getSettingValue(SETTINGS.COURIER_COMMISSION_TIPS)}
            onChange={handleChangeField(SETTINGS.COURIER_COMMISSION_TIPS)}
          />
        </div>
      </div>
      <div className={styles.settingBlock}>
        <Typography className={styles.blockTitle}>Default Price per Delivery</Typography>
        <div className={styles.inputBlock}>
          <TextField
            label={'Price'}
            className={styles.field}
            inputProps={{
              placeholder: 'Price',
              endAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
            value={getSettingValue(SETTINGS.DEFAULT_PRICE_PER_DELIVERY_PRICE)}
            onChange={handleChangeField(SETTINGS.DEFAULT_PRICE_PER_DELIVERY_PRICE)}
          />
        </div>
      </div>
      <div className={styles.settingBlock}>
        <Typography className={styles.blockTitle}>Volume Price per Delivery</Typography>
        <div className={styles.inputBlock}>
          <TextField
            label={'Offers per months'}
            className={styles.field}
            inputProps={{
              placeholder: 'Offers per months'
            }}
            value={getSettingValue(SETTINGS.VOLUME_PRICE_PER_DELIVERY_OFFER_PER_MONTH)}
            onChange={handleChangeField(SETTINGS.VOLUME_PRICE_PER_DELIVERY_OFFER_PER_MONTH)}
          />
          <TextField
            label={'Price'}
            className={styles.field}
            inputProps={{
              placeholder: 'Price',
              endAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
            value={getSettingValue(SETTINGS.VOLUME_PRICE_PER_DELIVERY_PRICE)}
            onChange={handleChangeField(SETTINGS.VOLUME_PRICE_PER_DELIVERY_PRICE)}
          />
        </div>
      </div>
      <div className={styles.navigation}>
        <Button variant="contained" color="secondary" disabled={!!loading} onClick={handleUpdateSettings}>
          <Typography>Update Settings</Typography>
        </Button>
      </div>
    </div>
  );
};
