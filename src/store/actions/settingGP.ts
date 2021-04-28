import api from '../../api';

export const getSettingGP = (id: string) => {
  return api.getSettingGP(id);
};

export const getSettingListGP = (data: any) => {
  return api.getSettingListGP(data);
};

export const updateSettingGP = (dataSettings: any, idGP: string, typeObject: string) => {
  return api.updateSettingGP(dataSettings, idGP, typeObject);
};
