import React, { FC, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
  defItems,
  invoiceFrequency,
  invoiceFrequencyMonthlyDays,
  invoiceFrequencyWeeklyDays
} from '../../../../constants';
import Error from '../../../common/Error';
import Loading from '../../../common/Loading';
import styles from './DispatchSettings.module.sass';
import { Grid, InputAdornment, makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import TextField from '../../../common/TextField';
import Select from '../../../common/Select';
import SVGIcon from '../../../common/SVGIcon';
import SelectButton from '../../../common/SelectButton';
import { useHistory, useRouteMatch } from 'react-router';
import { decodeErrors } from '../../../../utils';
import { BillingAccount } from '../../../../interfaces';
import AccountHolder from '../AccountHolder';
import { useStores } from '../../../../store';
import useBillingManagement from '../../../../hooks/useBillingManagement';
import _ from 'lodash';
import ContactSettings from '../ContactSettings';

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
  const {
    newSettingsGP,
    updateSettingGP,
    getSettingGP,
    getInvoiceCustomers,
    getDefaultSettingGP,
  } = useSettingsGP();
  const { billingAccountStore } = useStores();
  const { billings, billingAccountFilters } = useBillingManagement();
  const [isLoading, setLoading] = useState(false);
  const [isLoadingBillings, setIsLoadingBillings] = useState(false);
  const [invoiceFrequencyInfo, setInvoiceFrequencyInfo] = useState<any>([]);
  const [invoiceFrequencyInfoLabel, setInvoiceFrequencyInfoLabel] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [newSettingGP, setNewSettingGP] = useState(newSettingsGP);
  const billingAccountHolderErrors = {
    companyName: '',
    email: '',
    phone: '',
    invoiced: ''
  };
  const [billingAccountErrors, setBillingAccountErrors] = useState(billingAccountHolderErrors);
  const useStyles = makeStyles({
    button: {
      boxShadow: '0 3px 5px 2px var(rgba(255, 105, 135, .3))',
      borderRadius: 50,
      backgroundColor: '#006cf0',
      color: '#ffff',
      padding: 10,
      height: 45,
      width: 210,
      position: 'fixed',
      bottom: 35,
      right: '50%',
      left: '50%'
    }
  });
  const classes = useStyles();

  const emptyAccountData: BillingAccount = {
    attention_to: '',
    name: '',
    companyName: '',
    email: '',
    phone: ''
  };

  const getSettingGPById = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSettingGP(id);
      let newData = {
        ...data.data,
        billingAccountHolder: {...emptyAccountData }
      };
      if (!data.data.calculateDistanceForSegments) {
        newData = {
          ...newData,
          calculateDistanceForSegments: 'Yes'
        };
      }
      setNewSettingGP(newData);
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

  const handleChangeBillingAccount = (data: any) => {
    const { id, account } = data;
    setNewSettingGP({
      ...newSettingGP,
      invoicedId: id,
      billingAccountHolder: { ...account, id }
    });
    setBillingAccountErrors(billingAccountHolderErrors);
  };

  const handleScroll = () => (e: any) => {
    if (e.target.scrollTop === e.target.scrollHeight - e.target.offsetHeight) {
      billingAccountStore.set('billingAccountFilters')({
        ...billingAccountFilters,
        page: billingAccountFilters.page + 1
      });
      getCustomersOnInvoiced().then().catch();
     }
  };

  const getCustomersOnInvoiced = useCallback(async () => {
    try {
      if (!totalCount) setIsLoadingBillings(true);
      const customers = await getInvoiceCustomers(billingAccountFilters);
      if (customers) {
        billingAccountStore.set('billings')([...billings, ...customers.data]);
        setTotalCount(customers.totalCount);
      }
      setIsLoadingBillings(false);
    } catch (error) {
      // TODO: show error message
    }
  }, [getInvoiceCustomers, billingAccountFilters]);

  useEffect(() => {
    if (id) {
      void getSettingGPById()
        .then()
        .catch();
    } else {
      setNewSettingGP(newSettingGP);
    }
    getCustomersOnInvoiced().then().catch();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!notDefaultBilling) {
      void getSettingGPDefault()
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

  const errorsTemplate = {
    autoDispatchTimeframe: '',
    dispatchedBeforeClosingHours: '',
    maxDeliveryLegDistance: '',
    amountOrdersInBatch: '',
    forcedPrice: '',
    name: ''
  };

  const [errors, setErrors] = useState(errorsTemplate);
  const [priceErrors, setPriceErrors] = useState({
    mileRadius_0: '',
    mileRadius_1: '',
    mileRadius_2: ''
  });

  const valid = useCallback(
    (data: any) => {
      let isError = false;
      let newError = _.cloneDeep(errorsTemplate);

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
          const errors = err.response.data;
          if (errors.message === "validation error") {
            setBillingAccountErrors({
              ...billingAccountErrors,
              ...decodeErrors(errors.details)
            });
          } else {
            setErrors({ ...errors, ...decodeErrors(errors.details) })
          };
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

    if (key === 'amountOrdersInBatch' && value && Number(value) < 0) {
      value = 1;
    }
    if (key === 'amountOrdersInBatch' && value && Number(value) > 3000) {
      value = 3000;
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
    <>
      <div className={classNames(notDefaultBilling && styles.groupBlock)}>
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
                <Grid item xs={4}>
                  <TextField
                    label="Maximum possible amount of Orders to be in 1 batch"
                    value={newSettingGP.amountOrdersInBatch >= 0 ? newSettingGP.amountOrdersInBatch : ''}
                    onChange={handleChange('amountOrdersInBatch')}
                    inputProps={{
                      type: 'number',
                      placeholder: '',
                      endAdornment: <InputAdornment position="start">orders</InputAdornment>
                    }}
                  />
                  {errors.amountOrdersInBatch ? (
                    <Error className={styles.errorAbsolute} value={errors.amountOrdersInBatch} />
                  ) : null}
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <SelectButton
                    defItems={defItems}
                    label="Manual Batch Deliveries"
                    value={newSettingGP.isManualBatchDeliveries}
                    onChange={handleChange('isManualBatchDeliveries')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <SelectButton
                    defItems={defItems}
                    label="Max Delivery Leg Distance"
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
                  {errors.autoDispatchTimeframe ? (
                    <Error className={styles.errorAbsolute} value={errors.autoDispatchTimeframe} />
                  ) : null}
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
                {newSettingGP.calculateDistanceForSegments !== 'No' ? (
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
                ) : null}
              </Grid>
            </div>
          )}
        </div>
      </div>
      {notDefaultBilling && (
        <AccountHolder
          invoicedId={newSettingGP.invoicedId}
          accountForm={newSettingGP.billingAccountHolder}
          errors={billingAccountErrors}
          isForNewConfiguration={!id}
          isLoading={isLoadingBillings}
          existingAccounts={billings}
          handleChangeBillingAccount={handleChangeBillingAccount}
          handleScroll={handleScroll}
        />
      )}
      {id && <ContactSettings invoicedId={newSettingGP.invoicedId} />}
      <Button
        variant="contained"
        color="secondary"
        className={notDefaultBilling ? classNames(classes.button, styles.floatingBtn) : classes.button}
        onClick={() => updateSettingGPEx()}
      >
        {notDefaultBilling ? (
          <Typography>{id ? 'Save changes' : 'Add Account'}</Typography>
        ) : (
          <Typography>{'Update Settings'}</Typography>
        )}
      </Button>
    </>
  );
};
