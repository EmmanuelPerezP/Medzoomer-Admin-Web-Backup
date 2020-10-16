import React, { FC, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';

import TextField from '../../../common/TextField';
import useSetting from '../../../../hooks/useSetting';
import { SETTINGS, settingsError } from '../../../../constants';
import Error from '../../../common/Error';
import Loading from '../../../common/Loading';

import styles from './SystemSettings.module.sass';

export const SystemSettings: FC = () => {
  const { getSetting, updateListSettings } = useSetting();
  const [settings, setSettings] = useState();
  const [isLoading, setLoading] = useState(false);
  const [err, setErr] = useState({
    delivery: '',
    transaction_fee: '',
    training_video_link: ''
  });

  const isValid = () => {
    let isError = true;

    setErr({
      ...err,
      ...Object.keys(settings).reduce((res: object, e: any) => {
        if (e !== 'training_video_link' && settings[e] > 100) {
          isError = false;
          return { ...res, [e]: `${settingsError[e]} must be lower then 100` };
        }

        if (e !== 'training_video_link' && settings[e] < 0) {
          isError = false;
          return { ...res, [e]: `${settingsError[e]} must be greater then 0` };
        }

        if (!settings[e]) {
          isError = false;
          return { ...res, [e]: `${settingsError[e]} is not allowed to be empty` };
        }

        return { ...res };
      }, {})
    });

    return isError;
  };

  const parseValues = () => {
    return {
      [SETTINGS.TRAINING_VIDEO_LINK]: settings[SETTINGS.TRAINING_VIDEO_LINK],
      [SETTINGS.COURIER_COMMISSION_DELIVERY]: Number(settings[SETTINGS.COURIER_COMMISSION_DELIVERY]),
      [SETTINGS.COURIER_TRANSACTION_FEE]: Number(settings[SETTINGS.COURIER_TRANSACTION_FEE])
    };
  };

  const handleUpdateSettings = useCallback(async () => {
    if (isValid()) {
      const parsedSettings = parseValues();

      try {
        setLoading(true);
        await updateListSettings(parsedSettings);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
    return;
  }, [settings]); // eslint-disable-line

  useEffect(() => {
    setLoading(true);
    getSetting([SETTINGS.COURIER_COMMISSION_DELIVERY, SETTINGS.TRAINING_VIDEO_LINK, SETTINGS.COURIER_TRANSACTION_FEE])
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
      setErr({ ...err, [settingKey]: '' });
    },
    [settings, err]
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
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className={styles.settingBlock}>
            <Typography className={styles.blockTitle}>Courier Commissions</Typography>
            <div className={styles.inputBlock}>
              <div>
                <TextField
                  label={'Delivery'}
                  className={styles.procentField}
                  inputProps={{
                    placeholder: 'Delivery',
                    type: 'number',
                    endAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                  value={getSettingValue(SETTINGS.COURIER_COMMISSION_DELIVERY)}
                  onChange={handleChangeField(SETTINGS.COURIER_COMMISSION_DELIVERY)}
                />
                {err.delivery ? <Error className={styles.error} value={err.delivery} /> : null}
              </div>
              <div>
                <TextField
                  label={'Transaction fee'}
                  className={styles.feeField}
                  inputProps={{
                    placeholder: 'Transaction fee',
                    type: 'number',
                    endAdornment: <InputAdornment position="start">%</InputAdornment>
                  }}
                  value={getSettingValue(SETTINGS.COURIER_TRANSACTION_FEE)}
                  onChange={handleChangeField(SETTINGS.COURIER_TRANSACTION_FEE)}
                />
                {err.transaction_fee ? <Error className={styles.error} value={err.transaction_fee} /> : null}
              </div>
            </div>
          </div>
          <div className={styles.settingBlock}>
            <Typography className={styles.blockTitle}>Training Video Link</Typography>
            <div className={styles.inputBlock}>
              <div>
                <TextField
                  label={'Link'}
                  className={styles.field}
                  inputProps={{
                    placeholder: 'Link'
                  }}
                  value={getSettingValue(SETTINGS.TRAINING_VIDEO_LINK)}
                  onChange={handleChangeField(SETTINGS.TRAINING_VIDEO_LINK)}
                />
                {err.training_video_link ? <Error className={styles.error} value={err.training_video_link} /> : null}
              </div>
            </div>
          </div>
          <div className={styles.navigation}>
            <Button variant="contained" color="secondary" disabled={!!isLoading} onClick={handleUpdateSettings}>
              <Typography>Update Settings</Typography>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
