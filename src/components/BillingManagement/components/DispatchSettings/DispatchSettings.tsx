import React, { FC, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { invoiceFrequency, invoiceFrequencyMonthlyDays, invoiceFrequencyWeeklyDays } from '../../../../constants';
import Error from '../../../common/Error';
import Loading from '../../../common/Loading';
import styles from './DispatchSettings.module.sass';
import { Grid, InputAdornment } from '@material-ui/core';
import classNames from 'classnames';
// import useGroups from '../../../../hooks/useGroup';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import TextField from '../../../common/TextField';
import Select from '../../../common/Select';
import SVGIcon from '../../../common/SVGIcon';
import SelectButton from '../../../common/SelectButton';
import { useHistory, useRouteMatch } from 'react-router';
import { decodeErrors } from '../../../../utils';

interface Props {
  notDefaultBilling?: boolean;
  typeObject: string;
}

export const DispatchSettings: FC<Props> = (props) => {
  const {
    params: { id }
  } = useRouteMatch();
  const history = useHistory();
  const { notDefaultBilling } = props;
  const { updateSettingGP, getSettingGP, newSettingsGP, getDefaultSettingGP } = useSettingsGP();
  const [isLoading, setLoading] = useState(false);
  const [invoiceFrequencyInfo, setInvoiceFrequencyInfo] = useState<any>([]);
  const [invoiceFrequencyInfoLabel, setInvoiceFrequencyInfoLabel] = useState('');

  const [newSettingGP, setNewSettingGP] = useState(newSettingsGP);

  const getSettingGPById = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSettingGP(id);
      setNewSettingGP({
        calculateDistanceForSegments: 'Yes',
        ...data.data
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, [id, getSettingGP]);

  const getSettingGPDefault = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDefaultSettingGP();
      if (data && data.data) {
        setNewSettingGP({
          calculateDistanceForSegments: 'Yes',
          ...data.data
        });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line
  }, [id, getSettingGP]);

  useEffect(() => {
    if (id) {
      getSettingGPById()
        .then()
        .catch();
    } else {
      setNewSettingGP({
        name: '',
        billingAccount: '',
        invoiceFrequency: 'bi_monthly',
        invoiceFrequencyInfo: 1,
        forcedPrice: null,
        isManualBatchDeliveries: 'No',
        calculateDistanceForSegments: 'Yes',
        autoDispatchTimeframe: '180',
        dispatchedBeforeClosingHours: '120',
        maxDeliveryLegDistance: '10',
        prices: [
          {
            orderCount: '0-10000',
            prices: [
              {
                minDist: 0,
                maxDist: 5,
                price: null
              },
              {
                minDist: 5,
                maxDist: 10,
                price: null
              },
              {
                minDist: 10,
                maxDist: 1000,
                price: null
              }
            ]
          },
          {
            orderCount: '10001-25000',
            prices: [
              {
                minDist: 0,
                maxDist: 5,
                price: null
              },
              {
                minDist: 5,
                maxDist: 10,
                price: null
              },
              {
                minDist: 10,
                maxDist: 1000,
                price: null
              }
            ]
          },
          {
            orderCount: '25001-10000000',
            prices: [
              {
                minDist: 0,
                maxDist: 5,
                price: null
              },
              {
                minDist: 5,
                maxDist: 10,
                price: null
              },
              {
                minDist: 10,
                maxDist: 1000,
                price: null
              }
            ]
          }
        ]
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!notDefaultBilling) {
      getSettingGPDefault()
        .then()
        .catch();
    }
    // eslint-disable-next-line
  }, [notDefaultBilling]);

  const priceTitles = [
    'Order volume less than 10,000/month',
    'Order volume greater than 10,000/month',
    'Order volume greater than 25,000/month'
  ];

  const [errors, setErrors] = useState({
    autoDispatchTimeframe: '',
    dispatchedBeforeClosingHours: '',
    maxDeliveryLegDistance: '',
    forcedPrice: '',
    name: ''
  });
  const [priceErrors, setPriceErrors] = useState({
    mileRadius_0: '',
    mileRadius_1: '',
    mileRadius_2: ''
  });

  const valid = useCallback(
    (data: any) => {
      let isError = false;
      const newError = {
        autoDispatchTimeframe: '',
        dispatchedBeforeClosingHours: '',
        maxDeliveryLegDistance: '',
        forcedPrice: '',
        name: ''
      };

      for (const i in newError) {
        if (!data[i]) {
          // @ts-ignore
          newError[i] = 'Field is not allowed to be empty';
          isError = true;
        }
      }

      if (data.prices) {
        const priceError = {
          mileRadius_0: '',
          mileRadius_1: '',
          mileRadius_2: ''
        };

        data.prices.forEach((item: any, index: number) => {
          if (item.prices) {
            item.prices.forEach((price: any) => {
              if (Number(price.price) <= 0) {
                isError = true;
                const field = `mileRadius_${index}`;
                // @ts-ignore
                priceError[field] = 'All fields are required';
              }
            });
            setPriceErrors(priceError);
          }
        });
      }

      if (data.autoDispatchTimeframe <= 0 || data.autoDispatchTimeframe % 15 > 0) {
        newError.autoDispatchTimeframe = 'Must be a multiple of 15';
        isError = true;
      }
      if (data.dispatchedBeforeClosingHours < 0) {
        newError.dispatchedBeforeClosingHours = 'Must be greater than or equal to 0';
        isError = true;
      }
      if (data.calculateDistanceForSegments === 'Yes' && data.maxDeliveryLegDistance <= 0) {
        newError.maxDeliveryLegDistance = 'Must be greater than 0';
        isError = true;
      }

      if (!notDefaultBilling && !data.name) {
        newError.name = 'Name field are required';
        isError = true;
      }

      setErrors(newError);
      return !isError;
    },
    [notDefaultBilling]
  );

  useEffect(() => {
    if (['bi_weekly', 'weekly'].includes(newSettingGP.invoiceFrequency)) {
      setInvoiceFrequencyInfo(invoiceFrequencyWeeklyDays);
      setInvoiceFrequencyInfoLabel('Day of Week');
    } else if ('monthly' === newSettingGP.invoiceFrequency) {
      setInvoiceFrequencyInfo(invoiceFrequencyMonthlyDays);
      setInvoiceFrequencyInfoLabel('Day of Month');
    } else {
      setInvoiceFrequencyInfoLabel('');
    }
  }, [newSettingGP.invoiceFrequency]);

  const updateSettingGPEx = () => {
    if (valid(newSettingGP) && newSettingGP) {
      setLoading(true);
      updateSettingGP(newSettingGP)
        .then((res: any) => {
          history.push('/dashboard/billing_management');
          setLoading(false);
        })
        .catch((err: any) => {
          setErrors({ ...errors, ...decodeErrors(err.details) });
          setLoading(false);
        });
    }
  };

  const handleChangePrice = (indexPrice: number, indexPriceInPrice: number) => (
    e: React.ChangeEvent<{ value: string | number }>
  ) => {
    const { value } = e.target;
    const prices = newSettingGP.prices;
    // @ts-ignore
    prices[indexPrice].prices[indexPriceInPrice].price = value;
    setNewSettingGP({ ...newSettingGP, prices });
    setErrors({ ...errors, [`mileRadius_${indexPrice}`]: '' });
  };

  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: string }>) => {
    let value;
    if (['calculateDistanceForSegments', 'isManualBatchDeliveries'].includes(key)) {
      value = e;
    } else {
      value = e.target.value;
    }
    setNewSettingGP({ ...newSettingGP, [key]: value });
  };

  const renderPrices = (prices: any, index: number) => {
    // @ts-ignore
    const error = priceErrors[`mileRadius_${index}`];
    return (
      <>
        <Typography className={styles.blockTitle}>{priceTitles[index]}</Typography>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <TextField
              label={'0-5 Mile Radius '}
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
    <div className={classNames(styles.systemsWrapper, !notDefaultBilling && styles.wrapper)}>
      {!notDefaultBilling && (
        <div className={styles.navigation}>
          <Typography className={styles.title}>Default Billing Settings</Typography>
        </div>
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {notDefaultBilling && (
            <>
              <Typography className={styles.blockTitle}>Billing Account</Typography>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    label="Name *"
                    value={newSettingGP.name}
                    onChange={handleChange('name')}
                    inputProps={{
                      placeholder: 'Required'
                    }}
                  />
                  {errors.name ? <Error className={styles.errorAbsolute} value={errors.name} /> : null}
                </Grid>
              </Grid>
            </>
          )}
          {newSettingGP.prices &&
            newSettingGP.prices.map((item: { prices: any }, index: number) => {
              return renderPrices(item.prices, index);
            })}
          <Typography className={styles.blockTitle}>Manual Price</Typography>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <TextField
                inputProps={{
                  type: 'number',
                  placeholder: '0.00',
                  endAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                value={newSettingGP.forcedPrice}
                onChange={handleChange('forcedPrice')}
              />
              {errors.forcedPrice ? <Error className={styles.errorAbsolute} value={errors.forcedPrice} /> : null}
            </Grid>
          </Grid>

          <Typography className={styles.blockTitle}>Invoice</Typography>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <Select
                label="Frequency"
                value={newSettingGP.invoiceFrequency}
                onChange={handleChange('invoiceFrequency')}
                items={invoiceFrequency}
                IconComponent={() => <SVGIcon name={'downArrow'} style={{ height: '15px', width: '15px' }} />}
              />
            </Grid>
            {invoiceFrequencyInfoLabel ? (
              <Grid item xs={4}>
                <Select
                  label={invoiceFrequencyInfoLabel}
                  value={newSettingGP.invoiceFrequencyInfo}
                  onChange={handleChange('invoiceFrequencyInfo')}
                  items={invoiceFrequencyInfo}
                  IconComponent={() => <SVGIcon name={'downArrow'} style={{ height: '15px', width: '15px' }} />}
                />
              </Grid>
            ) : null}
          </Grid>

          <Typography className={styles.blockTitle}>Batch Orders</Typography>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <SelectButton
                label="Manual Batch Deliveries"
                value={newSettingGP.isManualBatchDeliveries}
                onChange={handleChange('isManualBatchDeliveries')}
              />
            </Grid>
            <Grid item xs={6}>
              <SelectButton
                label="Сalculate Distance For Segments"
                value={newSettingGP.calculateDistanceForSegments || 'Yes'}
                onChange={handleChange('calculateDistanceForSegments')}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Auto-Dispatch Timeframe"
                value={newSettingGP.autoDispatchTimeframe}
                onChange={handleChange('autoDispatchTimeframe')}
                inputProps={{
                  type: 'number',
                  placeholder: '0.00',
                  endAdornment: <InputAdornment position="start">min</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={'Orders should be dispatched before closing hours'}
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
            </Grid>
            {
              newSettingGP.calculateDistanceForSegments !== 'No'
                ? (
                  <Grid item xs={4}>
                    <TextField
                      label="Max Delivery Leg Distance"
                      value={newSettingGP.maxDeliveryLegDistance}
                      onChange={handleChange('maxDeliveryLegDistance')}
                      inputProps={{
                        type: 'number',
                        placeholder: '0.00',
                        endAdornment: <InputAdornment position="start">miles</InputAdornment>
                      }}
                    />
                    {errors.maxDeliveryLegDistance ? (
                      <Error className={styles.errorAbsolute} value={errors.maxDeliveryLegDistance} />
                    ) : null}
                  </Grid>

                )
                : null
            }
          </Grid>
          <Button
            variant="contained"
            color="secondary"
            className={classNames(notDefaultBilling && styles.btnMargin)}
            style={{ marginTop: 40 }}
            onClick={() => updateSettingGPEx()}
          >
            {notDefaultBilling ? (
              <Typography>{id ? 'Update Account' : 'Add Account'}</Typography>
            ) : (
              <Typography>{'Update Settings'}</Typography>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
