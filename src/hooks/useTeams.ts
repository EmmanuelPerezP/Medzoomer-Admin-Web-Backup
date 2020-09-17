import { useStores } from '../store';
import { getTeams } from '../store/actions/teams';

export default function useTeams() {
  const { teamsStore } = useStores();

  return {
    ...teamsStore.getState(),
    getTeams: () => getTeams()
  };
}
