import { useStores } from '../store';
import { CourierPagination } from '../interfaces';
import {
  courierSearchField,
  createOnfleetWorker,
  exportCouriers,
  getCourier,
  getCouriers,
  updateCourierOnboarded,
  updateCourierPackage,
  updateCourierStatus
} from '../store/actions/courier';

export default function useCourier() {
  const { courierStore } = useStores();

  return {
    courierStore,
    ...courierStore.getState(),
    getCourier: (id: string) => getCourier(id),
    updateCourierStatus: (id: string, status: string) => updateCourierStatus(id, status),
    courierSearchField: (field: string, search: string, limit: number) => courierSearchField(field, search, limit),
    updateCourierOnboarded: (id: string, onboarded: boolean) => updateCourierOnboarded(id, onboarded),
    createOnfleetWorker: (userId: string) => createOnfleetWorker(userId),
    getCouriers: (data: CourierPagination) => getCouriers(data),
    exportCouriers: (data: CourierPagination) => exportCouriers(data),
    updateCourierPackage: (id: string, welcomePackageSent: boolean) => updateCourierPackage(id, welcomePackageSent)
  };
}
