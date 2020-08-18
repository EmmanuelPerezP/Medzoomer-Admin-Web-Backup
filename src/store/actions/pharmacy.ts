import api from '../../api';
import { PharmacyPagination, Pharmacy } from '../../interfaces';

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
