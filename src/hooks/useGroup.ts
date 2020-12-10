import { useStores } from '../store';
import { GroupPagination, GroupContact, Group } from '../interfaces';
import {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  removeGroup,
  getAllGroups,
  getPharmacyInGroup,
  addContact,
  getContacts,
  removeContact,
  getGroupsInPharmaccy,
  generateReport,
  sendInvoices
} from '../store/actions/group';

export default function useGroups() {
  const { groupStore } = useStores();

  return {
    ...groupStore.getState(),
    getGroup: (id: string) => getGroup(id),
    getPharmacyInGroup: (id: string) => getPharmacyInGroup(id),
    getGroupsInPharmaccy: (id: string) => getGroupsInPharmaccy(id),
    createGroup: (data: any) => createGroup(data),
    getGroups: (data: GroupPagination) => getGroups(data),
    getAllGroups: () => getAllGroups(),
    getContacts: (id: string) => getContacts(id),
    updateGroup: (id: string, data: Partial<Group>) => updateGroup(id, data),
    removeGroup: (id: string) => removeGroup(id),
    addContact: (id: string, data: GroupContact) => addContact(id, data),
    removeContact: (id: string, contactId: string) => removeContact(id, contactId),
    generateReport: (data?: { groupId: string }) => generateReport(data),
    sendInvoices: (data?: { groupId: string }) => sendInvoices(data)
  };
}
