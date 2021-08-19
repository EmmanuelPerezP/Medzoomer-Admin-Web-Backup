import React, { useCallback, useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { Error } from '../../../common/Error/Error';
import Select from '../../../common/Select';
import TextField from '../../../common/TextField';
import styles from './AccountHolder.module.sass';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import SVGIcon from '../../../common/SVGIcon';
import AccountHolderHistory from '../AccountHolderHistory';
import Loading from '../../../common/Loading';
import SelectButton from '../../../common/SelectButton';
import { BillingAccount } from '../../../../interfaces';
import { useStores } from '../../../../store';

export interface AccountHolderProps {
  invoicedId?: number | null;
  accountForm: BillingAccount;
  errors: any;
  isLoading: boolean;
  isForNewConfiguration: boolean;
  existingAccounts: any[];
  handleChangeBillingAccount: Function;
  handleScroll: Function;
}

export const AccountHolder = (props: AccountHolderProps) => {
  const {
    invoicedId,
    accountForm,
    errors,
    isLoading,
    isForNewConfiguration,
    existingAccounts,
    handleChangeBillingAccount,
    handleScroll
  } = props;

  const { getInvoiceCustomerById } = useSettingsGP();
  const [showHistory, setShowHistory] = useState(false);
  const [disableInputs, setDisableInputs] = useState(isForNewConfiguration);
  const [isLoadingCustomerInfo, setIsLoadingCustomerInfo] = useState(false);
  const [switchValue, setSwitchValue] = useState(isForNewConfiguration && 'existing');
  const { settingGPStore } = useStores();
  const { billingAccountFilters } = useSettingsGP();
  const emptyAccountData: BillingAccount = {
    attention_to: '',
    name: '',
    companyName: '',
    number: '',
    email: '',
    phone: ''
  };

  const defaultValuesForSelect = [
    { label: 'New', value: 'new' },
    { label: 'Existing', value: 'existing' }
  ];

  const handleChangeAccount = () => (e: React.ChangeEvent<{ value: string }>) => {
    const { value } = e.target;
    const { id } = existingAccounts.find((account) => account.number === value);
    if (id) {
      handleChangeBillingAccount({ id, account: accountForm });
    }
    clearHistory();
  };

  const handleClearAccountData = () => {
    handleChangeBillingAccount({ account: emptyAccountData });
  };

  const handleDisableInputs = () => {
    const isExistingAccount = switchValue === 'existing';
    setSwitchValue(isExistingAccount ? 'new' : 'existing');
    setDisableInputs(!isExistingAccount);
    handleClearAccountData();
  };

  const handleShowHistory = () => {
    clearHistory();
    setShowHistory(!showHistory);
  };

  const clearHistory = () => {
    settingGPStore.set('billingAccountHolderHistory')([]);
    settingGPStore.set('billingAccountFilters')({
      ...billingAccountFilters,
      page: 1
    });
  };

  const getCustomerById = useCallback(async () => {
    setIsLoadingCustomerInfo(true);
    try {
      if (invoicedId) {
        const account = await getInvoiceCustomerById(invoicedId);
        let accountData = account;
        if (!account.companyName) {
          accountData = { ...accountData, companyName: account.name }
        }
        handleChangeBillingAccount({ id: invoicedId, account: accountData });
      }
    } catch (error) {
      // TODO: set error message
    }
    setIsLoadingCustomerInfo(false);
  }, [accountForm, handleChangeBillingAccount, getInvoiceCustomerById]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<{ value: string }>) => {
    const { value } = e.target;
    const id = accountForm.id || invoicedId;
    let account = {
      ...accountForm,
      [field]: value
    };
    if (field === 'companyName') {
      account = { ...account, name: value };
    }
    handleChangeBillingAccount({ id, account });
  };

  const getMappedItems = (): any[] => {
    return existingAccounts.map((account) => {
      return {
        value: account.number,
        label: `${account.name} (${account.number})`
      };
    });
  };

  useEffect(() => {
    if (invoicedId) {
      getCustomerById()
        .then()
        .catch();
    }
  }, [invoicedId]);

  const renderForm = () => {
    return (
      <>
        {isForNewConfiguration && (
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <div className={styles.toggle}>
                <SelectButton
                  label=""
                  value={switchValue}
                  items={defaultValuesForSelect}
                  onChange={handleDisableInputs}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              {isLoadingCustomerInfo && <Loading className={styles.loading} />}
            </Grid>
          </Grid>
        )}
        <Grid container spacing={4}>
          {switchValue !== "new" && (
            <Grid item xs={4}>
              <Select
                label={"Account *"}
                value={accountForm.number || ""}
                onChange={handleChangeAccount()}
                onScroll={handleScroll()}
                items={getMappedItems()}
                classes={{
                  input: styles.input,
                  selectLabel: styles.selectLabel,
                  inputRoot: styles.inputRoot
                }}
                className={styles.periodSelect}
              />
              {errors.account ? (
                <Error className={styles.error} value={errors.account} />
              ) : null}
            </Grid>
          )}
          <Grid item xs={4}>
            <TextField
              label={"Company Name *"}
              classes={{
                root: classNames(styles.textField, styles.input)
              }}
              value={accountForm.companyName || ""}
              disabled={disableInputs}
              onChange={handleInputChange("companyName")}
              inputProps={{
                placeholder: "Required"
              }}
            />
            {errors.companyName ? (
              <Error className={styles.error} value={errors.companyName} />
            ) : null}
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <TextField
              label={"Email *"}
              classes={{
                root: classNames(styles.textField, styles.input)
              }}
              value={accountForm.email || ""}
              disabled={disableInputs}
              onChange={handleInputChange("email")}
              inputProps={{
                placeholder: "Required"
              }}
            />
            {errors.email ? (
              <Error className={styles.error} value={errors.email} />
            ) : null}
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={"Attention to"}
              classes={{
                root: classNames(styles.textField, styles.input)
              }}
              value={accountForm.attention_to || ""}
              disabled={disableInputs}
              onChange={handleInputChange("attention_to")}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={"Phone (Optional)"}
              classes={{
                root: classNames(styles.textField, styles.input)
              }}
              value={accountForm.phone || ""}
              disabled={disableInputs}
              onChange={handleInputChange("phone")}
              inputProps={{
                placeholder: "(000) 000-000"
              }}
            />
            {errors.phone || errors.phone_number ? (
              <Error
                className={styles.error}
                value={errors.phone || errors.phone_number}
              />
            ) : null}
          </Grid>
        </Grid>
        <Typography className={styles.messageInfo}>
          This information will be updated on the Invoiced.com portal.
        </Typography>
        {errors.invoiced ? (
          <Error className={styles.errorAbsolute} value={errors.invoiced} />
        ) : null}
      </>
    );
  };

  const renderHistory = () => {
    return (
      !isForNewConfiguration && (
        <>
          <div className={styles.toggleHistory} onClick={handleShowHistory}>
            <Typography className={styles.viewHistory}>
              View Change History
            </Typography>
            <SVGIcon
              className={classNames(showHistory && styles.downArrow)}
              name="rightArrow"
            />
          </div>
          {showHistory && <AccountHolderHistory invoicedId={invoicedId} />}
        </>
      )
    );
  };

  return (
    <>
      <div className={styles.groupBlock}>
        {isLoading ? (
          <Loading className={styles.loading} />
        ) : (
          <div className={styles.accountHolder}>
            <Typography className={styles.blockTitle}>
              Billing Account Holder
            </Typography>
            {renderForm()}
            {renderHistory()}
          </div>
        )}
      </div>
    </>
  );
};
