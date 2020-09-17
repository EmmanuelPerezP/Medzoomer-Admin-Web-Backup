import api from '../../api';
import { PharmacyPagination, Pharmacy, PharmacyUser } from '../../interfaces';

export const getPharmacies = (data: PharmacyPagination) => {
  return api.getPharmacies(data);
};

export const getPharmacy = (id: string) => {
  return api.getPharmacy(id);
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
