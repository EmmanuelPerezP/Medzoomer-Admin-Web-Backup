import React, { FC, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MapOnFleet from '../../../common/MapOnFleet';
import useSystemSettings from '../../../../hooks/useSystemSettings';
import { invoiceFrequency, invoiceFrequencyMonthlyDays } from '../../../../constants';
import Error from '../../../common/Error';
import Loading from '../../../common/Loading';

import styles from './BillingSettings.module.sass';
import { Grid, InputAdornment } from '@material-ui/core';
import classNames from 'classnames';
import useGroups from '../../../../hooks/useGroup';
import { useStores } from '../../../../store';
import TextField from '../../../common/TextField';
import Select from '../../../common/Select';
import SVGIcon from '../../../common/SVGIcon';
import SelectButton from '../../../common/SelectButton';

export const BillingSettings: FC = () => {
  const {
    newGroup,
    newContact,
    getContacts,
    getManagers,
    createGroup,
    updateGroup,
    getGroup,
    getPharmacyInGroup,
    addContact,
    removeContact,
    generateReport,
    sendInvoices
  } = useGroups();

  const [err, setError] = useState({
    global: '',
    name: '',
    billingAccount: '',
    mileRadius_0: '',
    mileRadius_1: '',
    mileRadius_2: '',
    forcedPrice: ''
  });

  const { groupStore } = useStores();

  const { getSetting, updateSetting } = useSystemSettings();
  const [geoJson, setGeoJson] = useState('');
  const [isLoading, setLoading] = useState(false);

  const priceTitles = [
    'Order volume less than 10,000/month',
    'Order volume greater than 10,000/month',
    'Order volume greater than 25,000/month'
  ];

  const handleChangePrice = (indexPrice: number, indexPriceInPrice: number) => (
    e: React.ChangeEvent<{ value: string | number }>
  ) => {
    const { value } = e.target;
    const prices = newGroup.prices;
    // @ts-ignore
    prices[indexPrice].prices[indexPriceInPrice].price = value;
    groupStore.set('newGroup')({ ...newGroup, prices });
    setError({ ...err, [`mileRadius_${indexPrice}`]: '' });
  };

  

  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: string | number }>) => {
    const { value } = e.target;

    switch (key) {
      case 'invoiceFrequency':
        // @ts-ignore
        groupStore.set('newGroup')({ ...newGroup, [key]: value, invoiceFrequencyInfo: 1 });
        break;
      case 'pricePerDelivery':
      case 'volumeOfferPerMonth':
      case 'volumePrice':
        if (value >= 0) groupStore.set('newGroup')({ ...newGroup, [key]: value });
        break;
      default:
        groupStore.set('newGroup')({ ...newGroup, [key]: value });
        break;
    }

    setError({ ...err, [key]: '' });
  };

  const renderPrices = (prices: any, index: number) => {
    // @ts-ignore
    const error = err[`mileRadius_${index}`];
    return (
      <>
        {console.log('C! groupStore', groupStore)}
        <Typography className={styles.blockTitle}>{priceTitles[index]}</Typography>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <TextField
              label={'0-5 Mile Radius '}
              classes={{
                root: classNames(styles.textField, styles.priceInput)
              }}
              inputProps={{
                type: 'number',
                placeholder: '0.00',
                endAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              value={prices[0].price}
              onChange={handleChangePrice(index, 0)}
            />
            {error ? <Error className={styles.errorAbsolute} value={error} /> : null}
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={'5.1-10 Mile Radius'}
              classes={{
                root: classNames(styles.textField, styles.priceInput)
              }}
              inputProps={{
                type: 'number',
                placeholder: '0.00',
                endAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              value={prices[1].price}
              onChange={handleChangePrice(index, 1)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={'10+ Mile Radius '}
              classes={{
                root: classNames(styles.textField, styles.priceInput)
              }}
              inputProps={{
                type: 'number',
                placeholder: '0.00',
                endAdornment: <InputAdornment position="start">$/mile</InputAdornment>
              }}
              value={prices[2].price}
              onChange={handleChangePrice(index, 2)}
            />
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <div className={styles.systemsWrapper}>
      <div className={styles.navigation}>
        <Typography className={styles.title}>Default Billing Settings</Typography>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.settingBlock}>
          {newGroup.prices &&
            newGroup.prices.map((item, index) => {
              return renderPrices(item.prices, index);
            })
          }
          <Typography className={styles.blockTitle}>Manual Price</Typography>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <TextField
                classes={{
                  root: classNames(styles.textField, styles.priceInput)
                }}
                inputProps={{
                  type: 'number',
                  placeholder: '0.00',
                  endAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                value={newGroup.forcedPrice}
                onChange={handleChange('forcedPrice')}
              />
              {err.forcedPrice ? <Error className={styles.errorAbsolute} value={err.forcedPrice} /> : null}
            </Grid>
          </Grid>
          <Typography className={styles.blockTitle}>Invoice</Typography>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              {console.log('C! invoiceFrequency', newGroup.invoiceFrequency)}
              <Select
                label='Frequency'
                value={newGroup.invoiceFrequency}
                onChange={handleChange('invoiceFrequency')}
                items={invoiceFrequency}
                IconComponent={() => <SVGIcon name={'downArrow'} style={{ height: '15px', width: '15px' }} />}
              />
            </Grid>
            <Grid item xs={4}>
                {console.log('C! newGroup', newGroup)}
              <Select
                label='Day of Month'
                value={newGroup.invoiceDay}
                onChange={handleChange('invoiceDay')}
                items={invoiceFrequencyMonthlyDays}
                IconComponent={() => <SVGIcon name={'downArrow'} style={{ height: '15px', width: '15px' }} />}
              />
            </Grid>
          </Grid>
          <Typography className={styles.blockTitle}>Batch Ordes</Typography>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <SelectButton
                label='Manual Batch Deliveries'
                onChange={handleChange('manualBatchDeliveries')}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label='Auto-Dispatch Timeframe'
                classes={{
                  root: classNames(styles.textField, styles.priceInput)
                }}
                inputProps={{
                  type: 'number',
                  placeholder: '0.00',
                  endAdornment: <InputAdornment position="start">min</InputAdornment>
                }}
                value={newGroup.forcedPrice}
                onChange={handleChange('autoDispatchTimeframe')}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label='Max Delivery Leg Distance'
                classes={{
                  root: classNames(styles.textField, styles.priceInput)
                }}
                inputProps={{
                  type: 'number',
                  placeholder: '0.00',
                  endAdornment: <InputAdornment position="start">miles</InputAdornment>
                }}
                value={newGroup.forcedPrice}
                onChange={handleChange('MaxDeliveryLegDistance')}
              />
            </Grid>
          </Grid>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            style={{marginTop: 40}}
            // onClick={onUpdate()}
          >
            Update Settings
          </Button>
        </div>
      )}
    </div>
  );
};
