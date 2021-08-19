import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { contactTypesArray } from '../../../../constants';
import usePharmacy from '../../../../hooks/usePharmacy';
import { useStores } from '../../../../store';
import { decodeErrors } from '../../../../utils';
import { Error } from '../../../common/Error/Error';
import Select from '../../../common/Select';
import TextField from '../../../common/TextField';
import styles from '../Settings.module.sass';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import { ContactsTable } from '../ContactsTable/ContactsTable';

export interface ContactSettingsProps {
  typeObject?: string;
  objectId?: string;
  settingsGP?: any;
  invoicedId?: number | null;
}

export const ContactSettings = (props: ContactSettingsProps) => {
  const { invoicedId } = props;
  const { settingGPStore } = useStores();
  const [isContactLoading, setIsContactLoading] = useState(false);
  const { getContacts, getManagers, removeContact } = useSettingsGP();
  const { removePharmacyAdmin } = usePharmacy();
  const [isHasBillingAccount, setIsHasBillingAccount] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [selectedManagers, setSelectedManagers] = useState<any[]>([]);
  const [contactErr, setContactError] = useState({
    fullName: '',
    name: '',
    family_name: '',
    companyName: '',
    title: '',
    email: '',
    phone: '',
    phone_number: '',
    type: '',
    attachedToCustomerId: ''
  });
  const { createPharmacyAdmin } = usePharmacy();
  const groupManagerDelimeter = '__delimeter__';
  const {
    params: { id }
  } = useRouteMatch();
  const { newContact, addContact } = useSettingsGP();

  useEffect(() => {
    if (id) {
      setIsContactLoading(true);
      handleGetContacts(id).catch((r) => r);
      handleGetManagers(id).catch((r) => r);
    }
    // eslint-disable-next-line
  }, [id]);

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
      setIsContactLoading(false);
    }
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
      setContactError({ ...contactErr, ...decodeErrors(errors.details) });
      setIsContactLoading(false);
      return;
    }
  };

  const handleChangeContact = (key: string) => (e: React.ChangeEvent<{ value: string | number }>) => {
    const { value } = e.target;

    settingGPStore.set('newContact')({ ...newContact, [key]: value });

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
        type: '',
        attachedToCustomerId: ''
      });
    } else if (key === 'phone') {
      setContactError({ ...contactErr, phone: '', phone_number: '' });
    } else {
      setContactError({ ...contactErr, [key]: '' });
    }
  };

  const isContactGroupManager = () => {
    return ((newContact.type as unknown) as string) === 'GROUP-MANAGER';
  };

  useEffect(() => {
    if (invoicedId) {
      settingGPStore.set('newContact')({
        ...newContact, 
        attachedToCustomerId: invoicedId 
      });
    }
  }, [invoicedId]);

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
      type: '',
      attachedToCustomerId: ''
    });
    setIsContactLoading(true);
    try {
      if (!newContact.attachedToCustomerId) {
        setContactError({
          ...contactErr,
          attachedToCustomerId:
            'You must have an associated Billing Account Holder in order to add contacts in Invoiced'
        });
        setIsContactLoading(false);
        return;
      }
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
    } catch (error) {
      const errors = error.response.data;
      setContactError({ ...contactErr, ...decodeErrors(errors.details) });
      setIsContactLoading(false);
      return;
    }
    handleGetContacts(id).catch((r) => r);
    handleGetManagers(id).catch((r) => r);
    settingGPStore.set('newContact')({
      fullName: '',
      email: '',
      companyName: '',
      title: '',
      phone: '',
      type: 'BILLING',
      attachedToCustomerId: invoicedId
    });
    setIsContactLoading(false);
  };

  return (
    <>
      <div className={styles.groupBlock}>
        <Typography className={styles.blockTitle}>Add Contact</Typography>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <TextField
              label="Full Name *"
              classes={{ root: classNames(styles.textField, styles.priceInput) }}
              value={newContact.fullName}
              onChange={handleChangeContact('fullName')}
              inputProps={{
                placeholder: 'Required'
              }}
            />
            {contactErr.fullName || contactErr.name || contactErr.family_name ? (
              <Error
                className={styles.error}
                value={contactErr.fullName || contactErr.name || contactErr.family_name}
              />
            ) : null}
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={isContactGroupManager() ? 'Company Name' : 'Company Name *'}
              classes={{ root: classNames(styles.textField, styles.priceInput) }}
              value={newContact.companyName}
              onChange={handleChangeContact('companyName')}
              inputProps={{
                placeholder: 'Required'
              }}
            />
            {contactErr.companyName ? <Error className={styles.error} value={contactErr.companyName} /> : null}
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={isContactGroupManager() ? 'Title' : 'Title *'}
              classes={{ root: classNames(styles.textField, styles.priceInput) }}
              value={newContact.title}
              onChange={handleChangeContact('title')}
              inputProps={{
                placeholder: 'Required'
              }}
            />
            {contactErr.title ? <Error className={styles.error} value={contactErr.title} /> : null}
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <TextField
              label={'Email *'}
              classes={{ root: classNames(styles.textField, styles.priceInput) }}
              value={newContact.email}
              onChange={handleChangeContact('email')}
              inputProps={{
                placeholder: 'Required'
              }}
            />
            {contactErr.email ? <Error className={styles.error} value={contactErr.email} /> : null}
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={'Phone *'}
              classes={{ root: classNames(styles.textField, styles.priceInput) }}
              value={newContact.phone}
              onChange={handleChangeContact('phone')}
              inputProps={{
                placeholder: 'Required'
              }}
            />
            {contactErr.phone || contactErr.phone_number ? (
              <Error className={styles.error} value={contactErr.phone || contactErr.phone_number} />
            ) : null}
          </Grid>
          <Grid item xs={4}>
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
          </Grid>
          {contactErr.attachedToCustomerId ? (
            <Error
              className={styles.mainError}
              value={contactErr.attachedToCustomerId}
            />
          ) : null}
        </Grid>
        <Grid container justify="center">
          <Button
            variant="contained"
            color="secondary"
            disabled={isContactLoading}
            onClick={handleAddContact}
            style={{ marginTop: 40 }}
          >
            <Typography>Add</Typography>
          </Button>
        </Grid>
      </div>
      <ContactsTable
        handleRemoveContact={handleRemoveContact}
        selectedContacts={selectedContacts}
        selectedManagers={selectedManagers}
        isContactLoading={isContactLoading}
      />
    </>
  );
};
