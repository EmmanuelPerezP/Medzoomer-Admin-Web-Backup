import { useStores } from '../store';

export default function usePharmacy() {
  const { pharmacyStore } = useStores();

  return {
    ...pharmacyStore.getState()
    // getCourier: (id: string) => getCourier(id),
    // updateCourierStatus: (id: string, status: string) => updateCourierStatus(id, status),
    // getCouriers: (data: CourierPagination) => getCouriers(data)
  };
}
