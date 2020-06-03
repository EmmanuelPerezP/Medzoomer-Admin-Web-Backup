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

export const createOnfleetWorker = (userId: string) => {
  return api.createOnfleetWorker(userId);
};

export const updateCourierOnboarded = (id: string, onboarded: boolean) => {
  return api.updateCourierOnboarded(id, onboarded);
};
