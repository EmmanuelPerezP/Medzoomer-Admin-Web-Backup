import api from '../../api';

export const getSetting = (list: string[]) => {
  return api.getSetting(list);
};

export const updateSetting = (key: string, value: string) => {
  return api.updateSetting(key, value);
};
export const updateListSettings = (settings: object) => {
  return api.updateListSettings(settings);
};
