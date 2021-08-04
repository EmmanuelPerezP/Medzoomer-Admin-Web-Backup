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
import _ from 'lodash';
import { IInvoicedCustomer, SettingsGP } from '../../../../interfaces';
import { useStores } from '../../../../store';

export interface AccountHolderProps {
  notDefaultBilling: any;
  invoicedId: number | null;
  isLoading: boolean;
  settingsGP: SettingsGP;
  isForNewConfiguration: boolean;
  existingAccounts: any[];
  handleChangeNewAccountData: Function;
}

export const AccountHolder = (props: AccountHolderProps) => {
  const {
    notDefaultBilling,
    invoicedId,
    isLoading,
    settingsGP,
    isForNewConfiguration,
    existingAccounts,
    handleChangeNewAccountData,
  } = props;

  const { getInvoiceCustomerById } = useSettingsGP();  
  const [showHistory, setShowHistory] = useState(false);
  const [contactErr, setContactError] = useState({
    fullName: '',
    name: '',
    family_name: '',
    companyName: '',
    title: '',
    email: '',
    phone: '',
    phone_number: '',
    type: ''
  });
  const [selectedAccount, setSelectedAccount] = useState({ id: null, number: '' });
  const [disableInputs, setDisableInputs] = useState(isForNewConfiguration);
  const [isLoadingCustomerInfo, setIsLoadingCustomerInfo] = useState(false);
  const [switchValue, setSwitchValue] = useState(isForNewConfiguration && 'existing');
  const { settingGPStore } = useStores();
  const { billingAccountFilters } = useSettingsGP();
  const emptyAccountData: IInvoicedCustomer = {
    attention_to: '',
    name: '',
    number: '',
    email: '',
    phone: '',
  };
  const [newAccountData, setNewAccountData] = useState(emptyAccountData);
  const defaultValuesForSelect = [
    {
      label: 'New',
      value: 'new'
    },
    {
      label: 'Existing',
      value: 'existing'
    }
  ];

  const handleChangeAccount = () => (
    e: React.ChangeEvent<{ value: string }>
  ) => {
    const { value } = e.target;
    const account = existingAccounts.find(account => account.number === value);
    setSelectedAccount(account);
  };

  const handleClearAccountData = () => {
    setNewAccountData(emptyAccountData);
    handleChangeNewAccountData(emptyAccountData);
  };

  const handleDisableInputs = () => {
    const isExistingAccount = switchValue === 'existing';
    setSwitchValue(isExistingAccount ? 'new' : 'existing');
    setDisableInputs(!isExistingAccount);
    handleClearAccountData();
  };

  const handleShowHistory = () => {
    settingGPStore.set("billingAccountHolderHistory")([]);
    settingGPStore.set("billingAccountFilters")({
      ...billingAccountFilters, 
      page: 1
    });
    setShowHistory(!showHistory);
  };

  useEffect(() => {
    if (selectedAccount.id || settingsGP.invoicedId) {
      getCustomerById()
        .then()
        .catch();
    }
  }, [selectedAccount, settingsGP]);

  const getCustomerById = useCallback(async () => {
    setIsLoadingCustomerInfo(true);
    try {
      let id = _.get(selectedAccount, "id")
        ? _.get(selectedAccount, "id")
        : invoicedId;
        
      if(id) {
        const data = await getInvoiceCustomerById(id);
        setNewAccountData(data);
        handleChangeNewAccountData({...data, id});
      }
    } catch (error) {
      // TODO: set error message
    }
    setIsLoadingCustomerInfo(false);
  }, [invoicedId, selectedAccount, getInvoiceCustomerById]);

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<{ value: string }>
  ) => {
    const { value } = e.target;
    const data = {
      ...newAccountData,
      [field]: value,
    };
    setNewAccountData(data);
    handleChangeNewAccountData(data);
  }

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
            {isForNewConfiguration && (
              <Grid container spacing={4}>
                <Grid item xs={4}>
                  <div className={styles.toggle}>
                    <SelectButton
                      label=''
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
              {switchValue !== 'new' && (
                <Grid item xs={4}>
                  <Select
                    label={"Account *"}
                    value={newAccountData.number}
                    onChange={handleChangeAccount()}
                    items={
                      existingAccounts.map(account => {
                        return {
                          value: account.number,
                          label: account.number
                        };
                      })
                    }
                    classes={{
                      input: styles.input,
                      selectLabel: styles.selectLabel,
                      inputRoot: styles.inputRoot
                    }}
                    className={styles.periodSelect}
                  />
                  {contactErr.type ? (
                    <Error className={styles.error} value={contactErr.type} />
                  ) : null}
                </Grid>
              )}
              <Grid item xs={4}>
                <TextField
                  label={'Company Name *'}
                  classes={{
                    root: classNames(styles.textField, styles.input)
                  }}
                  value={newAccountData.name || ''}
                  disabled={disableInputs}
                  onChange={handleInputChange('name')}
                  inputProps={{
                    placeholder: 'Required'
                  }}
                />
                {contactErr.companyName ? (
                  <Error
                    className={styles.error}
                    value={contactErr.companyName}
                  />
                ) : null}
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <TextField
                  label={'Email *'}
                  classes={{
                    root: classNames(styles.textField, styles.input)
                  }}
                  value={newAccountData.email}
                  disabled={disableInputs}
                  onChange={handleInputChange('email')}
                  inputProps={{
                    placeholder: 'Required'
                  }}
                />
                {contactErr.email ? (
                  <Error className={styles.error} value={contactErr.email} />
                ) : null}
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label={'Attention to'}
                  classes={{
                    root: classNames(styles.textField, styles.input)
                  }}
                  value={newAccountData.attention_to || ''}
                  disabled={disableInputs}
                  onChange={handleInputChange('attention_to')}
                  inputProps={{
                    placeholder: 'Required'
                  }}
                />
                {contactErr.companyName ? (
                  <Error
                    className={styles.error}
                    value={contactErr.companyName}
                  />
                ) : null}
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label={'Phone (Optional)'}
                  classes={{
                    root: classNames(styles.textField, styles.input)
                  }}
                  value={newAccountData.phone || ''}
                  disabled={disableInputs}
                  onChange={handleInputChange('phone')}
                  inputProps={{
                    placeholder: '(000) 000-000'
                  }}
                />
                {contactErr.phone || contactErr.phone_number ? (
                  <Error
                    className={styles.error}
                    value={contactErr.phone || contactErr.phone_number}
                  />
                ) : null}
              </Grid>
            </Grid>
            <Typography className={styles.messageInfo}>
              This information will be updated on the Invoiced.com portal.
            </Typography>
            {!isForNewConfiguration && (
              <div
                className={styles.toggleHistory}
                onClick={handleShowHistory}
              >
                <Typography className={styles.viewHistory}>
                  View Change History
                </Typography>
                <SVGIcon
                  className={classNames(showHistory && styles.downArrow)}
                  name="rightArrow"
                />
              </div>
            )}
            {showHistory && <AccountHolderHistory invoicedId={invoicedId} />}
          </div>
        )}
      </div>
    </>
  );
};
