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
import { Grid, InputAdornment } from '@material-ui/core';
import classNames from 'classnames';
// import useGroups from '../../../../hooks/useGroup';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import TextField from '../../../common/TextField';
// import Select from '../../../common/Select';
// import SVGIcon from '../../../common/SVGIcon';
// import SelectButton from '../../../common/SelectButton';
import { useHistory, useRouteMatch } from 'react-router';
import { decodeErrors } from '../../../../utils';
import PharmacyPricing from '../PharmacyPricing';
import CourierPricing from '../CourierPricing';
import Batching from '../Batching';
import { Invoicing } from '../Invoicing/Invoicing';
import Reporting from '../Reporting';
import PickUpTimes from '../PickUpTimes';
import AccountHolder from '../AccountHolder';
import APIKey from '../APIKey';
import { makeStyles } from '@material-ui/core/styles';
import { typeOfSignatureLog } from '../../../../constants';
import { IPickUpOptions, IInvoicedCustomer } from '../../../../interfaces';
import _ from 'lodash';
interface Props {
  notDefaultBilling?: boolean;
  changeSettingGPName: Function;
  typeObject: string;
}

export const DispatchSettings: FC<Props> = (props) => {
  const {
    params: { id }
  } = useRouteMatch();
  const history = useHistory();
  const { notDefaultBilling, changeSettingGPName } = props;
  const {
    newSettingsGP,
    updateSettingGP,
    getSettingGP,
    getInvoiceCustomers,
    createInvoiceCustomer,
    updateInvoiceCustomer,
    getDefaultSettingGP
  } = useSettingsGP();
  const [isLoading, setLoading] = useState(false);
  const [invoiceFrequencyInfo, setInvoiceFrequencyInfo] = useState<any>([]);
  const [invoiceFrequencyInfoLabel, setInvoiceFrequencyInfoLabel] = useState('');
  const [newSettingGP, setNewSettingGP] = useState(newSettingsGP);
  const [invoicedAccounts, setInvoicedAccounts] = useState([]);
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
  const emptyAccountData: IInvoicedCustomer = {
    // id: null,
    attention_to: '',
    name: '',
    email: '',
    phone: ''
  };
  const [accountData, setAccountData] = useState(emptyAccountData);

  // const createNewInvoicedCustomer = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     // const response = await createInvoiceCustomer(accountData);
  //     // if (response) {
  //       // setNewSettingGP({
  //       //   ...newSettingGP,
  //       //   invoicedId: response.newCustomerId
  //       // });
  //     // }
  //     // TODO: save invoicedid in our database.
  //     // setInvoicedAccounts(response);
  //     setLoading(false);
  //   } catch (error) {}
  // }, [accountData, createInvoiceCustomer]);

  const handleChangeBillingAccount = (data: any) => {
    // setAccountData(account)
    // setNewSettingGP({ ...newSettingGP, invoicedId: account.id });
    const { id, account } = data;
    setNewSettingGP({ 
      ...newSettingGP,
      invoicedId: id,
      billingAccountHolder: account
    });
  };

  const getCustomersOnInvoiced = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getInvoiceCustomers();
      setInvoicedAccounts(data);
      setLoading(false);
    } catch (error) {
      // TODO: show error message
    }
  }, [getInvoiceCustomers]); // TODO: add pagination

  // const updateCustomerById = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     if (accountData.id) {
  //       const data = await updateInvoiceCustomer(accountData.id, accountData);
  //       setNewSettingGP({ ...newSettingGP, invoicedId: accountData.id });
  //       // setNewAccountData(data);
  //       // handleChangeNewAccountData(data);
  //     }
  //   } catch (error) {
  //     // TODO: show error message
  //   }
  //   setLoading(false);
  // }, [accountData, updateInvoiceCustomer]);

  const getSettingGPById = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSettingGP(id);
      let newData = { 
        ...data.data, 
        billingAccountHolder: {
          ...emptyAccountData 
        }
      };

      if (!data.data.reporting) {
        newData = {
          ...newData,
          reporting: typeOfSignatureLog[0].value, // improve this
        };
      }
      if (!data.data.calculateDistanceForSegments) {
        newData = {
          ...newData,
          calculateDistanceForSegments: 'Yes', // improve this
        };
      }
      // if (data.data.invoicedId) {
      //   newData = {
      //     ...newData,
      //     billingAccountHolder["id"]: 1,
      //   };
      // }
      setNewSettingGP(newData);
      changeSettingGPName(data.data.name);
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
      void getSettingGPById()
        .then()
        .catch();
    } else {
      setNewSettingGP(newSettingGP);
    }
    getCustomersOnInvoiced()
      .then()
      .catch();
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

  // const priceTitles = [
  //   'Order volume less than 10,000/month',
  //   'Order volume greater than 10,000/month',
  //   'Order volume greater than 25,000/month'
  // ];
  const errorsTemplate = {
    autoDispatchTimeframe: '',
    dispatchedBeforeClosingHours: '',
    maxDeliveryLegDistance: '',
    amountOrdersInBatch: '',
    forcedPrice: '',
    name: '',
    billingAccountHolder: {
      companyName: '',
      email: '',
      phone: '',
    }
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
      
      let newError = errorsTemplate;
      const emptyFieldErrorMessage = 'Field is not allowed to be empty';

      for (const i in newError) {
        if (!data[i]) {
          // @ts-ignore
          newError[i] = emptyFieldErrorMessage;
          isError = true;
        }
      }
      // If there's no id, this means that the user is creating a new
      // billing account holder, so we need to validate the form.
      if (!data.billingAccountHolder.id) {
        const { email, name } = data.billingAccountHolder;
        if (!email) {
          newError.billingAccountHolder.email = emptyFieldErrorMessage;
        }
        if (!name) {
          newError.billingAccountHolder.email = emptyFieldErrorMessage;
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
          history.push('/dashboard/pharmacy_configuration');
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

    if (key === 'amountOrdersInBatch' && value && Number(value) < 0) {
      value = 1;
    }
    if (key === 'amountOrdersInBatch' && value && Number(value) > 3000) {
      value = 3000;
    }

    setNewSettingGP({ ...newSettingGP, [key]: value });
  };

  const handlePickUpTimesChange = (options: IPickUpOptions) => {
    const pickUpTimes = Object.keys(options);

    if (pickUpTimes.length > 0) {
      let parsedData = {};
      pickUpTimes.forEach((key) => {
        let isSelected = _.get(options, `[${key}].selected`);
        // Gets only the 'from' and 'to' fields, because there is no need to
        // store the other fields, which are only used to display information
        // in the UI.
        if (isSelected) {
          let value = _.get(options, `[${key}]`);
          parsedData = {
            ...parsedData,
            [key]: {
              from: value.from,
              to: value.to
            }
          };
        }
      });
      setNewSettingGP({
        ...newSettingGP,
        pickUpTimes: {
          ...parsedData
        }
      });
    }
  };

  // const renderPrices = (prices: any, index: number) => {
  //   // @ts-ignore
  //   const error = priceErrors[`mileRadius_${index}`];
  //   return (
  //     <>
  //       <Typography className={styles.blockTitle}>{priceTitles[index]}</Typography>
  //       <Grid container spacing={4}>
  //         <Grid item xs={4}>
  //           <TextField
  //             label={'0-5 Mile Radius '}
  //             inputProps={{
  //               type: 'number',
  //               placeholder: '0.00',
  //               endAdornment: <InputAdornment position="start">$</InputAdornment>
  //             }}
  //             value={prices[0].price}
  //             onChange={handleChangePrice(index, 0)}
  //           />
  //           {error ? <Error className={styles.errorAbsolute} value={error} /> : null}
  //         </Grid>
  //         <Grid item xs={4}>
  //           <TextField
  //             label={'5.1-10 Mile Radius'}
  //             inputProps={{
  //               type: 'number',
  //               placeholder: '0.00',
  //               endAdornment: <InputAdornment position="start">$</InputAdornment>
  //             }}
  //             value={prices[1].price}
  //             onChange={handleChangePrice(index, 1)}
  //           />
  //         </Grid>
  //         <Grid item xs={4}>
  //           <TextField
  //             label={'10+ Mile Radius '}
  //             inputProps={{
  //               type: 'number',
  //               placeholder: '0.00',
  //               endAdornment: <InputAdornment position="start">$/mile</InputAdornment>
  //             }}
  //             value={prices[2].price}
  //             onChange={handleChangePrice(index, 2)}
  //           />
  //         </Grid>
  //       </Grid>
  //     </>
  //   );
  // };

  return (
    // <div className={classNames(styles.systemsWrapper, !notDefaultBilling && styles.wrapper)}>
    <div className={notDefaultBilling ? styles.systemsWrapper : styles.wrapper}>
      {notDefaultBilling && (
        <>
          <div className={styles.groupBlock}>
            <Typography className={styles.blockTitle}>General</Typography>
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <TextField
                      className={styles.billingNameInput}
                      label="Configuration Name *"
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
          </div>
        </>
      )}
      {/* <div className={classNames(notDefaultBilling && styles.groupBlock)}> */}
      {!notDefaultBilling && (
        <div className={styles.navigation}>
          <Typography className={styles.title}>Default Pharmacy Pricing</Typography>
        </div>
      )}
      {/* {isLoading ? (
          <Loading />
        ) : ( */}
      {/* <div> */}

      {id && <APIKey notDefaultBilling={notDefaultBilling} isLoading={isLoading} />}

      {newSettingGP.prices.length > 0 && (
        <PharmacyPricing
          notDefaultBilling={notDefaultBilling}
          isLoading={isLoading}
          prices={newSettingGP.prices}
          handleChangePrice={handleChangePrice}
          handleChange={handleChange}
        />
      )}
      <CourierPricing notDefaultBilling={notDefaultBilling} isLoading={isLoading} />

      <Batching
        settingGroup={newSettingGP}
        notDefaultBilling={notDefaultBilling}
        isLoading={isLoading}
        handleChange={handleChange}
      />

      <Invoicing
        newSettingGP={newSettingGP}
        newSettingsGP={newSettingsGP}
        invoiceFrequencyInfo={invoiceFrequencyInfo}
        invoiceFrequencyInfoLabel={invoiceFrequencyInfoLabel}
        notDefaultBilling={notDefaultBilling}
        isLoading={isLoading}
        handleChange={handleChange}
      />

      <Reporting
        isLoading={isLoading}
        handleSignatureLogChange={handleChange}
        newSettingGP={newSettingGP}
        notDefaultBilling={notDefaultBilling}
      />

      <PickUpTimes
        settingGroup={newSettingGP}
        handleChange={handlePickUpTimesChange}
        notDefaultBilling={notDefaultBilling}
        isLoading={isLoading}
      />

      <AccountHolder
        invoicedId={newSettingGP.invoicedId}
        accountForm={newSettingGP.billingAccountHolder}
        isForNewConfiguration={!id}
        isLoading={isLoading}
        existingAccounts={invoicedAccounts}
        // handleChangeNewAccountData={handleChangeNewAccountData}
        handleChangeBillingAccount={handleChangeBillingAccount}
        
      />

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
      <div className={styles.blurBottom}></div>
      {/* </div> */}
      {/* )} */}
      {/* {isLoading ? (
          <Loading />
        ) : (
          <div>
            {newSettingGP.prices &&
              <PharmacyPricing
                prices={newSettingGP.prices}
                handleChangePrice={handleChangePrice} 
                handleChange={handleChange} 
              />}
              
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
                  label="Manual Batch Deliveries"
                  value={newSettingGP.isManualBatchDeliveries}
                  onChange={handleChange('isManualBatchDeliveries')}
                />
              </Grid>
              <Grid item xs={6}>
                <SelectButton
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
        )} */}
      {/* </div> */}
    </div>
  );
};
