import { useStores } from '../store';
import { CourierPagination } from '../interfaces';
import {
  createOnfleetWorker,
  getCourier,
  getCouriers,
  updateCourierStatus,
  updateCourierOnboarded,
  exportCouriers
} from '../store/actions/courier';

export default function useCourier() {
  const { courierStore } = useStores();

  return {
    ...courierStore.getState(),
    getCourier: (id: string) => getCourier(id),
    updateCourierStatus: (id: string, status: string) => updateCourierStatus(id, status),
    updateCourierOnboarded: (id: string, onboarded: boolean) => updateCourierOnboarded(id, onboarded),
    createOnfleetWorker: (userId: string) => createOnfleetWorker(userId),
    getCouriers: (data: CourierPagination) => getCouriers(data),
    exportCouriers: (data: CourierPagination) => exportCouriers(data)
  };
}
