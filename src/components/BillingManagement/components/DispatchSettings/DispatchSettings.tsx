import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
  invoiceFrequencyMonthlyDays,
  invoiceFrequencyWeeklyDays
} from '../../../../constants';
import Error from '../../../common/Error';
import Loading from '../../../common/Loading';
import styles from './DispatchSettings.module.sass';
import { Grid, makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import TextField from '../../../common/TextField';
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
import { IPickUpOptions, BillingAccount, ICourierPricing } from '../../../../interfaces';
import _ from 'lodash';
import { useStores } from '../../../../store';
import useBillingManagement from '../../../../hooks/useBillingManagement';
import ContactSettings from '../ContactSettings';
import { validateCourierPricing } from '../../helper/validateCourierPricing';

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
  const { notDefaultBilling, changeSettingGPName} = props;
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
  const [newSettingGP, setNewSettingGP] = useState(newSettingsGP);
  const [totalCount, setTotalCount] = useState(0);
  const billingAccountHolderErrors = {
    account: '',
    companyName: '',
    email: '',
    phone: '',
    invoiced: ''
  };
  
  const emptyAccountData: BillingAccount = {
    attention_to: '',
    name: '',
    companyName: '',
    email: '',
    phone: ''
  };

  const emptyCourierPricing: ICourierPricing = {
    courier_cost_for_one_order: '',
    courier_cost_for_two_order: '',
    courier_cost_for_more_two_order: '',
    courier_cost_for_ml_in_delivery: ''
  };

  const errorsTemplate = {
    autoDispatchTimeframe: '',
    maxDeliveryLegDistance: '',
    amountOrdersInBatch: '',
    name: '',
  };

  const priceErrorsTemplate = {
    mileRadius_0_0: '',
    mileRadius_0_1: '',
    mileRadius_1_0: '',
    mileRadius_1_1: '',
    failedDeliveryCharge: ''
  }

  const [errors, setErrors] = useState(errorsTemplate);
  const [priceErrors, setPriceErrors] = useState(priceErrorsTemplate);
  const [courierPricingErrors, setcourierPricingErrors] = useState(emptyCourierPricing);
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
  const sectionRef = useRef<HTMLLinkElement>(null);

  const getSettingGPById = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSettingGP(id);
      let newData = {
        ...data.data,
        billingAccountHolder: {...emptyAccountData }
      };
      const hvPrices = data.data.highVolumePrices;
      const standardPrices = data.data.standardPrices;
      if (hvPrices && hvPrices.length === 0) {
        newData = {
          ...newData,
          highVolumePrices: newSettingGP.highVolumePrices,
        };
      }
      if (standardPrices && standardPrices.length === 0) {
        newData = {
          ...newData,
          standardPrices: newSettingGP.standardPrices,
        };
      }
      if (!data.data.calculateDistanceForSegments) {
        newData = {
          ...newData,
          calculateDistanceForSegments: 'Yes'
        };
      }
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
      let newData = { ...newSettingGP };
      if (data && data.data) {
        newData = { ...data.data };
      }
      setNewSettingGP({ ...newData, name: 'default', isDefault: true });
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

  const validateBillingAccountHolder = () => {
    const billingAccount = newSettingGP.billingAccountHolder;
    let errors = { ...billingAccountErrors };
    let isValid = true;
    if(!billingAccount.companyName) {
      errors = { 
        ...errors,
        companyName: 'Company Name cannot be empty'
      };
      isValid = false;
    }
    if(!billingAccount.email) {
      errors = { 
        ...errors,
        email: 'Email cannot be empty'
      };
      isValid = false;
    }
    setBillingAccountErrors(errors);
    return isValid;
  }

  const valid = useCallback(
    (data: any) => {
      let isError = false;
      let newError = { ...errorsTemplate };
      const priceError = { ...priceErrorsTemplate };

      if (notDefaultBilling && !data.name) {
        newError.name = 'Name cannot be empty';
        isError = true;
      }

      if (data.standardPrices || data.highVolumePrices) {
        const prices = data.allowHighVolumeDeliveries
          ? data.highVolumePrices
          : data.standardPrices;

        prices.forEach((item: any, index: number) => {
          if (item.prices) {
            item.prices.forEach((price: any, priceIndex: number) => {
              if (Number(price.price) <= 0) {
                isError = true;
                const field = `mileRadius_${index}_${priceIndex}`;
                // @ts-ignore
                priceError[field] = 'Required';
              }
            });
            setPriceErrors(priceError);
          }
        });
      }

      if (!data.failedDeliveryCharge) {
        setPriceErrors({
          ...priceError,
          failedDeliveryCharge: 'Required'
        });
        isError = true;
      }

      const {errors, isCourierError} = validateCourierPricing(data.courierPricing);
      isError = isCourierError;
      setcourierPricingErrors(errors);

      if (data.autoDispatchTimeframe <= 0 || data.autoDispatchTimeframe % 15 > 0) {
        newError.autoDispatchTimeframe = 'Must be a multiple of 15';
        isError = true;
      }

      if (data.calculateDistanceForSegments === 'Yes' && data.maxDeliveryLegDistance <= 0) {
        newError.maxDeliveryLegDistance = 'Must be greater than 0';
        isError = true;
      }

      setErrors(newError);
      const isValidBillingAccount = validateBillingAccountHolder();
      return !isError && isValidBillingAccount;
    },
    [notDefaultBilling, newSettingGP.billingAccountHolder]
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
    let prices = newSettingGP.standardPrices;
    let field = 'standardPrices';
    if (newSettingGP.allowHighVolumeDeliveries) {
      prices = newSettingGP.highVolumePrices;
      field = 'highVolumePrices';
    }
    // @ts-ignore
    prices[indexPrice].prices[indexPriceInPrice].price = value;
    setNewSettingGP({ ...newSettingGP, [field]: prices });
    setPriceErrors({
      ...priceErrors, 
      [`mileRadius_${indexPrice}_${indexPriceInPrice}`]: '' 
    });
  };

  const handleFailedDeliveryChargeChange = () => (
    e: React.ChangeEvent<{ value: string }>
  ) => {
    const { value } = e.target;
    setNewSettingGP({ ...newSettingGP, failedDeliveryCharge: value});
    setPriceErrors({
      ...priceErrors, 
      failedDeliveryCharge: ''
    });
  };

  const handleCourierPricingChange = (pricingType: string) => (
    e: React.ChangeEvent<{ value: string }>
  ) => {
    const { value } = e.target;
    setNewSettingGP({
      ...newSettingGP,
      courierPricing: {
        ...newSettingGP.courierPricing,
        [pricingType]: value
      }
    });
  };

  const handleSwitchChange = (switchName: string, value: boolean) => {
    setNewSettingGP({ 
      ...newSettingGP, 
      [switchName]: value
    });
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
    setErrors({ ...errors, [key]: '' });
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

  const goto = (sectionName: string) => {
    // let ref = React.createRef();
    console.log(sectionName)
    // window.scrollTo(210, 200);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({
        block: "end", behavior: "smooth"
      });
    }
  }

  const renderSectionsBlock = () => {
    // TODO: improve this
    const sectionsList = ["General", "API Key", "Pharmacy Pricing", "Courier Pricing", "Batching", "Invoicing", "Reporting", "Pick Up Times", "Billing Account Holder", "Billing Contacts"];
    return (
      <div className={styles.sectionList}>
        {sectionsList.map((sectionName) => {
          return (
            <div className={styles.section} onClick={() => goto(sectionName)}>
                <Typography className={styles.title}>{sectionName}</Typography>
            </div>
          )
        })}
      </div>
    );
  };

  return (
    // <div className={classNames(styles.systemsWrapper, !notDefaultBilling && styles.wrapper)}>
    <>
    {notDefaultBilling && renderSectionsBlock()}
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

      {!notDefaultBilling && (
        <div className={styles.navigation}>
          <Typography className={styles.title}>Default Pharmacy Pricing</Typography>
        </div>
      )}

      {id && <APIKey notDefaultBilling={notDefaultBilling} isLoading={isLoading} />}

      <PharmacyPricing
        notDefaultBilling={notDefaultBilling}
        isLoading={isLoading}
        allowHighVolumeDeliveries={newSettingGP.allowHighVolumeDeliveries}
        enablePriceProjection={newSettingGP.enablePriceProjection}
        prices={
          newSettingGP.allowHighVolumeDeliveries 
          ? newSettingGP.highVolumePrices
          : newSettingGP.standardPrices
        }
        errors={priceErrors}
        failedDeliveryCharge={newSettingGP.failedDeliveryCharge}
        handleChangePrice={handleChangePrice}
        handleSwitchChange={handleSwitchChange}
        handleFailedDeliveryChargeChange={handleFailedDeliveryChargeChange}
      />

      {notDefaultBilling && (
        <CourierPricing
          notDefaultBilling={notDefaultBilling}
          isLoading={isLoading}
          courierPricing={newSettingGP.courierPricing}
          errors={courierPricingErrors}
          handleCourierPricingChange={handleCourierPricingChange}
        />
      )}

      <Batching
        sectionRef={sectionRef}
        settingGroup={newSettingGP}
        notDefaultBilling={notDefaultBilling}
        isLoading={isLoading}
        errors={errors}
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
        sectionRef={sectionRef}
        settingGroup={newSettingGP}
        handleChange={handlePickUpTimesChange}
        notDefaultBilling={notDefaultBilling}
        isLoading={isLoading}
      />

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
      <div className={styles.blurBottom}></div>
    </div>
  </>
  );
};
