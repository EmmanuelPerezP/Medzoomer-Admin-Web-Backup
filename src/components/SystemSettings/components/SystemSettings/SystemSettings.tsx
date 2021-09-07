import React, { FC, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import useSystemSettings from '../../../../hooks/useSystemSettings';
import Loading from '../../../common/Loading';
import styles from './SystemSettings.module.sass';
import CourierPricing from '../../../BillingManagement/components/CourierPricing';
import { SETTINGS, courierPricingLabels } from '../../../../constants';
import { ICourierPricing } from '../../../../interfaces';
import _ from 'lodash';

export const SystemSettings: FC = () => {
  const { getSetting, updateListSettings } = useSystemSettings();
  const emptyCourierPricing: ICourierPricing = {
    courier_cost_for_one_order: '',
    courier_cost_for_two_order: '',
    courier_cost_for_more_two_order: '',
    courier_cost_for_ml_in_delivery: ''
  };
  const [settings, setSettings] = useState(emptyCourierPricing);
  const [err, setErr] = useState(emptyCourierPricing);
  const [isLoading, setLoading] = useState(false);
  
  const isValid = () => {
    let isError = true;
    setErr({
      ...err,
      ...Object.keys(settings).reduce((res: object, e: any) => {
        const value = Number(_.get(settings, e));
        if (value > 100) {
          isError = false;
          return { ...res, [e]: `${courierPricingLabels[e]} must be lower than 100` };
        }

        if (value < 0) {
          isError = false;
          return { ...res, [e]: `${courierPricingLabels[e]} must be greater than 0` };
        }

        if (!value) {
          isError = false;
          return { ...res, [e]: `${courierPricingLabels[e]} cannot be empty` };
        }

        return { ...res };
      }, {})
    });

    return isError;
  };

  const handleUpdateSettings = useCallback(async () => {
    if (isValid()) {
      try {
        setLoading(true);
        await updateListSettings(settings);
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

  return (
    <div className={styles.systemsWrapper}>
      <div className={styles.navigation}>
        <Typography className={styles.title}>Courier Payout</Typography>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <CourierPricing 
            notDefaultBilling={false}
            isLoading={isLoading}
            courierPricing={settings}
            errors={err}
            handleCourierPricingChange={handleChangeField}
          />
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
