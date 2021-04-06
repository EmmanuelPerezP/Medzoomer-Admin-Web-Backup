import api from '../../api';

export const getSettingGP = (id: string, typeObject: string) => {
  return api.getSettingGP(id, typeObject);
};

export const updateSettingGP = (dataSettings: any, idGP: string, typeObject:string) => {
  return api.updateSettingGP(dataSettings, idGP, typeObject);
};

