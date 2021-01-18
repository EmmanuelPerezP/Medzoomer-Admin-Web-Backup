import api from '../../api';
import { GroupPagination, Group, GroupContact } from '../../interfaces';

export const getGroups = (data: GroupPagination) => {
  return api.getGroups(data);
};

export const getAllGroups = () => {
  return api.getAllGroups();
};

export const getGroup = (id: string) => {
  return api.getGroup(id);
};

export const getPharmacyInGroup = (id: string) => {
  return api.getPharmacyInGroup(id);
};

export const createGroup = (data: Partial<Group>) => {
  return api.createGroup(data);
};

export const updateGroup = (id: string, data: Partial<Group>) => {
  return api.updateGroup(id, data);
};

export const removeGroup = (id: string) => {
  return api.removeGroup(id);
};

export const addContact = (id: string, data: GroupContact) => {
  return api.addContact(id, data);
};

export const getContacts = (id: string) => {
  return api.getContacts(id);
};

export const getManagers = (id: string) => {
  return api.getManagers(id);
}

export const removeContact = (id: string, contactId: string) => {
  return api.removeContact(id, contactId);
};

export const getGroupsInPharmaccy = (id: string) => {
  return api.getGroupsInPharmaccy(id);
};

export const generateReport = (data?: { groupId: string }) => {
  return api.generateReport(data);
};

export const sendInvoices = (data?: { groupId: string }) => {
  return api.sendInvoices(data);
};
