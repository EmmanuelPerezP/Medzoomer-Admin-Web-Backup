import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useHistory, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
// import SendIcon from '@material-ui/icons/Send';
// import AssessmentIcon from '@material-ui/icons/Assessment';

import { useStores } from '../../../../store';
import useGroups from '../../../../hooks/useGroup';
import useUser from '../../../../hooks/useUser';
import { decodeErrors } from '../../../../utils';
import {
  contactTypesArray,
  contactTypes,
  invoiceFrequency,
  invoiceFrequencyWeeklyDays,
  invoiceFrequencyMonthlyDays
} from '../../../../constants';
import usePharmacy from '../../../../hooks/usePharmacy';
import useBillingManagement from '../../../../hooks/useBillingManagement';

import SVGIcon from '../../../common/SVGIcon';
import TextField from '../../../common/TextField';
import Select from '../../../common/Select';
import Error from '../../../common/Error';
import DispatchSettings from '../../../Settings/Dispatch';
import Image from '../../../common/Image';
import Loading from '../../../common/Loading';
import AutoCompleteSearch from '../../../common/AutoCompleteSearch';
// import MenuSmall from '../../../common/MenuSmall';

import styles from './CreateGroup.module.sass';
import { ConfirmationModal } from '../../../common/ConfirmationModal/ConfirmationModal';
import useSettingsGP from '../../../../hooks/useSettingsGP';

let timerId: any = null;
const groupManagerDelimeter = '__delimeter__';

const errorText = 'All fields are required';

