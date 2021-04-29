import { useStores } from '../store';
import { SettingsGPContact } from '../interfaces';
import {
  getSettingGP,
  updateSettingGP,
  getSettingListGP,
  addContact,
  getContacts,
  removeContact,
  getManagers} from '../store/actions/settingGP';

export default function useSettingsGP() {
  const { settingStore } = useStores();

  return {
    ...settingStore.getState(),
    getSettingGP: (idGP: string) => getSettingGP(idGP),
    getSettingListGP: (data: any) => getSettingListGP(data),
    updateSettingGP: (dataSettings: any) => updateSettingGP(dataSettings),
    getContacts: (id: string) => getContacts(id),
    getManagers: (id: string) => getManagers(id),
    addContact: (id: string, data: SettingsGPContact) => addContact(id, data),
    removeContact: (id: string, contactId: string) => removeContact(id, contactId),
  };
}
