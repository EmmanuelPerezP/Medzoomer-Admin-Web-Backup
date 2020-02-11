import { useStores } from '../store';
import { CourierPagination } from '../interfaces';
import { getCourier, getCouriers, updateCourierStatus } from '../store/actions/courier';

export default function useUser() {
  const { courierStore } = useStores();

  return {
    ...courierStore.getState(),
    getCourier: (id: string) => getCourier(id),
    updateCourierStatus: (id: string, status: string) => updateCourierStatus(id, status),
    getCouriers: (data: CourierPagination) => getCouriers(data)
  };
}
