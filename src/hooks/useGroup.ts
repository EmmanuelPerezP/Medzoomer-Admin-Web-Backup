import { useStores } from '../store';
import { GroupPagination, Group } from '../interfaces';
import {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  removeGroup,
  getAllGroups,
  getPharmacyInGroup,
  getGroupsInPharmacy,
  generateReport,
  sendInvoices,
} from '../store/actions/group';

export default function useGroups() {
  const { groupStore } = useStores();

  return {
    ...groupStore.getState(),
    getGroup: (id: string) => getGroup(id),
    getPharmacyInGroup: (id: string) => getPharmacyInGroup(id),
    getGroupsInPharmacy: (id: string) => getGroupsInPharmacy(id),
    createGroup: (data: any) => createGroup(data),
    getGroups: (data: GroupPagination) => getGroups(data),
    getAllGroups: () => getAllGroups(),
    updateGroup: (id: string, data: Partial<Group>) => updateGroup(id, data),
    removeGroup: (id: string) => removeGroup(id),
    generateReport: (data?: { groupId: string }) => generateReport(data),
    sendInvoices: (data?: { groupId: string }) => sendInvoices(data)
  };
}
