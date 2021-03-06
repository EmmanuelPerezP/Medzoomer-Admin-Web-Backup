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

export const reAddToOnfleet = (id: string) => {
  return api.reAddToOnfleet(id);
};

export const increaseCourierBalance = (
  id: string,
  data: { amount: number; type: string; reason: string; note: string }
) => {
  return api.increaseCourierBalance(id, data);
};

export const courierSearchField = (field: string, search: string, limit: number, status: string) => {
  return api.courierSearchField(field, search, limit, status);
};

export const createOnfleetWorker = (userId: string) => {
  return api.createOnfleetWorker(userId);
};

export const updateCourierOnboarded = (id: string, onboarded: boolean) => {
  return api.updateCourierOnboarded(id, onboarded);
};

export const exportCouriers = (data: CourierPagination) => {
  return api.exportCouriers(data);
};

export const updateCourierPackage = (id: string, welcomePackageSent: boolean) => {
  return api.updateCourierPackage(id, welcomePackageSent);
};

export const updateCourierisOnFleet = (id: string, isOnFleet: boolean) => {
  return api.updateCourierisOnFleet(id, isOnFleet);
};

export const courierForgotPassword = (email: string) => {
  return api.courierForgotPassword(email);
};

export const checkCreateCandidate = (data: { cognitoId: string }) => {
  return api.checkCreateCandidate(data);
};

export const courierSendReminder = () => {
  return api.courierSendReminder();
};

export const changeCourierEmail = (data: { _id: string; email: string }) => {
  return api.changeCourierEmail(data);
};

export const changeCourierPhone = (data: { _id: string; phone: string }) => {
  return api.changeCourierPhone(data);
};
