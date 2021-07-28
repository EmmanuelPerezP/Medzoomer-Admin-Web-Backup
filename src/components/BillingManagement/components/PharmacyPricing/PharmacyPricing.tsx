import React, { FC, useEffect, useState } from 'react';
import styles from './PharmacyPricing.module.sass';
import Typography from '@material-ui/core/Typography';
import { Grid, InputAdornment } from '@material-ui/core';
import TextField from '../../../common/TextField';
import SelectButton from '../../../common/SelectButton';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import Loading from '../../../common/Loading';
import CustomSwitch from '../../../common/CustomSwitch';

interface Props {
  notDefaultBilling: any;
  isLoading: boolean;
  prices: Array<object>;
  handleChangePrice: Function;
  handleChange: Function;
}

export const PharmacyPricing: FC<Props> = (props) => {
  const { handleChangePrice, handleChange, notDefaultBilling, isLoading } = props;
  const [isStandardPricing, setIsStandardPricing] = useState(true);
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
  console.log('notDefaultBilling');
  console.log(notDefaultBilling);
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
  const { updateSettingGP, getSettingGP, newSettingsGP, getDefaultSettingGP } = useSettingsGP();
  const [prices, setNewSettingGP] = useState(newSettingsGP);
  const [currentPricing, setCurrentPricing] = useState(standardPricing);
  const standardPricingTitles = ['Less than 25/day', 'Greater than 25/day'];
  const [fail, setFail] = useState(0);
  const [priceProjection, setPriceProjection] = React.useState(false);
  const tableCell = [
    {
      _id: '60a26f9b9abf660009048ece', // less than
      prices: [
        {
          _id: '60a26f9b9abf660009048ecf',
          minDist: 0,
          maxDist: 10,
          price: '1'
        },
        {
          _id: '60a26f9b9abf660009048ed0',
          minDist: 10.1,
          maxDist: 50,
          price: '2'
        }
      ]
    },
    {
      _id: '60a26f9b9abf660009048ed2', // greater than
      prices: [
        {
          _id: '60a26f9b9abf660009048ecx',
          minDist: 0,
          maxDist: 10,
          price: '3'
        },
        {
          _id: '60a26f9b9abf660009048edy',
          minDist: 10.1,
          maxDist: 50,
          price: '4'
        }
      ]
    }
  ];

  const handlePricingChange = () => {
    setIsStandardPricing((isStandardPricing) => !isStandardPricing);
  };

  const handlepriceInputPriceChange = (event: any) => {
    const { value } = event.target;
    setFail(value);
  };

  useEffect(() => {
    if (isStandardPricing) {
      setCurrentPricing(standardPricing);
    } else {
      setCurrentPricing(highVolumePricing);
    }
  }, [isStandardPricing]);

  const handleSwitch = () => {
    setPriceProjection(!priceProjection);
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
              <SelectButton label="High Volume Deliveries" value={'No'} onChange={handlePricingChange} />
            </div>
            <div className={styles.switch}>
              <Typography className={styles.blockSubtitle}>Enable Price Projection</Typography>
              <CustomSwitch
                checked={priceProjection}
                onChange={handleSwitch}
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
              {tableCell.map((setting, settingsIndex) => {
                return (
                  <Grid container spacing={4} key={`${settingsIndex}`}>
                    <Grid item className={styles.gridAlignCenter} xs={4}>
                      <Typography className={styles.gridDescription}>
                        {Object.values(currentPricing.labels)[settingsIndex]}
                      </Typography>
                    </Grid>
                    {setting['prices'].map((price, pricesIndex) => {
                      return (
                        <Grid item className={styles.gridAlignCenter} key={`${settingsIndex}${pricesIndex}`} xs={4}>
                          <TextField
                            className={
                              pricesIndex < setting['prices'].length - 1 ? styles.input : styles.afterTextInput
                            }
                            inputProps={{
                              type: 'number',
                              placeholder: '0.00',
                              endAdornment: (
                                <InputAdornment position="start" className={styles.adornment}>
                                  $
                                </InputAdornment>
                              )
                            }}
                            value={price.price}
                            onChange={handleChangePrice(settingsIndex, pricesIndex)}
                          />
                        </Grid>
                      );
                    })}
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
            value={fail}
            onChange={handlepriceInputPriceChange}
          />
        </>
      )}
    </div>
  );
};

export default PharmacyPricing;
