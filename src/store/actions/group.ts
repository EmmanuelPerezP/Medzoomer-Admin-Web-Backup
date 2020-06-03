import api from '../../api';
import { GroupPagination, Group } from '../../interfaces';

export const getGroups = (data: GroupPagination) => {
  return api.getGroups(data);
};

export const getAllGroups = () => {
  return api.getAllGroups();
};

export const getGroup = (id: string) => {
  return api.getGroup(id);
};

export const createGroup = (data: Partial<Group>) => {
  return api.createGroup(data);
};

export const updateGroup = (id: string, data: Partial<Group>) => {
  return api.updateGroup(id, data);
};

export const removeGroup = (id: string) => {
  return api.removeGroup(id);
};
