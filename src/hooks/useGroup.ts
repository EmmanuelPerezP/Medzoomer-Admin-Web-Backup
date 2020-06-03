import { useStores } from '../store';
import { GroupPagination } from '../interfaces';
import { getGroups, getGroup, createGroup, updateGroup, removeGroup } from '../store/actions/group';

export default function useGroups() {
  const { groupStore } = useStores();

  return {
    ...groupStore.getState(),
    getGroup: (id: string) => getGroup(id),
    createGroup: (data: any) => createGroup(data),
    getGroups: (data: GroupPagination) => getGroups(data),
    updateGroup: (id: string, data: any) => updateGroup(id, data),
    removeGroup: (id: string) => removeGroup(id)
  };
}
