import api from '../../api';
import { PharmacyPagination, Pharmacy, PharmacyUser, PharmacyUserStatus, Filters } from '../../interfaces';
import { IPharmacyRCSettings } from '../../interfaces/_types';

export const getPharmacies = (data: PharmacyPagination) => {
  return api.getPharmacies(data);
};

export const getPharmacy = (id: string) => {
  return api.getPharmacy(id);
};

export const getReportsInPharmacy = (id: string, data: PharmacyPagination) => {
  return api.getReportsInPharmacy(id, data);
};

export const createPharmacy = (data: Partial<Pharmacy>) => {
  return api.createPharmacy(data);
};

export const updatePharmacy = (id: string, data: Partial<Pharmacy>) => {
  return api.updatePharmacy(id, data);
};

export const pharmacySearchField = (field: string, search: string, limit: number) => {
  return api.pharmacySearchField(field, search, limit);
};

export const createPharmacyAdmin = (data: Partial<PharmacyUser>) => {
  return api.createPharmacyAdmin(data);
};

export const updatePharmacyAdmin = (data: Partial<PharmacyUser>) => {
  return api.updatePharmacyAdmin(data);
};

export const removePharmacyAdmin = (email: string) => {
  return api.removePharmacyAdmin(email);
};

export const addGroupToPharmacy = (id: string, groupId: string) => {
  return api.addGroupToPharmacy(id, groupId);
};

export const removeGroupFromPharmacy = (id: string, groupId: string) => {
  return api.removeGroupFromPharmacy(id, groupId);
};

export const pharmacyAdminForgotPassword = (email: string) => {
  return api.pharmacyAdminForgotPassword(email);
};

export const pharmacyUserSetStatus = (data: { user: string; status: PharmacyUserStatus }) => {
  return api.pharmacyUserSetStatus(data);
};

export const exportPharmacies = (data: Filters) => {
  return api.exportPharmacies(data);
};

export const generatePharmaciesReport = () => {
  return api.generatePharmaciesReport();
};

export const sendAdditionalPharmacyFee = (id: string, amount: number) => {
  return api.sendAdditionalPharmacyFee(id, amount);
};

export const updatePharmacyRCSettings = (id: string, data: IPharmacyRCSettings) => {
  return api.updatePharmacyRCSettings(id, data);
};
