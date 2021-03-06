import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { contactTypesArray } from '../../../../constants';
import usePharmacy from '../../../../hooks/usePharmacy';
import { useStores } from '../../../../store';
import { decodeErrors } from '../../../../utils';
import { Error } from '../../../common/Error/Error';
import Select from '../../../common/Select';
import TextField from '../../../common/TextField';
import styles from './AddContactModal.module.sass';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import Modal from 'react-modal';
import SVGIcon from '../../../common/SVGIcon';
export interface ContactSettingsProps {
  isOpen: boolean;
  contact?: any;
  onClose: Function;
  autoCloseModal: Function;
  invoicedId?: number | null;
}

export const AddContactModal = (props: ContactSettingsProps) => {
  const { contact, isOpen, onClose, autoCloseModal, invoicedId } = props;
  const { settingGPStore } = useStores();
  const [isContactLoading, setIsContactLoading] = useState(false);
  const contactErrorTemplate = {
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
  };
  const [contactErr, setContactError] = useState(contactErrorTemplate);
  const { createPharmacyAdmin } = usePharmacy();
  const groupManagerDelimeter = '__delimeter__';
  const {
    params: { id }
  } = useRouteMatch();
  const { newContact, addContact, updateContact } = useSettingsGP();

  const isContactGroupManager = () => {
    return ((newContact.type as unknown) as string) === 'GROUP-MANAGER';
  };

  useEffect(() => {
    if (contact) {
      settingGPStore.set('newContact')(contact);
    }
    // eslint-disable-next-line
  }, [contact]);

  const handleChangeContact = (key: string) => (e: React.ChangeEvent<{ value: string | number }>) => {
    const { value } = e.target;

    settingGPStore.set('newContact')({ ...newContact, [key]: value });

    if (key === 'fullName') {
      setContactError({
        ...contactErr,
        fullName: '',
        name: '',
        family_name: ''
      });
    } else if (key === 'type') {
      setContactError(contactErrorTemplate);
    } else if (key === 'phone') {
      setContactError({ ...contactErr, phone: '', phone_number: '' });
    } else {
      setContactError({ ...contactErr, [key]: '' });
    }
  };

  const handleAddContact = async () => {
    setContactError(contactErrorTemplate);
    setIsContactLoading(true);
    try {
      if (isContactGroupManager()) {
        const [name, familyName] = newContact.fullName.split(' ');
        if (name && !familyName) {
          setContactError({
            ...contactErr,
            family_name: 'Full name must contain from two words'
          });
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
      } else if (contact) {
        await updateContact(id, { ...newContact });
      } else {
        await addContact(id, { ...newContact, attachedToCustomerId: Number(invoicedId) });
      }
      autoCloseModal();
    } catch (error) {
      const errors = error.response.data;
      setContactError({ ...contactErr, ...decodeErrors(errors.details) });
      setIsContactLoading(false);
      return;
    }
    settingGPStore.set('newContact')({
      fullName: '',
      email: '',
      companyName: '',
      title: '',
      phone: '',
      type: 'BILLING',
      attachedToCustomerId: null
    });
    setIsContactLoading(false);
  };

  return (
    <Modal
      shouldFocusAfterRender={false}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      onRequestClose={() => onClose()}
      isOpen={isOpen}
      className={styles.modal}
      style={{ overlay: { zIndex: 2 } }}
    >
      <div className={styles.modalHeader}>
        <Typography className={styles.blockTitle}>{contact ? 'Edit Billing Contact' : 'Add New Contact'}</Typography>
        <SVGIcon name="close" className={styles.closeIcon} onClick={onClose} />
      </div>
      <div className={styles.content}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <TextField
              label="Full Name *"
              classes={{
                root: classNames(styles.textField, styles.input)
              }}
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
              classes={{
                root: classNames(styles.textField, styles.input)
              }}
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
              classes={{
                root: classNames(styles.textField, styles.input)
              }}
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
              classes={{
                root: classNames(styles.textField, styles.input)
              }}
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
              classes={{
                root: classNames(styles.textField, styles.input)
              }}
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
              items={contactTypesArray}
              classes={{
                input: styles.input,
                selectLabel: styles.selectLabel,
                inputRoot: styles.inputRoot
              }}
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
            <Typography>{contact ? 'Update Contact' : 'Save Contact'}</Typography>
          </Button>
        </Grid>
      </div>
    </Modal>
  );
};
