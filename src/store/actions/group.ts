import api from '../../api';
import { GroupPagination, Group } from '../../interfaces';

export const getGroups = (data: GroupPagination) => {
  return api.getGroups(data);
};

export const getAllGroups = () => {
  return api.getAllGroups();
};

export const getGroup = (id: string) => {
  return api.getGroup(id);
};

export const getGroupUsers = (id: string) => api.getGroupUsers(id);

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

export const getGroupsInPharmacy = (id: string) => {
  return api.getGroupsInPharmacy(id);
};

export const generateReport = (data?: { groupId: string }) => {
  return api.generateReport(data);
};

export const sendInvoices = (data?: { groupId: string }) => {
  return api.sendInvoices(data);
};

export const resendReport = (id: string) => {
  return api.resendReport(id);
};

export const regenerateReport = (id: string) => {
  return api.regenerateReport(id);
};
