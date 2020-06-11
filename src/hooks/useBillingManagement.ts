import { useStores } from '../store';
import { BillingPagination } from '../interfaces';
import {
  getAllBilling,
  getBillings,
  getBilling,
  createBilling,
  updateBilling,
  removeBilling
} from '../store/actions/billing_management';

export default function useGroups() {
  const { billingAccountStore } = useStores();

  return {
    ...billingAccountStore.getState(),
    get: (id: string) => getBilling(id),
    createBilling: (data: any) => createBilling(data),
    getBillings: (data: BillingPagination) => getBillings(data),
    getAllBilling: () => getAllBilling(),
    updateBilling: (id: string, data: any) => updateBilling(id, data),
    removeBilling: (id: string) => removeBilling(id)
  };
}
