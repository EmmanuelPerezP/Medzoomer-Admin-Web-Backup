import { useStores } from '../store';
import { CourierPagination } from '../interfaces';
import { getCourier, getCouriers, updateCourierStatus, downloadFile } from '../store/actions/courier';

export default function useCourier() {
  const { courierStore } = useStores();

  return {
    ...courierStore.getState(),
    getCourier: (id: string) => getCourier(id),
    updateCourierStatus: (id: string, status: string) => updateCourierStatus(id, status),
    downloadFile: (fileId: string) => downloadFile(fileId),
    getCouriers: (data: CourierPagination) => getCouriers(data)
  };
}
