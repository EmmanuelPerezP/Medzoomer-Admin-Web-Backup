import api from '../../api';
import { CourierPagination } from '../../interfaces';

export const getCouriers = (data: CourierPagination) => {
  return api.getCouriers(data);
};

export const getCourier = (id: string) => {
  return api.getCourier(id);
};

export const updateCourierStatus = (id: string, status: string) => {
  return api.updateCourierStatus(id, status);
};

export const getFileLink = (key: string, fileName: string) => {
  return api.getFileLink(key, fileName);
};

export const getImageLink = (key: string, fileName: string) => {
  return api.getImageLink(key, fileName);
};
