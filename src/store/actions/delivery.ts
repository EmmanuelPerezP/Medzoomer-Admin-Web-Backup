import api from '../../api';
import { DeliveryPagination } from '../../interfaces';

export const getDeliveries = (data: DeliveryPagination) => {
  return api.getDeliveries(data);
};

export const getDeliveriesBatches = (data: DeliveryPagination) => {
  return api.getDeliveriesBatches(data);
};

export const updateNameBatch = (label: string, id: string) => {
  return api.updateNameBatch(label, id);
};

export const setDeliveriesToDispatch = (ids: any) => {
  return api.setDeliveriesToDispatch(ids);
};

export const getDelivery = (id: string) => {
  return api.getDelivery(id);
};

export const sendTaskToOnfleet = (id: string) => {
  return api.sendTaskToOnfleet(id);
};

export const setForcedPrice = (data: any) => {
  return api.setForcedPrice(data);
};

export const canceledOrder = (id: string) => {
  return api.canceledOrder(id);
};

export const failedOrder = (id: string) => {
  return api.failedOrder(id);
};

export const completedOrder = (id: string) => {
  return api.completedOrder(id);
};

export const forcedInvoicedOrder = (id: string) => {
  return api.forcedInvoicedOrder(id);
};

export const getDeliveriesCourier = (data: DeliveryPagination) => {
  return api.getDeliveriesCourier(data);
};

export const exportDeliveries = (data: DeliveryPagination) => {
  return api.exportDeliveries(data);
};

export const sendSignatureLink = (id: string) => {
  return api.sendSignatureLink(id);
};
