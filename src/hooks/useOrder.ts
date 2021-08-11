import { useStores } from '../store';
import { OrderQueryParams } from '../interfaces';
import { getOrders, getOrder, exportOrders } from '../store/actions/order';

export default function useOrder() {
  const { orderStore } = useStores();

  return {
    orderStore,
    ...orderStore.getState(),
    getOrders: (params: OrderQueryParams) => getOrders(params),
    getOrder: (id: string) => getOrder(id),
    exportOrders: (params: OrderQueryParams) => exportOrders(params)
  };
}
