import React, { FC, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';

import TextField from '../../../common/TextField';
import useSystemSettings from '../../../../hooks/useSystemSettings';
import { SETTINGS, settingsError } from '../../../../constants';
import Error from '../../../common/Error';
import Loading from '../../../common/Loading';

import styles from './TrainingVideo.module.sass';
import classNames from 'classnames';
import CourierPricing from '../../../BillingManagement/components/CourierPricing';

export const TrainingVideo: FC = () => {
  const { getSetting, updateListSettings } = useSystemSettings();
  const [settings, setSettings] = useState();
  const [isLoading, setLoading] = useState(false);
  const [err, setErr] = useState({
    delivery: '',
    transaction_fee: '',
    training_video_link: '',
    courier_cost_for_one_order: '',
    courier_cost_for_two_order: '',
    courier_cost_for_more_two_order: '',
    courier_cost_for_ml_in_delivery: ''
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
          return {
            ...res,
            [e]: `${settingsError[e]} is not allowed to be empty`
          };
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
      [SETTINGS.COURIER_TRANSACTION_FEE]: Number(settings[SETTINGS.COURIER_TRANSACTION_FEE]),
      [SETTINGS.COURIER_COST_FOR_ONE_ORDER]: Number(settings[SETTINGS.COURIER_COST_FOR_ONE_ORDER]),
      [SETTINGS.COURIER_COST_FOR_TWO_ORDER]: Number(settings[SETTINGS.COURIER_COST_FOR_TWO_ORDER]),
      [SETTINGS.COURIER_COST_FOR_MORE_TWO_ORDER]: Number(settings[SETTINGS.COURIER_COST_FOR_MORE_TWO_ORDER]),
      [SETTINGS.COURIER_COST_FOR_ML_IN_DELIVERY]: Number(settings[SETTINGS.COURIER_COST_FOR_ML_IN_DELIVERY])
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
      SETTINGS.TRAINING_VIDEO_LINK,
      SETTINGS.COURIER_TRANSACTION_FEE,
      SETTINGS.COURIER_COST_FOR_ONE_ORDER,
      SETTINGS.COURIER_COST_FOR_TWO_ORDER,
      SETTINGS.COURIER_COST_FOR_MORE_TWO_ORDER,
      SETTINGS.COURIER_COST_FOR_ML_IN_DELIVERY
    ])
      .then((d: { data: any }) => {
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
        <Typography className={styles.title}>Training Video Link</Typography>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className={styles.settingBlock}>
            <div className={styles.inputBlock}>
              {/* <div> */}
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
              {/* </div> */}
            </div>
          </div>
          <div className={styles.center}>
            <Button variant="contained" color="secondary" disabled={!!isLoading} onClick={handleUpdateSettings}>
              <Typography>Update</Typography>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
