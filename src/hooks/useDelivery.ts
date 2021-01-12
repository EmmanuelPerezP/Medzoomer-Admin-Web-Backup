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
  exportDeliveries
} from '../store/actions/delivery';

export default function useDelivery() {
  const { deliveryStore } = useStores();

  return {
    deliveryStore,
    ...deliveryStore.getState(),
    getDelivery: (id: string) => getDelivery(id),
    sendTaskToOnfleet: (id: string) => sendTaskToOnfleet(id),
    canceledOrder: (id: string) => canceledOrder(id),
    failedOrder: (id: string) => failedOrder(id),
    completedOrder: (id: string) => completedOrder(id),
    forcedInvoicedOrder: (id: string) => forcedInvoicedOrder(id),
    getDeliveries: (data: DeliveryPagination) => getDeliveries(data),
    getDeliveriesCourier: (data: DeliveryPagination) => getDeliveriesCourier(data),
    exportDeliveries: (data: CourierPagination) => exportDeliveries(data)
  };
}
