import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useRouteMatch } from 'react-router';
import { contactTypesArray } from '../../../../constants';
import useGroups from '../../../../hooks/useGroup';
import usePharmacy from '../../../../hooks/usePharmacy';
import { useStores } from '../../../../store';
import { decodeErrors } from '../../../../utils';
import { Error } from '../../../common/Error/Error';
import Loading from '../../../common/Loading';
// import Error from "../../common/Error/Error";
import Select from '../../../common/Select';
// import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '../../../common/TextField';
import ContactsTable from '../ContactsTable';
import styles from '../Settings.module.sass';

export interface ContactSettingsProps {
  typeObject?: string;
  objectId?: string;
  settingsGP?: any;
}

export const ContactSettings = (props: ContactSettingsProps) => {
  const { groupStore } = useStores();
  const [isContactLoading, setIsContactLoading] = useState(false);
  const [userIsAdded, setUserIsAdded] = useState(false);
  const [isHasBillingAccount, setIsHasBillingAccount] = useState(false);

  const groupManagerDelimeter = '__delimeter__';
  // const {
  //   params: { id }
  // } = useRouteMatch();
  const id = '5fabd54e4689fd9d7f9e8007';


  const { newContact, addContact } = useGroups();

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
  const { createPharmacyAdmin, } = usePharmacy();

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
    } catch (error) {
      const errors = error.response.data;
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

  return (
    <>
      <div className={styles.groupBlock}>
        <Typography className={styles.blockTitle}>Add Contact</Typography>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <TextField
              label='Full Name *'
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

    </>
  );
};
