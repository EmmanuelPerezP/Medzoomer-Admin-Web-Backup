import { useStores } from '../store';
import { SettingsGPContact } from '../interfaces';
import {
  generateAPIKey,
  getSettingGP,
  updateSettingGP,
  getSettingListGP,
  getInvoiceQueue,
  getInvoiceQueueDetails,
  getInvoiceDeliveriesByQueue,
  getInvoiceHistory,
  getInvoiceHistoryDetails,
  reSendInvoice,
  addContact,
  updateContact,
  getContacts,
  removeContact,
  getBillingAccount,
  getDefaultSettingGP,
  removeSettingsGP,
  getManagers,
  getInvoiceCustomers,
  getInvoiceCustomerById,
  getEventsForCustomer
} from '../store/actions/settingGP';

export default function useSettingsGP() {
  const { settingGPStore } = useStores();

  return {
    ...settingGPStore.getState(),
    generateAPIKey: () => generateAPIKey(),
    getSettingGP: (idGP: string) => getSettingGP(idGP),
    getDefaultSettingGP: () => getDefaultSettingGP(),
    removeSettingsGP: (id: string) => removeSettingsGP(id),
    getSettingListGP: (data: any) => getSettingListGP(data),
    getBillingAccount: (search: string) => getBillingAccount(search),
    getInvoiceQueue: (data: any) => getInvoiceQueue(data),
    getInvoiceHistory: (data: any) => getInvoiceHistory(data),
    getInvoiceQueueDetails: (data: any) => getInvoiceQueueDetails(data),
    getInvoiceHistoryDetails: (data: any) => getInvoiceHistoryDetails(data),
    getInvoiceDeliveriesByQueue: (data: any) => getInvoiceDeliveriesByQueue(data),
    reSendInvoice: (id: string) => reSendInvoice(id),
    updateSettingGP: (dataSettings: any) => updateSettingGP(dataSettings),
    getContacts: (id: string) => getContacts(id),
    getManagers: (id: string) => getManagers(id),
    addContact: (id: string, data: SettingsGPContact) => addContact(id, data),
    updateContact: (id: string, data: SettingsGPContact) => updateContact(id, data),
    removeContact: (id: string, contactId: string) => removeContact(id, contactId),
    getInvoiceCustomers: (filters: any) => getInvoiceCustomers(filters),
    getInvoiceCustomerById: (id: number) => getInvoiceCustomerById(id),
    getEventsForCustomer: (id: number, filters: any) => getEventsForCustomer(id, filters)
  };
}
