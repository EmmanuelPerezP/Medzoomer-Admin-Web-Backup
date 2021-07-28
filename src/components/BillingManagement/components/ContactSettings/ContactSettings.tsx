import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import usePharmacy from '../../../../hooks/usePharmacy';
import { useStores } from '../../../../store';
import { decodeErrors } from '../../../../utils';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import { ContactsTable } from '../ContactsTable/ContactsTable';

export interface ContactSettingsProps {
  typeObject?: string;
  objectId?: string;
  settingsGP?: any;
}

export const ContactSettings = (props: ContactSettingsProps) => {
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
    type: ''
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
      type: 'BILLING'
    });
    setIsContactLoading(false);
  };

  return (
    <>
      <ContactsTable
        handleRemoveContact={handleRemoveContact}
        selectedContacts={selectedContacts}
        selectedManagers={selectedManagers}
        isContactLoading={isContactLoading}
      />
    </>
  );
};
