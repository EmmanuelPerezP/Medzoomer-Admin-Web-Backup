import { useStores } from '../store';
import { getSetting, updateListSettings, updateSetting } from '../store/actions/setting';

export default function useConsumer() {
  const { settingStore } = useStores();

  return {
    ...settingStore.getState(),
    getSetting: (list: string[]) => getSetting(list),
    updateSetting: (key: string, value: string) => updateSetting(key, value),
    updateListSettings: (settings: object) => updateListSettings(settings)
  };
}
