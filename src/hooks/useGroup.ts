import { useStores } from '../store';
import { GroupPagination } from '../interfaces';
import {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  removeGroup,
  getAllGroups,
  getPharmacyInGroup
} from '../store/actions/group';

export default function useGroups() {
  const { groupStore } = useStores();

  return {
    ...groupStore.getState(),
    getGroup: (id: string) => getGroup(id),
    getPharmacyInGroup: (id: string) => getPharmacyInGroup(id),
    createGroup: (data: any) => createGroup(data),
    getGroups: (data: GroupPagination) => getGroups(data),
    getAllGroups: () => getAllGroups(),
    updateGroup: (id: string, data: any) => updateGroup(id, data),
    removeGroup: (id: string) => removeGroup(id)
  };
}
