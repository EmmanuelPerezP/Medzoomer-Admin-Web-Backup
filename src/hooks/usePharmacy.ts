import { useStores } from '../store';
import { Filters, PharmacyPagination, PharmacyUser, PharmacyUserStatus, Pharmacy } from '../interfaces';
import { emptyPharmacy } from '../constants';
import {
  createPharmacy,
  getPharmacies,
  getPharmacy,
  getReportsInPharmacy,
  updatePharmacy,
  pharmacySearchField,
  createPharmacyAdmin,
  updatePharmacyAdmin,
  removePharmacyAdmin,
  addGroupToPharmacy,
  removeGroupFromPharmacy,
  pharmacyAdminForgotPassword,
  pharmacyUserSetStatus,
  exportPharmacies,
  generatePharmaciesReport,
  sendAdditionalPharmacyFee,
  updatePharmacyRCSettings,
  getPharmacySoftware,
  createPharmacySoftware
} from '../store/actions/pharmacy';
import { IPharmacyRCSettings } from '../interfaces/_types';

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
    setPharmacy: (pharmacy: Pharmacy) => {
      pharmacyStore.set('newPharmacy')(Object.assign({}, pharmacy));
    },
    createPharmacy: (data: any) => createPharmacy(data),
    pharmacySearchField: (field: string, search: string, limit: number) => pharmacySearchField(field, search, limit),
    getPharmacies: (data: PharmacyPagination) => getPharmacies(data),
    getReportsInPharmacy: (id: string, data: PharmacyPagination) => getReportsInPharmacy(id, data),
    updatePharmacy: (id: string, data: any) => updatePharmacy(id, data),
    addGroupToPharmacy: (id: string, groupId: string) => addGroupToPharmacy(id, groupId),
    removeGroupFromPharmacy: (id: string, groupId: string) => removeGroupFromPharmacy(id, groupId),
    createPharmacyAdmin: (data: Partial<PharmacyUser>) => createPharmacyAdmin(data),
    updatePharmacyAdmin: (data: Partial<PharmacyUser>) => updatePharmacyAdmin(data),
    removePharmacyAdmin: (email: string) => removePharmacyAdmin(email),
    pharmacyAdminForgotPassword: (email: string) => pharmacyAdminForgotPassword(email),
    pharmacyUserSetStatus: (data: { user: string; status: PharmacyUserStatus }) => pharmacyUserSetStatus(data),
    exportPharmacies: (data: Filters) => exportPharmacies(data),
    generatePharmaciesReport: () => generatePharmaciesReport(),
    sendAdditionalPharmacyFee: (id: string, amount: number) => sendAdditionalPharmacyFee(id, amount),
    updatePharmacyRCSettings: (id: string, data: IPharmacyRCSettings) => updatePharmacyRCSettings(id, data),
    getPharmacySoftware: (softwareName: string) => getPharmacySoftware(softwareName),
    createPharmacySoftware: (softwareName: any) => createPharmacySoftware(softwareName)
  };
}
