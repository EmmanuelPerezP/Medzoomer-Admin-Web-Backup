import { useStores } from '../store';
import { PharmacyPagination, Pharmacy } from '../interfaces';
import { emptyPharmacy } from '../constants';
import { getPharmacies, getPharmacy, createPharmacy, updatePharmacy } from '../store/actions/pharmacy';

export default function usePharmacy() {
  const { pharmacyStore } = useStores();

  return {
    ...pharmacyStore.getState(),
    getPharmacy: (id: string) => getPharmacy(id),
    resetPharmacy: () => {
      pharmacyStore.set('newPharmacy')(Object.assign({}, emptyPharmacy)); // Object assign for nested object
    },
    setUpdatePharmacy: () => {
      pharmacyStore.set('newPharmacy')(Object.assign({}, pharmacyStore.get('pharmacy')));
    },
    setEmptySchedule: () => {
      pharmacyStore.set('newPharmacy')(
        Object.assign({}, { ...pharmacyStore.get('pharmacy'), schedule: emptyPharmacy.schedule })
      );
    },
    createPharmacy: (data: any) => createPharmacy(data),
    getPharmacies: (data: PharmacyPagination) => getPharmacies(data),
    updatePharmacy: (id: string, data: any) => updatePharmacy(id, data)
  };
}
