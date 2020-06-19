import { useStores } from '../store';
import { DeliveryPagination } from '../interfaces';
import { getDeliveries, getDelivery, getDeliveriesCourier } from '../store/actions/delivery';

export default function useDelivery() {
  const { deliveryStore } = useStores();

  return {
    ...deliveryStore.getState(),
    getDelivery: (id: string) => getDelivery(id),
    getDeliveries: (data: DeliveryPagination) => getDeliveries(data),
    getDeliveriesCourier: (data: DeliveryPagination) => getDeliveriesCourier(data)
  };
}
