import { useStores } from '../store';
import { PharmacyPagination, Pharmacy } from '../interfaces';
import { getPharmacies, getPharmacy, createPharmacy } from '../store/actions/pharmacy';

export default function usePharmacy() {
  const { pharmacyStore } = useStores();

  return {
    ...pharmacyStore.getState(),
    getPharmacy: (id: string) => getPharmacy(id),
    createPharmacy: (data: Pharmacy) => createPharmacy(data),
    getPharmacies: (data: PharmacyPagination) => getPharmacies(data)
  };
}
