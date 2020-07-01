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
    tips: '',
    default_price_per_delivery_price: '',
    training_video_link: '',
    volume_price_per_delivery_offer_per_month: '',
    volume_price_per_delivery_price: ''
  });

  const isValid = () => {
    let isError = true;

    setErr({
      ...err,
      ...Object.keys(settings).reduce((res: object, e: any) => {
        if (e !== 'training_video_link' && e !== 'volume_price_per_delivery_offer_per_month' && settings[e] > 100) {
          isError = false;
          return { ...res, [e]: `${settingsError[e]} must be lower then 100` };
        }

        if (e === 'volume_price_per_delivery_offer_per_month' && settings[e] > 1000) {
          isError = false;
          return { ...res, [e]: `${settingsError[e]} must be lower then 1000` };
        }
        // volume_price_per_delivery_price default_price_per_delivery_price
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
      [SETTINGS.COURIER_COMMISSION_DELIVERY]: Number(settings[SETTINGS.COURIER_COMMISSION_DELIVERY]).toFixed(0),
      [SETTINGS.COURIER_COMMISSION_TIPS]: Number(settings[SETTINGS.COURIER_COMMISSION_TIPS]).toFixed(0),
      [SETTINGS.VOLUME_PRICE_PER_DELIVERY_PRICE]: Number(settings[SETTINGS.VOLUME_PRICE_PER_DELIVERY_PRICE]).toFixed(2),
      [SETTINGS.DEFAULT_PRICE_PER_DELIVERY_PRICE]: Number(settings[SETTINGS.DEFAULT_PRICE_PER_DELIVERY_PRICE]).toFixed(
        2
      ),
      [SETTINGS.VOLUME_PRICE_PER_DELIVERY_OFFER_PER_MONTH]: Number(
        settings[SETTINGS.VOLUME_PRICE_PER_DELIVERY_OFFER_PER_MONTH]
      ).toFixed(0)
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
    getSetting([
      SETTINGS.COURIER_COMMISSION_DELIVERY,
      SETTINGS.COURIER_COMMISSION_TIPS,
      SETTINGS.DEFAULT_PRICE_PER_DELIVERY_PRICE,
      SETTINGS.VOLUME_PRICE_PER_DELIVERY_PRICE,
      SETTINGS.VOLUME_PRICE_PER_DELIVERY_OFFER_PER_MONTH,
      SETTINGS.TRAINING_VIDEO_LINK
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
              {/* <div>
                <TextField
                  label={'Tips'}
                  className={styles.procentField}
                  inputProps={{
                    placeholder: 'Tips',
                    type: 'number',
                    endAdornment: <InputAdornment position="start">%</InputAdornment>
                  }}
                  value={getSettingValue(SETTINGS.COURIER_COMMISSION_TIPS)}
                  onChange={handleChangeField(SETTINGS.COURIER_COMMISSION_TIPS)}
                />
                {err.tips ? <Error className={styles.error} value={err.tips} /> : null}
              </div> */}
            </div>
          </div>
          <div className={styles.settingBlock}>
            <Typography className={styles.blockTitle}>Default Price per Delivery</Typography>
            <div className={styles.inputBlock}>
              <div>
                <TextField
                  label={'Price'}
                  className={styles.field}
                  inputProps={{
                    placeholder: 'Price',
                    type: 'number',
                    endAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                  value={getSettingValue(SETTINGS.DEFAULT_PRICE_PER_DELIVERY_PRICE)}
                  onChange={handleChangeField(SETTINGS.DEFAULT_PRICE_PER_DELIVERY_PRICE)}
                />
                {err.default_price_per_delivery_price ? (
                  <Error className={styles.error} value={err.default_price_per_delivery_price} />
                ) : null}
              </div>
            </div>
          </div>
          <div className={styles.settingBlock}>
            <Typography className={styles.blockTitle}>Volume Price per Delivery</Typography>
            <div className={styles.inputBlock}>
              <div>
                <TextField
                  label={'Offers per months'}
                  className={styles.field}
                  inputProps={{
                    type: 'number',
                    placeholder: 'Offers per months'
                  }}
                  value={getSettingValue(SETTINGS.VOLUME_PRICE_PER_DELIVERY_OFFER_PER_MONTH)}
                  onChange={handleChangeField(SETTINGS.VOLUME_PRICE_PER_DELIVERY_OFFER_PER_MONTH)}
                />
                {err.volume_price_per_delivery_offer_per_month ? (
                  <Error className={styles.error} value={err.volume_price_per_delivery_offer_per_month} />
                ) : null}
              </div>
              <div>
                <TextField
                  label={'Price'}
                  className={styles.field}
                  inputProps={{
                    type: 'number',
                    placeholder: 'Price',
                    endAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                  value={getSettingValue(SETTINGS.VOLUME_PRICE_PER_DELIVERY_PRICE)}
                  onChange={handleChangeField(SETTINGS.VOLUME_PRICE_PER_DELIVERY_PRICE)}
                />
                {err.volume_price_per_delivery_price ? (
                  <Error className={styles.error} value={err.volume_price_per_delivery_price} />
                ) : null}
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
