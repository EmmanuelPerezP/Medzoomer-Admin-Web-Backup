import { useStores } from '../store';
import { GroupPagination } from '../interfaces';
import { getGroups, getGroup, createGroup, updateGroup } from '../store/actions/group';

export default function usePharmacy() {
  const { groupStore } = useStores();

  return {
    ...groupStore.getState(),
    getPharmacy: (id: string) => getGroup(id),
    createGroup: (data: any) => createGroup(data),
    getGroups: (data: GroupPagination) => getGroups(data),
    updateGroup: (id: string, data: any) => updateGroup(id, data)
  };
}
