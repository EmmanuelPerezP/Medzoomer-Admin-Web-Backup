import { useStores } from '../store';
import { PharmacyPagination, PharmacyUser } from '../interfaces';
import { emptyPharmacy } from '../constants';
import {
  createPharmacy,
  getPharmacies,
  getPharmacy,
  updatePharmacy,
  pharmacySearchField,
  createPharmacyAdmin,
  updatePharmacyAdmin,
  removePharmacyAdmin
} from '../store/actions/pharmacy';

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
    pharmacySearchField: (field: string, search: string, limit: number) => pharmacySearchField(field, search, limit),
    getPharmacies: (data: PharmacyPagination) => getPharmacies(data),
    updatePharmacy: (id: string, data: any) => updatePharmacy(id, data),
    createPharmacyAdmin: (data: Partial<PharmacyUser>) => createPharmacyAdmin(data),
    updatePharmacyAdmin: (data: Partial<PharmacyUser>) => updatePharmacyAdmin(data),
    removePharmacyAdmin: (email: string) => removePharmacyAdmin(email)
  };
}
