import { useStores } from '../store';
import { CourierPagination, DeliveryPagination } from '../interfaces';
import {
  getDeliveries,
  getDelivery,
  getDeliveriesCourier,
  sendTaskToOnfleet,
  canceledOrder,
  failedOrder,
  completedOrder,
  forcedInvoicedOrder,
  forcedInvoicedAllOrders,
  exportDeliveries,
  getDeliveriesBatches,
  updateNameBatch,
  setDeliveriesToDispatch,
  setForcedPrice,
  sendSignatureLink,
  getDeliveriesPrescriptionsCount,
  getAdjustmentHistory,
  canceledAllOrders
} from '../store/actions/delivery';

export default function useDelivery() {
  const { deliveryStore } = useStores();

  return {
    deliveryStore,
    ...deliveryStore.getState(),
    getDelivery: (id: string) => getDelivery(id),
    setForcedPrice: (data: any) => setForcedPrice(data),
    sendTaskToOnfleet: (id: string) => sendTaskToOnfleet(id),
    canceledOrder: (id: string) => canceledOrder(id),
    canceledAllOrders: (ids: string[]) => canceledAllOrders(ids),
    failedOrder: (id: string) => failedOrder(id),
    completedOrder: (id: string) => completedOrder(id),
    forcedInvoicedOrder: (id: string) => forcedInvoicedOrder(id),
    forcedInvoicedAllOrders: (ids: string[]) => forcedInvoicedAllOrders(ids),
    getDeliveries: (data: DeliveryPagination) => getDeliveries(data),
    getDeliveriesPrescriptionsCount: (data: any) => getDeliveriesPrescriptionsCount(data),
    getDeliveriesBatches: (data: DeliveryPagination) => getDeliveriesBatches(data),
    updateNameBatch: (label: string, id: string) => updateNameBatch(label, id),
    setDeliveriesToDispatch: (ids: any) => setDeliveriesToDispatch(ids),
    getDeliveriesCourier: (data: DeliveryPagination) => getDeliveriesCourier(data),
    exportDeliveries: (data: CourierPagination) => exportDeliveries(data),
    sendSignatureLink: (id: string) => sendSignatureLink(id),
    getAdjustmentHistory: (id: string) => getAdjustmentHistory(id)
  };
}
