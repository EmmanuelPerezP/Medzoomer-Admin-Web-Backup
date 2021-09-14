import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { contactTypes } from '../../../../constants';
import Loading from '../../../common/Loading';
import SVGIcon from '../../../common/SVGIcon';
import { AddContactModal } from '../AddContactModal/AddContactModal';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import usePharmacy from '../../../../hooks/usePharmacy';
import { decodeErrors } from '../../../../utils';
import styles from './ContactSettings.module.sass';
import { useStores } from '../../../../store';

interface ContactSettingsProps {
  sectionRef?: React.RefObject<HTMLDivElement>;
  invoicedId?: number | null;
}

const tableCell = [
  { label: 'Full Name' },
  { label: 'Job Title' },
  { label: 'Type' },
];

export const ContactSettings = (props: ContactSettingsProps) => {
  const groupManagerDelimeter = '__delimeter__';
  const { sectionRef, invoicedId } = props;
  const { settingGPStore } = useStores();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isContactLoading, setIsContactLoading] = useState(false);
  const [hasBillingAccount, setHasBillingAccount] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [selectedManagers, setSelectedManagers] = useState<any[]>([]);
  const { removePharmacyAdmin } = usePharmacy();
  const {
    newContact,
    getContacts,
    getManagers,
    removeContact
  } = useSettingsGP();
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
  const { params: { id } } = useRouteMatch();

  const computedContacts = useMemo(() => {
    return selectedContacts.concat(selectedManagers);
  }, [selectedContacts, selectedManagers]);

  const loadContacts = () => {
    setIsContactLoading(true);
    handleGetContacts(id).catch((r) => r);
    handleGetManagers(id).catch((r) => r);
  };

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

  const handleEditContact = (index: number) => {
    setSelectedContact(computedContacts[index])
    setIsModalOpen(!isModalOpen)
  };

  const handleOnClose = () => {
    settingGPStore.set('newContact')({
      fullName: '',
      email: '',
      companyName: '',
      title: '',
      phone: '',
      type: 'BILLING',
      attachedToCustomerId: null
    });
    setSelectedContact(null);
    setIsModalOpen(false);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(!isModalOpen)
    loadContacts();
  };

  useEffect(() => {
    if (invoicedId) {
      settingGPStore.set('newContact')({
        ...newContact, 
        attachedToCustomerId: invoicedId 
      });
    }
  }, [invoicedId]);

  useEffect(() => {
    if (id) loadContacts();
  }, [id]);

  return (
    <div className={styles.groupBlock} ref={sectionRef}>
      {isContactLoading ? (
        <Loading className={styles.loading} />
      ) : (
        <>
          <div className={styles.cardHeader}>
            <Typography className={styles.blockTitle}>Billing Contacts</Typography>
            <div 
              className={hasBillingAccount ? styles.addContactButton : styles.disabled} 
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              <SVGIcon name="add" />
              <Typography className={styles.addContactTitle}>Add New Contact</Typography>
            </div>
          </div>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className={styles.tableHeader}>
                  {tableCell.map((item, index) => (
                    <TableCell key={index}>{item.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {computedContacts.map((contact: any, index: number) => {
                  if (contact.type !== 'BILLING-ACCOUNT') {
                    const isGroupManager = !!contact.cognitoId;
                    const [ title ] = isGroupManager
                      ? contact.jobTitle.split(groupManagerDelimeter)
                      : ['', ''];
                    const contactIdentifier = isGroupManager ? contact.email : contact._id;

                    return (
                      <TableRow key={index} className={styles.tableRow}>
                        <TableCell>
                          {isGroupManager ? `${contact.name} ${contact.family_name}` : contact.fullName}
                        </TableCell>
                        <TableCell>{isGroupManager ? title : contact.title}</TableCell>
                        <TableCell size="small">
                          {isGroupManager ? contactTypes['GROUP-MANAGER'] : contactTypes[contact.type]}
                        </TableCell>
                        <TableCell align="right" size="small">
                          <div className={styles.actions}>
                            <SVGIcon
                              className={styles.editContact}
                              name={'edit'}
                              onClick={() => {
                                handleEditContact(index);
                              }}
                            />
                            <SVGIcon
                              className={styles.removeContact}
                              name="remove"
                              onClick={() => handleRemoveContact(contactIdentifier, isGroupManager).catch()}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }
                  return null;
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <AddContactModal
            contact={selectedContact}
            isOpen={isModalOpen}
            onClose={handleOnClose}
            autoCloseModal={handleCloseModal}
            invoicedId={invoicedId}
          />
        </>
      )}
    </div>
  );
};
