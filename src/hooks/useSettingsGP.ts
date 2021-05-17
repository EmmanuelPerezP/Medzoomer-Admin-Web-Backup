import { useStores } from '../store';
import { SettingsGPContact } from '../interfaces';
import {
  getSettingGP,
  updateSettingGP,
  getSettingListGP,
  addContact,
  getContacts,
  removeContact,
  getDefaultSettingGP,
  removeSettingsGP,
  getManagers
} from '../store/actions/settingGP';

export default function useSettingsGP() {
  const { settingGPStore } = useStores();

  return {
    ...settingGPStore.getState(),
    getSettingGP: (idGP: string) => getSettingGP(idGP),
    getDefaultSettingGP: () => getDefaultSettingGP(),
    removeSettingsGP: (id: string) => removeSettingsGP(id),
    getSettingListGP: (data: any) => getSettingListGP(data),
    updateSettingGP: (dataSettings: any) => updateSettingGP(dataSettings),
    getContacts: (id: string) => getContacts(id),
    getManagers: (id: string) => getManagers(id),
    addContact: (id: string, data: SettingsGPContact) => addContact(id, data),
    removeContact: (id: string, contactId: string) => removeContact(id, contactId)
  };
}
