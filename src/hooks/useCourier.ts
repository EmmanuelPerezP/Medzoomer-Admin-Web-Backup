import { useStores } from '../store';
import { CourierPagination } from '../interfaces';
import { createOnfleetWorker, getCourier, getCouriers, updateCourierStatus } from '../store/actions/courier';

export default function useCourier() {
  const { courierStore } = useStores();

  return {
    ...courierStore.getState(),
    getCourier: (id: string) => getCourier(id),
    updateCourierStatus: (id: string, status: string) => updateCourierStatus(id, status),
    createOnfleetWorker: (userId: string) => createOnfleetWorker(userId),
    getCouriers: (data: CourierPagination) => getCouriers(data)
  };
}
