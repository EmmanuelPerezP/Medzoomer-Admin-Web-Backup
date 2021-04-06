// import { useStores } from '../store';
import { getSettingGP, updateSettingGP } from '../store/actions/settingGP';

export default function useSettingsGP() {
  // const { settingStore } = useStores();

  return {
    // ...settingStore.getState(),
    getSettingGP: (idGP: string, typeObject: string) => getSettingGP(idGP, typeObject),
    updateSettingGP: (dataSettings: any, idGP: string, typeObject: string) =>
      updateSettingGP(dataSettings, idGP, typeObject)
  };
}
