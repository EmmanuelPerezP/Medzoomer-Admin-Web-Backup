import { useStores } from '../store';
import { CustomerPagination } from '../interfaces';
import { getCustomers, getCustomer, createCustomer, updateCustomer } from '../store/actions/customer';

export default function useCustomer() {
  const { customerStore } = useStores();

  return {
    ...customerStore.getState(),
    getCustomer: (id: string) => getCustomer(id),
    createCustomer: (data: any) => createCustomer(data),
    getCustomers: (data: CustomerPagination) => getCustomers(data),
    updateCustomer: (id: string, data: any) => updateCustomer(id, data)
  };
}
