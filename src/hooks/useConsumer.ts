import { useStores } from '../store';
import { ConsumerPagination, ConsumerOrderPagination } from '../interfaces';
import {
  getConsumers,
  getConsumer,
  getConsumerOrders,
  createConsumer,
  updateConsumer,
  updateConsumerStatus,
  consumerSearchField
} from '../store/actions/consumer';

export default function useConsumer() {
  const { consumerStore } = useStores();

  return {
    consumerStore,
    ...consumerStore.getState(),
    getConsumer: (id: string) => getConsumer(id),
    getConsumerOrders: (id: string, data: ConsumerOrderPagination) => getConsumerOrders(id, data),
    createConsumer: (data: any) => createConsumer(data),
    consumerSearchField: (field: string, search: string, limit: number, withID?: boolean) =>
      consumerSearchField(field, search, limit, withID),
    getConsumers: (data: ConsumerPagination) => getConsumers(data),
    updateConsumer: (id: string, data: any) => updateConsumer(id, data),
    updateConsumerStatus: (id: string, status: string) => updateConsumerStatus(id, status)
  };
}
