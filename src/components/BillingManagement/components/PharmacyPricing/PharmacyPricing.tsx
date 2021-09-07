import React, { FC, useEffect, useState } from 'react';
import styles from './PharmacyPricing.module.sass';
import Typography from '@material-ui/core/Typography';
import { Grid, InputAdornment } from '@material-ui/core';
import TextField from '../../../common/TextField';
import SelectButton from '../../../common/SelectButton';
import Loading from '../../../common/Loading';
import CustomSwitch from '../../../common/CustomSwitch';
import { SettingsGPPrice } from '../../../../interfaces';
import { Error } from '../../../common/Error/Error';

interface Props {
  notDefaultBilling: any;
  isLoading: boolean;
  allowHighVolumeDeliveries: boolean;
  enablePriceProjection: boolean;
  prices: SettingsGPPrice[];
  errors: any;
  failedDeliveryCharge: string | null;
  handleChangePrice: Function;
  handleSwitchChange: Function;
  handleFailedDeliveryChargeChange: Function;
}

export const PharmacyPricing: FC<Props> = (props) => {
  const {
    notDefaultBilling,
    isLoading,
    allowHighVolumeDeliveries,
    enablePriceProjection,
    prices,
    errors,
    failedDeliveryCharge,
    handleChangePrice,
    handleSwitchChange,
    handleFailedDeliveryChargeChange,
  } = props;
  const standardPricing = {
    title: 'Standard Pricing',
    labels: {
      firstTier: 'Less than 25/day',
      secondTier: 'Greater than 25/day'
    },
    distance: {
      firstTier: '0-10 Mile Radius',
      secondTier: '10.1-50 Mile Radius'
    }
  };

  const highVolumePricing = {
    title: 'High Volume Pricing',
    labels: {
      firstTier: 'Greater than 50/day',
      secondTier: 'Greater than 100/day'
    },
    distance: {
      firstTier: '0-25 Mile Radius',
      secondTier: '25.1-50 Mile Radius (Next Day Delivery)'
    }
  };
  const [currentPricing, setCurrentPricing] = useState(standardPricing);

  useEffect(() => {
    if (allowHighVolumeDeliveries) {
      setCurrentPricing(highVolumePricing);
    } else {
      setCurrentPricing(standardPricing);
    }
  }, [allowHighVolumeDeliveries]);

  const handleToggle = (field: string) => {
    Array.from(document.querySelectorAll("input")).forEach(
      input => (input.value = "")
    );
    const value =
      field === "allowHighVolumeDeliveries"
        ? !allowHighVolumeDeliveries
        : !enablePriceProjection;
    handleSwitchChange(field, value);
  };

  const renderPricing = (setting: SettingsGPPrice, settingsIndex: number) => {
    return (
      setting.prices.map((price, pricesIndex) => {
        const error = errors[`mileRadius_${settingsIndex}_${pricesIndex}`];
        return (
          <Grid item className={styles.gridAlignCenter} key={`${settingsIndex}${pricesIndex}`} xs={4}>
            <TextField
              className={
                allowHighVolumeDeliveries
                ? styles.input
                : pricesIndex < setting.prices.length - 1
                  ? styles.input
                  : styles.afterTextInput
              }
              inputProps={{
                type: 'number',
                placeholder: '0.00',
                endAdornment: (
                  <InputAdornment position="start" className={styles.adornment}>$</InputAdornment>
                )
              }}
              value={price.price}
              onChange={handleChangePrice(settingsIndex, pricesIndex)}
            />
            {error ? (
              <Error className={styles.error} value={error} />
            ) : null}
          </Grid>
        );
      })
    )
  };

  return (
    <div className={notDefaultBilling ? styles.groupBlock : styles.systemsWrapper}>
      <Typography className={styles.blockTitle}>Pharmacy Pricing</Typography>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className={styles.pricingGroup}>
            <div className={styles.toggle}>
              <SelectButton 
                label="High Volume Deliveries" 
                value={allowHighVolumeDeliveries ? "Yes" : "No"}
                onChange={() => handleToggle("allowHighVolumeDeliveries")}
              />
            </div>
            <div className={styles.switch}>
              <Typography className={styles.blockSubtitle}>Enable Price Projection</Typography>
              <CustomSwitch
                checked={enablePriceProjection}
                onChange={() => handleToggle("enablePriceProjection")}
                name="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>
          </div>
          <Typography className={styles.blockSubtitle}>{currentPricing.title}</Typography>
          <div className={styles.pricingContainer}>
            <div className={styles.pricingTable}>
              <Grid container spacing={4}>
                <Grid item xs={4}>
                  <Typography className={styles.title}>Order Volume</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={styles.titleCenter}>{currentPricing.distance.firstTier}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={styles.titleCenter}>{currentPricing.distance.secondTier}</Typography>
                </Grid>
              </Grid>
              {prices.map((setting, settingsIndex) => {
                return (
                  <Grid container spacing={4} key={`${settingsIndex}`}>
                    <Grid item className={styles.gridAlignCenter} xs={4}>
                      <Typography className={styles.gridDescription}>
                        {Object.values(currentPricing.labels)[settingsIndex]}
                      </Typography>
                    </Grid>
                    {renderPricing(setting, settingsIndex)}
                  </Grid>
                );
              })}
            </div>
          </div>
          <Typography className={styles.blockSubtitle}>Failed Delivery Charge</Typography>
          <TextField
            className={styles.input}
            inputProps={{
              type: 'number',
              placeholder: '0.00',
              endAdornment: (
                <InputAdornment position="start" className={styles.adornment}>
                  $
                </InputAdornment>
              )
            }}
            value={failedDeliveryCharge}
            onChange={handleFailedDeliveryChargeChange()}
          />
          {errors.failedDeliveryCharge ? (
            <Error className={styles.error} value={errors.failedDeliveryCharge} />
          ) : null}
        </>
      )}
    </div>
  );
};

export default PharmacyPricing;