export const CreateGroup: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const history = useHistory();
  const { getPharmacies, filters, createPharmacyAdmin, removePharmacyAdmin } = usePharmacy();
  const { getAllBilling } = useBillingManagement();
  const [isLoading, setIsLoading] = useState(false);
  const [isHasBillingAccount, setIsHasBillingAccount] = useState(false);
  const [settingsGP, setSettingsGP] = useState(null);
  const [isOptionLoading, setIsOptionLoading] = useState(false);
  const [isContactLoading, setIsContactLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [billingAccount, setBillingAccount] = useState([]);
  const [selectedPharmacies, setSelectedPharmacies] = useState<any[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [selectedManagers, setSelectedManagers] = useState<any[]>([]);
  const [isReportGenerate, setIsReportGenerate] = useState(false);
  const [isSendBilling, setIsSendBilling] = useState(false);
  const [reportIsGenerated, setReportIsGenerated] = useState(false);
  const [invoiceIsGenerated, setInvoiceIsGenerated] = useState(false);
  const [userIsAdded, setUserIsAdded] = useState(false);
  const { groupStore } = useStores();
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
  const { sub } = useUser();
  const [err, setError] = useState({
    global: '',
    name: '',
    billingAccount: '',
    mileRadius_0: '',
    mileRadius_1: '',
    mileRadius_2: '',
    forcedPrice: ''
  });
  // similar data because the form is used for different methods (in one phone, in other phone_number etc.)
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
  const { addGroupToPharmacy, removeGroupFromPharmacy } = usePharmacy();

  const computedContacts = useMemo(() => {
    return selectedContacts.concat(selectedManagers);
  }, [selectedContacts, selectedManagers]);

  const getBillingAccount = useCallback(async () => {
    try {
      const { data } = await getAllBilling();
      const listBillingAccouns: any = [];
      listBillingAccouns.push({
        value: 0,
        label: 'Not Selected'
      });
      // eslint-disable-next-line
      data.map((item: any) => {
        listBillingAccouns.push({
          value: item._id,
          label: item.name
        });
      });
      setBillingAccount(listBillingAccouns);
      setIsLoading(false);
    } catch (err) {
      console.error(err, billingAccount);
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    addNewGroupDefaultData();
    getBillingAccount().catch((r) => r);
    if (id) {
      setIsLoading(true);
      handleGetById(id)
        .then(() => {
          setIsLoading(false);
        })
        .catch((r) => r);
      handleGetContacts(id).catch((r) => r);
      handleGetManagers(id).catch((r) => r);
      handleGetPharmacyInGroup(id).catch((r) => r);
    }

    return () => {
      addNewGroupDefaultData();
    };
    // eslint-disable-next-line
  }, [id]);

  const handleGetById = async (idGroup: string) => {
    const result = await getGroup(idGroup);
    groupStore.set('newGroup')({
      name: result.data.name,
      invoiceFrequency: result.data.invoiceFrequency || 'bi_monthly',
      billingAccount: result.data.billingAccount || null,
      invoiceFrequencyInfo: result.data.invoiceFrequencyInfo || 1,
      prices: result.data.prices || null,
      forcedPrice: result.data.forcedPrice
    });
    setSettingsGP(result.data.settingsGP);
  };

  const handleGetPharmacyInGroup = async (idGroup: string) => {
    const pharmacyInGroup = await getPharmacyInGroup(idGroup);
    pharmacyInGroup.data ? setSelectedPharmacies(pharmacyInGroup.data) : setSelectedPharmacies([]);
  };

  const handleGetContacts = async (idGroup: string) => {
    const contacts = await getContacts(idGroup);
    if (contacts.data) {
      for (const i in contacts.data) {
        if (contacts.data[i].type === 'BILLING-ACCOUNT') {
          setIsHasBillingAccount(true);
        }
      }
      setSelectedContacts(contacts.data);
    }
  };

  const handleGetManagers = async (idGroup: string) => {
    const { data } = await getManagers(idGroup);
    if (data) {
      setSelectedManagers(data);
    }
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <Link className={styles.link} to={'/dashboard/groups'}>
          <SVGIcon name="backArrow" className={styles.backArrowIcon} />
        </Link>

        {id ? (
          <div className={styles.textBlock}>
            <Typography className={styles.title}>Group Details</Typography>
            <Typography className={styles.subTitle}>{groupStore.get('newGroup').name}</Typography>
          </div>
        ) : (
          <Typography className={styles.title}>Add New Group</Typography>
        )}

        <div className={styles.reportBtnBlock}>
          {!id ? null : isReportGenerate || isSendBilling ? (
            <Loading />
          ) : (
            <>
              <Button
                color="secondary"
                variant={'contained'}
                onClick={handleGenerateReport}
                className={styles.reportBtn}
                disabled={isReportGenerate}
              >
                Generate Report
              </Button>
              <Button
                color="primary"
                variant={'contained'}
                onClick={handleSendInvoices}
                className={styles.sendInvoicesBtn}
                disabled={isSendBilling}
              >
                Send Invoice
              </Button>
              {/*<MenuSmall*/}
              {/*  options={[*/}
              {/*    {*/}
              {/*      icon: <AssessmentIcon color={'inherit'} />,*/}
              {/*      title: 'Generate Report',*/}
              {/*      action: handleGenerateReport,*/}
              {/*      loading: isReportGenerate*/}
              {/*    },*/}
              {/*    {*/}
              {/*      // icon: <SVGIcon name={'details'} />,*/}
              {/*      icon: <SendIcon color={'inherit'} />,*/}
              {/*      title: 'Send Invoice',*/}
              {/*      action: handleSendInvoices,*/}
              {/*      loading: isSendBilling*/}
              {/*    }*/}
              {/*  ]}*/}
              {/*/>*/}
            </>
          )}
        </div>
      </div>
    );
  };

  const handleChangeContact = (key: string) => (e: React.ChangeEvent<{ value: string | number }>) => {
    const { value } = e.target;

    groupStore.set('newContact')({ ...newContact, [key]: value });

    if (key === 'fullName') {
      setContactError({ ...contactErr, fullName: '', name: '', family_name: '' });
    } else if (key === 'type') {
      setContactError({
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
    } else if (key === 'phone') {
      setContactError({ ...contactErr, phone: '', phone_number: '' });
    } else {
      setContactError({ ...contactErr, [key]: '' });
    }
  };

  const addNewGroupDefaultData = () => {
    groupStore.set('newGroup')({
      name: '',
      invoiceFrequency: 'bi_monthly',
      invoiceFrequencyInfo: 1,
      billingAccount: '',
      forcedPrice: null,
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

  const validate = () => {
    let isError = false;

    if (newGroup.prices) {
      const errors = {
        mileRadius_0: '',
        mileRadius_1: '',
        mileRadius_2: '',
        forcedPrice: '',
        name: ''
      };
      newGroup.prices.forEach((item, index) => {
        if (item.prices) {
          item.prices.forEach((price) => {
            if (Number(price.price) <= 0) {
              isError = true;
              const field = `mileRadius_${index}`;
              // @ts-ignore
              errors[field] = errorText;
            }
          });
        }
      });

      if (!newGroup.forcedPrice && newGroup.forcedPrice !== 0) {
        isError = true;
        errors.forcedPrice = 'Required field';
      } else if (newGroup.forcedPrice < 0) {
        isError = true;
        errors.forcedPrice = 'Forced price should have positive value';
      }

      if (!newGroup.name.trim()) {
        isError = true;
        errors.name = 'Group Name is not allowed to be empty';
      }

      if (isError) {
        setError({ ...err, ...errors });
      }
    }

    return !isError;
  };

  const handleCreateGroup = async () => {
    setError({
      global: '',
      name: '',
      billingAccount: '',
      mileRadius_0: '',
      mileRadius_1: '',
      mileRadius_2: '',
      forcedPrice: ''
    });
    if (!validate()) {
      return false;
    }

    setIsLoading(true);
    try {
      if (id) {
        await updateGroup(id, newGroup);
      } else {
        await createGroup({ ...newGroup, name: newGroup.name.trim() });
      }
    } catch (error) {
      const errors = error.response.data;
      setError({ ...err, ...decodeErrors(errors.details) });
      setIsLoading(false);
      return;
    }
    addNewGroupDefaultData();
    setIsLoading(false);
    history.push('/dashboard/groups');
  };

  const isContactGroupManager = () => {
    return ((newContact.type as unknown) as string) === 'GROUP-MANAGER';
  };

  const handleAddContact = async () => {
    setContactError({
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
    setIsContactLoading(true);
    try {
      if (isContactGroupManager()) {
        const [name, familyName] = newContact.fullName.split(' ');
        if (name && !familyName) {
          setContactError({ ...contactErr, family_name: 'Full name must contain from two words' });
          setIsContactLoading(false);
          return;
        }
        const jobTitle =
          newContact.companyName && newContact.title
            ? `${newContact.companyName}${groupManagerDelimeter}${newContact.title}`
            : '';
        await createPharmacyAdmin({
          name,
          family_name: familyName,
          email: newContact.email,
          phone_number: newContact.phone,
          jobTitle,
          groupId: id
        } as any);
      } else {
        await addContact(id, newContact);
      }
      setUserIsAdded(true);
      await handleGetContacts(id);
      await handleGetManagers(id);
    } catch (error) {
      const errors = error.response.data;
      // console.log(errors)
      setContactError({ ...contactErr, ...decodeErrors(errors.details) });
      setIsContactLoading(false);
      return;
    }
    groupStore.set('newContact')({
      fullName: '',
      email: '',
      companyName: '',
      title: '',
      phone: '',
      type: 'BILLING'
    });
    setIsContactLoading(false);
  };

  const handleGenerateReport = async () => {
    setIsReportGenerate(true);
    await generateReport({ groupId: id }).catch(console.error);
    setIsReportGenerate(false);
    setReportIsGenerated(true);
  };

  const handleSendInvoices = async () => {
    setIsSendBilling(true);
    await sendInvoices({ groupId: id }).catch(console.error);
    setIsSendBilling(false);
    setInvoiceIsGenerated(true);
  };

  const renderFooter = () => {
    return (
      <div className={styles.buttons}>
        <Button
          className={styles.changeStepButton}
          variant="contained"
          color="secondary"
          disabled={isLoading}
          onClick={handleCreateGroup}
        >
          <Typography className={styles.summaryText}>Save</Typography>
        </Button>
      </div>
    );
  };

  const priceTitles = [
    'Order volume less than 10,000/month',
    'Order volume greater than 10,000/month',
    'Order volume greater than 25,000/month'
  ];

  const renderPrices = (prices: any, index: number) => {
    // @ts-ignore
    const error = err[`mileRadius_${index}`];
    return (
      <div className={styles.nextBlock}>
        <Typography className={styles.blockTitle}>{priceTitles[index]}</Typography>
        <div className={styles.threeInput}>
          <div className={styles.textField}>
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
          </div>
          <div className={styles.textField}>
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
          </div>
          <div className={styles.textField}>
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
          </div>
        </div>
      </div>
    );
  };

  const renderGroupInfo = () => {
    let invoiceFrequencyInfo: any = [];
    let invoiceFrequencyInfoLabel = '';

    if (['bi_weekly', 'weekly'].includes(newGroup.invoiceFrequency)) {
      invoiceFrequencyInfo = invoiceFrequencyWeeklyDays;
      invoiceFrequencyInfoLabel = 'Day of Week';
    }

    if ('monthly' === newGroup.invoiceFrequency) {
      invoiceFrequencyInfo = invoiceFrequencyMonthlyDays;
      invoiceFrequencyInfoLabel = 'Day of Month';
    }

    return (
      <div className={styles.groupBlock}>
        <div className={styles.mainInfo}>
          <div className={styles.managerBlock}>
            <Typography className={styles.blockTitle}>General</Typography>
            <div className={styles.oneInput}>
              <div className={styles.textField}>
                <TextField
                  label={'Group Name'}
                  classes={{
                    root: styles.textField
                  }}
                  inputProps={{
                    placeholder: 'Please enter group name'
                  }}
                  value={newGroup.name}
                  onChange={handleChange('name')}
                />
                {err.name ? <Error className={styles.error} value={err.name} /> : null}
              </div>
            </div>
          </div>
          {newGroup.prices &&
            newGroup.prices.map((item, index) => {
              return renderPrices(item.prices, index);
            })}
          <div className={styles.nextBlock}>
            <Typography className={styles.blockTitle}>Manual Price</Typography>
            <div className={styles.oneInput}>
              <div className={styles.textField}>
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
              </div>
            </div>
          </div>
          <div className={styles.nextBlock}>
            <Typography className={styles.blockTitle}>Invoice</Typography>
            <div className={styles.threeInput}>
              <div className={styles.textField}>
                <Select
                  label={'Frequency'}
                  value={newGroup.invoiceFrequency}
                  onChange={handleChange('invoiceFrequency')}
                  items={invoiceFrequency}
                  IconComponent={() => <SVGIcon name={'downArrow'} style={{ height: '15px', width: '15px' }} />}
                  classes={{ input: styles.input, root: styles.select, inputRoot: styles.inputRoot }}
                />
              </div>
              {invoiceFrequencyInfoLabel ? (
                <div className={styles.textField}>
                  <Select
                    label={invoiceFrequencyInfoLabel}
                    value={newGroup.invoiceFrequencyInfo}
                    onChange={handleChange('invoiceFrequencyInfo')}
                    items={invoiceFrequencyInfo}
                    IconComponent={() => <SVGIcon name={'downArrow'} style={{ height: '15px', width: '15px' }} />}
                    classes={{ input: styles.input, root: styles.select, inputRoot: styles.inputRoot }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {renderFooter()}
      </div>
    );
  };

  const handleSearchPharmacy = (e: any) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    const value: any = e.target.value;
    timerId = setTimeout(() => {
      getPharmaciesList(value).catch();
    }, 500);
  };

  const handleFocus = () => {
    getPharmaciesList('').catch();
  };

  const getPharmaciesList = useCallback(
    async (search) => {
      setIsOptionLoading(true);
      try {
        const pharmaciesResult = await getPharmacies({
          ...filters,
          page: 0,
          perPage: 10,
          search
        });
        setPharmacies(pharmaciesResult.data);
        setIsOptionLoading(false);
      } catch (err) {
        console.error(err);
        setIsOptionLoading(false);
      }
    },
    [getPharmacies, filters]
  );

  const handleRemovePharmacy = async (pharmacy: any) => {
    await removeGroupFromPharmacy(pharmacy._id, id);
    setPharmacies([]);
    await handleGetPharmacyInGroup(id);
  };

  const handleRemoveContact = async (contactId: string, isGroupManager: boolean) => {
    setIsContactLoading(true);
    try {
      if (isGroupManager) await removePharmacyAdmin(contactId);
      else await removeContact(id, contactId);
      setSelectedContacts([]);
      setSelectedManagers([]);
      setIsHasBillingAccount(false);
      await handleGetContacts(id);
      await handleGetManagers(id);
      setIsContactLoading(false);
    } catch (error) {
      const errors = error.response.data;
      setError({ ...err, ...decodeErrors(errors.details) });
      setIsContactLoading(false);
      return;
    }
  };

  const handleAddPharmacy = async (pharmacy: any) => {
    setIsOptionLoading(true);
    await addGroupToPharmacy(pharmacy._id, id);
    setPharmacies([]);
    setIsOptionLoading(false);
    await handleGetPharmacyInGroup(id);
  };

  const closeMessageModal = () => {
    setReportIsGenerated(false);
    setInvoiceIsGenerated(false);
  };

  const closeUserContactModal = () => {
    setUserIsAdded(false);
  };

  const renderPharmacies = () => {
    return (
      <div className={styles.pharmacies}>
        <Typography className={styles.blockTitle}>Added Pharmacies</Typography>
        <AutoCompleteSearch placeholder={'Add Pharmacy'} onFocus={handleFocus} onChange={handleSearchPharmacy} />
        <div className={styles.options}>
          {isOptionLoading ? (
            <Loading className={styles.loadPharmacyBlock} />
          ) : pharmacies && pharmacies.length === 0 ? null : (
            pharmacies.map((row: any) => {
              const { address, preview, _id, name } = row;
              if (_.find(selectedPharmacies, { _id })) {
                return null;
              }
              return (
                <div key={_id} className={styles.optionItem}>
                  <div className={styles.infoWrapper}>
                    <Image
                      className={styles.photo}
                      alt={'No Avatar'}
                      src={preview}
                      width={200}
                      height={200}
                      cognitoId={sub}
                    />
                    <div className={styles.info}>
                      <Typography className={styles.title}>{name}</Typography>
                      <Typography className={styles.subTitle}>
                        {address.street} {address.number}, {address.city}, {address.state}, {address.postalCode}
                      </Typography>
                    </div>
                  </div>
                  <SVGIcon
                    className={styles.closeIcon}
                    name="plus"
                    onClick={() => {
                      handleAddPharmacy(row).catch();
                    }}
                  />
                </div>
              );
            })
          )}
        </div>
        {selectedPharmacies && selectedPharmacies.length > 0
          ? selectedPharmacies.map((row: any) => {
              const { address, preview, _id, name } = row;
              return (
                <div key={_id} className={styles.pharmacyItem}>
                  <div className={styles.infoWrapper}>
                    <Image
                      className={styles.photo}
                      alt={'No Avatar'}
                      src={preview}
                      width={200}
                      height={200}
                      cognitoId={sub}
                    />
                    <div className={styles.info}>
                      <Typography className={styles.title}> {name}</Typography>
                      <Typography className={styles.subTitle}>
                        {address.street} {address.number}, {address.city}, {address.state}, {address.postalCode}
                      </Typography>
                    </div>
                  </div>
                  <SVGIcon
                    className={styles.closeIcon}
                    name="close"
                    onClick={() => {
                      handleRemovePharmacy(row).catch();
                    }}
                  />
                </div>
              );
            })
          : null}
      </div>
    );
  };

  const renderContactForm = () => {
    return (
      <div className={styles.contactForm}>
        <Typography className={styles.blockTitle}>Add Contact</Typography>
        <div className={styles.threeInput}>
          <div className={styles.textField}>
            <TextField
              label={'Full Name *'}
              classes={{ root: classNames(styles.textField, styles.priceInput) }}
              value={newContact.fullName}
              onChange={handleChangeContact('fullName')}
            />
            {contactErr.fullName || contactErr.name || contactErr.family_name ? (
              <Error
                className={styles.error}
                value={contactErr.fullName || contactErr.name || contactErr.family_name}
              />
            ) : null}
          </div>
          <div className={styles.textField}>
            <TextField
              label={isContactGroupManager() ? 'Company Name' : 'Company Name *'}
              classes={{ root: classNames(styles.textField, styles.priceInput) }}
              value={newContact.companyName}
              onChange={handleChangeContact('companyName')}
            />
            {contactErr.companyName ? <Error className={styles.error} value={contactErr.companyName} /> : null}
          </div>
          <div className={styles.textField}>
            <TextField
              label={isContactGroupManager() ? 'Title' : 'Title *'}
              classes={{ root: classNames(styles.textField, styles.priceInput) }}
              value={newContact.title}
              onChange={handleChangeContact('title')}
            />
            {contactErr.title ? <Error className={styles.error} value={contactErr.title} /> : null}
          </div>
        </div>
        <div className={styles.threeInput}>
          <div className={styles.textField}>
            <TextField
              label={'Email *'}
              classes={{ root: classNames(styles.textField, styles.priceInput) }}
              value={newContact.email}
              onChange={handleChangeContact('email')}
            />
            {contactErr.email ? <Error className={styles.error} value={contactErr.email} /> : null}
          </div>
          <div className={styles.textField}>
            <TextField
              label={'Phone *'}
              classes={{ root: classNames(styles.textField, styles.priceInput) }}
              value={newContact.phone}
              onChange={handleChangeContact('phone')}
            />
            {contactErr.phone || contactErr.phone_number ? (
              <Error className={styles.error} value={contactErr.phone || contactErr.phone_number} />
            ) : null}
          </div>
          <div className={styles.textField}>
            <Select
              label={'Type *'}
              value={newContact.type}
              onChange={handleChangeContact('type')}
              items={
                !isHasBillingAccount
                  ? contactTypesArray
                  : // tslint:disable-next-line:no-shadowed-variable
                    contactTypesArray.filter((_, index) => index !== 0)
              }
              classes={{ input: styles.input, selectLabel: styles.selectLabel, inputRoot: styles.inputRoot }}
              className={styles.periodSelect}
            />
            {contactErr.type ? <Error className={styles.error} value={contactErr.type} /> : null}
          </div>
        </div>
        <Button
          className={styles.changeStepButton}
          variant="contained"
          color="secondary"
          disabled={isContactLoading}
          onClick={handleAddContact}
        >
          <Typography className={styles.summaryText}>Add</Typography>
        </Button>
      </div>
    );
  };

  const renderSettingsDispatcher = () => {
    return <DispatchSettings typeObject={'group'} settingsGP={settingsGP} objectId={id || ''} />;
  };

  const renderContacts = () => {
    return (
      <div className={styles.contacts}>
        <Typography className={styles.blockTitle}>Contacts</Typography>
        <div className={styles.tableHeader}>
          <div className={styles.fullName}>Full Name</div>
          <div className={styles.companyName}>Company Name</div>
          <div className={styles.title}>Title</div>
          <div className={styles.email}>Email</div>
          <div className={styles.phone}>Phone</div>
          <div className={styles.type}>Type</div>
          <div className={styles.action}>Action</div>
        </div>
        {isContactLoading ? (
          <Loading />
        ) : (
          computedContacts.map((contact) => {
            const isGroupManager = !!contact.cognitoId;
            const [companyName, title] = isGroupManager ? contact.jobTitle.split(groupManagerDelimeter) : ['', ''];
            const removeContactIdentifier = isGroupManager ? contact.email : contact._id;
            return (
              <div key={contact._id} className={styles.tableRow}>
                <div className={styles.fullName}>
                  {isGroupManager ? `${contact.name} ${contact.family_name}` : contact.fullName}
                </div>
                <div className={styles.companyName}>{isGroupManager ? companyName : contact.companyName}</div>
                <div className={styles.title}>{isGroupManager ? title : contact.title}</div>
                <div className={styles.email} title={contact.email}>
                  {contact.email}
                </div>
                <div className={styles.phone}>{isGroupManager ? contact.phone_number : contact.phone}</div>
                <div className={styles.type}>
                  {isGroupManager ? contactTypes['GROUP-MANAGER'] : contactTypes[contact.type]}
                </div>
                <div className={styles.action}>
                  <SVGIcon
                    className={styles.closeIcon}
                    name="close"
                    onClick={() => handleRemoveContact(removeContactIdentifier, isGroupManager).catch()}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className={styles.loadingWrapper}>{<Loading />}</div>;
  }

  return (
    <div className={styles.createGroupsWrapper}>
      {renderHeaderBlock()}
      {renderGroupInfo()}
      {id ? renderPharmacies() : null}
      {id ? renderSettingsDispatcher() : null}
      {id ? renderContactForm() : null}
      {id ? renderContacts() : null}

      <ConfirmationModal
        isOpen={reportIsGenerated}
        handleModal={closeMessageModal}
        title={'Report Generated Successfully'}
      />
      <ConfirmationModal
        isOpen={invoiceIsGenerated}
        handleModal={closeMessageModal}
        title={'Invoice Sent Successfully'}
      />
      <ConfirmationModal
        isOpen={userIsAdded}
        handleModal={closeUserContactModal}
        title={'Group contact added successfully'}
      />
    </div>
  );
};
