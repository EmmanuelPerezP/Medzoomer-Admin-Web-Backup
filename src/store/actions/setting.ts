import api from '../../api';

export const getSetting = (key: string) => {
  return api.getSetting(key);
};

export const updateSetting = (key: string, value: string) => {
  return api.updateSetting(key, value);
};
