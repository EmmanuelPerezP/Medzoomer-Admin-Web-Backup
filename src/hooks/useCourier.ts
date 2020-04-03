import { useStores } from '../store';
import { CourierPagination } from '../interfaces';
import { getCourier, getCouriers, updateCourierStatus, getFileLink, getImageLink } from '../store/actions/courier';

export default function useCourier() {
  const { courierStore } = useStores();

  return {
    ...courierStore.getState(),
    getCourier: (id: string) => getCourier(id),
    updateCourierStatus: (id: string, status: string) => updateCourierStatus(id, status),
    getFileLink: (key: string, fileName: string) => getFileLink(key, fileName),
    getImageLink: (key: string, fileName: string) => getImageLink(key, fileName),
    getCouriers: (data: CourierPagination) => getCouriers(data)
  };
}
