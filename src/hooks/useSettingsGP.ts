// import { useStores } from '../store';
import { getSettingGP, updateSettingGP, getSettingListGP } from '../store/actions/settingGP';

export default function useSettingsGP() {
  // const { settingStore } = useStores();

  return {
    // ...settingStore.getState(),
    getSettingGP: (idGP: string) => getSettingGP(idGP),
    getSettingListGP: (data: any) => getSettingListGP(data),
    updateSettingGP: (dataSettings: any, idGP: string, typeObject: string) =>
      updateSettingGP(dataSettings, idGP, typeObject)
  };
}
