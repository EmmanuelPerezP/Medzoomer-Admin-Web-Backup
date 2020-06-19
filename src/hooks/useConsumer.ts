import { useStores } from '../store';
import { ConsumerPagination } from '../interfaces';
import {
  getConsumers,
  getConsumer,
  createConsumer,
  updateConsumer,
  updateConsumerStatus
} from '../store/actions/consumer';

export default function useConsumer() {
  const { consumerStore } = useStores();

  return {
    ...consumerStore.getState(),
    getConsumer: (id: string) => getConsumer(id),
    createConsumer: (data: any) => createConsumer(data),
    getConsumers: (data: ConsumerPagination) => getConsumers(data),
    updateConsumer: (id: string, data: any) => updateConsumer(id, data),
    updateConsumerStatus: (id: string, status: string) => updateConsumerStatus(id, status)
  };
}
