import { useStores } from '../store';
import { getSetting, updateSetting } from '../store/actions/setting';

export default function useConsumer() {
  const { settingStore } = useStores();

  return {
    ...settingStore.getState(),
    getSetting: (key: string) => getSetting(key),
    updateSetting: (key: string, value: string) => updateSetting(key, value)
  };
}
