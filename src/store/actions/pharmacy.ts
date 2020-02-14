import api from '../../api';
import { PharmacyPagination, Pharmacy } from '../../interfaces';

export const getPharmacies = (data: PharmacyPagination) => {
  return api.getPharmacies(data);
};

export const getPharmacy = (id: string) => {
  return api.getPharmacy(id);
};

export const createPharmacy = (data: Pharmacy) => {
  return api.createPharmacy(data);
};
