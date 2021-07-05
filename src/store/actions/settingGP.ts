import api from '../../api';

export const getSettingGP = (id: string) => {
  return api.getSettingGP(id);
};

export const getDefaultSettingGP = () => {
  return api.getDefaultSettingGP();
};

export const getSettingListGP = (data: any) => {
  return api.getSettingListGP(data);
};

export const getInvoiceQueue = (data: any) => {
  return api.getInvoiceQueue(data);
};

export const getInvoiceDeliveriesByQueue = (data: any) => {
  return api.getInvoiceDeliveriesByQueue(data);
};

export const getInvoiceHistory = (data: any) => {
  return api.getInvoiceHistory(data);
};

export const getInvoiceHistoryDetails = (data: any) => {
  return api.getInvoiceHistoryDetails(data);
};

export const reSendInvoice = (data: any) => {
  return api.reSendInvoice(data);
};

export const updateSettingGP = (dataSettings: any) => {
  return api.updateSettingGP(dataSettings);
};

export const removeSettingsGP = (id: string) => {
  return api.removeSettingsGP(id);
};

export const addContact = (id: string, data: any) => {
  return api.addContact(id, data);
};

export const getContacts = (id: string) => {
  return api.getContacts(id);
};

export const getManagers = (id: string) => {
  return api.getManagers(id);
};

export const removeContact = (id: string, contactId: string) => {
  return api.removeContact(id, contactId);
};
