import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import usePharmacy from '../../../../hooks/usePharmacy';
import { useStores } from '../../../../store';
import { decodeErrors } from '../../../../utils';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import { ContactsTable } from '../ContactsTable/ContactsTable';

export interface ContactSettingsProps {
  sectionRef?: React.RefObject<HTMLDivElement>;
  typeObject?: string;
  objectId?: string;
  settingsGP?: any;
  invoicedId?: number | null;
}

export const ContactSettings = (props: ContactSettingsProps) => {
  const { sectionRef, invoicedId } = props;
  const { settingGPStore } = useStores();
  const [isContactLoading, setIsContactLoading] = useState(false);
  const { getContacts, getManagers, removeContact } = useSettingsGP();
  const { removePharmacyAdmin } = usePharmacy();
  const [hasBillingAccount, setHasBillingAccount] = useState(false);
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
  const { params: { id } } = useRouteMatch();
  const { newContact } = useSettingsGP();

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
          setHasBillingAccount(true);
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
      setHasBillingAccount(false);
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

  useEffect(() => {
    if (invoicedId) {
      settingGPStore.set('newContact')({
        ...newContact, 
        attachedToCustomerId: invoicedId 
      });
    }
  }, [invoicedId]);

  return (
    <>
      <ContactsTable
        ref={sectionRef}
        hasBillingAccount={hasBillingAccount}
        handleRemoveContact={handleRemoveContact}
        selectedContacts={selectedContacts}
        selectedManagers={selectedManagers}
        isContactLoading={isContactLoading}
      />
    </>
  );
};
