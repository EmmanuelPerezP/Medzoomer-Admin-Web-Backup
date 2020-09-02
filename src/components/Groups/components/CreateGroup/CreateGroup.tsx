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

export const CreateGroup: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const history = useHistory();
  const { getPharmacies } = usePharmacy();
  const { getAllBilling } = useBillingManagement();
  const [isLoading, setIsLoading] = useState(false);
  const [isOptionLoading, setIsOptionLoading] = useState(false);
  const [isContactLoading, setIsContactLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [billingAccount, setBillingAccount] = useState([]);
  const [selectedPharmacies, setSelectedPharmacies] = useState<any[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
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
    removeContact
  } = useGroups();
  const { sub } = useUser();
  const [err, setError] = useState({
    global: '',
    name: '',
    billingAccount: '',
    pricePerDelivery: '',
    volumeOfferPerMonth: '',
    volumePrice: '',
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
      console.error(err);
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    groupStore.set('newGroup')({
      name: '',
      billingAccount: '',
      pricePerDelivery: 0,
      volumeOfferPerMonth: 0,
      volumePrice: 0
    });
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
      pricePerDelivery: result.data.pricePerDelivery || null,
      volumeOfferPerMonth: result.data.volumeOfferPerMonth || null,
      volumePrice: result.data.volumePrice || null
    });
  };

  const handleGetPharmacyInGroup = async (idGroup: string) => {
    const pharmacyInGroup = await getPharmacyInGroup(idGroup);
    pharmacyInGroup.data ? setSelectedPharmacies(pharmacyInGroup.data) : setSelectedPharmacies([]);
  };

  const handleGetContacts = async (idGroup: string) => {
    const contacts = await getContacts(idGroup);
    contacts.data ? setSelectedContacts(contacts.data) : setSelectedContacts([]);
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
      </div>
    );
  };

  const handleChangeContact = (key: string) => (e: React.ChangeEvent<{ value: string | number }>) => {
    const { value } = e.target;

    groupStore.set('newContact')({ ...newContact, [key]: value });

    setError({ ...err, [key]: '' });
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

  const handleCreateGroup = async () => {
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
    groupStore.set('newGroup')({
      name: '',
      billingAccount: '',
      pricePerDelivery: 0,
      volumeOfferPerMonth: 0,
      volumePrice: 0
    });
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

  const renderGroupInfo = () => {
    return (
      <div className={styles.groupBlock}>
        <div className={styles.mainInfo}>
          <div className={styles.managerBlock}>
            <Typography className={styles.blockTitle}>General</Typography>
            <div className={styles.twoInput}>
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
              <div className={styles.textField}>
                <Select
                  label={'Billing Accounts'}
                  value={newGroup.billingAccount}
                  onChange={handleChange('billingAccount')}
                  items={billingAccount}
                  classes={{ input: styles.input, selectLabel: styles.selectLabel, inputRoot: styles.inputRoot }}
                  className={styles.periodSelect}
                />
                {err.billingAccount ? <Error className={styles.error} value={err.billingAccount} /> : null}
              </div>
            </div>
          </div>
          <div className={styles.nextBlock}>
            <div className={styles.twoInput}>
              <div className={styles.textField}>
                <Typography className={styles.blockTitle}>Default Price per Delivery</Typography>
                <TextField
                  label={'Price'}
                  classes={{
                    root: classNames(styles.textField, styles.priceInput)
                  }}
                  inputProps={{
                    placeholder: '0.00',
                    type: 'number',
                    endAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                  value={newGroup.pricePerDelivery}
                  onChange={handleChange('pricePerDelivery')}
                />
                {err.pricePerDelivery ? <Error className={styles.error} value={err.pricePerDelivery} /> : null}
              </div>
              <div className={styles.nextBlock}>
                <Typography className={styles.blockTitle}>Volume Price per Delivery</Typography>
                <div className={styles.twoInput}>
                  <div className={styles.textField}>
                    <TextField
                      label={'Offers per month'}
                      classes={{
                        root: classNames(styles.textField, styles.priceInput)
                      }}
                      inputProps={{
                        type: 'number',
                        placeholder: '0.00',
                        endAdornment: <InputAdornment position="start">$</InputAdornment>
                      }}
                      value={newGroup.volumeOfferPerMonth}
                      onChange={handleChange('volumeOfferPerMonth')}
                    />
                    {err.volumeOfferPerMonth ? (
                      <Error className={styles.error} value={err.volumeOfferPerMonth} />
                    ) : null}
                  </div>
                  <div className={styles.textField}>
                    <TextField
                      label={'Price'}
                      classes={{
                        root: classNames(styles.textField, styles.priceInput)
                      }}
                      inputProps={{
                        type: 'number',
                        placeholder: '0.00',
                        endAdornment: <InputAdornment position="start">$</InputAdornment>
                      }}
                      value={newGroup.volumePrice}
                      onChange={handleChange('volumePrice')}
                    />
                    {err.volumePrice ? <Error className={styles.error} value={err.volumePrice} /> : null}
                  </div>
                </div>
              </div>
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
                      <Typography
                        className={styles.subTitle}
                      >{`${address.number} ${address.street} ${address.city} ${address.zip} ${address.state}`}</Typography>
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
                      <Typography
                        className={styles.subTitle}
                      >{`${address.number} ${address.street} ${address.city} ${address.zip} ${address.state}`}</Typography>
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
              items={contactTypesArray}
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
                <div className={styles.email}>{contact.email}</div>
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
