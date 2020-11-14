import React, { FC, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { useHistory, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';

import { useStores } from '../../../../store';
import useGroups from '../../../../hooks/useGroup';
import useUser from '../../../../hooks/useUser';
import { decodeErrors } from '../../../../utils';
import { contactTypesArray, contactTypes } from '../../../../constants';
import usePharmacy from '../../../../hooks/usePharmacy';
import useBillingManagement from '../../../../hooks/useBillingManagement';

import SVGIcon from '../../../common/SVGIcon';
import TextField from '../../../common/TextField';
import Select from '../../../common/Select';
import Error from '../../../common/Error';
import Image from '../../../common/Image';
import Loading from '../../../common/Loading';
import AutoCompleteSearch from '../../../common/AutoCompleteSearch';

import styles from './CreateGroup.module.sass';

let timerId: any = null;

const errorText = 'All fields are required';

export const CreateGroup: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const history = useHistory();
  const { getPharmacies } = usePharmacy();
  const { getAllBilling } = useBillingManagement();
  const [isLoading, setIsLoading] = useState(false);
  const [isHasBillingAccount, setIsHasBillingAccount] = useState(false);
  const [isOptionLoading, setIsOptionLoading] = useState(false);
  const [isContactLoading, setIsContactLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [billingAccount, setBillingAccount] = useState([]);
  const [selectedPharmacies, setSelectedPharmacies] = useState<any[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [isReportGenerate, setIsReportGenerate] = useState(false);
  const { groupStore } = useStores();
  const {
    newGroup,
    newContact,
    getContacts,
    createGroup,
    updateGroup,
    getGroup,
    getPharmacyInGroup,
    addContact,
    removeContact,
    generateReport
  } = useGroups();
  const { sub } = useUser();
  const [err, setError] = useState({
    global: '',
    name: '',
    billingAccount: '',
    mileRadius_0: '',
    mileRadius_1: '',
    mileRadius_2: '',
    fullName: '',
    companyName: '',
    title: '',
    email: '',
    phone: '',
    type: ''
  });
  const { addGroupToPharmacy, removeGroupFromPharmacy } = usePharmacy();

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
      handleGetPharmacyInGroup(id).catch((r) => r);
    }
    // eslint-disable-next-line
  }, [id]);

  const handleGetById = async (idGroup: string) => {
    const result = await getGroup(idGroup);
    groupStore.set('newGroup')({
      name: result.data.name,
      billingAccount: result.data.billingAccount || null,
      prices: result.data.prices || null
    });
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

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <Link className={styles.link} to={'/dashboard/groups'}>
          <SVGIcon name="backArrow" className={styles.backArrowIcon} />
        </Link>
        {id ? (
          <div className={styles.textBlock}>
            <Typography className={styles.title}>Edit Group</Typography>
            <Typography className={styles.subTitle}>{groupStore.get('newGroup').name}</Typography>
          </div>
        ) : (
          <Typography className={styles.title}>Add New Group</Typography>
        )}
        {id ? (
          <div className={styles.reportBtnBlock}>
            {isReportGenerate ? (
              <Loading />
            ) : (
              <Button color="primary" variant={'contained'} onClick={handleGenerateReport} className={styles.reportBtn}>
                Generate report
              </Button>
            )}
          </div>
        ) : (
          <div className={styles.reportBtnBlock} />
        )}
      </div>
    );
  };

  const handleChangeContact = (key: string) => (e: React.ChangeEvent<{ value: string | number }>) => {
    const { value } = e.target;

    groupStore.set('newContact')({ ...newContact, [key]: value });

    setError({ ...err, [key]: '' });
  };

  const addNewGroupDefaultData = () => {
    groupStore.set('newGroup')({
      name: '',
      billingAccount: '',
      prices: [
        {
          orderCount: '0-10000',
          prices: [
            {
              minDist: 0,
              maxDist: 5,
              price: 0
            },
            {
              minDist: 5,
              maxDist: 10,
              price: 0
            },
            {
              minDist: 10,
              maxDist: 1000,
              price: 0
            }
          ]
        },
        {
          orderCount: '10001-25000',
          prices: [
            {
              minDist: 0,
              maxDist: 5,
              price: 0
            },
            {
              minDist: 5,
              maxDist: 10,
              price: 0
            },
            {
              minDist: 10,
              maxDist: 1000,
              price: 0
            }
          ]
        },
        {
          orderCount: '25001-10000000',
          prices: [
            {
              minDist: 0,
              maxDist: 5,
              price: 0
            },
            {
              minDist: 5,
              maxDist: 10,
              price: 0
            },
            {
              minDist: 10,
              maxDist: 1000,
              price: 0
            }
          ]
        }
      ]
    });
  };
  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: string | number }>) => {
    const { value } = e.target;

    switch (key) {
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
  };

  const validate = () => {
    let isError = false;

    if (newGroup.prices) {
      const errors = {
        mileRadius_0: '',
        mileRadius_1: '',
        mileRadius_2: ''
      };
      newGroup.prices.forEach((item, index) => {
        if (item.prices) {
          item.prices.forEach((price) => {
            if (price.price <= 0) {
              isError = true;
              const field = `mileRadius_${index}`;
              // @ts-ignore
              errors[field] = errorText;
            }
          });
        }
      });
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
      fullName: '',
      companyName: '',
      title: '',
      email: '',
      phone: '',
      type: ''
    });
    if (!validate()) {
      return false;
    }

    setIsLoading(true);
    try {
      if (id) {
        await updateGroup(id, newGroup);
      } else {
        await createGroup(newGroup);
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

  const handleAddContact = async () => {
    setIsContactLoading(true);
    try {
      await addContact(id, newContact);
      await handleGetContacts(id);
    } catch (error) {
      const errors = error.response.data;
      setError({ ...err, ...decodeErrors(errors.details) });
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
    'Order volume less then 10,000/month',
    'Order volume greater then 10,000/month',
    'Order volume greater then 25,000/month'
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
              label={'0-5 Mile radius '}
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
              label={'5.1-10 Mile radius'}
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
              label={'10+ Mile radius '}
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
    [getPharmacies]
  );

  const handleRemovePharmacy = async (pharmacy: any) => {
    await removeGroupFromPharmacy(pharmacy._id, id);
    setPharmacies([]);
    await handleGetPharmacyInGroup(id);
  };

  const handleRemoveContact = async (contactId: string) => {
    setIsContactLoading(true);
    try {
      await removeContact(id, contactId);
      setSelectedContacts([]);
      setIsHasBillingAccount(false);
      await handleGetContacts(id);
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
              label={'Full Name'}
              classes={{ root: classNames(styles.textField, styles.priceInput) }}
              value={newContact.fullName}
              onChange={handleChangeContact('fullName')}
            />
            {err.fullName ? <Error className={styles.error} value={err.fullName} /> : null}
          </div>
          <div className={styles.textField}>
            <TextField
              label={'Company Name'}
              classes={{ root: classNames(styles.textField, styles.priceInput) }}
              value={newContact.companyName}
              onChange={handleChangeContact('companyName')}
            />
            {err.companyName ? <Error className={styles.error} value={err.companyName} /> : null}
          </div>
          <div className={styles.textField}>
            <TextField
              label={'Title'}
              classes={{ root: classNames(styles.textField, styles.priceInput) }}
              value={newContact.title}
              onChange={handleChangeContact('title')}
            />
            {err.title ? <Error className={styles.error} value={err.title} /> : null}
          </div>
        </div>
        <div className={styles.threeInput}>
          <div className={styles.textField}>
            <TextField
              label={'Email'}
              classes={{ root: classNames(styles.textField, styles.priceInput) }}
              value={newContact.email}
              onChange={handleChangeContact('email')}
            />
            {err.email ? <Error className={styles.error} value={err.email} /> : null}
          </div>
          <div className={styles.textField}>
            <TextField
              label={'Phone'}
              classes={{ root: classNames(styles.textField, styles.priceInput) }}
              value={newContact.phone}
              onChange={handleChangeContact('phone')}
            />
            {err.phone ? <Error className={styles.error} value={err.phone} /> : null}
          </div>
          <div className={styles.textField}>
            <Select
              label={'Type'}
              value={newContact.type}
              onChange={handleChangeContact('type')}
              items={
                !isHasBillingAccount
                  ? contactTypesArray
                  : // tslint:disable-next-line:no-shadowed-variable
                    contactTypesArray.filter((_, index) => index !== 3)
              }
              classes={{ input: styles.input, selectLabel: styles.selectLabel, inputRoot: styles.inputRoot }}
              className={styles.periodSelect}
            />
            {err.type ? <Error className={styles.error} value={err.type} /> : null}
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
          selectedContacts.map((contact) => {
            return (
              <div key={contact._id} className={styles.tableRow}>
                <div className={styles.fullName}>{contact.fullName}</div>
                <div className={styles.companyName}>{contact.companyName}</div>
                <div className={styles.title}>{contact.title}</div>
                <div className={styles.email} title={contact.email}>
                  {contact.email}
                </div>
                <div className={styles.phone}>{contact.phone}</div>
                <div className={styles.type}>{contactTypes[contact.type]}</div>
                <div className={styles.action}>
                  <SVGIcon
                    className={styles.closeIcon}
                    name="close"
                    onClick={() => {
                      handleRemoveContact(contact._id).catch();
                    }}
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
      {id ? renderContactForm() : null}
      {id ? renderContacts() : null}
    </div>
  );
};
