import { useStores } from '../store';
import { DeliveryPagination } from '../interfaces';
import { getDeliveries, getDelivery, getDeliveriesCourier, sendTaskToOnfleet } from '../store/actions/delivery';

export default function useDelivery() {
  const { deliveryStore } = useStores();

  return {
    deliveryStore,
    ...deliveryStore.getState(),
    getDelivery: (id: string) => getDelivery(id),
    sendTaskToOnfleet: (id: string) => sendTaskToOnfleet(id),
    getDeliveries: (data: DeliveryPagination) => getDeliveries(data),
    getDeliveriesCourier: (data: DeliveryPagination) => getDeliveriesCourier(data)
  };
}
